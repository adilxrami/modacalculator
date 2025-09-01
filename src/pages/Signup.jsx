
import SignupForm from "../components/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <SignupForm />
      </div>
    </div>
  );
}

