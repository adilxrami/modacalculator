import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function MealPlan() {
  const [meals, setMeals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("https://dummyjson.com/recipes");
        const data = await res.json();
        setMeals(data.recipes);
        setFiltered(data.recipes);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching meals:", err);
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  useEffect(() => {
    let filteredList = meals;

    if (category !== "all") {
      filteredList = filteredList.filter((m) =>
        m.tags?.includes(category) || m.mealType?.includes(category)
      );
    }

    if (search.trim() !== "") {
      filteredList = filteredList.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(filteredList);
  }, [search, category, meals]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const categories = [
    { label: "All Meals", value: "all", emoji: "🍽" },
    { label: "Breakfast", value: "breakfast", emoji: "🥞" },
    { label: "Lunch", value: "lunch", emoji: "🥗" },
    { label: "Dinner", value: "dinner", emoji: "🍛" },
    { label: "Snacks", value: "snacks", emoji: "🍿" },
    { label: "Vegan", value: "vegan", emoji: "🥬" },
    { label: "High Protein", value: "high-protein", emoji: "🍗" },
  ];

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500">
        ⏳ Loading meal plans...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 tracking-tight text-green-800">
        <span style={{ fontFamily: "Pacifico, cursive" }}>
          Delicious Meal Plans
        </span>
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 mb-10 sm:mb-12">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="🔍 Search your favorite meal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div ref={dropdownRef} className="relative w-full md:w-64">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-800 shadow-sm font-semibold flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          >
            <span>
              {categories.find((c) => c.value === category)?.emoji}{" "}
              {categories.find((c) => c.value === category)?.label}
            </span>
            <svg
              className="w-4 h-4 ml-2 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-100 transition-all ${
                    cat.value === category ? "bg-gray-100 font-bold" : ""
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meal Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 text-base sm:text-lg mt-12 sm:mt-16">
          😕 No meals found. Try adjusting your filters or search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filtered.map((meal) => (
            <div
              key={meal.id}
              onClick={() => navigate(`/meals/${meal.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="overflow-hidden relative">
                <img
                  src={meal.image || "https://source.unsplash.com/400x300/?healthy-food"}
                  alt={meal.name}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  {meal.calories || Math.floor(Math.random() * 700 + 200)} kcal
                </span>
              </div>
              <div className="p-4">
                <h2 className="text-base sm:text-lg font-bold mb-1 truncate">
                  {meal.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 capitalize">
                  {meal.mealType?.join(", ")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-xs sm:text-sm">
                    🥦 Health:{" "}
                    {meal.healthScore || Math.floor(Math.random() * 50 + 50)}%
                  </span>
                  <button className="bg-green-500 text-white text-xs px-3 py-1 rounded-full hover:bg-green-600 transition">
                    Add to Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
