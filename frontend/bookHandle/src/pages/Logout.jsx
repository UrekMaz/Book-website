import React, { useState } from 'react';
import { useNavigate,Navigate } from 'react-router-dom'; // Updated to use useNavigate
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate(); // Updated to use useNavigate
    const [redirect,setRedirect] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
            window.location.reload();
            setRedirect(true); // Updated to use navigate
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if(redirect){
        
        return <Navigate to={'/'}/>;
    }

    return (
        <button onClick={handleLogout} className='flex gap-2 items-center border border-gray-300 rounded-full px-4 py-2 shadow-md'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-9A2.25 2.25 0 0 0 2.25 5.25v13.5A2.25 2.25 0 0 0 4.5 21h9a2.25 2.25 0 0 0 2.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H7.5m0 0 3-3m-3 3 3 3" />
            </svg>
            <span>Logout</span>
        </button>
    );
};

export default Logout;
