"use client";

import { useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { gsap } from "gsap";  // <-- Import gsap here
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BentoCard, BentoTilt } from "./BentoTilt";
const AboutFeatures = () => {
  useEffect(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  }, []);

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="text-lg text-white">The Future of Game Sharing</p>
          <p className="mt-3 max-w-lg text-sm text-white/70">
            Horizon Games is a **game renting and lending platform** where players can **borrow, lend, and trade games** easily. Access a vast collection and experience gaming **on demand**.
          </p>
        </div>
        
        <BentoTilt className="h-96 w-full mb-7 overflow-hidden rounded-md">
          <BentoCard
            src="videos/feature-1.mp4"
            title="Rent Instantly"
            description="Browse and rent games at a fraction of the cost. Play without commitment and return anytime."
            isComingSoon
          />
        </BentoTilt>
        
        <div className="grid gap-7 md:grid-cols-2 md:grid-rows-3 h-auto">
          <BentoTilt><BentoCard src="videos/feature-2.mp4" title="Lend & Earn" description="List your games and earn money when other gamers rent them." isComingSoon /></BentoTilt>
          <BentoTilt><BentoCard src="videos/feature-3.mp4" title="Discover More" description="Explore a massive library of games across all genres." isComingSoon /></BentoTilt>
          <BentoTilt><BentoCard src="videos/feature-4.mp4" title="Secure & Safe" description="With secure transactions, enjoy hassle-free renting." isComingSoon /></BentoTilt>
          <BentoTilt>
            <div className="flex flex-col justify-between p-5 bg-violet-300 h-full rounded-lg">
              <h1 className="text-black text-lg font-bold">More Games, More Access.</h1>
              <TiLocationArrow className="self-end text-5xl text-black" />
            </div>
          </BentoTilt>
          <BentoTilt>
            <video src="videos/feature-5.mp4" loop muted autoPlay className="w-full h-full object-cover rounded-lg" />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default AboutFeatures;
