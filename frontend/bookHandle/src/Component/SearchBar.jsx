import React from 'react';
import { Link } from "react-router-dom";


function SearchBar() {
  return (
    <div>
    <header className='p-4 flex justify-between'>
      <form className=''>
        <div className='flex gap-2 items-center border border-gray-300  p-2 shadow-md  '>
        <input type="text" placeholder="Search..." />
        <button type="submit ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <  path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

        </button>
        </div>
        
      </form>

      <div>
      <Link to={'/login'} className='flex gap-2 items-center border border-gray-300 rounded-full px-4 py-2 shadow-md  '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <div className="border-l border-gray-400 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white bg-gray-400 rounded-full p-1 border-gray-700 overflow-hidden">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                </div>
            </Link>
      </div>
    </header>
      
    </div>
  );
}

export default SearchBar;
