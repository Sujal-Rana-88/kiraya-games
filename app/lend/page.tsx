"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URLS from "@/config/urls";
import { toast } from "react-toastify";
import Image from "next/image";

const LendGame = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [token, setStoredToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // This code only runs on the client
    const value = localStorage.getItem('token');
    const value1 = localStorage.getItem('user_id');
    setStoredToken(value);
    setUserId(value1);
  }, []);
  const [formData, setFormData] = useState({
    gameName: "",
    lendingPeriod: "",
    price: "",
    tags: "",
    about: "",
    termsAccepted: false,
    image: null,
    category: "",
  });
  const [tagsList, setTagsList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const validCharactersRegex = /^[\s\S]*$/;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      if (files && files[0]) {
        setFormData({ ...formData, image: files[0] });
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else {
      if (
        name === "about" ||
        validCharactersRegex.test(value) ||
        value === ""
      ) {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleAddTag = () => {
    if (tagsList.length >= 3) {
      toast.warning("You can only add up to 3 tags.");
      return;
    }
    if (formData.tags.trim() && !tagsList.includes(formData.tags.trim())) {
      setTagsList([...tagsList, formData.tags.trim()]);
      setFormData({ ...formData, tags: "" });
    }
  };

  const handleRemoveTag = (tag) => {
    setTagsList(tagsList.filter((t) => t !== tag));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.gameName.trim() !== "" && formData.category.trim() !== ""
        );
      case 2:
        return (
          formData.lendingPeriod.trim() !== "" && formData.price.trim() !== ""
        );
      case 3:
        return formData.about.trim() !== "" && formData.about.length <= 250;
      case 4:
        return formData.image !== null && formData.termsAccepted;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error("Please complete all fields in this step before proceeding.");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setFormData({
      gameName: "",
      lendingPeriod: "",
      price: "",
      tags: "",
      about: "",
      termsAccepted: false,
      image: null,
      category: "",
    });
    setTagsList([]);
    setPreviewImage(null);
    setCurrentStep(1); // Reset to the first step
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast.error(
        "You must accept the terms and conditions to submit the form."
      );
      return;
    }

    if (formData.about.length > 250) {
      toast.error("The 'About' field must not exceed 250 characters.");
      return;
    }

    const tags = tagsList.join("$");
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("gameName", formData.gameName);
    formDataToSubmit.append("lendingPeriod", formData.lendingPeriod);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("tags", tags);
    formDataToSubmit.append("about", formData.about);
    formDataToSubmit.append("userId", userId);
    formDataToSubmit.append("image", formData.image);
    formDataToSubmit.append("category", formData.category);
    setLoading(true);
    try {
      const response = await axios.post(API_URLS.LEND_GAME, formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Game Uploaded successfully");
      resetForm(); // Call the reset function on success
    } catch (error) {
      console.error(
        "Error lending the game:",
        error.response?.data || error.message
      );
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold text-blue-500 mb-4">
              Step 1: Game Details
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Game Name
              </label>
              <input
                type="text"
                name="gameName"
                value={formData.gameName}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                required
              >
                <option value="">Select a category</option>
                <option value="Action">Action</option>
                <option value="RPG">RPG</option>
                <option value="Sports">Sports</option>
                <option value="Racing">Racing</option>
                <option value="Shooter">Shooter</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Open World">Open World</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold text-blue-500 mb-4">
              Step 2: Lending Details
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Lending Period (days)
              </label>
              <input
                type="number"
                name="lendingPeriod"
                value={formData.lendingPeriod}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Tags (Up to 3)
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                  placeholder="Enter a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md transition-colors"
                >
                  +
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagsList.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-600 text-white px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-red-400 hover:text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold text-blue-500 mb-4">
              Step 3: Game Description
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                About (max 250 characters)
              </label>
              <p className="text-xs text-gray-400 mt-1">
                {formData.about.length} / 250 characters
              </p>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-600"
                rows="4"
                required
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold text-blue-500 mb-4">
              Step 4: Upload & Confirm
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Game Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
                accept="image/*"
                required
              />
              {previewImage && (
                <div className="mt-4 flex justify-center">
                  <div className="relative w-40 h-40 overflow-hidden rounded-md">
                    <img
                      src={previewImage}
                      alt="Game preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center text-gray-300">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm">
                I accept the terms and conditions
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-semibold text-center">Lend Your Game</h1>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Progress Bar */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-300">
                  Step {currentStep} of {totalSteps}
                </p>
                <p className="text-xs text-gray-300">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>

              {/* Steps indicator */}
              <div className="flex justify-between mt-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        i + 1 <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-400">
                      {i === 0
                        ? "Details"
                        : i === 1
                        ? "Lending"
                        : i === 2
                        ? "Description"
                        : "Upload"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-4">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={`bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors ${
                    currentStep === 1 ? "invisible" : ""
                  }`}
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors ${
                      loading ? "cursor-not-allowed opacity-70" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>&copy; 2024 Game Lending Platform</p>
      </footer>
    </div>
  );
};

export default LendGame;
