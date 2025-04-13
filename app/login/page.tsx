"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URLS from "../../config/urls.js";
import { toast } from "react-toastify";
// VerifyEmailModal Component
const VerifyEmailModal = ({ isOpen, onClose, userName }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Prevent rendering if the modal is not open
  if (!isOpen) return null;

  // Function to handle OTP input changes
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Function to handle OTP verification
  const handleVerify = async () => {
    if (otp.some((digit) => digit === "")) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true); // Start verifying
    try {
      const response = await axios.post(API_URLS.VERIFY_OTP, {
        userName,
        otp: otp.join(""),
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        onClose();

      } else {
        toast({
          title: "Error",
          description: "Verification failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Verification failed. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false); // End verifying
    }
  };

  // Function to handle resending OTP
  const handleResend = async () => {
    setIsResending(true); // Start resending
    try {
      await axios.post(API_URLS.VERIFY_EMAIL, { userName });
      toast({
        title: "Info",
        description: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false); // End resending
    }
  };

  // UI for the OTP verification modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-lg"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
        <p className="text-center text-muted-foreground mb-4">
          Enter the 6-digit OTP sent to your email.
        </p>
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-xl text-center rounded-md focus:ring focus:ring-blue-600"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <Button
          className="w-full py-3 text-white font-bold rounded-md mb-3"
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
              Verifying...
            </span>
          ) : (
            "Verify Email"
          )}
        </Button>
        <Button
          variant="outline"
          className={`w-full py-3 font-bold rounded-md border border-blue-600 text-blue-600 ${
            isResending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
          }`}
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
              Resending...
            </span>
          ) : (
            "Resend OTP"
          )}
        </Button>
      </div>
    </div>
  );
};

// LoginPage Component
export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const { user, login, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Function to check if token is valid
  const isTokenValid = (token:any) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (error) {
      return false; // Invalid token
    }
  };

  // useEffect to check authentication status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

      if (token && isAuthenticated && isTokenValid(token)) {
        router.replace("/");
      }
    }
  }, [router]);

  // useEffect to redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true); // Start loading
  
    try {
      // setLoading(true);
      const response = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
  
      if (!response.ok) throw new Error("Login failed");
  
      const data = await response.json();
  
      // Store user details with a delay
      await Promise.all([
        localStorage.setItem("token", data.access_token),
        localStorage.setItem("user_id", data.userId),
        localStorage.setItem("user_name", data.userName),
        localStorage.setItem("email", data.email),
        localStorage.setItem("first_name", data.firstName),
        localStorage.setItem("last_name", data.lastName),
        localStorage.setItem("isAuthenticated", "true"),
        localStorage.setItem("profilePicture", data.profilePictureUrl || ""),
        localStorage.setItem("user", JSON.stringify(data)),
      ]);
  
      // setUser(data);
      

      // Validate before redirecting
      setTimeout(() => {
        if (localStorage.getItem("isAuthenticated") === "true") {
          router.push("/");
        }
      }, 300);
      toast.success("Logged In Successfully");
    } catch (error : any) {
      if (error.status === 403) {
        // Open OTP modal if verification is required
        setIsOtpModalOpen(true);
        axios.post(API_URLS.VERIFY_EMAIL, { userName });
      } else {
        toast.error("Some error occured");
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };
  

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast.success("Google login failed");
    }
  };

  // Main UI for the login page
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <VerifyEmailModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        userName={userName}
      />
    </div>
  );
}
