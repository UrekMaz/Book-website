from flask import Flask,render_template,request,jsonify,Response
import requests

import pickle
import os
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier 
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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommend_books', methods=['GET'])
def recommend():
    user_input = request.args.get('user')
    user_input_quoted = f'"{user_input}"'
    
    # Check if the book is in the index
    if user_input_quoted not in book_pivot.index:
        return jsonify({"error": "Book not found"}), 404
    
    book_index = book_pivot.index.get_loc(user_input_quoted)

    # Find k-nearest neighbors
    distances, indices = knn_model.kneighbors(book_sparse[book_index], n_neighbors=6)  # k+1 because the first neighbor is the book itself

    # Get the indices of the similar books
    similar_books_indices = indices.flatten()[1:]  # Exclude the book itself
    similar_books_distances = distances.flatten()[1:]

    # Get the titles of the similar books
    similar_books_titles = book_pivot.index[similar_books_indices].str.strip('"')

    # Fetch the book details for the similar books
    similar_books_df = books[books['title'].isin(similar_books_titles)].copy()
    similar_books_df['Similarity'] = similar_books_df['title'].apply(
    
    lambda x: 1 - similar_books_distances[similar_books_titles.get_loc(x)]
    )
    similar_books_df['pdf_link'] = similar_books_df['ISBN'].apply(get_open_library_pdf_link)
    return similar_books_df.to_json(orient='records')

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