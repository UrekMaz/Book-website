import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Download, Eye, Search, Filter } from 'lucide-react';

const ProfileBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        filterBooks();
    }, [books, searchTerm, selectedGenre]);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:4000/getBooks', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterBooks = () => {
        let filtered = books;

        if (searchTerm) {
            filtered = filtered.filter(book => 
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGenre !== 'all') {
            filtered = filtered.filter(book => 
                book.genre.toLowerCase() === selectedGenre.toLowerCase()
            );
        }

        setFilteredBooks(filtered);
    };

    const renderStars = (rating) => {
        const stars = [];
        const numRating = Number(rating) || 0;
        
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${i <= numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
            );
        }
        return stars;
    };

    const handleDownload = (filename, title) => {
        const link = document.createElement('a');
        link.href = `http://localhost:4000/files/${filename}`;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getUniqueGenres = () => {
        const genres = books.map(book => book.genre).filter(Boolean);
        return [...new Set(genres)];
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-red-500 text-xl mb-4">Error loading books</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchBooks}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Book Collection</h1>
                    <p className="text-gray-600">Manage and explore your uploaded books</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search books by title, author, or ISBN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Genres</option>
                                {getUniqueGenres().map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredBooks.length} of {books.length} books
                    </p>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {books.length === 0 ? 'No books uploaded yet' : 'No books match your search'}
                        </h3>
                        <p className="text-gray-600">
                            {books.length === 0 
                                ? 'Start building your library by uploading your first book!' 
                                : 'Try adjusting your search terms or filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <div key={book._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                {/* Book Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                                    <p className="text-blue-100 text-sm">by {book.author}</p>
                                </div>

                                {/* Book Content */}
                                <div className="p-4">
                                    <div className="space-y-3">
                                        {/* Genre */}
                                        <div className="flex items-center justify-between">
                                            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                                                {book.genre}
                                            </span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {getFileExtension(book.material)}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        {book.rating && (
                                            <div className="flex items-center gap-1">
                                                {renderStars(book.rating)}
                                                <span className="text-sm text-gray-600 ml-1">
                                                    ({book.rating}/5)
                                                </span>
                                            </div>
                                        )}

                                        {/* ISBN */}
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">ISBN:</span> {book.isbn}
                                        </div>

                                        {/* Description */}
                                        {book.des && (
                                            <div className="text-sm text-gray-700">
                                                <p className="line-clamp-3">{book.des}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDownload(book.material, book.title)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => window.open(`http://localhost:4000/files/${book.material}`, '_blank')}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileBooksPage;