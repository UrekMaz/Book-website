import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import Logout from './Logout';
import hoverSound from './hover_sound.mp3'; // Adjust the path as necessary

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    // Create a ref to the audio element
    const audioRef = React.useRef(new Audio(hoverSound));

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:4000/recommend_books', {
                params: { query: searchTerm }
            });
            setRecommendedBooks(response.data);
        } catch (error) {
            console.error('Error fetching recommended books:', error);
        }
    };

    // Function to play sound
    const playHoverSound = () => {
        // Play the sound
        const audio = audioRef.current;
        audio.currentTime = 0; // Restart sound from beginning
        audio.play();

        // Stop the sound after 1 second
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0; // Reset to start
        }, 1000);
    };

    return (
        <div>
            <header className='p-4 flex justify-between items-center bg-dark-brown shadow-md'>
                <Link to={'/'}>
                    <div className='flex items-center gap-2'>
                        <div className="header-logo">
                            <img src="/pikaso_texttoimage_35mm-film-photography-a-circular-book-icon-with-di.jpeg" alt="Logo"></img>
                        </div>
                    </div>
                </Link>

                <Link to={'/upload'} className="font-bold text-light-brown x">
                    Upload
                </Link>

                <div className='flex-1 max-w-md mx-4'>
                    <form onSubmit={handleSearch} className='search-form'>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="flex gap-4">
                    <Link to={'/login'} className='flex gap-2 items-center border border-gray-300 rectangle px-4 py-2 shadow-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <div className="border-l border-gray-400 pl-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-light-brown bg-brown rectangle p-1 border-gray-700 overflow-hidden icon">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.8" />
                            </svg>
                        </div>
                    </Link>

                    <Link to={'/chatbot'} className='flex gap-2 items-center border border-gray-300 rectangle px-4 py-2 shadow-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v.008M4.5 8.25c0-1.89 1.269-3.5 3-3.937M19.5 8.25a3.948 3.948 0 0 0-3 3.937M4.5 8.25V10a7.5 7.5 0 0 0 3 5.99m-3-7.74a5.25 5.25 0 0 1 10.5 0v4.745a5.25 5.25 0 0 1-10.5 0V8.25ZM12 21.75a7.5 7.5 0 0 0 7.5-7.5v-2.25m-15 0v2.25a7.5 7.5 0 0 0 15 0V10a7.5 7.5 0 0 0-7.5 7.5H4.5m7.5-9V7.5m3-1.875h.008V3.75H12m0 0H11.992V3.75H12m0 0v-.008M9 3.75v.008M12 3.75h-.008V3.75H12Z" />
                        </svg>
                        <span className='text-light-brown'>Chatbot</span>
                    </Link>

                    <Logout />
                </div>
            </header>

            {recommendedBooks.length > 0 && (
                <div className='container mt-4'>
                    <h2></h2>
                    <div className='row'>
                        {recommendedBooks.map((book, index) => (
                            <div 
                                key={index} 
                                className='col-md-3 mb-4'
                                 // Play sound on hover
                            >
                                <div className='bord'>
                                    <div className='card rectangle'>
                                        {book.image_url && (
                                            <img src={book.image_url} alt={book.title} className='card-img-top' />
                                        )}
                                        <div className='card-body'>
                                            <h5 className='card-title'>{book.title}</h5>
                                            <p className='c card-text'>
                                                <strong>Author:</strong> {book.authors}<br />
                                            </p>
                                            {book.previewLink && (
                                                <a href={book.previewLink} className='color btn btn-primary' onMouseEnter={playHoverSound} target='_blank' rel='noopener noreferrer'>Preview</a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            

        </div>
    );
}
