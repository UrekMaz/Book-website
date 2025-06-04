from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fuzzywuzzy import process
from concurrent.futures import ThreadPoolExecutor
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
# Load your dataset
books = pd.read_csv('merged.csv')

# Text preprocessing and feature extraction
vectorizer_description = TfidfVectorizer(stop_words='english')
X_description = vectorizer_description.fit_transform(books['description'])

vectorizer_author = TfidfVectorizer(stop_words='english')
X_author = vectorizer_author.fit_transform(books['authors'])

label_encoder = LabelEncoder()
X_category = label_encoder.fit_transform(books['categories'])
X_category = np.expand_dims(X_category, axis=1)

from scipy.sparse import hstack
X_combined = hstack([X_description, X_author, X_category])

num_clusters = 10
kmeans = KMeans(n_clusters=num_clusters, random_state=0)
books['cluster'] = kmeans.fit_predict(X_combined)

X_combined_dense = X_combined.toarray()

def fuzzy_match(query, choices):
    return process.extractOne(query, choices)

@app.route('/recommend_books', methods=['GET'])
def recommend_books():
    query = request.args.get('query')
    print(f"Received query: {query}")  # Print received query
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    query_lower = query.lower()
    titles = books['title'].tolist()
    authors = books['authors'].tolist()

    with ThreadPoolExecutor() as executor:
        title_future = executor.submit(fuzzy_match, query, titles)
        author_future = executor.submit(fuzzy_match, query, authors)
        closest_title, title_score = title_future.result()
        closest_author, author_score = author_future.result()

    print(f"Closest title: {closest_title}, Score: {title_score}")  # Print closest title and score
    print(f"Closest author: {closest_author}, Score: {author_score}")  # Print closest author and score

    max_score = max(title_score, author_score)
    if max_score < 80:
        return jsonify({'message': 'No close match found for query'}), 404

    if max_score == title_score:
        matched_column = 'title'
        matched_value = closest_title
    else:
        matched_column = 'authors'
        matched_value = closest_author

    book_cluster = books.loc[books[matched_column] == matched_value, 'cluster']
    print(f"Matched column: {matched_column}, Matched value: {matched_value}")  # Print matched column and value

    if book_cluster.empty:
        genre = books[books[matched_column] == matched_value]['categories']
        if genre.empty:
            return jsonify({'message': 'No genre information available to provide recommendations'}), 404
        genre_value = genre.values[0].lower()
        similar_genre_books = books[books['categories'].str.lower() == genre_value]
        if similar_genre_books.empty:
            return jsonify({'message': 'No recommendations available based on genre'}), 404
        recommendations = similar_genre_books.sort_values(by=['average_rating'], ascending=False)
        print(f"Recommendations based on genre: {recommendations.head(20).to_dict(orient='records')}")  # Print recommendations
        return jsonify(recommendations.head(20).to_dict(orient='records'))

    book_cluster_value = book_cluster.values[0]
    cluster_books = books[books['cluster'] == book_cluster_value]
    book_index = books[books[matched_column] == matched_value].index[0]
    book_vector = X_combined_dense[book_index]
    cluster_features_dense = X_combined_dense[books['cluster'] == book_cluster_value]
    similarities = cosine_similarity([book_vector], cluster_features_dense).flatten()

    print(f"Cluster books before sorting: {cluster_books.head()}")  # Print cluster books before sorting
    cluster_books['similarity'] = similarities
    recommendations = cluster_books.sort_values(by=['similarity'], ascending=False)
    print(f"Recommendations: {recommendations[['book_id', 'title', 'authors', 'categories', 'description', 'similarity']].head(20).to_dict(orient='records')}")  # Print recommendations
    return jsonify(recommendations[['book_id', 'title', 'authors', 'categories', 'description', 'similarity','image_url','previewLink']].head(20).to_dict(orient='records'))

def create_features(df, selected_genres=None, selected_authors=None):
    # Validate input dataframe contains required columns
    print("DataFrame columns:", df.columns.tolist())
    
    # Create an empty DataFrame with proper structure if there are no matches
    if (selected_genres or selected_authors) and df.empty:
        return pd.DataFrame(columns=['title', 'authors', 'categories', 'image_url', 'previewLink', 'average_rating'])
    
    # Start with full dataset if no filters provided
    if not selected_genres and not selected_authors:
        features = df.copy()
    else:
        features = pd.DataFrame()
        
        if selected_genres:
            # Handle case sensitivity and partial matches
            genre_mask = df['categories'].str.lower().apply(
                lambda x: any(genre.lower() in x for genre in selected_genres) if isinstance(x, str) else False
            )
            genre_features = df[genre_mask]
            features = pd.concat([features, genre_features])

        if selected_authors:
            # Handle case sensitivity and partial matches
            author_mask = df['authors'].str.lower().apply(
                lambda x: any(author.lower() in x for author in selected_authors) if isinstance(x, str) else False
            )
            author_features = df[author_mask]
            features = pd.concat([features, author_features])

        # Remove duplicates if both genres and authors are selected
        features = features.drop_duplicates()
    
    print(f"Features shape after filtering: {features.shape}")
    
    # Check if average_rating exists and is numeric
    if 'average_rating' not in features.columns:
        print("Warning: 'average_rating' column not found. Using default sorting.")
        # Add a dummy rating if not available
        features['average_rating'] = 0
    else:
        # Ensure average_rating is numeric
        features['average_rating'] = pd.to_numeric(features['average_rating'], errors='coerce').fillna(0)
    
    # Sort by average_rating
    sorted_df = features.sort_values(by='average_rating', ascending=False)
    
    return sorted_df.head(15)

@app.route('/trends', methods=['GET'])
def get_books():
    try:
        genres = request.args.getlist('genres')
        authors = request.args.getlist('authors')
        print("Received genres:", genres)
        print("Received authors:", authors)
        
        # Ensure we're working with a copy of the dataframe
        books_df = books.copy()
        
        # Debug columns
        print("Books DataFrame columns:", books_df.columns.tolist())
        
        # If no filters, return trending books (top rated with some filters for quality)
        if not genres and not authors:
            # Make sure average_rating is properly handled
            books_df['average_rating'] = pd.to_numeric(books_df['average_rating'], errors='coerce').fillna(0)
            
            # Filter for quality trending books:
            # 1. Minimum rating threshold
            # 2. Only include books with valid image_url and previewLink
            trending_df = books_df[
                (books_df['average_rating'] >= 4.0) & 
                (books_df['image_url'].notna() & books_df['image_url'].str.len() > 5) &
                (books_df['previewLink'].notna() & books_df['previewLink'].str.len() > 5)
            ]
            
            # Sort by average_rating and get top books
            result_books = trending_df.sort_values(by='average_rating', ascending=False).head(50)

            # Fallback in case fewer than 50
            if len(result_books) < 50:
                result_books = books_df.sort_values(by='average_rating', ascending=False).head(50)
            
            print(f"Found {len(result_books)} trending books")
        else:
            # If genres or authors specified, use the filtering function
            result_books = create_features(books_df, genres, authors)
        
        # Ensure required columns exist in output
        required_columns = ['title', 'authors', 'image_url', 'previewLink']
        for col in required_columns:
            if col not in result_books.columns:
                result_books[col] = f"No {col} available"
        
        # Return only the requested columns for the top books
        output_data = result_books[required_columns].head(50).to_dict(orient='records')
        
        print(f"Returning {len(output_data)} books")
        return jsonify(output_data)
    
    except Exception as e:
        print("Error processing request:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)