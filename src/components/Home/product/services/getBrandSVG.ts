// lib/getBrandSvg.ts

import { socialProofCarditems } from "@/components/SocialProof/SocialProofItem";

type ApiBrand = {
  name?: string;
  logo?: string;
};

export function getBrandSvg(brand?: ApiBrand | null) {
  if (!brand) return null;

  const normalizedName = brand.name?.toLowerCase().trim();

  const match = socialProofCarditems.find((b) => {
    return b.name.toLowerCase() === normalizedName;
  });

  return match?.logo || null;
}
