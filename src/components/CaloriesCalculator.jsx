import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activity, setActivity] = useState("moderate");
  const [calories, setCalories] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setAge(data.age ?? "");
            setGender(data.gender ?? "male");
            setWeight(data.weight ?? 70);
            setHeight(data.height ?? 170);
            setActivity(data.activity ?? "moderate");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateCalories = async () => {
    if (age <= 0 || weight <= 0 || height <= 0) {
      setError("Please enter valid positive numbers for age, weight, and height.");
      setCalories(null);
      return;
    }

    setError("");

    const bmr =
      gender === "male"
        ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
        : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;

    const activityLevels = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const totalCalories = bmr * (activityLevels[activity] || 1.55);
    setCalories(totalCalories.toFixed(2));

    const user = auth.currentUser;
    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        {
          age,
          gender,
          weight,
          height,
          activity,
          calories: totalCalories.toFixed(2),
        },
        { merge: true }
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg mt-6 sm:mt-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Calorie Calculator</h1>
      <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
        Estimate your daily caloric needs based on your personal details and activity level.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-sm sm:text-base">Age (years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            min="1"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-sm sm:text-base">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2 text-sm sm:text-base">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            min="1"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-sm sm:text-base">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            min="1"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-medium mb-2 text-sm sm:text-base">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly active (light exercise 1-3 days/week)</option>
            <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="active">Active (hard exercise 6-7 days/week)</option>
            <option value="veryActive">Very active (hard daily exercise or physical job)</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateCalories}
        className="w-full mt-6 sm:mt-8 bg-blue-600 text-white p-3 sm:p-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-700 transition"
      >
        Calculate
      </button>

      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {calories && (
        <div className="mt-6 p-3 sm:p-4 bg-green-100 border border-green-300 rounded-xl text-center">
          <h2 className="text-lg sm:text-xl font-bold text-green-700">Your Daily Caloric Needs</h2>
          <p className="text-xl sm:text-2xl font-semibold mt-2">{calories} kcal/day</p>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            This is the estimated amount to maintain your current weight.
          </p>
        </div>
      )}
    </div>
  );
}
