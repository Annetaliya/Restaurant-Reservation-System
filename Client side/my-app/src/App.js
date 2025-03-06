import NavBar from "./Components/Nav/NavBar";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <div>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Router>
      
      
      
    </div>
  );
}

export default App;
