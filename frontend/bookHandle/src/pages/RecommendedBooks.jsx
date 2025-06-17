import React from 'react';

export default function RecommendedBooks({ recommendedBooks }) {
  if (recommendedBooks.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedBooks.map((book, index) => (
          <div 
            key={index}
            className="transform transition-transform duration-300 hover:scale-105 hover:rotate-1"
          >
            <div className="bg-amber-50 rounded-lg overflow-hidden shadow-lg border border-amber-200 h-full flex flex-col relative">
              {/* Book spine effect with gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-amber-400 to-amber-200"></div>
              
              {/* Book top edge effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200"></div>
              
              {/* Book Cover */}
              <div className="relative pt-[130%] bg-amber-100">
                {book.image_url ? (
                  <img 
                    src={book.image_url} 
                    alt={book.title} 
                    className="absolute inset-0 w-full h-full object-cover shadow-inner"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-amber-700 opacity-70">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Book Info */}
              <div className="p-4 flex-grow flex flex-col">
                <h5 className="font-medium text-amber-900 mb-2 line-clamp-2 overflow-hidden">{book.title}</h5>
                <p className="text-amber-700 text-sm mb-4 flex-grow">
                  <span className="italic">by</span> {book.authors}
                </p>
                {book.previewLink && (
                  <a 
                    href={book.previewLink} 
                    className="bg-amber-700 hover:bg-amber-600 text-amber-50 py-2 px-4 rounded text-center transition-colors duration-300"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Preview Book
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}