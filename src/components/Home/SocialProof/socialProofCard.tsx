"use client";

import Image from "next/image";
import { SocialProofItem } from "@/type/socialproof";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SocialProofCardProps = SocialProofItem;

export function SocialProofCard({
  name,
  logo,
  alt,
  url,
}: SocialProofCardProps) {
  const isStringLogo = typeof logo === "string";
  const LogoIcon = !isStringLogo ? logo : null;

  return (
    <a
      href={url}
      className={cn(
        "relative h-full w-64  cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      {isStringLogo
        ? logo && (
            <Image width={100} height={100} src={logo} alt={alt || name} />
          )
        : LogoIcon && <LogoIcon className="w-12 h-12" />}
    </a>
  );
}
