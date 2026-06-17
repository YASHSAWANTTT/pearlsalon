import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileDockShell } from "@/components/layout/mobile-dock-shell";
import { SALON_FULL_NAME, SALON_SEO_DESCRIPTION } from "@/lib/constants";
import { SITE_METADATA, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SALON_FULL_NAME} | Thane West`,
    template: `%s | ${SALON_FULL_NAME}`,
  },
  description: SALON_SEO_DESCRIPTION,
  applicationName: SALON_FULL_NAME,
  keywords: [
    "Pearl Beauty Salon",
    "beauty salon Thane West",
    "salon near Dhokali",
    "spa Thane",
    "facial waxing threading Thane",
    "beauty salon booking",
  ],
  authors: [{ name: SALON_FULL_NAME }],
  creator: SALON_FULL_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: SITE_METADATA.locale,
    url: SITE_URL,
    siteName: SALON_FULL_NAME,
    title: `${SALON_FULL_NAME} | Thane West`,
    description: SALON_SEO_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SALON_FULL_NAME} | Thane West`,
    description: SALON_SEO_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <MobileDockShell>{children}</MobileDockShell>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
