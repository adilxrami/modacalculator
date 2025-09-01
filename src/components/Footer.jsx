import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }
    alert(`Subscribed successfully with: ${email}`);
    setEmail("");
    // Optionally: Send email to backend / Firebase
  };

  return (
    <footer className="bg-gray-100 text-gray-700 pt-12 pb-8 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* About Us */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-600">About CalorieCalc</h3>
          <p className="text-sm leading-relaxed">
            CalorieCalc helps you track calories, set fitness goals, and stay
            on top of your health journey with ease and accuracy.
          </p>
          <Link
            to="/about-us"
            className="mt-3 inline-block text-sm text-green-600 hover:underline"
          >
            Learn more
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-600">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li><Link to="/CaloriesCalculator" className="hover:text-green-600 transition">Calorie Calculator</Link></li>
            <li><Link to="/signup" className="hover:text-green-600 transition">Create Account</Link></li>
            <li><Link to="/login" className="hover:text-green-600 transition">Login</Link></li>
            <li><Link to="/Meals" className="hover:text-green-600 transition">Meal Plans</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-600">Resources</h3>
          <ul className="text-sm space-y-2">
            <li><Link to="/privacy-policy" className="hover:text-green-600 transition">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-green-600 transition">Terms of Service</Link></li>
            <li><Link to="/contact-us" className="hover:text-green-600 transition">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-green-600 transition">FAQs</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-600">Stay Updated</h3>
          <p className="text-sm mb-4">
            Get healthy tips, recipes, and fitness guides delivered straight to
            your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Subscribe
            </button>
          </form>

          {/* Social Media */}
          <div className="flex gap-4 mt-4 text-gray-500">
            <a href="#" aria-label="Facebook" className="hover:text-green-600 transition"><Facebook size={20} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-green-600 transition"><Instagram size={20} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-green-600 transition"><Twitter size={20} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-green-600 transition"><Youtube size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
        <p>
          &copy; {currentYear} CalorieCalc. All rights reserved. <br />
          This website uses cookies to enhance your experience. By using our site, you agree to our{" "}
          <Link to="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </footer>
  );
}
