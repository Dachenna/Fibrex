import { useState, useEffect } from "react";
import { db } from "../components/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import Navbar from "./NavBar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { BiTrash } from "react-icons/bi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Progress = () => {
  const [totalFiber, setTotalFiber] = useState(0);
  const [fiberData, setFiberData] = useState([]);
  const dailyGoal = 50; // Recommended daily fiber intake in grams

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "loggedMeals"), (snapshot) => {
      let fiberSum = 0;
      const fiberEntries = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.fiberContent) {
          const fiberValue = parseFloat(data.fiberContent);
          fiberSum += fiberValue;
          fiberEntries.push({ id: doc.id, name: data.name, fiberContent: fiberValue });
        }
      });

      setTotalFiber(fiberSum);
      setFiberData(fiberEntries);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteMeal = async (id) => {
    try {
      await deleteDoc(doc(db, "loggedMeals", id));
      console.log(`Meal with ID ${id} deleted`);
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const chartData = {
    labels: fiberData.map((entry) => entry.name),
    datasets: [
      {
        label: "Fiber Content (g)",
        data: fiberData.map((entry) => entry.fiberContent),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fiber Intake Progress</h2>

      <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${(totalFiber / dailyGoal) * 100}%` }}
        ></div>
      </div>

      <p className="mt-2 text-gray-700 text-lg">
        {totalFiber.toFixed(1)}g / {dailyGoal}g of fiber consumed
      </p>

      <h3 className="text-lg font-semibold mt-4">Meal History</h3>
      <ul>
        {fiberData.length > 0 ? (
          fiberData.map((entry, index) => (
            <li key={entry.id} className="p-2 border-b text-lg m-2 flex items-center">
              {entry.name}: {entry.fiberContent}g Fiber
              <BiTrash
                onClick={() => handleDeleteMeal(entry.id)}
                className="ml-auto cursor-pointer text-red-500"
              />
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No meals logged yet</li>
        )}
      </ul>
      <h3 className="text-lg font-semibold mt-4">Fiber Intake Chart</h3>
      <div className="mt-4">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <Navbar />
    </div>
  );
};

export default Progress;
