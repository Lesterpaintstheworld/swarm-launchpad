'use client';

import dynamic from 'next/dynamic';
import { Providers } from "./providers";
import { Toaster } from "@/components/shadcn/sonner";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { usePathname } from 'next/navigation';
import { Banner } from "@/components/banner";
import { BackgroundBlur } from "@/components/background";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isHomePage = usePathname() === '/';

  return (
    <Providers>
      <BackgroundBlur />
      <Banner />
      {!isHomePage && <Navigation />}
      {children}
      <Footer />
      <Toaster />
    </Providers>
  );
}
