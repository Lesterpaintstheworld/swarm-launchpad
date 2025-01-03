import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "@/components/shadcn/sonner";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { BackgroundBlur } from "@/components/background";

export const metadata: Metadata = {
  title: "Universal Basic Compute",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        <BackgroundBlur />
        <Providers>
          <Navigation />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
