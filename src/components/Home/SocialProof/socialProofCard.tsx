"use client";

import Image from "next/image";

type SocialProofCardProps = {
  name: string;
  logo: string;
  alt: string;
};

export function SocialProofCard({ name, logo, alt }: SocialProofCardProps) {
  return (
    <figure>
      <Image width={500} height={500} src={logo} alt={alt} />
      <figcaption>{name}</figcaption>
    </figure>
  );
}
