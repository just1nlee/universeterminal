import "@/app/ui/globals.css";
import type { Metadata } from "next";
import { vt323 } from "@/app/ui/fonts";
import { pressStart2P } from "@/app/ui/fonts";
import Window from "@/app/ui/window";

export const metadata: Metadata = {
  title: "universeterminal",
  description: "The universe terminal is a terminal-based universe explorer that lets you navigate galaxies, explore cosmic directories and discover new knowledge, all from a custom command-line interface.",
  icons: {
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.className}`}
      >
        <Window>
          {children}
        </Window>
      </body>
    </html>
  );
}
