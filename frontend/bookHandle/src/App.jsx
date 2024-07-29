import {Routes,Route} from 'react-router-dom'; 
import UploadPage from './Component/UploadPage';
import LoginPage   from './pages/LoginPage.jsx';
import Layout   from './Layout.jsx';
import Register from './pages/Register.jsx';
import { UserContextProvider } from './UserContext.jsx';
import axios from"axios";
import Chatbot from './Chatbot.jsx';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials =true;

function App() {
    return (
      <UserContextProvider>
        <Routes>
            <Route path='/' index element={<Layout/>}/>
            <Route path = '/upload' index element={<UploadPage/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path="/chatbot" element={<Chatbot />} />
          
        </Routes>
    </UserContextProvider>
  )
}
 
export default App