"use client";

import React from "react";
import { SocialProofItem } from "@/type/socialproof";

const socialProofItem: SocialProofItem[] = [
  {
    id: 1,
    name: "Epic Games",
    logo: "svg/Epic_Games_logo.svg",
    url: "https://store.epicgames.com/en-US",
    alt: "EpicGames",
    featured: false,
  },
  {
    id: 2,
    name: "Steam",
    logo: "svg/steam_icon_logo.svg",
    url: "https://store.steampowered.com/",
    alt: "STeam",
    featured: false,
  },
  {
    id: 3,
    name: "Ubisoft Connect",
    logo: "svg/icons8-ubisoft.svg",
    url: "https://www.ubisoft.com/en-gb/ubisoft-connect",
    alt: "UbisoftConnect",
    featured: false,
  },
  {
    id: 4,
    name: "Origins",
    logo: "svg/origin-1-logo-svg-vector.svg",
    url: "https://www.ea.com/ea-app",
    alt: "Origins",
    featured: false,
  },
  {
    id: 5,
    name: "BattleNet",
    logo: "svg/battlenet-480.svg",
    url: "https://us.shop.battle.net/en-gb",
    alt: "Battle.net",
    featured: false,
  },
  {
    id: 6,
    name: "Xbox",
    logo: "svg/Xbox_one_logo.svg",
    url: "https://www.xbox.com/ar-SA",
    alt: "XBOX",
    featured: false,
  },
  {
    id: 7,
    name: "Playstation",
    logo: "svg/PlayStation_logo_colour.svg",
    url: "https://www.playstation.com/en-us/",
    alt: "Playstation",
    featured: false,
  },
];

export const socialProofCarditems = socialProofItem.slice(
  0,
  socialProofItem.length,
);
