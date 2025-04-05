"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  type User,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import API_URLS from "@/config/urls";
import { useRouter } from "next/navigation";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
// toast.configure();

// Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",


// };
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface SignupData {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter(); // Initialize inside your componen
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          const firebaseUser = {
            userId: currentUser.uid,
            userName: currentUser.displayName || "",
            email: currentUser.email || "",
            profilePicture: currentUser.photoURL || "",
            access_token: currentUser.refreshToken || "",
          };
  
          localStorage.setItem("user", JSON.stringify(firebaseUser));
          localStorage.setItem("token", firebaseUser.access_token);
          localStorage.setItem("isAuthenticated", "true");
          
          setUser(firebaseUser); // Fix: Setting user state here!
        } else {
          localStorage.clear();
          setUser(null);
        }
      });
  
      return () => unsubscribe();
    }
  
    setLoading(false);
  }, []);
  
  

  const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  
  
  const login = async (userName: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
  
      if (!response.ok) throw new Error("Login failed");
  
      const data = await response.json();
  
      // Store user details with a delay
      await Promise.all([
        setLocalStorage("token", data.access_token),
        setLocalStorage("user_id", data.userId),
        setLocalStorage("user_name", data.userName),
        setLocalStorage("email", data.email),
        setLocalStorage("first_name", data.firstName),
        setLocalStorage("last_name", data.lastName),
        setLocalStorage("isAuthenticated", "true"),
        setLocalStorage("profilePicture", data.profilePictureUrl || ""),
        setLocalStorage("user", JSON.stringify(data)),
      ]);
  
      setUser(data);
      

      // Validate before redirecting
      setTimeout(() => {
        if (localStorage.getItem("isAuthenticated") === "true") {
          router.push("/");
        }
      }, 300);
      toast.success("Logged In Successfully");
    } catch (error : any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = result.user;
      const idToken = await result.user.getIdToken();
  
      const [firstName, ...lastNameArray] = displayName?.split(" ") || [];
      const lastName = lastNameArray.join(" ");
  
      // Store basic info temporarily
      localStorage.setItem("user_name", displayName || "");
      localStorage.setItem("firstName", firstName || "");
      localStorage.setItem("lastName", lastName || "");
      localStorage.setItem("email", email || "");
  
      // Send token and email to backend for verification
      const response = await fetch(API_URLS.GOOGLE_OAUTH_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          idToken,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Store user details
        setLocalStorage("token", data.access_token),
        setLocalStorage("user_id", data.userId),
        setLocalStorage("user_name", data.userName),
        setLocalStorage("email", data.email),
        setLocalStorage("first_name", data.firstName),
        setLocalStorage("last_name", data.lastName),
        setLocalStorage("isAuthenticated", "true"),
        setLocalStorage("profilePicture", data.profilePictureUrl || ""),
        setLocalStorage("user", JSON.stringify(data)),
  
        setUser(data);
        router.push("/");
        toast.success("Logged in with Google successfully!");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
  
      if (error.response?.status === 404) {
        toast.error("Account doesn't exist. Redirecting to registration...");
        localStorage.setItem("redirectToRegister", "true");
        
        setTimeout(() => {
          router.push("/auth/google/user/register");
        }, 3000);
      } else {
        toast.error("Google login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (data: SignupData) => {
    try {
      setLoading(true);
  
      // Register user in backend
      const response = await fetch(API_URLS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Signup failed. Please try again.");
      }
  
      // Register user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;
  
      // Store data in localStorage
      await Promise.all([
        localStorage.setItem("token", newUser.refreshToken),
        localStorage.setItem("user_id", newUser.uid),
        localStorage.setItem("user_name", data.userName),
        localStorage.setItem("firstName", data.firstName),
        localStorage.setItem("lastName", data.lastName),
        localStorage.setItem("email", data.email),
        localStorage.setItem("isAuthenticated", "true"),
        localStorage.setItem("profilePicture", ""),
        localStorage.setItem("user", JSON.stringify(newUser)),
      ]);
  
      setUser(newUser);
      toast.success("User created successfully!");
  
      router.push("/"); // Redirect to home or dashboard after successful signup
    } catch (error: any) {
      console.error("Signup Error:", error);
  
      // Handle Firebase-specific errors
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            toast.error("This email is already in use. Please use a different email.");
            break;
          case "auth/weak-password":
            toast.error("Password is too weak. Use at least 6 characters.");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email format. Please enter a valid email.");
            break;
          default:
            toast.error("Signup failed. Please try again.");
        }
      } else {
        toast.error(error.message || "Signup failed. Please try again.");
      }
  
      // Clear stored data on failure
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true); // Ensure loading is true before logout
    await signOut(auth);
    localStorage.clear();
    setUser(null);
    setTimeout(() => {
      setLoading(false); // Delay stopping loading to ensure effect runs
    }, 300);
    toast.success("Logout Successfully");
  };
  


  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) throw new Error("User not authenticated");

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    await fetch(API_URLS.UPDATE_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, newPassword }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        loginWithGoogle,
        updatePassword: updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
