import type { Project } from "@/data/site-content";

export type ProjectGallery = {
  id: string;
  columnCount?: number;
  designs: {
    name: string;
    src: string;
    width: number;
    height: number;
    alt: string;
  }[];
};

export const projectGalleries: Partial<Record<Project["tone"], ProjectGallery>> = {
  adidas: {
    id: "brand-identity-gallery",
    designs: [
      { name: "FUR Bites", src: "/images/fur-bites-brand-identity.png", width: 1440, height: 2815, alt: "FUR Bites brand identity: logo, pet illustrations, color palette, typography, patterns, and packaging mockups" },
      { name: "Phoebe’s", src: "/images/phoebes-brand-identity.png", width: 1440, height: 2560, alt: "Phoebe’s bakery brand identity: logos, apron and packaging mockups, color palette, and typography" },
      { name: "FinFin Ramen", src: "/images/finfin-brand-identity.png", width: 1440, height: 2048, alt: "FinFin Ramen brand identity: fish and ramen logo, color palette, signage, bowls, packaging, and typography" },
    ],
  },
  desk: {
    id: "product-ads-gallery",
    columnCount: 3,
    designs: [
      { name: "Lipelle Premium", src: "/images/lipelle-product-ad.png", width: 1080, height: 1080, alt: "Turquoise Lipelle lip gloss ad with two products and the headline Glow That Speaks Luxury" },
      { name: "ICON Office to After Hours", src: "/images/icon-office-after-hours.png", width: 1080, height: 1350, alt: "ICON Amsterdam tech pants ad with a split office and evening setting" },
      { name: "ICON Product Benefit", src: "/images/icon-product-benefit.png", width: 1080, height: 1350, alt: "ICON Amsterdam dress pants product-benefit ad featuring folded cream trousers" },
      { name: "ICON Comfort at Work", src: "/images/icon-comfort-work.png", width: 1080, height: 1350, alt: "ICON Amsterdam comfort-at-work ad featuring cream tech pants in an office" },
      { name: "KUB STEM Time", src: "/images/kub-stem-time.png", width: 1080, height: 1350, alt: "KUB Planet screen-time and STEM-toy campaign graphic on a blue background" },
      { name: "KUB Guilt-Free Evenings", src: "/images/kub-guilt-free-evenings.png", width: 1080, height: 1350, alt: "KUB Planet ad contrasting a child using a tablet with a child building magnetic shapes" },
      { name: "KUB Imagination", src: "/images/kub-imagination.png", width: 1080, height: 1350, alt: "KUB Planet comparison ad showing three-dimensional magnetic builds beside flat magnetic tiles" },
      { name: "KUB Moms Chat", src: "/images/kub-moms-chat.png", width: 1080, height: 1920, alt: "KUB Planet social ad styled as a parents group chat about magnetic building toys" },
      { name: "KUB Me-Time", src: "/images/kub-me-time.png", width: 1080, height: 1350, alt: "KUB Planet toy ad using off and on switches to illustrate time for parents" },
      { name: "Chowking Offer", src: "/images/chowking-offer.png", width: 1080, height: 1080, alt: "Chowking rice-bowl offer ad featuring dumplings, lumpia, and siomai" },
      { name: "Pesto Pasta", src: "/images/pesto-pasta-ad.png", width: 1080, height: 1080, alt: "Yellow and black pesto pasta promotion with garlic bread and a limited-time offer" },
      { name: "Fresh Vegetable", src: "/images/fresh-vegetable-ad.png", width: 1080, height: 1080, alt: "Green Fresh Market vegetable promotion featuring a basket of produce" },
      { name: "Carrot Creative", src: "/images/carrot-ad.png", width: 500, height: 750, alt: "Minimal white and green carrot drink ad with the headline Boost Your Energy Naturally" },
      { name: "Behind Network", src: "/images/network-ad.png", width: 1080, height: 1080, alt: "Behind Network interior-design service ad with a living-room rendering and free 3D renders offer" },
      { name: "Orange Perfume A", src: "/images/orange-perfume-a.png", width: 1080, height: 1080, alt: "Sunshine citrus perfume ad featuring an orange peel wrapped around the bottle" },
      { name: "Orange Perfume B", src: "/images/orange-perfume-b.png", width: 1080, height: 1080, alt: "Sunshine orange perfume ad variant with the headline Smell Fresh All Day" },
      { name: "Luxury Ring A", src: "/images/luxury-ring-a.png", width: 1080, height: 1080, alt: "Purple gemstone ring ad displayed against a geometric purple background" },
      { name: "Luxury Ring B", src: "/images/luxury-ring-b.png", width: 1080, height: 1080, alt: "Purple gemstone ring promotion with a limited-time discount design" },
      { name: "Affogato A", src: "/images/affogato-a.png", width: 1080, height: 1080, alt: "Crema Cafe affogato ad with vanilla ice cream, espresso, and coffee-bean graphics" },
      { name: "Affogato B", src: "/images/affogato-b.png", width: 1080, height: 1080, alt: "Crema Cafe affogato ad variant on a brown coffee-patterned background" },
      { name: "Ovary Good Chocolate", src: "/images/ovary-good-chocolate.png", width: 1080, height: 1080, alt: "Smoo Ovary Good chocolate product ad with a jar, cocoa powder, and pink benefit icons" },
      { name: "Ovary Good Strawberry", src: "/images/ovary-good-strawberry.png", width: 1080, height: 1080, alt: "Smoo Ovary Good strawberry product ad with an open jar and strawberry powder on a table" },
      { name: "Ovary Good Vanilla", src: "/images/ovary-good-vanilla.png", width: 1254, height: 1254, alt: "Smoo Ovary Good vanilla product ad with a jar, creamy drink, and vanilla powder on a spoon" },
    ],
  },
  bound: {
    id: "commissions-gallery",
    columnCount: 3,
    designs: [
      { name: "Home Crowd Cover", src: "/images/home-crowd-1.png", width: 1414, height: 2000, alt: "Home Crowd interviews pre-production information cover for the Royal Edinburgh Military Tattoo and Ginger Cow" },
      { name: "Home Crowd Shoot Details", src: "/images/home-crowd-2.png", width: 1414, height: 2000, alt: "Home Crowd participant information pack with shoot details and Edinburgh location photographs" },
      { name: "Home Crowd Attendees", src: "/images/home-crowd-3.png", width: 1414, height: 2000, alt: "Home Crowd participant pack layout featuring attendees and key contact information" },
      { name: "Home Crowd Filming", src: "/images/home-crowd-4.png", width: 1414, height: 2000, alt: "Home Crowd information page with filming plans, facilities, and wardrobe guidance" },
      { name: "Home Crowd Thank You", src: "/images/home-crowd-5.png", width: 1414, height: 2000, alt: "Home Crowd thank-you page with the Royal Edinburgh Military Tattoo and Ginger Cow logos" },
      { name: "Email Design 1", src: "/images/commission-email-1.jpg", width: 600, height: 2358, alt: "Blue LVNG with Lung Cancer email design featuring an educational overview and six topic cards" },
      { name: "Email Design 2", src: "/images/commission-email-2.jpg", width: 600, height: 3317, alt: "LVNG with Lung Cancer email design with lung imagery and alternating photo and information sections" },
    ],
  },
  ragas: {
    id: "poster-design-gallery",
    designs: [
      { name: "Honda Civic Type R", src: "/images/honda-civic-poster.png", width: 1080, height: 1350, alt: "Honda Civic Type R advertising poster with a white car and performance, design, and technology panels" },
      { name: "Toyota Hilux Conquest", src: "/images/toyota-hilux-poster.png", width: 1080, height: 1350, alt: "Toyota Hilux Conquest poster with red and white pickup trucks against mountain scenery" },
      { name: "McDonald’s", src: "/images/mcdonalds-poster.png", width: 1080, height: 1080, alt: "McDonald’s Two Icons, One Choice poster featuring two burgers on a yellow background" },
      { name: "Coca-Cola Zero", src: "/images/coca-cola-zero-poster.png", width: 1080, height: 1080, alt: "Coca-Cola Zero Sugar can on a rainy city street with the headline Zero Sugar. Full Impact." },
      { name: "TWICE Meet and Greet", src: "/images/twice-poster.png", width: 1080, height: 1350, alt: "Pink and blue TWICE meet-and-greet poster with a collage of the group and event details" },
      { name: "Carnation", src: "/images/carnation-poster.png", width: 1080, height: 1080, alt: "Turquoise carnation flower poster with botanical typography and flower information" },
      { name: "Ovary Good", src: "/images/ovary-good-poster.png", width: 1122, height: 1402, alt: "Pink Ovary Good product poster featuring strawberry powder packaging and a glass of strawberry drink" },
      { name: "Orion Vale", src: "/images/orion-vale-poster.png", width: 1024, height: 1536, alt: "Blue Orion Vale live-on-stage event poster with a singer holding a microphone" },
    ],
  },
};
