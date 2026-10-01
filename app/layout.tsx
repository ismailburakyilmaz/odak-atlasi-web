import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";
import "./new-games.css";
import "./deep-games.css";
import "./cube-game.css";
import "./orbit-game.css";
import "./light-game.css";
import "./matrix-studio.css";
import "./air-game.css";

export const metadata: Metadata = {
  title: "Odak Atlası · Kısa zihin oyunları",
  description: "Kısa bir mola ayır. Zihin oyunları oyna, kendi oyun performansını takip et.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" >
      <body className="antialiased">{children}</body>
    </html>
  );
}
