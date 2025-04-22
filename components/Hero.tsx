import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const totalVideos = 4;

const Hero = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedVideos, setLoadedVideos] = useState<number>(0);

  const nextVdRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const handleVideoLoad = (): void => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  const handleVideoClick = (): void => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useGSAP(
    () => {
      if (hasClicked && nextVdRef.current) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current?.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index: number): string => `/videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        ref={videoContainerRef}
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-greem-75"
        onClick={handleVideoClick} // Trigger video change only on video click
      >
        {/* Apply hover effect for the center of the video only */}
        <div className="absolute inset-0 cursor-pointer hover:bg-opacity-20 hover:bg-black transition-all duration-300">
          <div className="mask-clip-path flex justify-center items-center absolute top-1/3 left-1/3  size-72 cursor-pointer overflow-hidden rounded-lg ">
            <VideoPreview>
              <div className="origin-center scale-50 flex justify-center text-center opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100">
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  id="current-video"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />
              </div>
            </VideoPreview>
          </div>

          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75 text-8xl md:text-8xl">
            G<b>A</b>MES
          </h1>

          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className="special-font hero-heading text-blue-100 text-9xl md:text-8xl">
                Kiray<b>a</b>
              </h1>

              <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                Rent Your Favorite Games <br /> Unleash the Play Economy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
