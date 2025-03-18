import { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import axios from "axios";
import FetchFoodData from "./FetchFoodData";

const ImageRecognition = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [fiberContent, setFiberContent] = useState(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Process Image with MobileNet
  const analyzeImage = async () => {
    if (!image) return;

    const imgElement = document.createElement("img");
    imgElement.src = image;
    imgElement.onload = async () => {
      const model = await mobilenet.load();
      const predictions = await model.classify(imgElement);
      if (predictions.length > 0) {
        setPrediction(predictions[0].className);
        fetchFiberData(predictions[0].className);
      }
    };
  };

  // Fetch Fiber Content from API
  const fetchFiberData = async (foodName) => {
    try {
      const response = await axios.get(`https://fibrex-e83bd-default-rtdb.firebaseio.com/`, {
        params: {
          app_id: "1:187920041382:web:ead882690b5b40c3b9fb67",
          app_key: "AIzaSyBSFHtHoS8t4AaOFXr2XvpCnLDE6rBeOQ8",
          ingr: foodName,
        },
      });

      if (response.data.hints.length > 0) {
        const fiber = response.data.hints[0].food.nutrients.FIBTG || "Unknown";
        setFiberContent(fiber);
      } else {
        setFiberContent("Not found in database");
      }
    } catch (error) {
      console.error("Error fetching fiber data:", error);
      setFiberContent("Error retrieving data");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary">Scan Your Food</h1>

      {/* Upload Image */}
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-4" />
      {image && <img src={image} alt="Uploaded" className="mt-4 w-1/2 h-1/2 rounded-lg shadow-md" />}

      {/* Analyze Button */}
      <button onClick={analyzeImage} className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:from-primary hover:to-secondary/80">
        Analyze Image
      </button>

      {/* Display Results */}
      {prediction && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Detected Food:</h2>
          <p className="text-xl font-bold text-secondary">{FetchFoodData}</p>

          {fiberContent !== null && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Fiber Content:</h3>
              <p className="text-2xl font-bold">{fiberContent}g</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageRecognition;
