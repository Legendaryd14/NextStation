"use client";

import React from "react";
import { SocialProofItem } from "@/type/socialproof";
import { Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";

const socialProofItem: SocialProofItem[] = [
  {
    id: 1,
    name: "Epic Games",
    logo: "@svg/Epic_Games_logo.svg",
    url: "https://store.epicgames.com/en-US",
    alt: "EpicGames",
    featured: false,
  },
  {
    id: 2,
    name: "Steam",
    logo: "@svg/steam_icon_logo.svg",
    url: "https://store.steampowered.com/",
    alt: "STeam",
    featured: false,
  },
  {
    id: 3,
    name: "Ubisoft Connect",
    logo: "@svg/Ubisoft_Connect_logo.svg",
    url: "https://www.ubisoft.com/en-gb/ubisoft-connect",
    alt: "UbisoftConnect",
    featured: false,
  },
  {
    id: 4,
    name: "Origins",
    logo: "",
    url: "",
    alt: "",
    featured: false,
  },
  {
    id: 5,
    name: "BattleNet",
    logo: "",
    url: "",
    alt: "",
    featured: false,
  },
  {
    id: 6,
    name: "Xbox",
    logo: "",
    url: "",
    alt: "",
    featured: false,
  },
  {
    id: 7,
    name: "Playstation",
    logo: "",
    url: "",
    alt: "",
    featured: false,
  },
];

export const socialProofCarditems = socialProofItem.slice(
  0,
  socialProofItem.length,
);
