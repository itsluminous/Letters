import type { Metadata } from "next";
import { Cinzel, Lora, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ToastProvider } from "@/lib/contexts/ToastContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
  fallback: ["serif"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["Georgia", "serif"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  title: "Letter Exchange App",
  description: "Exchange letters with your partner in a beautiful papyrus interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${lora.variable} ${caveat.variable} font-body antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
