export type SocialProofItem = {
  id: number;
  name: string; // e.g. "Google", "Netflix"
  logo: React.FC<React.SVGProps<SVGSVGElement>> | string;
  url?: string; // link to company or case study
  alt?: string; // accessibility
  featured?: boolean; // highlight certain logos
};
