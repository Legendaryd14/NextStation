import { Footer } from "@/components/footer/Footer";
import { NavbarComponent } from "@/components/navBar/Navbar";
import { cn } from "@/lib/utils";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-full flex flex-col">
      <div className="w-screen h-screen relative overflow-x-hidden">
        <NavbarComponent />
        {children}
        <Footer />
      </div>
    </section>
  );
}
