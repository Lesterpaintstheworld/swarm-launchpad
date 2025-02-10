import type { Metadata } from "next";
import { ClientLayout } from "./clientLayout";
import "./globals.css";
import { Toaster } from "sonner";

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
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
        <script
          id="microsoft-clarity"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "px4jz61szm");
            `
          }}
        />
      </body>
    </html>
  );
}
