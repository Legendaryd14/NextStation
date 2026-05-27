"use client";

import { Marquee } from "@/components/ui/marquee";

import React from "react";
import { socialProofCarditems } from "./SocialProofItem";
import { SocialProofCard } from "./socialProofCard";

function SocialProof() {
  return (
    <div className="relative p-10 flex flex-col gap-10 items-center overflow-x-hidden">
      <h1 className="font-semibold text-3xl">Our brands </h1>
      <Marquee className="" pauseOnHover repeat={3}>
        {socialProofCarditems.map((cards) => {
          return <SocialProofCard key={cards.id} {...cards} />;
        })}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}

export default SocialProof;
