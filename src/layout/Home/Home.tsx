import React from "react";
import HeroSection from "@/components/Home/heroSection/HeroSection";
import { NavbarComponent } from "@/components/navBar/Navbar";

export default function HomePage() {
  return (
    <>
      <NavbarComponent />
      <HeroSection />
    </>
  );
}
