import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Dropdown from '../Component/Dropdown';
import "./s.css"
const SelectGenre = () => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [chosenOption, setOption] = useState('Genre');
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const options = ['Genre', 'Author'];
  const itemsToDisplay = chosenOption === "Genre" ? genres : authors;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (chosenOption === "Author") {
          const data = await axios.get('/authors');
          setAuthors(data.data);
          console.log(authors);
        } else {
          const data = await axios.get('/genres');
          setGenres(data.data);
          console.log(genres);
        }
      } catch (er) {
        console.log(er);
      }
    };

    fetchData();
  }, [chosenOption]); // Dependency on chosenOption

  const handleToggle = (item) => {
    if(chosenOption ==="Genre" ){
      setSelectedGenre((prevSelected) =>
        prevSelected.includes(item)
          ? prevSelected.filter((g) => g !== item)
          : [...prevSelected, item]
      );
    }else{
      setSelectedAuthors((prevSelected) =>
        prevSelected.includes(item)
        ? prevSelected.filter((g) => g !== item)
        : [...prevSelected, item]
      );
    }
    
  };

  const handleSelect = (option) => {
    console.log('Selected:', option);
    setOption(option); // Clear selected items when the option changes
  };

  
   

  const finalSelecteds = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior if this is within a form
    
    console.log('Final selected g:', selectedGenre);
    console.log('Final selected a:', selectedAuthors);

    try {
        const response = await axios.post('http://localhost:4000/trends', {
            genre: selectedGenre,
            authors: selectedAuthors
        }, {
          headers: {
              'Content-Type': 'application/json'
          }});
        console.log('Response from server: error');
    } catch (error) {
        console.error('Error sending data to the server:', error);
    }
};

  return (
    <div className="max-w-fit mx-auto p-4">
      <h1 className="font-sans text-3xl font-bold mb-4 text-center">Next, select your favorite genres.</h1>
      <p className="font-sans text-lg mb-4 bg-red-200 p-7">
        We use your favorite genre / authors to make better book recommendations and tailor what you see in your Updates feed.
      </p>
      <div className="p-4">
        <Dropdown
          options={options}
          placeholder="Select an option"
          onSelect={handleSelect}
        />
      </div>
      <div className="w grid grid-cols-4 gap-3">
        {itemsToDisplay.map((item) => (
          <label key={item} className="block p-3 rounded-md bg-gray-300 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 mr-2 text-lg text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={chosenOption === "Genre" ?selectedGenre.includes(item):selectedAuthors.includes(item)}
              onChange={() => handleToggle(item)}
            />
            {item}
          </label>
        ))}
      </div>
      <Link to={'/'}>
        <button
          className={`mt-4 p-2 bg-blue-500 text-white rounded ${selectedGenre.length === 0 && selectedAuthors.length === 0? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedGenre.length === 0 && selectedAuthors.length === 0}
          onClick={finalSelecteds}
        >
          Select at least one genre to continue
        </button>
      </Link>
    </div>
  );
};

export default SelectGenre;
