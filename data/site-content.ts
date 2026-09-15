export type Project = {
  title: string;
  discipline: string;
  context: string;
  placeholderLabel: string;
  image?: { src: string; alt: string };
  tone: "adidas" | "desk" | "ragas" | "bound";
};

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const disciplines = [
  "Static Ads",
  "Logo",
  "Mockups",
  "Color Palette",
  "Typography",
  "Layout",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Figma",
  "Canva",
  "Brand Identity",
  "Poster Design",
] as const;

export const projects: Project[] = [
  {
    title: "Brand Identity",
    discipline: "Brand Visuals & Applications",
    context: "Visual Design | Logos, Assets & Mockups",
    placeholderLabel: "PROJECT IMAGE 01",
    image: {
      src: "/images/fur-bites-brand-identity.png",
      alt: "FUR Bites brand identity featuring a dog logo, pet illustrations, colors, typography, and packaging",
    },
    tone: "adidas",
  },
  {
    title: "Product Ads",
    discipline: "Campaign Creatives & Product Visuals",
    context: "Static Ads | Products, Offers & Social Creatives",
    placeholderLabel: "PROJECT IMAGE 02",
    image: {
      src: "/images/lipelle-product-ad.png",
      alt: "Lipelle premium lip gloss advertisement featuring turquoise products and the headline Glow That Speaks Luxury",
    },
    tone: "desk",
  },
  {
    title: "Poster Design",
    discipline: "Campaign Visuals & Promotional Creatives",
    context: "Visual Design | Advertising, Product & Event Graphics",
    placeholderLabel: "PROJECT IMAGE 03",
    image: {
      src: "/images/honda-civic-poster.png",
      alt: "Honda Civic Type R advertising poster featuring a white car and performance, design, and technology details",
    },
    tone: "ragas",
  },
  {
    title: "Commissions",
    discipline: "Client Work & Custom Projects",
    context: "Graphic Design | Campaigns, Branding, & Visuals",
    placeholderLabel: "PROJECT IMAGE 04",
    image: {
      src: "/images/home-crowd-1.png",
      alt: "Home Crowd interviews pre-production information cover for the Royal Edinburgh Military Tattoo and Ginger Cow",
    },
    tone: "bound",
  },
];

export const socials = [
  { label: "Upwork", href: "https://www.upwork.com/freelancers/~01b86061bcdaedcfd0?mp_source=share" },
  { label: "OnlineJobs", href: "https://v2.onlinejobs.ph/jobseekers/info/4747473" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/raegan-ricafrente-b39b783b1",
  },
] as const;

export const resumeHref =
  "https://drive.google.com/file/d/11K_3589ND9PMwjK7l9KISZU0cQNubEe3/view?usp=sharing";
