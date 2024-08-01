from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fuzzywuzzy import process
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
