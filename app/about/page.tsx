"use client";
import Footer from "@/components/Footer";
import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

// BentoTilt Component to apply tilt effect
export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    setTransformStyle(`perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`);
  };

  return (
    <div
      ref={itemRef}
      className={`transition-transform duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransformStyle("")}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

// BentoCard Component to display a video card with hover effects
export const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverRef = useRef(null);

  const handleHover = (event) => {
    if (!hoverRef.current) return;
    const rect = hoverRef.current.getBoundingClientRect();
    setCursorPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col justify-between h-full p-5 text-white">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {description && <p className="mt-2 text-sm opacity-80">{description}</p>}
        </div>

        {isComingSoon && (
          <div
            ref={hoverRef}
            onMouseMove={handleHover}
            onMouseEnter={() => setHoverOpacity(1)}
            onMouseLeave={() => setHoverOpacity(0)}
            className="relative flex items-center gap-2 px-4 py-2 text-xs uppercase text-white/80 bg-black rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(101, 111, 226, 0.6), rgba(0, 0, 0, 0.2))`,
              }}
            />
            <TiLocationArrow className="z-10" />
            <span className="z-10">Coming Soon</span>
          </div>
        )}
      </div>
      
    </div>
  );
};

// AboutFeatures Section to display multiple BentoCards with hover and tilt effects
const AboutFeatures = () => (
<>
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
    <Footer />
    </>
);

export default AboutFeatures;
