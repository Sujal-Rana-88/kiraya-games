"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-hooks";
import HeroSection from "@/components/hero-section";
import FeaturedGames from "@/components/featured-games";
import HowItWorks from "@/components/how-it-works";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; 
  
    const token = localStorage.getItem("token");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
    if (!token || !isAuthenticated || !user) {
      localStorage.clear();
      router.replace("/login");
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedGames />
      <HowItWorks />
    </div>
  );
}
