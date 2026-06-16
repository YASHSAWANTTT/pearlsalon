import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileDockShell } from "@/components/layout/mobile-dock-shell";
import { SALON_NAME, SALON_TAGLINE } from "@/lib/constants";
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
    default: SALON_NAME,
    template: `%s | ${SALON_NAME}`,
  },
  description: SALON_TAGLINE,
  applicationName: SALON_NAME,
  keywords: [
    "Pearl Beauty Salon",
    "spa Thane",
    "salon Thane West",
    "beauty salon booking",
    "facial waxing threading",
  ],
  authors: [{ name: SALON_NAME }],
  creator: SALON_NAME,
  openGraph: {
    type: "website",
    locale: SITE_METADATA.locale,
    url: SITE_URL,
    siteName: SALON_NAME,
    title: SALON_NAME,
    description: SALON_TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: SALON_NAME,
    description: SALON_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
  },
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
