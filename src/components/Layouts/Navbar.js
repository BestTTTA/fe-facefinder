"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="flex p-4 sticky top-0 z-50 justify-center bg-indigo-950">
      <div className="w-container flex items-center justify-center ">
        <Link href="/" className="flex justify-center items-center w-full">
          <div className="flex items-center gap-3 group ">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <img
                src="/favicon.png"
                alt="Facemenow Logo"
                className="relative h-10 w-12 rounded-lg"
              />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Facemenow
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          {/* <button
            style={{ background: "var(--btn-gradient)" }}
            className="hidden text-sm font-thin outline-4 outline-offset-2 outline-solid outline-purple-500 sm:inline-block px-8 py-2 rounded-full text-white shadow"
          >
            LOGIN
          </button> */}

          <div className="relative hidden" ref={menuRef}>
            <button
              className="p-2 rounded hover:bg-gray-100 focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex flex-col z-50 animate-fade-in p-4">
                <button
                  className="px-4 py-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/uploads");
                  }}
                >
                  อัพโหลดรูป
                </button>
                <button
                  className="px-4 py-3 text-left hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  ติดต่อเรา
                </button>
                {/* <button
                  style={{ background: "var(--btn-gradient)" }}
                  onClick={() => setMenuOpen(false)}
                  className="sm:hidden text-sm font-thin outline-4 outline-offset-2 outline-solid outline-purple-500 inline-block px-8 py-2 rounded-full text-white shadow mt-4"
                >
                  LOGIN
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
