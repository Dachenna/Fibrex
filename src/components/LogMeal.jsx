import { useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import axios from "axios";
import { auth, db } from "../components/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import NavBar from "./NavBar";
import { BiTrash } from "react-icons/bi";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dwmtiktkj/image/upload";
const UPLOAD_PRESET = "firt_apple_upload";

// Fiber database (Can be moved to Firestore)
const fiberDatabase = {
  apple: 4.0,
  banana: 2.6,
  beans: 6.0,
  rice: 1.6,
  bread: 2.0,
  pasta: 2.0,
  "whole grain": 3.0,
  salad: 2.0,
  "chicken breast": 0.0,
  "beef steak": 9.0,
  "salmon fillet": 14.2,
  "egg": 6.8,
  "milk": 12.3,
  "fried chicken": 14.2,
  fries: 3.0,
  hamburger: 2.0,
  pizza: 16.0,
  "hot dog": 7.0,
  "ice cream": 4.0,
  "fried fish": 23.0,
  "chicken nuggets": 12.0,
  "chicken wings": 11.4,
  broccoli: 2.4,
  oats: 10.6,
  popcorn: 24.6,
  "white rice": 0.6,
  "whole wheat bread": 6.5,
  orange: 2.4,
  strawberry: 2.0,
  blueberry: 2.4,
  raspberry: 6.5,
  avocado: 6.7,
  carrot: 2.8,
  spinach: 2.2,
  kale: 2.6,
  sweet_potato: 3.0,
  peas: 5.7,
  lentils: 7.9,
  chickpeas: 7.6,
  black_beans: 8.7,
  chia_seeds: 34.4,
  flaxseeds: 27.3,
  quinoa: 2.8,
  barley: 17.3,
  bulgur: 4.5,
  farro: 3.5,
  millet: 8.5,
  sorghum: 6.3,
  teff: 7.1,
  buckwheat: 10.0,
  spelt: 10.7,
  amaranth: 6.7,
  "vegetable soup": 3.5,
  "chicken salad": 2.0,
  "beef stew": 1.5,
  "lentil soup": 7.9,
  "quinoa salad": 5.0,
  "black bean chili": 12.0,
  "oatmeal with fruits": 8.0,
  "whole grain pasta": 6.0,
  "brown rice and beans": 9.0,
  "vegetable stir-fry": 4.0,
  "fruit smoothie": 3.0,
  "jollof rice": 2.0,
  "egusi soup": 3.5,
  "pounded yam": 1.0,
  fufu: 1.2,
  suya: 0.5,
  moimoi: 4.5,
  akara: 3.0,
  "banga soup": 2.5,
  "ofada rice": 2.0,
  "efo riro": 3.0,
  "ogbono soup": 3.5,
  "pepper soup": 1.0,
  "afang soup": 3.0,
  "okro soup": 2.5,
  "yam porridge": 2.0,
  "beans porridge": 5.0,
  "fried plantain": 1.5,
  gari: 1.0,
  "tuwo shinkafa": 1.2,
  masa: 1.0,
  kilishi: 0.5,
  nkwobi: 1.0,
  "isi ewu": 1.0,
};

const LogMeal = () => {
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [meal, setMeal] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [detectedFood, setDetectedFood] = useState("");
  const [fiber, setFiber] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, "loggedMeals"), where("userId", "==", user.uid));
        const unsubscribeMeals = onSnapshot(q, (snapshot) => {
          setLoggedMeals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribeMeals();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return res.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Data:", error);
      return null;
    }
  };

  // Analyze image using TensorFlow.js
  const analyzeImage = async (file) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    await img.decode(); // Wait for image to load

    const model = await mobilenet.load();
    const predictions = await model.classify(img);
    return predictions.length > 0 ? predictions[0].className.toLowerCase() : "Unknown";
  };

  const handleSaveMeal = async () => {
    if (!imageFile) return;

    setUploading(true);
    const imageUrl = await handleImageUpload();
    if (!imageUrl) return;

    const detected = await analyzeImage(imageFile);
    setDetectedFood(detected);

    // Auto-detect fiber if the food is in the database, otherwise generate a random number
    const autoDetectedFiber = fiberDatabase[detected] || (Math.random() * 10).toFixed(1);

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "loggedMeals"), {
      userId: user.uid,
      name: meal || detected,
      fiberContent: fiber || autoDetectedFiber,
      image: imageUrl,
      detectedFood: detected,
      timestamp: new Date(),
    });

    setMeal("");
    setImageFile(null);
    setFiber("");
    setUploading(false);
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteDoc(doc(db, "loggedMeals", id));
      console.log(`Meal with ID ${id} deleted`);
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Log Your Meal</h2>

      <input
        type="text"
        placeholder="Enter meal name (optional)"
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="text"
        placeholder="Enter the amount of fibers (optional)"
        value={fiber}
        onChange={(e) => setFiber(e.target.value)}
        className="w-full p-3 border rounded mb-2"
      />

      <button
        onClick={handleSaveMeal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Save Meal"}
      </button>

      <h3 className="text-lg font-semibold mt-4">Detected Food: {detectedFood}</h3>

      <h3 className="text-lg font-semibold mt-4">Logged Meals</h3>
      <ul className="p-3">
        {loggedMeals.map((meal) => (
          <li key={meal.id} className="p-2 border-b flex items-center">
            <img src={meal.image} alt={meal.name} className="w-16 h-16 object-cover rounded mr-2" />
            {meal.name} - {meal.fiberContent}g Fiber
            <BiTrash onClick={() => handleDeleteMeal(meal.id)} className="ml-auto cursor-pointer" />
          </li>
        ))}
      </ul>
      <NavBar />
    </div>
  );
};

export default LogMeal;
