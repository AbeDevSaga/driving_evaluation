import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Driving Evaluation System",
  description: "Driving evaluation management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} font-sans bg-slate-50 antialiased text-primary`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}