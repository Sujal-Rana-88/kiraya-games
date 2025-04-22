import { motion } from "framer-motion";
import React from "react";

interface ImageClipBoxProps {
  src: string;
  clipClass: string;
}

const ImageClipBox: React.FC<ImageClipBoxProps> = ({ src, clipClass }) => (
  <motion.div
    className={clipClass}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <img src={src} alt="contact visual" />
  </motion.div>
);

interface ButtonProps {
  id?: string;
  title: string;
  containerClass?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  id,
  title,
  containerClass,
  onClick,
}) => {
  return (
    <motion.button
      id={id}
      className={`px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all ${containerClass}`}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      {title}
    </motion.button>
  );
};

const Contact: React.FC = () => {
  const handleContactClick = () => {
    // Navigate programmatically to the "/contact" route
    window.location.href = "/contact";
  };

  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        {/* Clip Images with Framer Motion Animations */}
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        {/* Title and Button Animation */}
        <div className="flex flex-col items-center text-center">
          <motion.p
            className="mb-10 font-general text-[10px] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Join Horizon Games
          </motion.p>

          <motion.h1
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether.
          </motion.h1>

          <Button
            title="contact us"
            containerClass="mt-10 cursor-pointer"
            onClick={handleContactClick} // Using window.location.href for navigation
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
