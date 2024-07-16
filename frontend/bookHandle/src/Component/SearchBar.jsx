import React from 'react';

function SearchBar() {
  return (
    <div>
    <header className='p-4 flex justify-between'>
      <form className='max-w-md mx-auto '>
        <div className='flex gap-2 items-center border border-gray-300 rounded-full px-4 py-2 shadow-md  '>
        <input type="text" placeholder="Search..." />
        <button type="submit ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <  path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

        </button>
        </div>
        
      </form>
    </header>
      
    </div>
  );
}

export default SearchBar;
