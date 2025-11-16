import type { Metadata } from "next";
import "./globals.css";
import { ThemeColorProvider } from "@/components/providers/ThemeColorProvider";

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
    <html lang="en" className="dark">
      <body className="font-mono antialiased bg-background text-foreground">
        <ThemeColorProvider>
          {children}
        </ThemeColorProvider>
      </body>
    </html>
  );
}
