import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeColorProvider } from "@/components/providers/ThemeColorProvider";
import { MobileDetector } from "@/components/providers/MobileDetector";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { PersonSchema, WebSiteSchema, FAQPageSchema } from "@/lib/schemas";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreebohara.com';

// Viewport configuration (Next.js 14+ pattern)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Shree Bohara - Portfolio",
    template: "%s | Shree Bohara"
  },
  description: "USC CS Graduate Student specializing in AI/ML and Full-Stack Development. Chat with my portfolio to learn about my projects, experience, and skills.",
  keywords: ["portfolio", "developer", "full-stack", "AI", "ML", "software engineer", "USC", "computer science", "Shree Bohara", "machine learning", "artificial intelligence", "web development", "React", "Next.js"],
  authors: [{ name: "Shree Bohara", url: baseUrl }],
  creator: "Shree Bohara",
  publisher: "Shree Bohara",

  // Open Graph metadata for social sharing
  openGraph: {
    title: "Shree Bohara - Portfolio",
    description: "USC CS Graduate Student specializing in AI/ML and Full-Stack Development. Chat with my portfolio to learn about my projects, experience, and skills.",
    type: "website",
    url: baseUrl,
    siteName: "Shree Bohara Portfolio",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Shree Bohara - Portfolio",
        type: "image/png",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Shree Bohara - Portfolio",
    description: "USC CS Graduate Student specializing in AI/ML and Full-Stack Development. Chat with my portfolio to learn about my projects, experience, and skills.",
    creator: "@shree",
    images: [`${baseUrl}/og-image.png`],
  },

  // Canonical URLs and alternate languages
  alternates: {
    canonical: baseUrl,
  },

  // Icons and favicons (optional - will use defaults if not present)
  // Uncomment when you add icon files to public/ directory
  // icons: {
  //   icon: [
  //     { url: "/favicon.ico", sizes: "any" },
  //     { url: "/icon.svg", type: "image/svg+xml" },
  //   ],
  //   apple: [
  //     { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  //   ],
  // },

  // Manifest for PWA
  manifest: `${baseUrl}/manifest.json`,

  // Apple Web App settings
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Shree Bohara',
  },

  // Format detection
  formatDetection: {
    telephone: false,
  },

  // Robots directive
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Additional metadata for LLM/AI crawlers
  other: {
    'google': 'notranslate',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <PersonSchema />
        <WebSiteSchema />
        <FAQPageSchema />
      </head>
      <body className="font-mono antialiased bg-background text-foreground">
        <MobileDetector />
        <ThemeColorProvider>
          {children}
        </ThemeColorProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
