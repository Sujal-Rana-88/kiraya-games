"use client";

import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Footer from "@/components/Footer"; 
import Navbar from "@/components/navbar";

const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    setTransformStyle(
      `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const ContactCard = () => {
  return (
    <BentoTilt className="relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/feature-4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative flex w-full flex-col justify-between p-8 text-white bg-black/50 rounded-md">
        <div>
          <h1 className="bento-title special-font text-3xl">Contact Us</h1>
          <p className="mt-3 max-w-64 text-xs md:text-base">
            Have questions or need support? Reach out to us, and we’ll get back to you shortly.
          </p>
        </div>
        <TiLocationArrow className="m-5 scale-[2] self-end text-blue-300" />
      </div>
    </BentoTilt>
  );
};

const ContactForm = () => {
  return (
    <form className="space-y-4 bg-gray-800 p-8 rounded-md shadow-md">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-600"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-600"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="block w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-600"
        required
      ></textarea>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-md transition-colors"
      >
        Send Message
      </button>
    </form>
  );
};

const ContactUs = () => {
  return (
    <>
      <section className="bg-black pb-52 text-white">
        <div className="container mx-auto px-3 md:px-10">
          <div className="px-5 py-32 text-center">
            <p className="text-lg text-blue-50">We’d Love to Hear From You</p>
          </div>
          <ContactCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <BentoTilt className="p-8 bg-gray-800 text-white rounded-md shadow-md">
              <h2 className="text-xl font-bold">Get In Touch</h2>
              <p className="mt-2">
                Fill out the form, and our team will contact you soon.
              </p>
            </BentoTilt>
            <BentoTilt className="bento-tilt_1">
              <ContactForm />
            </BentoTilt>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
