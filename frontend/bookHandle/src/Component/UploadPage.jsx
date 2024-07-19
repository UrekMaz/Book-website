import React, { useState } from 'react';
import axios from 'axios';
const UploadPage = () => {
  const [title, setBookTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [rating, setRating] = useState('');
  const [material, setMaterial] = useState('');

  
  async function handleSubmit(ev){
    ev.preventDefault();
    const formData = new FormData();
    formData.append('title', title);    
    formData.append('isbn', isbn);
    formData.append('rating', rating);
    formData.append('material', material);
    try{
      const response = await axios.post('/uploadBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true 
      });
      alert('Uploaded successfully');
        // await axios.post('/uploadBook',{title,isbn,rating,material: btoa(material) });
        
    }catch(er){
      console.log('There was an error uploading the book!', er);
        alert("couldnt");
    }
    
  }

 

  return (
    <div className='min-h-screen  place-items-center gap-6 m-10'>
  <h1 className='font-bold text-3xl text-primary'>Upload here</h1>
  <div className='border border-gray-300 shadow-md shadow-gray-300 m-10 rounded-lg px-30'>
    <form onSubmit={handleSubmit} className='items-center m-10 '>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-4'>
          <label className='font-bold text-xl my-4 text-gray-600'>Book Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setBookTitle(e.target.value)}
            className='flex-1 border border-gray-300 rounded-full px-4 py-7 shadow-md shadow-gray-300'
          />
        </div>
        <div className='flex items-center gap-4'>
          <label className='font-bold text-xl my-4 text-gray-600'>ISBN:</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className='flex-1 border border-gray-300 rounded-full px-4 py-2 shadow-md shadow-gray-300'
          />
        </div>
        <div className='flex items-center gap-4'>
          <label className='font-bold text-xl my-4 text-gray-600'>Rating:</label>
          <input
            type="number"
            value={rating} min="0"
              max="10"
            onChange={(e) => setRating(e.target.value)}
            className='flex-1 border border-gray-300 rounded-full px-4 py-2 shadow-md shadow-gray-300'
          />
        </div>
        <div className='flex items-center gap-4'>
          <label className='font-bold text-xl my-4 text-gray-600'>Upload Book:</label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setMaterial(e.target.files[0])}
            className='flex-1 border border-gray-300 rounded-full px-4 py-2 shadow-md shadow-gray-300'
          />
        </div>
      </div>
      <button
        type="submit"
        className='flex gap-2 border text-white bg-primary m-6 rounded-full px-4 py-2 shadow-md shadow-gray-300'
      >
        Submit
      </button>
    </form>
      
    </div>
    </div>
  );
};

export default UploadPage;
