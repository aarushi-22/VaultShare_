// app/layout.tsx
"use client";

import "./globals.css";
import { ReactNode } from "react";
import { Amplify } from "aws-amplify";
import "@/lib/awsAuth";
import { useAuthSync } from '@/lib/authEvents'; // Add this import

export default function RootLayout({ children }: { children: ReactNode }) {
  useAuthSync(); // Add this hook call

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}