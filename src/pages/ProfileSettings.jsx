import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    height: "",
    weight: "",
    goal: "",
    plan: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFirestoreUser(data);
            setFormData({
              name: data.name || currentUser.displayName || "",
              height: data.height || "",
              weight: data.weight || "",
              goal: data.goal || "",
              plan: data.plan || "Free",
            });
          }
        } catch (err) {
          setError("Failed to load user profile");
          console.error(err);
        }
      } else {
        setError("User not logged in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, formData, { merge: true });

      // Update Firebase Auth displayName if name was changed
      if (formData.name) {
        await updateProfile(user, { displayName: formData.name });
      }

      setFirestoreUser({ ...firestoreUser, ...formData });
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={firestoreUser?.avatar || user?.photoURL || "https://via.placeholder.com/150"}
          alt="User Avatar"
          className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {firestoreUser?.name || user?.displayName || "Unknown User"}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
          <p className="mt-2 text-gray-600">
            Member since:{" "}
            {firestoreUser?.createdAt
              ? new Date(firestoreUser.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Details</h2>
        <ul className="space-y-2 text-gray-600">
          <li>Plan: {firestoreUser?.plan || "Free"}</li>
          <li>Height: {firestoreUser?.height ? `${firestoreUser.height} cm` : "Not set"}</li>
          <li>Weight: {firestoreUser?.weight ? `${firestoreUser.weight} kg` : "Not set"}</li>
          <li>Goal: {firestoreUser?.goal || "Stay healthy"}</li>
        </ul>
      </div>

      <div className="mt-6 text-right">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsPopupOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      {/* POPUP MODAL */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Height (cm)"
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Goal"
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-lg"
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
