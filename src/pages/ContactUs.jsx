import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent! We will contact you at ${formData.email}`);
    // Here you can integrate Firebase or EmailJS to send the form
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">Email us at: <a href="mailto:support@yourdomain.com" className="text-green-600">support@yourdomain.com</a></p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-3 rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-3 rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Your Message"
          className="w-full border p-3 rounded h-32"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
