import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const checkUserAndRedirect = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      navigate("/CaloriesCalculator");
    } else {
      alert("You don't have an account. Please sign up first.");
      navigate("/signup");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await checkUserAndRedirect(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await checkUserAndRedirect(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
          Login to continue using our app
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-white border border-gray-300 py-2.5 sm:py-3 rounded-lg shadow hover:bg-gray-50 transition mb-3 text-sm sm:text-base"
        >
          <FcGoogle size={22} />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>

        {/* Facebook Login */}
        <button
          onClick={handleFacebookLogin}
          className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg shadow hover:bg-blue-700 transition mb-3 text-sm sm:text-base"
        >
          <FaFacebook size={22} />
          <span className="font-medium">Continue with Facebook</span>
        </button>

        {/* Email Login (Optional Placeholder) */}
        <button className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg shadow hover:bg-gray-900 transition text-sm sm:text-base">
          <FaEnvelope size={20} />
          <span className="font-medium">Login with Email</span>
        </button>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
