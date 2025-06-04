import { useContext, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import axios from "axios";
import { UserContext, UserContextProvider } from "./UserContext";
import UploadPage from './Component/UploadPage';
import LoginPage from './pages/LoginPage.jsx';
import Layout from './Layout.jsx';
import Register from './pages/Register.jsx';
import Chatbot from './Chatbot.jsx';
import SelectGenre from './pages/selectGenre.jsx'
import IndexPage from './pages/IndexPage.jsx'
import SearchResults from './pages/SearchResults.jsx';
import ProfilePage from "./pages/ProfilePage.jsx";
// import BookRecommendation from "./pages/BookRec.jsx";

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
              console.error('Error fetching profile:', err.message);
              console.error('Error config:', err.config);
              console.error('Error response:', err.response);
            }
            
        };

        checkLoggedIn();
        console.log('Cookies:', document.cookie); // Log the cookies to check their presence
    }, [setUser]);

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          {/* <Route path="/recommendations" element={<BookRecommendation />} /> */}
          <Route path='index' element={<IndexPage />} />
          <Route path='upload' element={<UploadPage />} />
          <Route path="search-results" element={<SearchResults />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<Register />} />
          <Route path='chatbot' element={<Chatbot />} />
          <Route path='genre' element={<SelectGenre />} />
          <Route path='profile' element={<ProfilePage />} />

          
        </Route>
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
