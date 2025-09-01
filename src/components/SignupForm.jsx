import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { auth } from "../firebaseConfig"; // Ensure correct path
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (!password || password.length < 8) return "Password must be at least 8 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      // You can also add: createUserWithEmailAndPassword(auth, email, password)
      console.log("Signing up:", { email, password });
      setEmail("");
      setPassword("");
      alert("Signup successful! Please check your email.");
      navigate("/CaloriesCalculator");
    } catch (err) {
      setError("Signup failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google signup/signin successful:", result.user);
      navigate("/CaloriesCalculator");
    } catch (err) {
      console.error("Google signup error:", err.message);
      setError("Google signup failed, please try again.");
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Facebook signup/signin successful:", result.user);
      navigate("/CaloriesCalculator");
    } catch (err) {
      console.error("Facebook signup error:", err.message);
      setError("Facebook signup failed, please try again.");
    }
  };

  return (
    <div className="max-w-xs sm:max-w-sm mx-auto mt-10 sm:mt-16 bg-white rounded-2xl shadow-md p-4 sm:p-6">
      {/* Social Signup */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleGoogleSignup}
          className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2.5 min-h-[44px] hover:bg-gray-100 transition text-sm sm:text-base"
        >
          <FcGoogle size={22} />
          Google
        </button>

        <button
          onClick={handleFacebookSignup}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg py-2.5 min-h-[44px] hover:bg-blue-700 transition text-sm sm:text-base"
        >
          <FaFacebook size={22} />
          Facebook
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 hover:underline">Log in</a>
      </p>
    </div>
  );
}
