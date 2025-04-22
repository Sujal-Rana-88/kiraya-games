"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll(".animated-word");

      if (words) {
        const titleAnimation = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "100 bottom",
            end: "center bottom",
            toggleActions: "play none none reverse",
          },
        });

        titleAnimation.to(words, {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          ease: "power2.inOut",
          stagger: 0.02,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <h2
      ref={containerRef}
      className={clsx(
        "text-[44px] font-black leading-[1.1] tracking-tight md:text-[80px]",
        containerClass
      )}
      dangerouslySetInnerHTML={{
        __html: title
          .split(" ")
          .map(
            (word) =>
              `<span class="animated-word inline-block opacity-0 translate-y-3">${word}</span>`
          )
          .join(" "),
      }}
    />
  );
};

export default AnimatedTitle;
