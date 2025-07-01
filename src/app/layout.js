import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";
import { ThemeModeScript } from "flowbite-react";

const noto_sans_thai = Noto_Sans_Thai({
  weight: "400",
  subsets: ["thai"],
});

export const metadata = {
  title: "Face me now",
  description: "ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า",
  openGraph: {
    title: "Face me now",
    description: "ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า",
    url: "https://facemenow.co",
    siteName: "Face me now",
    images: [
      {
        url: "https://facemenow.co/op.png",
        width: 1200,
        height: 630,
        alt: "Face me now - ค้นหารูปภาพจากใบหน้า",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Face me now",
    description: "ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า",
    images: ["https://facemenow.co/op.png"],
    creator: "@facemenow",
  },
  alternates: {
    canonical: "https://facemenow.co",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Face me now",
    "ค้นหารูปภาพ",
    "หารูป",
    "ค้นหารูปภาพด้วยใบหน้า",
    "หาใบหน้าจากรูป",
  ],
  authors: [{ name: "Face me now" }],
  creator: "Face me now",
  publisher: "Face me now",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${noto_sans_thai.className}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
