import type { Metadata } from "next";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/outfit/index.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-mono/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ananya Mehrotra — Communication Designer",
  description:
    "Portfolio landing page for communication designer Ananya Mehrotra.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
