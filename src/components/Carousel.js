"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  { src: "/emty-banner.png", alt: "Carousel 1" },
  { src: "/emty-banner2.png", alt: "Carousel 2" },
  { src: "/emty-banner3.png", alt: "Carousel 3" },
];

function Carousel() {
  const [active, setActive] = useState(0);
  const total = slides.length;

  const goTo = (idx) => setActive(idx);
  const prev = () => setActive((prev) => (prev - 1 + total) % total);
  const next = () => setActive((prev) => (prev + 1) % total);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
        {slides.map((slide, idx) => (
          <div
            key={slide.alt}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{ pointerEvents: active === idx ? "auto" : "none" }}
            data-carousel-item={active === idx ? "active" : undefined}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover w-full h-full"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`w-3 h-3 rounded-full ${
              active === idx ? "bg-gray-500" : "bg-gray-300"
            }`}
            aria-current={active === idx ? "true" : "false"}
            aria-label={`Slide ${idx + 1}`}
            data-carousel-slide-to={idx}
            onClick={() => goTo(idx)}
          ></button>
        ))}
      </div>
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={prev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 ">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={next}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 ">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}

export default Carousel;
