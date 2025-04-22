"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";

const About = () => {
  const containerRef = useRef(null);

  // Track scroll relative to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], // from out-of-view to in-view
  });

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Scale up the image from 0.5 to 1
  const scale = useTransform(smoothProgress, [0, 1], [0.5, 1]);

  // Expand width & height smoothly
  const width = useTransform(smoothProgress, [0, 1], ["40vw", "100vw"]);
  const height = useTransform(smoothProgress, [0, 1], ["40vh", "100vh"]);

  // Border radius shrink
  const borderRadius = useTransform(smoothProgress, [0, 1], ["30px", "0px"]);

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Horizon Games
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>Connect with a thriving community that values game sharing and accessibility.</p>
          <p className="text-gray-500">
            Rent your favorite titles at a fraction of the cost—no need to buy every game.
          </p>
        </div>
      </div>

      {/* Scroll-triggered animation block */}
      <div className="h-[200vh] w-screen" ref={containerRef}>
        <div className="sticky top-0 flex justify-center items-center h-screen">
          <motion.div
            style={{
              width,
              height,
              scale,
              borderRadius,
              overflow: "hidden",
            }}
            className="relative"
          >
            <Image
              src="/img/about.webp"
              alt="About Horizon"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
