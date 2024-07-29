from flask import Flask,render_template,request,jsonify,Response
import requests
import numpy as np
import pickle
import os
import pandas as pd
from fuzzywuzzy import process
from sklearn.neighbors import KNeighborsClassifier 
from spellchecker import SpellChecker

# Replace with your actual file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
book_pivot_path = os.path.join(BASE_DIR, 'book_pivot.pkl')
books_df_path = os.path.join(BASE_DIR, 'books_4.pkl')
book_sparse_path = os.path.join(BASE_DIR, 'book_sparse.pkl')
final_rating_path = os.path.join(BASE_DIR, 'final_rating.pkl')
user_sparse_path = os.path.join(BASE_DIR, 'user_sparse.pkl')
user_pivot_path = os.path.join(BASE_DIR, 'user_pivot.pkl')

with open(book_sparse_path, 'rb') as f:
    book_sparse = pickle.load(f)
with open(book_pivot_path, 'rb') as f:
    book_pivot = pickle.load(f)
with open(books_df_path, 'rb') as f:
    books = pickle.load(f)
with open(final_rating_path, 'rb') as f:
    final_rating = pickle.load(f)
with open(user_pivot_path, 'rb') as f:
    user_pivot = pickle.load(f)
with open(user_sparse_path, 'rb') as f:
    user_sparse = pickle.load(f)

MODELS_FOLDER = os.path.join(BASE_DIR, 'model')

# Load your KNN model
def load_knn_model():
    model_path = os.path.join(MODELS_FOLDER, 'model.pkl')
    with open(model_path, 'rb') as f:
        knn_model = pickle.load(f)
    return knn_model
def load_knn_model_user():
    model_path_user = os.path.join(MODELS_FOLDER, 'knn.pkl')
    with open(model_path_user, 'rb') as f:
        knn = pickle.load(f)
    return knn
# Call the function to load the model
knn_model = load_knn_model()
knn =load_knn_model_user()
app=Flask(__name__)
spell = SpellChecker()


@app.route('/')
def index():
    return render_template('index.html')

def normalize_text(text):
    return text.strip().lower()

def correct_spelling(text):
    words = text.split()
    corrected_words = [spell.candidates(word) for word in words]
    corrected_text = ' '.join([max(candidates, key=spell.candidates) for candidates in corrected_words])
    return corrected_text

def find_similar_books(query, book_list):
    normalized_query = normalize_text(query)
    matches = process.extract(normalized_query, book_list, limit=5)
    return [match[0] for match in matches if match[1] > 80]  # Adjust threshold as needed

def get_open_library_pdf_link(isbn):
    url = f'https://openlibrary.org/isbn/{isbn}.json'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'works' in data and len(data['works']) > 0:
            work_key = data['works'][0]['key']
            pdf_link = f'https://openlibrary.org{work_key}?edition=key%3A/books/OL39803336M'
            return pdf_link
    return None

@app.route('/recommend_books', methods=['GET'])
def recommend():
    user_input = request.args.get('user')
    
    # Normalize and correct spelling
    user_input_normalized = normalize_text(user_input)
    user_input_corrected = correct_spelling(user_input_normalized)
    
    # Find similar books based on corrected user input
    similar_books = find_similar_books(user_input_corrected, book_pivot.index)
    
    if not similar_books:
        return jsonify({"error": "No similar books found"}), 404
    
    # Check if the book is in the index
    book_index = [book_pivot.index.get_loc(book) for book in similar_books if book in book_pivot.index]
    
    if not book_index:
        # If no matching book index is found, return the similar books directly
        similar_books_df = books[books['title'].isin(similar_books)].copy()
        similar_books_df['Similarity'] = 1.0  # Set maximum similarity for direct matches
        similar_books_df['pdf_link'] = similar_books_df['ISBN'].apply(get_open_library_pdf_link)
        return similar_books_df.to_json(orient='records')

    # Find k-nearest neighbors
    distances, indices = knn_model.kneighbors(book_sparse[book_index], n_neighbors=6)  # k+1 because the first neighbor is the book itself

    # Ensure indices are within bounds
    valid_indices = [idx for idx in indices.flatten()[1:] if idx < book_sparse.shape[0]]
    valid_distances = [dist for i, dist in enumerate(distances.flatten()[1:]) if indices.flatten()[i+1] < book_sparse.shape[0]]

    # Get the titles of the valid similar books
    similar_books_titles = book_pivot.index[valid_indices].str.strip('"')

    # Fetch the book details for the similar books
    similar_books_df = books[books['title'].isin(similar_books_titles)].copy()
    
    # Ensure valid distances are correctly aligned with the similar book titles
    def get_similarity(title):
        try:
            idx = similar_books_titles.get_loc(title)
            if isinstance(idx, (int, np.integer)):
                return 1 - valid_distances[idx]
            else:
                return 0  # Default similarity if title is not found
        except KeyError:
            return 0  # Default similarity if title is not found
    
    similar_books_df['Similarity'] = similar_books_df['title'].apply(get_similarity)
    similar_books_df['pdf_link'] = similar_books_df['ISBN'].apply(get_open_library_pdf_link)

    return similar_books_df.to_json(orient='records')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        user_id = data.get('userId')
        password = data.get('password')

        # Add your authentication logic here
       
        return jsonify({'success': True, 'userId': user_id})
        
    else:
        return render_template('login.html')

@app.route('/personal', methods=['GET'])
def personal():
    user_id = request.args.get('userId')
    recommendations = get_user_recommendations(2276,k=3)
    
    # Check if recommendations is a Response object
    if isinstance(recommendations, Response):
        return recommendations  # Return the Response directly
    
    # If recommendations is None or empty, handle accordingly
    if recommendations is None or recommendations.empty:
        return render_template('personal.html', user_id=user_id, recommendations=[])
    
    # Convert DataFrame to list of dictionaries
    recommendations_list = recommendations.to_dict(orient='records')
    
    return render_template('personal.html', user_id=user_id, recommendations=recommendations_list)
def get_similar_users(user_id, k=3):
    # Check if user_id is in the index
    if user_id not in user_pivot.index:
        print(f"User ID {user_id} not found in the data.")
        return None

    # Find the index of the user
    user_index = user_pivot.index.get_loc(user_id)

    # Find k-nearest neighbors
    distances, indices = knn.kneighbors(user_sparse[user_index], n_neighbors=k+1)  # k+1 because the first neighbor is the user itself

    # Get the user IDs of similar users
    similar_users = [user_pivot.index[i] for i in indices.flatten()][1:]  # Exclude the user itself
    similar_users_distances = distances.flatten()[1:]

    return pd.DataFrame({'User': similar_users, 'Similarity': 1 - similar_users_distances})

def get_user_recommendations(user_id, k=3):
    # Get similar users

    similar_users_df = get_similar_users(user_id, k)
    if similar_users_df is None:
        return jsonify({"error": f"No similar users found for user ID {user_id}"})
    
    similar_user_ids = similar_users_df['User'].tolist()
    # Get the items rated by similar users
    similar_users_ratings = final_rating[final_rating['user_id'].isin(similar_user_ids)]

    # Exclude items already rated by the target user
    user_rated_items = final_rating[final_rating['user_id'] == user_id]['title'].tolist()
    recommendations = similar_users_ratings[~similar_users_ratings['title'].isin(user_rated_items)]

    # Aggregate the ratings of the recommended items
    recommendations = recommendations.groupby('title')['rating'].mean().sort_values(ascending=False).reset_index()
    
    return recommendations




if __name__ == '__main__':
    app.run(debug=True)