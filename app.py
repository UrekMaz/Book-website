from flask import Flask,render_template,request,jsonify
import pickle
import os
from sklearn.neighbors import KNeighborsClassifier 
# Replace with your actual file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
book_pivot_path = os.path.join(BASE_DIR, 'book_pivot.pkl')
books_df_path = os.path.join(BASE_DIR, 'books.pkl')
book_sparse_path = os.path.join(BASE_DIR, 'book_sparse.pkl')

with open(book_sparse_path, 'rb') as f:
    book_sparse = pickle.load(f)
with open(book_pivot_path, 'rb') as f:
    book_pivot = pickle.load(f)
with open(books_df_path, 'rb') as f:
    books = pickle.load(f)

MODELS_FOLDER = os.path.join(BASE_DIR, 'model')

# Load your KNN model
def load_knn_model():
    model_path = os.path.join(MODELS_FOLDER, 'model.pkl')
    with open(model_path, 'rb') as f:
        knn_model = pickle.load(f)
    return knn_model

# Call the function to load the model
knn_model = load_knn_model()

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
    similar_books_titles = book_pivot.index[similar_books_indices]

    # Fetch the book details for the similar books
    similar_books_df = books[books['title'].isin(similar_books_titles)].copy()
    similar_books_df['Similarity'] = similar_books_df['title'].apply(
        lambda x: 1 - similar_books_distances[similar_books_titles.get_loc(x)]
    )

    return similar_books_df.to_json(orient='records')


if __name__ == '__main__':
    app.run(debug=True)