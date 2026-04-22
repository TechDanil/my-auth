import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { cn } from "@/shared/utils/clsx";

import  '@/shared/styles/globals.css';
import { ToggleTheme } from "@/shared/components/ui";

import { MainProvider } from "./providers";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth Client",
  description: "Auth Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <MainProvider>
          <div className="relative flex min-h-screen flex-col">
            <ToggleTheme />
            <div className="flex h-screen w-full items-center justify-center px-4">
              {children}
            </div>
          </div>
        </MainProvider>
      </body>
    </html>
  );
}
