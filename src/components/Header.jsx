import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Menu, X } from "lucide-react"; // Optional: for hamburger menu icons

function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Error signing out: ", error));
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-green-600 tracking-wide hover:text-green-700 transition-colors"
        >
          Moda-calculator
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-green-600 transition-colors"
          >
            Home
          </Link>

          {user ? (
            <>
              {/* Make username clickable and lead to profile settings */}
              <Link
                to="/profile-settings"
                className="text-gray-800 font-semibold hover:text-green-600 transition-colors"
              >
                {user.displayName || "User"}
              </Link>
              <Link
                to="/Setting"
                className="text-gray-700 font-medium hover:text-green-600 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 font-medium hover:text-green-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 font-medium hover:text-green-600 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                {/* Mobile: username leads to profile settings */}
                <Link
                  to="/profile-settings"
                  className="text-gray-800 font-semibold hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.displayName || "User"}
                </Link>
                <Link
                  to="/Setting"
                  className="text-gray-700 font-medium hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Setting
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 font-medium hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
