"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion"; // optional for animation

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 1️⃣ Background Image */}
      <Image
        src="/Assets/Group2.png"
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center scale-110 animate-[zoomIn_12s_ease-in-out_infinite_alternate]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#030405]/90 via-[#030405]/70 to-transparent " />

      {/* 3️⃣ Animated Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

      {/* 4️⃣ Text Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 space-y-5"
      >
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-light text-white/90 tracking-tight"
        >
          Welcome to
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        >
          NextStation
        </motion.h2>

        <p className="text-lg md:text-xl text-white/80 max-w-xl">
          Buy the latest games on every platform — faster and easier than ever.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6">
          <a
            href="#products"
            className="group inline-flex items-center px-7 py-3 rounded-xl bg-gradient-to-r from-[#ffffff33] to-[#ffffff22]
              hover:from-[#ffffff55] hover:to-[#ffffff33] transition-all duration-300 shadow-lg text-white font-medium backdrop-blur-md"
          >
            <svg
              className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Get Started
          </a>

          <a
            href="#explore"
            className="inline-flex items-center px-7 py-3 rounded-xl border border-white/30 hover:bg-white/10 
              transition-all duration-300 text-white/90 font-semibold backdrop-blur-sm"
          >
            Explore More
          </a>
        </div>

        {/* Info Blocks */}
        <div className="flex flex-wrap gap-12 mt-10">
          {[
            {
              title: "Get Started",
              desc: "Dive into exclusive deals and curated collections for your favorite consoles.",
            },
            {
              title: "Explore",
              desc: "Discover new releases, trending titles, and upcoming launches.",
            },
          ].map((item, idx) => (
            <div key={idx} className="max-w-sm">
              <h3 className="font-semibold text-white/95 text-xl tracking-wide">
                {item.title}
              </h3>
              <p className="text-white/80 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
