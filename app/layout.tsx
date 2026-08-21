import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nanthansr.github.io"),
  title: "Nanthan SR — Engineer by degree. Explorer by nature.",
  description:
    "Nanthan SR — backend and ML engineer in Montréal. MSc Applied Computer Science, Concordia. I ship systems end to end, not notebooks.",
  authors: [{ name: "Nanthan SR" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Nanthan SR",
    description: "Engineer by degree. Explorer by nature.",
    type: "website",
    url: "/",
    siteName: "Nanthan SR",
    images: [
      {
        url: "/assets/og-image.png",
        alt: "Nanthan SR — Backend and ML Engineer",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          storageKey="nanthan_theme_v1"
          defaultTheme="dark"
          enableSystem={false}
        >
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
