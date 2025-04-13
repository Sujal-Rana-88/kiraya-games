"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Ensure importing from next/navigation
import API_URLS from "@/config/urls";

const OAuthRegisterScreen = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch initial localStorage values
  useEffect(() => {
    setUserName(localStorage.getItem("user_name") || "");
  }, []);

  // Username validation regex (same as backend)
  const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

  // Validate username input
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\s+/g, ""); // Remove spaces
    setUserName(input);

    if (!usernameRegex.test(input)) {
      setError("Username must be 3-20 characters and can only contain letters, numbers, underscores (_), and dots (.)");
    } else {
      setError(""); // Clear error
    }
  };

  // Validate phone number
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(input);

    if (input.length < 10) {
      setError("Phone number must be at least 10 digits long.");
    } else {
      setError(""); // Clear error
    }
  };

  const handleNext = () => {
    if (!usernameRegex.test(userName)) {
      setError("Invalid username format.");
      return;
    }
    if (!dob) {
      setError("Date of birth is required.");
      return;
    }
    setError(""); // Clear any existing errors
    setStep(2); // Proceed to the next step
  };

  const handlePrevious = () => {
    setStep(1); // Go back to step 1
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (phoneNumber.length < 10) {
      setError("Phone number must be at least 10 digits long.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("dob", dob);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", localStorage.getItem("email") || "");
      formData.append("firstName", localStorage.getItem("firstName") || "");
      formData.append("lastName", localStorage.getItem("lastName") || "");
      formData.append("profilePicture", localStorage.getItem("profilePicture") || "");

      const response = await axios.post(API_URLS.GOOGLE_OAUTH_REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_id", response.data.userId);
      localStorage.setItem("user_name", response.data.userName);
      localStorage.setItem("firstName", response.data.firstName);
      localStorage.setItem("lastName", response.data.lastName);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("profilePicture", response.data.profilePictureUrl || "");

      router.push("/"); // Redirect on success

    } catch (err: any) {
      console.error("Error response object:", err.response); // Log the error response
      console.error("Error message:", err.message); // Log the error message
      setError(err.response?.data?.message || "Registration failed. Try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-lg bg-gray-800 text-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={handleUsernameChange}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600"
              required
            />
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600"
              required
            />
            <div className="flex justify-between">
              <button
                type="button" // Ensure this is a button type
                onClick={handlePrevious}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                {loading ? "Submitting..." : "Register"}
              </button>
            </div>
          </div>
        )}

        {loading && <p className="text-yellow-400 text-center">Processing...</p>}
      </div>
    </section>
  );
};

export default OAuthRegisterScreen;
