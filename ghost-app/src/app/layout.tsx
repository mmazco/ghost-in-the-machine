import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghost in the Machine - Tenstorrent Tamagotchi",
  description: "A machine health interface for Tenstorrent's Tensix cores telemetry data, visualized as a retro Tamagotchi ghost character.",
  keywords: ["Tenstorrent", "Tensix", "AI Hardware", "Telemetry", "Visualization"],
  authors: [{ name: "mmazco", url: "https://x.com/mmazco" }],
  openGraph: {
    title: "Ghost in the Machine",
    description: "Humanizing silicon - A Tamagotchi-style dashboard for AI hardware telemetry",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
