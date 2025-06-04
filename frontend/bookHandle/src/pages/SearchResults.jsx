import React, { useState, useEffect } from 'react';
import RecommendedBooks from './RecommendedBooks';

export default function SearchResults() {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve search results from sessionStorage
    const storedBooks = sessionStorage.getItem('recommendedBooks');
    
    if (storedBooks) {
      setRecommendedBooks(JSON.parse(storedBooks));
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (recommendedBooks.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-amber-700 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="text-2xl font-serif text-amber-900 mb-4">No Books Found</h2>
          <p className="text-amber-700 mb-6">We couldn't find any books matching your search criteria. Please try another search term.</p>
        </div>
      </div>
    );
  }

  return <RecommendedBooks recommendedBooks={recommendedBooks} />;
}