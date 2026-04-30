import React, { Children } from "react";
import HeroSection from "@/components/Home/heroSection/HeroSection";
import { NavbarComponent } from "@/components/navBar/Navbar";
import { Footer } from "@/components/footer/Footer";

export default function HomePage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarComponent />
      <HeroSection />
      {children}
      <Footer />
    </>
  );
}
