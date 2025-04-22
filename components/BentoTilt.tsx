
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiLocationArrow } from "react-icons/ti";
gsap.registerPlugin(ScrollTrigger);

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