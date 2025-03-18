import { useEffect } from "react";
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [fiberIntake, setFiberIntake] = useState(0);

  useEffect(() => {
    //Generate a random number for fiber intake between 0 to 50
    const randomFiberIntake = Math.floor(Math.random() * 51);
    setFiberIntake(randomFiberIntake);
  }, []);

  const handleClick1 = () => {
    navigate("/progress");
  };
  const handleClick2 = () => {
    navigate("/track")
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-primary">Welcome Back!</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Fiber Intake</h2>
          <p className="text-2xl font-bold text-secondary ">{fiberIntake}g</p>
          <p className="text-sm text-gray-500">Goal: 50/day</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Yeast Intake</h2>
          <p className="text-2xl font-bold text-primary">3g</p>
          <p className="text-sm text-gray-500">Goal: 5g/day</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-4">
        <button className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/80" onClick={handleClick2}>Log a Meal</button>
        <button className="w-full bg-secondary text-white py-3 rounded-md hover:bg-secondary/80 duration-200" onClick={handleClick1}>View Progress</button>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
