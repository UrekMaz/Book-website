import {Routes,Route} from 'react-router-dom'; 
import SearchBar from  './Component/SearchBar';

function App() {
    return (
    <Routes>
        <Route path='/' index element={<SearchBar/>}/>
      
      
    </Routes>
  )
}
 
export default App