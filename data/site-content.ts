export type Project = {
  title: string;
  discipline: string;
  context: string;
  placeholderLabel: string;
  layout: "feature" | "standard";
  tone: "desk" | "ragas" | "bound";
};

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const disciplines = [
  "Branding",
  "3D",
  "Publication",
  "Packaging",
  "Motion Graphics",
  "Typography",
  "Spatial / Exhibition Design",
  "Layout",
] as const;

export const projects: Project[] = [
  {
    title: "Desk Mate",
    discipline: "D2C Lifestyle & Consumer",
    context: "Branding & Identity | Classroom Project",
    placeholderLabel: "PROJECT IMAGE 01",
    layout: "feature",
    tone: "desk",
  },
  {
    title: "Ragas & Rhythms",
    discipline: "Publication Design",
    context: "Design for Print | Classroom Project",
    placeholderLabel: "PROJECT IMAGE 02",
    layout: "standard",
    tone: "ragas",
  },
  {
    title: "Bound & Beyond",
    discipline: "D2C Lifestyle & Consumer",
    context: "System Thinking | Classroom Project",
    placeholderLabel: "PROJECT IMAGE 03",
    layout: "standard",
    tone: "bound",
  },
];

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/anu.dezign" },
  { label: "Behance", href: "https://www.behance.net/ananyamehrotra2" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ananya-mehrotra-625495275",
  },
  { label: "Medium", href: "https://medium.com/@ananyamehrotra1712" },
] as const;

export const resumeHref =
  "https://drive.google.com/file/d/1N6bpamfvruoPlz5_4aRGn5dOS0msW_d6/view?usp=drive_link";
