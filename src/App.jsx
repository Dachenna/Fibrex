import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LogMeal from "./components/LogMeal";
import Progress from "./components/Progress.jsx";
import Hero from "./components/Hero.jsx";
import Signup from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/home" element={<Home />} />
        <Route path="/track" element={<LogMeal />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
