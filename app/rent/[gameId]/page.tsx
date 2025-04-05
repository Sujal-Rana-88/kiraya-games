"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaUser, FaClock, FaTimes } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API_URLS from "@/config/urls";
import { use } from "react"; // Import use from React

const stripePromise = loadStripe("pk_test_51Qu93eCeKFVqQSMiGojgnCRBZhAOscz1Xwfl6HUBv7HWU5eiYtBjCZTEhtym1Mk18W5ys93jgHEtmz34VhG39NmH008iQ59kkY");

const PaymentForm = ({ gameId, userId, price, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const buyerId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        API_URLS.RENT_GAME,
        {
          buyerId,
          userId,
          gameId,
          paymentMethodId: paymentMethod.id,
          amount: price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.paymentStatus === "Success") {
        toast.success("Game rented successfully!");
        onSuccess();
      } else {
        toast.error("Payment failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement className="border p-3 rounded-md" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-center mt-4"
      >
        {loading ? "Processing..." : `Pay ₹${price}`}
      </button>
    </form>
  );
};

export default function GameDetailPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const gameId = unwrappedParams.gameId;
  
  const [game, setGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const token = localStorage.getItem("token");
        var userId = localStorage.getItem("user_id");
        
        const res = await axios.post(
          API_URLS.FETCH_GAME,
          { gameId, userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setGame(res.data);
        
        // Now fetch lender data
        const userRes = await axios.post(
          API_URLS.FETCH_USER_DATA,
          { userId: res.data.userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userRes.data) {
          setRating(userRes.data.rating || 0);
          setUserName(userRes.data.userName || "Anonymous");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]); 

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div>Game not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-4xl h-96 bg-cover bg-center rounded-lg overflow-hidden"
          style={{ backgroundImage: `url(${game.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-6 text-white">
            <h1 className="text-4xl font-bold">{game.gameName}</h1>
            <div className="flex space-x-2"><FaUser /><span>{userName}</span></div>
            <div className="flex space-x-2"><FaClock /><span>{game.lendingPeriod} Days</span></div>
            <div className="flex items-center space-x-2 text-yellow-500"><FaStar /><span>{rating} / 5</span></div>
            <div className="text-2xl font-semibold">₹{game.price}</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              Rent Now
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {game.about && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Details</h3>
              <p>{game.about}</p>
            </div>
          )}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold">Rental Info</h3>
            <p>Lending Period: {game.lendingPeriod} days</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 w-96 text-black"
          >
            <div className="flex justify-between border-b pb-3">
              <h3 className="text-lg font-semibold">Payment</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  gameId={game.gameId}
                  userId={game.userId}
                  price={game.price}
                  onSuccess={() => router.push("/success")}
                />
              </Elements>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}