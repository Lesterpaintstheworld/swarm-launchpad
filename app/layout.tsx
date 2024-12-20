import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "@/components/shadcn/sonner";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "UBC - Invest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        <Providers>
          <Navigation />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
