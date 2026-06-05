"use client";

import Image from "next/image";
import { SocialProofItem } from "@/type/socialproof";
import { cn } from "@/lib/utils";

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
        "flex flex-col justify-center gap-5 items-center  h-full w-64  cursor-pointer  rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      {isStringLogo
        ? logo && (
            <Image
              width={100}
              height={100}
              src={logo}
              alt={alt || name}
              className="mt-1 "
            />
          )
        : LogoIcon && <LogoIcon className=" h-12" />}
      <p className="font-bold text-lg">{name}</p>
    </a>
  );
}
