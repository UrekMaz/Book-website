import React, { useState, useEffect } from 'react';
import axios from "axios";
import Dropdown from '../Component/Dropdown';
import "./s.css";


const SelectGenre = () => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [chosenOption, setOption] = useState('Genre');
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [books, setBooks] = useState([]); // Ensure books is always an array
  const options = ['Genre', 'Author'];
  const itemsToDisplay = chosenOption === "Genre" ? genres : authors;
  
  const CustomDropdown = ({ options, placeholder, onSelect }) => {
    return (
      <div className="custom-dropdown">
        <Dropdown
          options={options}
          placeholder={placeholder}
          onChange={onSelect}
        />
      </div>
    );
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (chosenOption === "Author") {
          const data = await axios.get('/authors');
          setAuthors(data.data);
        } else {
          const data = await axios.get('/genres');
          setGenres(data.data);
        }
      } catch (er) {
        console.log(er);
      }
    };

    fetchData();
  }, [chosenOption]);

  const handleToggle = (item) => {
    if (chosenOption === "Genre") {
      setSelectedGenre((prevSelected) =>
        prevSelected.includes(item)
          ? prevSelected.filter((g) => g !== item)
          : [...prevSelected, item]
      );
    } else {
      setSelectedAuthors((prevSelected) =>
        prevSelected.includes(item)
          ? prevSelected.filter((g) => g !== item)
          : [...prevSelected, item]
      );
    }
  };

  const handleSelect = (option) => {
    setOption(option);
    setSelectedGenre([]);
    setSelectedAuthors([]);
  };

  const finalSelecteds = async (e) => {
    e.preventDefault();

    try {
      console.log("post");
      const response = await axios.post('http://localhost:4000/trends', {
        genre: selectedGenre,
        authors: selectedAuthors
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("where r u?")
      console.log('Response data in post:', response.data); // Debugging step
      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        console.error('Unexpected response data:', response.data);
        setBooks([]); // Set to an empty array if not
      }
    } catch (error) {
      console.error('Error sending data to the server:', error);
      setBooks([]); // Reset books to an empty array on error
    }
  };

  const playHoverSound = () => {
    // Add sound play logic here
  };

  return (
    <div className="max-w-fit mx-auto p-4 box_2">
      {books.length === 0 ? (
        <>
          <h1 className="v text-3xl font-bold mb-4 text-center">Next, select your favorite genres.</h1>
          <p className="b  mb-4 shift p-7 text-center">
            We use your favorite genre / authors to make better book recommendations and tailor what you see in your Updates feed.
          </p>
          <div className="p-4">
          <Dropdown
        className="style_it"
        options={options}
        placeholder="Select an option"
        onSelect={handleSelect}
       
      />
          </div>
          <div className="w grid grid-cols-4 gap-3">
            {itemsToDisplay.map((item) => (
              <label key={item} className="block p-3 rounded-md pp  transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2 text-lg text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={chosenOption === "Genre" ? selectedGenre.includes(item) : selectedAuthors.includes(item)}
                  onChange={() => handleToggle(item)}
                />
                {item}
              </label>
            ))}
          </div>
          <button
            className={`mt-4 p-2 bc text-white rounded ${selectedGenre.length === 0 && selectedAuthors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedGenre.length === 0 && selectedAuthors.length === 0}
            onClick={finalSelecteds}
          >
            Select at least one genre to continue
          </button>
        </>
      ) : (
        <div className='container mt-4'>
          <h2 className='font-sans text-2xl font-bold mb-2'></h2>
          <div className='row'>
            {books.map((book, index) => (
              <div key={index} className='col-md-3 mb-4'>
                <div className='bord'>
                  <div className='card g rectangle'>
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
};

export default SelectGenre;
