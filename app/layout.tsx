import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ToastProvider } from "@/lib/contexts/ToastContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// 1. Cinzel for majestic titles
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// 2. Cormorant for legitimate old-print body text (better than Lora for this vibe)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// 3. Caveat for the "Handwritten" feel
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Letters",
  description: "Exchange letters through time.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%235c4a2f'><path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'/><path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'/></svg>",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%235c4a2f'><path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'/><path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'/></svg>",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  themeColor: "#d4c4a8",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${caveat.variable} antialiased min-h-screen`}
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