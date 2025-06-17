import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecommendedBooks from './RecommendedBooks';

export default function IndexPage() {
  const [defaultBooks, setDefaultBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDefaultBooks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/trends', {
          withCredentials: false
        });
        
        setDefaultBooks(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching default books:', error);
        setError('Failed to load trending books. Please try again later.');
        setDefaultBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-10 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 px-4 text-center text-amber-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-10  px-4">
      <h2 className="text-2xl font-serif italic text-amber-900 mb-6 border-b-2 border-amber-300 pb-2">
        Trending Books
      </h2>
      {defaultBooks.length > 0 ? (
        <RecommendedBooks recommendedBooks={defaultBooks} />
      ) : (
        <p className="text-center text-amber-800">No trending books available at the moment.</p>
      )}
    </div>
  );
}