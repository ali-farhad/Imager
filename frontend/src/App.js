import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages
import Home from "./pages/Home"
import Gallery from './pages/Gallery';
import Error from './pages/Error'
import Navbar from './pages/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar/>}> 
        <Route index element={<Home/>} /> 
        <Route path="/gallery" element={<Gallery/>} />
        </Route>
        <Route path="*" element={<Error/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
