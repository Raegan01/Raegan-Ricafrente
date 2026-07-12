import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ananya Mehrotra — Communication Designer",
  description:
    "Portfolio landing page for communication designer Ananya Mehrotra.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${plex.variable}`}>
        {children}
      </body>
    </html>
  );
}
