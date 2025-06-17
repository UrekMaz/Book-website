import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [title, setBookTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [rating, setRating] = useState('');
  const [material, setMaterial] = useState('');
  const [des, setBookDes] = useState('');
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenre] = useState([]);
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get('/genres');
        setGenre(data.data);
      } catch(er) {
        console.log(er);
      }
    };

    fetchData();
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const formData = new FormData();
    formData.append('title', title);    
    formData.append('isbn', isbn);
    formData.append('rating', rating);
    formData.append('material', material);
    formData.append('genre', selectedGenre);    
    formData.append('author', author);
    formData.append('des', des);
    console.log(author);
    console.log(selectedGenre);
    try {
      const response = await axios.post('/uploadBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true 
      });
      alert('Book uploaded successfully!');
    } catch(er) {
      console.log('There was an error uploading the book!', er);
      alert("Upload failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-amber-800 mb-2">Add to Library</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-700 italic">Share your literary treasures with the world</p>
        </div>
        
        <div className="bg-white border-2 border-amber-200 rounded-lg shadow-xl p-8">
          <div className="flex mb-8">
            <div className="hidden md:block w-1/4">
              <div className="h-full bg-amber-100 rounded p-4 flex items-center justify-center">
                <div className="transform rotate-90">
                  <h3 className="font-serif text-2xl text-amber-800">New Book</h3>
                  <div className="flex items-center mt-2">
                    <div className="w-8 h-px bg-amber-500 mr-2"></div>
                    <span className="text-amber-600 text-sm font-medium">CATALOG</span>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full md:w-3/4 pl-0 md:pl-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-serif text-lg text-amber-800">Book Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter the title of your book"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-serif text-lg text-amber-800">ISBN</label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g. 978-3-16-148410-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block font-serif text-lg text-amber-800">Rating</label>
                    <input
                      type="number"
                      value={rating}
                      min="0"
                      max="5"
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="0-5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-serif text-lg text-amber-800">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Author's name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block font-serif text-lg text-amber-800">Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select a genre</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block font-serif text-lg text-amber-800">Description</label>
                  <textarea
                    value={des}
                    onChange={(e) => setBookDes(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Provide a brief description or summary of the book"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block font-serif text-lg text-amber-800">Upload Book (PDF)</label>
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 bg-amber-50">
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e) => setMaterial(e.target.files[0])}
                      className="w-full"
                    />
                    <p className="text-amber-600 text-sm mt-2">Only PDF files are accepted</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Add to Library
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center text-amber-600 text-sm">
            <p>Your contribution helps our library grow. Thank you for sharing your book!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;