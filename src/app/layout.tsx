import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "سامانه خان",
  description: "سامانه مدیریت و خرید و فروش املاک - ساخته شده توسط سعید مرادی",
  themeColor: "#0d6efd", // رنگ اصلی برای PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a1a" />
        {/* جلوگیری از نمایش Translate در مرورگر */}
        <meta name="google" content="notranslate" />
        {/* آیکون‌ها */}
        <link rel="icon" href="/icons/icon-512x512.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
