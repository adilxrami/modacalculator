import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    appName: "",
    welcomeMessage: "",
    supportEmail: "",
    theme: "light",
    enableCaloriesCalculator: true,
    enableMealPlans: true,
    facebook: "",
    instagram: "",
    youtube: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const docRef = doc(db, "settings", "fitnessApp");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const docRef = doc(db, "settings", "fitnessApp");
    await setDoc(docRef, settings);
    setSaving(false);
    alert("Settings updated!");
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">App Settings</h1>

      <label className="block mb-2">
        App Name
        <input
          type="text"
          name="appName"
          value={settings.appName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Welcome Message
        <textarea
          name="welcomeMessage"
          value={settings.welcomeMessage}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Support Email
        <input
          type="email"
          name="supportEmail"
          value={settings.supportEmail}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Theme
        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label className="block mb-2">
        <input
          type="checkbox"
          name="enableCaloriesCalculator"
          checked={settings.enableCaloriesCalculator}
          onChange={handleChange}
        />
        Enable Calories Calculator
      </label>

      <label className="block mb-2">
        <input
          type="checkbox"
          name="enableMealPlans"
          checked={settings.enableMealPlans}
          onChange={handleChange}
        />
        Enable Meal Plans
      </label>

      <label className="block mb-2">
        Facebook Link
        <input
          type="text"
          name="facebook"
          value={settings.facebook}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Instagram Link
        <input
          type="text"
          name="instagram"
          value={settings.instagram}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        YouTube Link
        <input
          type="text"
          name="youtube"
          value={settings.youtube}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
