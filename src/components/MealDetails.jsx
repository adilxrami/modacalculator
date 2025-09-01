import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function MealPlanDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portionSize, setPortionSize] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetch(`https://dummyjson.com/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMeal(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching meal:", err);
        setLoading(false);
      });
  }, [id]);

  const increasePortion = () => setPortionSize((prev) => prev + 1);
  const decreasePortion = () => setPortionSize((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) return <p className="p-6 text-center text-gray-600">⏳ Loading meal details...</p>;
  if (!meal || !meal.name) return <p className="text-center text-red-600">❌ Meal not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
      <Link
        to="/Meals"
        className="text-green-600 hover:underline inline-block text-sm sm:text-base"
      >
        ← Back to Meal Plans
      </Link>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start bg-white shadow-lg rounded-2xl p-5 sm:p-6">
        {/* Image */}
        <div
          className="relative rounded-xl overflow-hidden w-full max-w-sm mx-auto md:mx-0 h-80 sm:h-96 border border-gray-200 shadow"
          data-aos="zoom-in"
        >
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Meal Info */}
        <div className="space-y-4" data-aos="fade-left">
          <h1 className="text-xl sm:text-2xl font-bold">{meal.name}</h1>
          <p className="text-xs sm:text-sm text-gray-500">Cuisine: {meal.cuisine}</p>
          <p className="text-sm sm:text-base text-gray-700">{meal.mealType?.join(", ")}</p>

          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {meal.caloriesPerServing} kcal
            </span>
            <span className="text-yellow-500 text-xs sm:text-sm">
              ⭐ {meal.rating} / 5
            </span>
          </div>

          {/* Portion Selector */}
          <div>
            <h2 className="text-xs sm:text-sm font-semibold mb-1">Portion Size:</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={decreasePortion}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-base font-bold hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-base sm:text-lg">{portionSize}</span>
                <button
                  onClick={increasePortion}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-base font-bold hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              {/* Add to Meal Plan */}
              <button
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-full shadow transition hover:scale-105 active:scale-95"
              >
                ➕ Add to Meal Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
