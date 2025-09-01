import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/health-hero.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Make sure this file exists and is configured

export default function Home() {
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'admin', 'moderator', or 'user'
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    AOS.init({ once: true });

    // Fetch user role from Firebase
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'user');
          } else {
            setUserRole('user');
          }
        } catch {
          setUserRole('user');
        }
      } else {
        setUserRole(null);
      }
      setAuthChecked(true);
    });

    // Fetch meals
    fetch('https://dummyjson.com/products/category/groceries')
      .then(res => res.json())
      .then(data => {
        setFeaturedMeals(data.products.slice(0, 4));
        setLoadingMeals(false);
      })
      .catch(() => setLoadingMeals(false));

    return () => unsubscribe();
  }, []);

  const getHeroButton = () => {
    if (!authChecked) return null; // Wait until auth is checked

    if (!userRole) {
      return (
        <Link
          to="/signup"
          className="mt-6 sm:mt-8 inline-block bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg hover:scale-105"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          Start Your Journey
        </Link>
      );
    }

    if (userRole === 'admin' || userRole === 'moderator') {
      return (
        <Link
          to="/dashboard"
          className="mt-6 sm:mt-8 inline-block bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:scale-105"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          Go to Dashboard
        </Link>
      );
    }

    return (
      <Link
        to="/profile-settings"
        className="mt-6 sm:mt-8 inline-block bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg hover:scale-105"
        data-aos="zoom-in"
        data-aos-delay="400"
      >
        Go to Profile
      </Link>
    );
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section
        className="relative min-h-screen sm:h-[85vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-label="Hero section"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-0"></div>
        <div className="relative z-10 p-6 sm:p-10 max-w-xl sm:max-w-3xl text-center text-white">
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-xl"
            data-aos="fade-up"
          >
            Transform Your Health
          </h1>
          <p
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-200 font-light"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Track your calories, balance your meals, and follow a healthier lifestyle — one step at a time.
          </p>

          {getHeroButton()}
        </div>
      </section>

      {/* Featured Meal Plans */}
      <section className="relative py-16 sm:py-28 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16" data-aos="fade-up">
            <p className="text-xs sm:text-sm uppercase tracking-wider text-green-600 font-semibold">
              Recommended for You
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
              Balanced Meal Plans
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-500 text-base sm:text-lg max-w-md sm:max-w-2xl mx-auto">
              Explore nutrition-focused meal plans that keep your body fueled and your goals on track.
            </p>
          </div>

          {loadingMeals ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg animate-pulse">Loading healthy meal options...</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredMeals.map((meal, index) => (
                <div
                  key={meal.id}
                  className="hover:scale-[1.03] transition-transform duration-300 ease-in-out bg-white p-4 sm:p-5 rounded-xl shadow"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <h3 className="text-base sm:text-lg font-bold mb-2">{meal.title}</h3>
                  <p className="text-gray-600 text-sm">{meal.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 sm:mt-20" data-aos="fade-up" data-aos-delay="200">
            <Link
              to="/Meals"
              className="inline-block bg-green-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
            >
              View All Meal Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
