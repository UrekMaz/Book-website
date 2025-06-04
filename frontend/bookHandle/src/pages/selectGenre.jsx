import React, { useState, useEffect } from 'react';
import axios from "axios";
import Dropdown from '../Component/Dropdown';
import "./s.css";
import RecommendedBooks from './RecommendedBooks';

const SelectGenre = () => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('genres'); // For tab navigation
  const [isLoading, setIsLoading] = useState(false);

  // Fetch both genres and authors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresResponse, authorsResponse] = await Promise.all([
          axios.get('/genres'),
          axios.get('/authors')
        ]);
        
        setGenres(genresResponse.data);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const handleAuthorToggle = (author) => {
    setSelectedAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author) 
        : [...prev, author]
    );
  };

  const finalSelecteds = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Important: Use "genre" in the request body as that's what your Node.js middleware expects
      // The middleware will then rename it to "genres" for the Flask backend
      const response = await axios.post('http://localhost:4000/trends', {
        genres: selectedGenres,    // Change from "genre" to "genres" to be consistent
        authors: selectedAuthors
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response data:', response.data);
      
      // Handle the response
      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setBooks([]); 
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelections = () => {
    setBooks([]);
    setSelectedGenres([]);
    setSelectedAuthors([]);
  };

  return (
    <div >
      {books.length === 0 ? (
        <div className='className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg border border-amber-200'>
          <h1 className="text-3xl font-serif text-amber-900 mb-4 text-center">Discover Your Next Great Read</h1>
          <p className="text-amber-800 mb-6 text-center italic">
            Select your favorite genres and authors to help us recommend books tailored just for you.
          </p>
          
          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-amber-300">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'genres' ? 'text-amber-900 border-b-2 border-amber-500' : 'text-amber-700'}`}
              onClick={() => setActiveTab('genres')}
            >
              Genres
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'authors' ? 'text-amber-900 border-b-2 border-amber-500' : 'text-amber-700'}`}
              onClick={() => setActiveTab('authors')}
            >
              Authors
            </button>
          </div>
          
          {/* Selection Area */}
          <div className="mb-6">
            <h2 className="text-xl font-serif mb-4 text-amber-800">
              {activeTab === 'genres' ? 'Select Genres:' : 'Select Authors:'}
              {activeTab === 'genres' && <span className="text-sm text-amber-600 ml-2">({selectedGenres.length} selected)</span>}
              {activeTab === 'authors' && <span className="text-sm text-amber-600 ml-2">({selectedAuthors.length} selected)</span>}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {activeTab === 'genres' && genres.map((genre) => (
                <label key={genre} className={`flex items-center p-3 rounded-md transition-colors cursor-pointer ${selectedGenres.includes(genre) ? 'bg-amber-200' : 'bg-white hover:bg-amber-100'}`}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                  />
                  <span className="text-amber-900">{genre}</span>
                </label>
              ))}
              
              {activeTab === 'authors' && authors.map((author) => (
                <label key={author} className={`flex items-center p-3 rounded-md transition-colors cursor-pointer ${selectedAuthors.includes(author) ? 'bg-amber-200' : 'bg-white hover:bg-amber-100'}`}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                    checked={selectedAuthors.includes(author)}
                    onChange={() => handleAuthorToggle(author)}
                  />
                  <span className="text-amber-900">{author}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Selected Items Summary */}
          <div className="mb-6">
            {selectedGenres.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-amber-700">Selected Genres:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGenres.map(genre => (
                    <span key={genre} className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-sm flex items-center">
                      {genre}
                      <button 
                        onClick={() => handleGenreToggle(genre)} 
                        className="ml-1 text-amber-600 hover:text-amber-900"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedAuthors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-amber-700">Selected Authors:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAuthors.map(author => (
                    <span key={author} className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-sm flex items-center">
                      {author}
                      <button 
                        onClick={() => handleAuthorToggle(author)} 
                        className="ml-1 text-amber-600 hover:text-amber-900"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            className={`w-full py-3 px-4 bg-amber-600 text-white font-medium rounded-md shadow hover:bg-amber-700 transition-colors ${
              selectedGenres.length === 0 && selectedAuthors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={selectedGenres.length === 0 && selectedAuthors.length === 0 || isLoading}
            onClick={finalSelecteds}
          >
            {isLoading ? 'Finding books...' : 
              selectedGenres.length > 0 && selectedAuthors.length > 0 ? 'Get Books by Genres & Authors' :
              selectedGenres.length > 0 ? 'Get Books by Genres' :
              selectedAuthors.length > 0 ? 'Get Books by Authors' : 
              'Get Book Recommendations'
            }
          </button>
        </div>
      ) : 
      (
        <div className="mt-10  px-4">
              <h2 className="text-2xl font-serif italic text-amber-900 mb-6 border-b-2 border-amber-300 pb-2">
                Books for you
              </h2>
              {books.length > 0 ? (
                <RecommendedBooks recommendedBooks={books} />
              ) : (
                <p className="text-center text-amber-800">No books available at the moment.</p>
              )}
        </div>
        // <div className="mt-4">
        //   <div className="flex justify-between items-center mb-6">
        //     <h2 className="text-2xl font-serif text-amber-900 border-b-2 border-amber-300 pb-2">
        //       Your Personalized Book Recommendations
        //       {selectedGenres.length > 0 && <span className="text-sm font-normal ml-2">by genre</span>}
        //       {selectedAuthors.length > 0 && <span className="text-sm font-normal ml-2">by author</span>}
        //     </h2>
        //     <button 
        //       onClick={resetSelections}
        //       className="px-4 py-2 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
        //     >
        //       Back to Selection
        //     </button>
        //   </div>
          
        //   {books.length > 0 ? (
        //     <RecommendedBooks recommendedBooks={books} />
        //   ) : (
        //     <div className="text-center py-10">
        //       <p className="text-amber-800 mb-2">No matching books found.</p>
        //       <p className="text-amber-600">Try selecting different genres or authors.</p>
        //     </div>
        //   )}
        // </div>
      )}
    </div>
  );
};

export default SelectGenre;