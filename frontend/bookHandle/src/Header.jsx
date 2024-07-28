import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; // Make sure to import your CSS file

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:4000/recommend_books', {
                params: { user: searchTerm }
            });
            setRecommendedBooks(response.data);
        } catch (error) {
            console.error('Error fetching recommended books:', error);
        }
    };

    return (
        <div>
            <header className='p-4 flex justify-between items-center bg-white shadow-md'>
                <Link to={'/'}>
                    <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 -rotate-90">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                        <span className='font-bold text-xl'>NAME</span>
                    </div>
                </Link>

                <Link to={'/upload'} className="text-xl font-bold text-gray-600">
                    Upload
                </Link>

                <div className='flex-1 max-w-md mx-4'>
                    <form onSubmit={handleSearch} className='flex gap-2 items-center border border-gray-300 p-2 rounded-full shadow-sm'>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </form>
                </div>

                <Link to={'/login'} className='flex gap-2 items-center border border-gray-300 rounded-full px-4 py-2 shadow-md'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <div className="border-l border-gray-400 pl-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white bg-gray-400 rounded-full p-1 border-gray-700 overflow-hidden">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.8" />
                        </svg>
                    </div>
                </Link>
            </header>

            <div className="container mt-4">
                {recommendedBooks.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4"></h2>
                        <div className="row">
                            {recommendedBooks.map((book, index) => {
                                // Remove any additional quotes from the URL
                                const imageUrl = book.image_1.replace(/["]+/g, '');
                                return (
                                    <div key={index} className="col-md-4 mb-4">
                                        <div className="card shadow-sm h-100">
                                            <img 
                                                className="card-img-top fixed-size-img" 
                                                src={imageUrl} 
                                                alt="Thumbnail" 
                                                onError={(e) => e.target.src='fallback-image-url'} 
                                            />
                                            <div className="card-body d-flex flex-column">
                                                <p className="card-text">{book.title} by {book.author}</p>
                                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                                    <div className="btn-group">
                                                        <a href={book.pdf_link} target="_blank" rel="noopener noreferrer">
                                                            <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                        </a>
                                                    </div>
                                                    <small className="text-body-secondary">Similarity: {book.Similarity.toFixed(2)}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
