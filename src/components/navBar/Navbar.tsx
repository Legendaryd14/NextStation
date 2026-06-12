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
import { Car, Compass, Crosshair, Gamepad2, Swords } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/context/AuthProvider.tsx";
import { CartTrigger } from "../cart/CartTrigger";
import { GooeyInput } from "../ui/gooey-input";
import UserAccountAvatar, {
  type AccountMenuItem,
} from "../ui/smoothui/user-account-avatar";

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

const getAvatarUrl = (name: string, email: string) => {
  const seed = encodeURIComponent(email || name || "nextstation-user");

  return `https://avatar.vercel.sh/${seed}`;
};

export function NavbarComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth?status=login");
  };

  const accountMenuItems: AccountMenuItem[] = user?.role === "admin"
    ? [
        { href: "/dashboard", label: "Dashboard", type: "dashboard" },
        { href: "/dashboard/profile", label: "Profile", type: "profile" },
        { label: "Logout", onClick: handleLogout, type: "logout" },
      ]
    : [
        { href: "/profile", label: "Profile", type: "profile" },
        { href: "/orders", label: "Orders", type: "orders" },
        { label: "Logout", onClick: handleLogout, type: "logout" },
      ];

  const authAction = user && isAuthenticated ? (
    <UserAccountAvatar
      className="size-11 border-white/20 p-0.5"
      menuItems={accountMenuItems}
      user={{
        avatar: getAvatarUrl(user.name, user.email),
        email: user.email,
        name: user.name,
      }}
    />
  ) : loading ? (
    <div className="size-11 animate-pulse rounded-full bg-white/15" />
  ) : (
    <NavbarButton variant="primary" href="/auth?status=login">
      Login
    </NavbarButton>
  );

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <div className="transition-opacity duration-300">{authAction}</div>
            <CartTrigger />
            <NavbarButton variant="secondary">
              <GooeyInput placeholder="Search..." />
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
              <CartTrigger className="w-full justify-center border border-white/10 py-3" />
              {user && isAuthenticated ? (
                <div className="flex justify-center">
                  <UserAccountAvatar
                    className="size-12 border-white/20 p-0.5"
                    menuItems={accountMenuItems}
                    user={{
                      avatar: getAvatarUrl(user.name, user.email),
                      email: user.email,
                      name: user.name,
                    }}
                  />
                </div>
              ) : loading ? (
                <div className="mx-auto size-12 animate-pulse rounded-full bg-white/15" />
              ) : (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                  href="/auth?status=login"
                >
                  Login
                </NavbarButton>
              )}
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Search
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default Navbar;
