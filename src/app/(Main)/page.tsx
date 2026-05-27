import { Footer } from "@/components/footer/Footer";
import HeroSection from "@/components/Home/heroSection/HeroSection";
import SocialProof from "@/components/Home/SocialProof/SocialProof";
import { NavbarComponent } from "@/components/navBar/Navbar";

export default function Home() {
  return (
    <main>
      <header>
        <NavbarComponent />
      </header>
      <HeroSection />
      <SocialProof />
      <footer>
        <Footer />
      </footer>
    </main>
  );
}
