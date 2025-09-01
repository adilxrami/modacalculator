import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // <-- FIXED import

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          // Fetch user document from Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setFirestoreUser(userSnap.data());
          } else {
            setError("No user data found in Firestore.");
          }
        } catch (err) {
          setError(err.message || "Failed to fetch user data.");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Logout failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading your dashboard...
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Account Overview */}
      <section className="bg-gray-50 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Overview</h2>
        <p className="text-gray-700">
          Welcome back,{" "}
          <span className="font-medium">
            {firestoreUser?.name || user?.displayName || "User"}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Role:</strong> {firestoreUser?.role || "User"}
          </div>
          <div>
            <strong>Joined:</strong>{" "}
            {firestoreUser?.createdAt
              ? new Date(firestoreUser.createdAt.seconds * 1000).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      </section>

      {/* Raw Firestore Data */}
      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Account Details (Firestore)</h3>
        <pre className="bg-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
          {JSON.stringify(firestoreUser, null, 2)}
        </pre>
      </section>
    </div>
  );
}
