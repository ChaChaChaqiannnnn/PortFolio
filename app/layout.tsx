import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chia Qian — Creative Technologist",
  description: "The interactive portfolio of Chia Qian: product engineering, automation, algorithms and expressive digital experiments.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
