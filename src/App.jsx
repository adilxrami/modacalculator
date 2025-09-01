import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Meals from './components/meal-plans';
import CaloriesCalculator from './components/CaloriesCalculator';
import MealPlanDetail from './components/MealDetails';
import ProfileSettings from './pages/ProfileSettings';
import Setting from './pages/Setting';

// New Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// Cookie Banner Component
function CookieBanner() {
  const [accepted, setAccepted] = useState(localStorage.getItem('cookiesAccepted') === 'true');

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white text-sm p-4 flex justify-between items-center z-50">
      <p>
        We use cookies to improve your experience. By continuing, you agree to our{' '}
        <a href="/privacy-policy" className="underline text-green-400">Privacy Policy</a>.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Accept
      </button>
    </div>
  );
}

// Protected Route for role-based access
function ProtectedRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setFirestoreUser(userDoc.data());
          }
        } catch (err) {
          console.error('Error fetching Firestore user:', err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const userRole = firestoreUser?.role || 'user';
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/profile-settings" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="app-container relative">
        <Header />
        <main className="min-h-screen p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/CaloriesCalculator" element={<CaloriesCalculator />} />
            <Route path="/Meals" element={<Meals />} />
            <Route path="/meals/:id" element={<MealPlanDetail />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/Setting" element={<Setting />} />

            {/* New Legal & Info Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
