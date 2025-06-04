import React, { useContext, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import Logout from './pages/Logout';
import hoverSound from './hover_sound.mp3';
import { UserContext } from './UserContext';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useContext(UserContext);
    const audioRef = useRef(new Audio(hoverSound));
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            try {
                const response = await axios.get('http://localhost:4000/recommend_books', {
                    params: { query: searchTerm }
                });
                
                // Store search results in sessionStorage
                sessionStorage.setItem('recommendedBooks', JSON.stringify(response.data));
                
                // Navigate to search results page
                navigate('/search-results');
            } catch (error) {
                console.error('Error fetching recommended books:', error);
            }
        }
    };

    const playHoverSound = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.play();

        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 1000);
    };

    return (
        <div className="font-serif">
            <header className="py-4 px-6 bg-amber-900 text-amber-50 shadow-lg border-b border-amber-800">
                <div className="">
                    <div className="flex items-center justify-between">
                        <Link to={'/'} className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200 transition-all duration-300 group-hover:border-amber-100 shadow-md">
                                <img 
                                    src="/pikaso_texttoimage_35mm-film-photography-a-circular-book-icon-with-di.jpeg" 
                                    alt="Logo"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-wide text-amber-100">Bibliotheca</span>
                        </Link>

                    <div className={`relative flex-1 max-w-lg mx-8 ${isSearchFocused ? 'scale-105' : ''} transition-transform duration-300`}>
                        <form onSubmit={handleSearch} className='search-form'>
                            <input
                                 type="text"
                                 placeholder="Discover your next literary adventure..."
                                 className="w-full py-2 pl-5 pr-12 rounded-full bg-amber-800/50 border border-amber-700 focus:border-amber-300 placeholder-amber-300/70 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300"
                                
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            </button>
                        </form>
                    </div>

                        <div className="flex items-center space-x-4">
                            <Link 
                                to={'/upload'} 
                                className="px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors duration-200 flex items-center gap-2 font-medium text-amber-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                Upload
                            </Link>
                            <Link 
                                to={'/genre'} 
                                className="px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors duration-200 flex items-center gap-2 font-medium text-amber-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                    <path d="M12 .587l3.668 7.568L24 9.75l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.597 0 9.75l8.332-1.595z" />
                                </svg>
                                Recommend
                            </Link>


                           
                            <Link 
                                to={'/chatbot'} 
                                className="flex items-center gap-2 px-4 py-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v.008M4.5 8.25c0-1.89 1.269-3.5 3-3.937M19.5 8.25a3.948 3.948 0 0 0-3 3.937M4.5 8.25V10a7.5 7.5 0 0 0 3 5.99m-3-7.74a5.25 5.25 0 0 1 10.5 0v4.745a5.25 5.25 0 0 1-10.5 0V8.25ZM12 21.75a7.5 7.5 0 0 0 7.5-7.5v-2.25m-15 0v2.25a7.5 7.5 0 0 0 15 0V10a7.5 7.5 0 0 0-7.5 7.5H4.5m7.5-9V7.5m3-1.875h.008V3.75H12m0 0H11.992V3.75H12m0 0v-.008M9 3.75v.008M12 3.75h-.008V3.75H12Z" />
                                </svg>
                                <span className="font-medium text-amber-200">Chatbot</span>
                            </Link>
                            {user === "no token" && (
                                <Link 
                                    to={'/login'} 
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-700 border border-amber-700 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-200">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.8" />
                                    </svg>
                                    <span className="font-medium">Login</span>
                                </Link>
                            )}
                            {!!user && user !== "no token" && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-800 border border-amber-700 rounded-lg shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-200">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.8" />
                                    </svg>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            )}

                            {user !== "no token" && 
                            
                            <Link to={'/'}
                                    >
                                        <Logout />
                                    </Link>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}