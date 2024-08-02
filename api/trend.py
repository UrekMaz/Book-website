from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load dataset
df = pd.read_csv('merged.csv')

# Handle missing values
df = df.dropna()
# print(df.columns)


# Example function to create dynamic features based on selected genres and authors
def create_features(df, selected_genres=None, selected_authors=None):
    features = pd.DataFrame()

    if selected_genres:
        genre_mask = df['categories'].apply(lambda x: any(genre in x for genre in selected_genres))
        genre_features = df[genre_mask]
        features = pd.concat([features, genre_features])

    if selected_authors:
        author_mask = df['authors'].apply(lambda x: any(author in x for author in selected_authors))
        author_features = df[author_mask]
        features = pd.concat([features, author_features])

    # Remove duplicates if both genres and authors are selected
    features = features.drop_duplicates(subset=['id'])
    # print(features.columns)
    print(features)
    print("in createf")

    if 'average_rating' in features.columns:
        sorted_df = features.sort_values(by='average_rating', ascending=False)
    else:
        raise KeyError("The 'average_rating' column does not exist in the DataFrame.")

    return sorted_df
    # return features


# res = prepare_data(df, selected_genres=['Science Fiction', 'Fiction'])

@app.route('/trends', methods=['GET'])
def get_books():
    try:
        genres = request.args.getlist('genres')
        authors = request.args.getlist('authors')
        print("Received genres:", genres)
        print("Received authors:", authors)
        sorted_books = prepare_data(df, genres, authors)
        print(sorted_books)
        return jsonify(sorted_books.to_dict(orient='records'))
    except Exception as e:
        print("Error processing request:", e)
        return jsonify({"error": str(e)}), 500

def prepare_data(df, selected_genres=None, selected_authors=None):
    # Implement your data preparation logic here
    features = create_features(df, selected_genres, selected_authors)
    print(features)
    print("in predata")
    return features

if __name__ == '__main__':
    app.run(port=5001,debug=True)