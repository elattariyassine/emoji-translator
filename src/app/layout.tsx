import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emoji Translator - Transform Text into Emojis",
  description: "Convert your text into emojis with our easy-to-use emoji translator. Get real-time suggestions and share your translations with friends!",
  keywords: "emoji translator, text to emoji, emoji converter, emoji generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
