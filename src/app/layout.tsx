import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ParkEase - Smart Parking Finder",
  description:
    "Find and reserve parking spots at Qassim University. Smart parking made easy.",
  keywords:
    "parking, Qassim University, parking reservation, smart parking, Saudi Arabia",
  openGraph: {
    title: "ParkEase - Smart Parking Finder",
    description: "Find and reserve parking spots at Qassim University",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
