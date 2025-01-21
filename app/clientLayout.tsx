'use client';

import { Providers } from "./providers";
import { Toaster } from "@/components/shadcn/sonner";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { usePathname } from 'next/navigation';

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isHomePage = usePathname() === '/';

  return (
    <Providers>
      {!isHomePage && <Navigation />}
      {children}
      <Footer />
      <Toaster />
    </Providers>
  );
}
