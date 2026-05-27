"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { ShoppingBasket } from "@gravity-ui/icons";
import {
  Car,
  Compass,
  Crosshair,
  Gamepad2,
  SearchIcon,
  Swords,
} from "lucide-react";
import { useState } from "react";

import React from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const categories = [
  {
    name: "Action-Adventure",
    description: "Big stories, combat, and exploration.",
    icon: <Swords className="size-4" />,
    accent: "text-rose-300 bg-rose-400/10",
  },
  {
    name: "Adventure",
    description: "Quest-driven games and platform worlds.",
    icon: <Compass className="size-4" />,
    accent: "text-emerald-300 bg-emerald-400/10",
  },
  {
    name: "FPS",
    description: "Fast shooters and competitive firepower.",
    icon: <Crosshair className="size-4" />,
    accent: "text-sky-300 bg-sky-400/10",
  },
  {
    name: "Racing",
    description: "High-speed tracks, karts, and rivals.",
    icon: <Car className="size-4" />,
    accent: "text-amber-300 bg-amber-400/10",
  },
  {
    name: "Third-Person Shooter",
    description: "Cinematic action from over the shoulder.",
    icon: <Gamepad2 className="size-4" />,
    accent: "text-violet-300 bg-violet-400/10",
  },
];

const navItems = [
  { name: "Products", link: "/products" },
  {
    name: "Categories",
    link: "/products",
    dropdown: categories.map((category) => ({
      name: category.name,
      description: category.description,
      icon: category.icon,
      accent: category.accent,
      link: `/categories/${encodeURIComponent(category.name)}`,
    })),
  },
  { name: "Contact Us", link: "/contact" },
  { name: "Blog", link: "/blog" },
];

export function NavbarComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="primary" href="/login">
              Login
            </NavbarButton>
            <NavbarButton variant="secondary">
              <ShoppingBasket className="text-amber-50 text-3xl" />
            </NavbarButton>
            <NavbarButton variant="secondary">
              <SearchIcon className="text-amber-50" />
            </NavbarButton>
            <NavbarButton variant="secondary">
              <AnimatedThemeToggler className="h-10 w-10" />
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div key={`mobile-link-${idx}`} className="w-full">
                <a
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative block text-neutral-600 dark:text-neutral-300"
                >
                  {item.name}
                </a>
                {item.dropdown && (
                  <div className="mt-3 grid gap-2 border-l border-neutral-200 pl-4 dark:border-neutral-800">
                    {item.dropdown.map((dropItem) => (
                      <a
                        key={dropItem.link}
                        href={dropItem.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex gap-3 rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-white/5"
                      >
                        <span
                          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${dropItem.accent}`}
                        >
                          {dropItem.icon}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                            {dropItem.name}
                          </span>
                          {dropItem.description && (
                            <span className="mt-0.5 block text-xs leading-5 text-neutral-500 dark:text-neutral-500">
                              {dropItem.description}
                            </span>
                          )}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default Navbar;
