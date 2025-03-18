import { useState, useEffect } from "react";
import { database, ref, onValue } from "./firebase";

const FiberFoods = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const foodsRef = ref(database, "fiberFoods");

    onValue(foodsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const foodList = [];

        Object.keys(data).forEach((category) => {
          Object.keys(data[category]).forEach((foodName) => {
            foodList.push({
              name: foodName,
              fiber: data[category][foodName].fiber,
              category: data[category][foodName].category,
            });
          });
        });

        setFoods(foodList);
      }
    });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Fiber-Rich Foods</h2>
      <ul className="bg-white p-4 rounded-lg shadow">
        {foods.length > 0 ? (
          foods.map((food, index) => (
            <li key={index} className="p-2 border-b">
              <span className="font-semibold capitalize">{food.name}</span> - {food.fiber}g Fiber ({food.category})
            </li>
          ))
        ) : (
          <p>Loading fiber foods...</p>
        )}
      </ul>
    </div>
  );
};

export default FiberFoods;
