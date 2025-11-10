import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Shree Bohara - Portfolio",
  description: "USC CS Graduate Student specializing in AI/ML and Full-Stack Development. Chat with my portfolio to learn about my projects, experience, and skills.",
  keywords: ["portfolio", "developer", "full-stack", "AI", "ML", "software engineer", "USC", "computer science"],
  authors: [{ name: "Shree Bohara" }],
  openGraph: {
    title: "Shree Bohara - Portfolio",
    description: "Chat with my portfolio to learn about my projects and experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
