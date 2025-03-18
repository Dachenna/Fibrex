import { FiHome, FiList, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 -left-1 w-full bg-transparent/10 shadow-md flex justify-around py-4">
      <Link to="/home" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <FiHome size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/track" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <FiList size={24} />
        <span className="text-xs">Track</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <FiUser size={24} />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
};

export default Navbar;
