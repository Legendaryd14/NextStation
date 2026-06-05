"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-screen h-screen min-w-screen">
      {/* تصویر پس‌زمینه - سمت راست */}
      <div className="absolute right-0 top-0 h-full w-1/2 flex items-start justify-end overflow-hidden">
        <Image
          src="/images/HeroImg.png"
          alt="Hero Background"
          height={750}
          width={750}
          priority
          className="object-contain w-full h-auto animate-[zoomIn_12s_ease-in-out_infinite_alternate]"
        />
      </div>
      {/* 
      <div className="absolute inset-0 bg-gradient-to-r from-[#030405]/90 via-[#030405]/70 to-transparent" /> */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08)_0%,transparent_60%)]" /> */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex flex-col justify-center items-start
             px-6 sm:px-12 md:px-16 lg:px-24
             pt-20 md:pt-0
             gap-4 md:gap-5"
      >
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-light text-white/90 tracking-tight"
        >
          Welcome to
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-clip-text w-fit h-50"
        >
          <TextHoverEffect text="NextStation" />
        </motion.div>

        <p className="text-lg md:text-xl text-white/80 max-w-xl">
          Buy the latest games on every platform — faster and easier than ever.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6">
          <Link
            href="/products"
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
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center px-7 py-3 rounded-xl border border-white/30 hover:bg-white/10
              transition-all duration-300 text-white/90 font-semibold backdrop-blur-sm"
          >
            Explore More
          </Link>
        </div>

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
