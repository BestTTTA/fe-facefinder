import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const noto_sans_thai = Noto_Sans_Thai({
  weight: "400",
  subsets: ["thai"],
});

export const metadata = {
  title: "Where My Photos",
  description: "ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า",
  openGraph: {
    title: "Where My Photos",
    description: "ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า",
    url: "https://wheremyphotos.com",
    siteName: "Where My Photos",
    images: [
      {
        url: "https://wheremyphotos.com/op.png",
        width: 1200,
        height: 630,
        alt: "Where My Photos - ค้นหารูปภาพจากใบหน้า",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where My Photos",
    description: "ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า",
    images: ["https://wheremyphotos.com/op.png"],
    creator: "@wheremyphotos",
  },
  alternates: {
    canonical: "https://wheremyphotos.com",
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
    "Where My Photos",
    "ค้นหารูปภาพ",
    "หารูป",
    "ค้นหารูปภาพด้วยใบหน้า",
    "หาใบหน้าจากรูป",
  ],
  authors: [{ name: "Where My Photos" }],
  creator: "Where My Photos",
  publisher: "Where My Photos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${noto_sans_thai.className}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
