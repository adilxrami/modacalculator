import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

export default function Login() {
  const auth = getAuth();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in with Google!");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in with Facebook!");
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email/Password form (optional) */}
        <form className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-t" />
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition mb-3"
        >
          Continue with Google
        </button>

        {/* Facebook Login Button */}
        <button
          onClick={handleFacebookLogin}
          className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition"
        >
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
