"use client";

import { Marquee } from "@/components/ui/marquee";

import React from "react";
import { socialProofCarditems } from "./SocialProofItem";
import { SocialProofCard } from "./socialProofCard";

function SocialProof() {
  return (
    <Marquee className="">
      {" "}
      {socialProofCarditems.map((cards) => {
        return <SocialProofCard key={cards.name} {...cards} />;
      })}
    </Marquee>
  );
}

export default SocialProof;
