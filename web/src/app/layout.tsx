import type { Metadata } from "next";
import { Big_Shoulders, Familjen_Grotesk, Martian_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display" });
const body = Familjen_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Prince Chakusa — Operations Leader & Software Builder",
  description:
    "I run 350+ holiday homes in Dubai and build the software they run on. Interactive 3D portfolio of Prince Chakusa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
