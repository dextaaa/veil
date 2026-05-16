import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/components/shared/auth-provider";

export const metadata: Metadata = {
  title: "Veil — Personality first. Looks second.",
  description:
    "The dating app that asks you to feel something before you see anything. Swipe on bios. Reveal photos only after you connect.",
  keywords: ["dating", "relationships", "personality", "authentic", "meaningful"],
  openGraph: {
    title: "Veil — Personality first. Looks second.",
    description: "Modern dating was broken. We fixed the order.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07070c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#16162a",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f0f0f8",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
