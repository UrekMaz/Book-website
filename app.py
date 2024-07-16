from flask import Flask,render_template
import pickle
books_df=pickle.load(open('books.pkl','rb'))
app=Flask(__name__)



@app.route('/')
def index():
    return render_template('index.html',result=)

if __name__ == '__main__':
    app.run(debug=True)