import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "@/components/shadcn/sonner";
import { Navigation } from "@/components/navigation";
import { BackgroundBlur } from "@/components/background";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universal Basic Compute"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased dark min-h-screen flex flex-col">
        <BackgroundBlur />
        <Providers>
          <Navigation />
          {children}
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
