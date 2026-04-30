"client component";

import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { IconBrandYoutube } from "@tabler/icons-react";
import { Gamepad2, MessageCircle, Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#0A0A0A] text-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A] opacity-50" />

      {/* Subtle geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 36px)`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 py-12 lg:py-16 border-b border-white/10">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Image
                  src="/images/NextStationLogo.png"
                  width={60}
                  height={60}
                  alt="Logo"
                  className="rounded-xl"
                />
              </div>
              <h2 className="text-2xl font-black tracking-tight uppercase">
                Next Station
              </h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Level up your gaming experience. Discover the latest titles,
              exclusive deals, and join a community of passionate gamers.
            </p>
          </div>

          {/* Game Store Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/90">
              Game Store
            </h3>
            <ul className="space-y-3">
              {[
                "Store",
                "Categories",
                "Deals",
                "New Releases",
                "Pre-orders",
                "Gift Cards",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-[#00E0FF] transition-colors duration-200 inline-block hover:translate-x-0.5 hover:underline underline-offset-4"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/90">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                "Support Center",
                "Warranty",
                "FAQs",
                "Returns",
                "Contact Us",
                "System Status",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-[#00E0FF] transition-colors duration-200 inline-block hover:translate-x-0.5 hover:underline underline-offset-4"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/90">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                "About",
                "Careers",
                "Partnerships",
                "Press Kit",
                "Blog",
                "Investors",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-[#00E0FF] transition-colors duration-200 inline-block hover:translate-x-0.5 hover:underline underline-offset-4"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/90">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {[{ icon: MessageCircle, label: "Discord" }].map(
                ({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="group relative w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all duration-200"
                  >
                    <Icon
                      className="w-4 h-4 text-white/60 group-hover:text-[#00E0FF] transition-colors duration-200"
                      strokeWidth={2}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-md bg-[#00E0FF]/20 transition-opacity duration-200 -z-10" />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-xs text-white/40">
            <span>&copy; 2026 Next Station. All rights reserved.</span>
            <a
              href="#"
              className="hover:text-[#00E0FF] transition-colors duration-200 hover:underline underline-offset-2"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-[#00E0FF] transition-colors duration-200 hover:underline underline-offset-2"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-[#00E0FF] transition-colors duration-200 hover:underline underline-offset-2"
            >
              Cookies
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <span>Made with</span>
            <Heart
              className="w-3.5 h-3.5 text-[#FF0050] fill-[#FF0050]"
              strokeWidth={2}
            />
            <span>by Next Station</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// IconBrandYoutube;
// InstagramLogoIcon;
