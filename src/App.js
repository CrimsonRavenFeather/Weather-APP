import './App.css';
import Login from './componets/Login';
import Navbar from './componets/Navbar';
import Weather from './componets/Weather';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/weather' element={<Weather />}>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
