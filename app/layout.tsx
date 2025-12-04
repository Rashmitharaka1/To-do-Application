import type React from "react";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todo App - Role-Based Task Management",
  description:
    "A modern full-stack todo application with role-based authentication and beautiful glassmorphic design",
  keywords: ["todo", "task management", "productivity", "role-based", "nextjs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.variable} font-ubuntu antialiased`}>
        {children}
      </body>
    </html>
  );
}
