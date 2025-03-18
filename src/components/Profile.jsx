import { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();
  const [image, setImage] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.photoURL) {
      setImage(user.photoURL);
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await updateProfile(user, { photoURL: downloadURL });
    setImage(downloadURL);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    // Redirect to login
    navigate("/");
   
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold">Profile</h2>

        <div className="relative w-24 h-24 mx-auto mt-4">
          <img
            src={image || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-full h-full rounded-full border-2 border-gray-300 object-cover"
          />
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            accept="image/*"
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">{user?.displayName || "User"}</h3>
        <p className="text-gray-600">{user?.email}</p>

        {loading && <p className="text-blue-500 text-sm">Uploading...</p>}

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;
