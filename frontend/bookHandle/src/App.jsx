import { useContext, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import axios from "axios";
import { UserContext, UserContextProvider } from "./UserContext";
import UploadPage from './Component/UploadPage';
import LoginPage from './pages/LoginPage.jsx';
import Layout from './Layout.jsx';
import Register from './pages/Register.jsx';
import Chatbot from './Chatbot.jsx';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const { data } = await axios.get('http://localhost:4000/profile');
                //console.log('User data received:', data);
                if (data.email) {
                    setUser(data);
                   // console.log('User set in context:', data);
                } else {
                   // console.log('No user data found in response.');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        checkLoggedIn();
        console.log('Cookies:', document.cookie); // Log the cookies to check their presence
    }, [setUser]);

    return (
        <Routes>
            <Route path='/' index element={<Layout />} />
            <Route path='/upload' index element={<UploadPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<Register />} />
            <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
    );
}

export default function WrappedApp() {
    return (
        <UserContextProvider>
            <App />
        </UserContextProvider>
    );
}
