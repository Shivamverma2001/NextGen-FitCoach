import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextGen Fitness Coach",
  description: "Transform your fitness journey with AI-powered personalized workout plans and nutrition guidance. Get custom-tailored exercise routines, diet recommendations, and progress tracking to help you achieve your fitness goals faster and smarter.",
  keywords: "fitness coach, AI workout plans, personalized training, nutrition guidance, exercise routines, fitness tracking, health and wellness, workout programs, diet plans, fitness goals",
  authors: [{ name: "Shivam verma" }],
  openGraph: {
    title: "NextGen Fitness Coach - AI-Powered Personal Training",
    description: "Get personalized workout and nutrition plans powered by AI. Transform your fitness journey with custom-tailored guidance.",
    type: "website",
    locale: "en_US",
    siteName: "NextGen Fitness Coach",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen Fitness Coach",
    description: "AI-powered personal training and nutrition guidance for your fitness journey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <ThemeProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="fixed inset-0 -z-1">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
              <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
          <main className="pt-24 flex-grow">
          {children}
          </main>
        <Footer />
      </body>
    </html>
      </ThemeProvider>
    </ConvexClerkProvider>
  );
}
