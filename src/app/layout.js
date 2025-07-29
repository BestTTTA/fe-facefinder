import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";
import { ThemeModeScript } from "flowbite-react";
import Script from "next/script";

const noto_sans_thai = Noto_Sans_Thai({
  weight: "400",
  subsets: ["thai"],
});

export const metadata = {
  title: "ASC2025-fece-finder",
  description: "The Asian Science Camp (ASC) is an annual forum for pre-collegiate and college students, fostering discussion and cooperation to advance science in Asia. Inspired by the Lindau Nobel Laureate Meetings, ASC was co-proposed in 2005 by Nobel Laureates Yuan Tseh Lee and Masatoshi Koshiba. The first camp took place in Taipei in 2007 and has since been hosted in various Asian cities. ASC invites Nobel Laureates and distinguished scientists for plenary sessions, discussions, and competitions, aiming to inspire young scientists. Governed by the International Board of Asian Science Camp (IBASC), ASC operates as a non-profit initiative supported by educational institutions.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-32.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "ASC2025-fece-finder",
    description: "The Asian Science Camp (ASC) is an annual forum for pre-collegiate and college students, fostering discussion and cooperation to advance science in Asia. Inspired by the Lindau Nobel Laureate Meetings, ASC was co-proposed in 2005 by Nobel Laureates Yuan Tseh Lee and Masatoshi Koshiba. The first camp took place in Taipei in 2007 and has since been hosted in various Asian cities. ASC invites Nobel Laureates and distinguished scientists for plenary sessions, discussions, and competitions, aiming to inspire young scientists. Governed by the International Board of Asian Science Camp (IBASC), ASC operates as a non-profit initiative supported by educational institutions.",
    url: "https://facefinder.thetigerteamacademy.net",
    siteName: "ASC2025-fece-finder",
    images: [
      {
        url: "https://facefinder.thetigerteamacademy.net/op.jpg",
        width: 1200,
        height: 630,
        alt: "ASC2025-fece-finder",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASC2025-fece-finder",
    description: "The Asian Science Camp (ASC) is an annual forum for pre-collegiate and college students, fostering discussion and cooperation to advance science in Asia. Inspired by the Lindau Nobel Laureate Meetings, ASC was co-proposed in 2005 by Nobel Laureates Yuan Tseh Lee and Masatoshi Koshiba. The first camp took place in Taipei in 2007 and has since been hosted in various Asian cities. ASC invites Nobel Laureates and distinguished scientists for plenary sessions, discussions, and competitions, aiming to inspire young scientists. Governed by the International Board of Asian Science Camp (IBASC), ASC operates as a non-profit initiative supported by educational institutions.",
    images: ["https://facefinder.thetigerteamacademy.net/op.jpg"],
    creator: "@facefinder",
  },
  alternates: {
    canonical: "https://facefinder.thetigerteamacademy.net",
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
    "ASC2025-fece-finder",
    "ค้นหารูปภาพ",
    "หารูป",
    "ค้นหารูปภาพด้วยใบหน้า",
    "หาใบหน้าจากรูป",
  ],
  authors: [{ name: "ASC2025-fece-finder" }],
  creator: "ASC2025-fece-finder",
  publisher: "ASC2025-fece-finder",
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
        <Script
          id="ld-json-logo"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Facefinder",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
              logo: `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png}`, // ลิงก์เต็มของโลโก้ ขนาดแนะนำ 112x112
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7JKHP5GQSZ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7JKHP5GQSZ');
          `}
        </Script>
      </head>
      <body
        className={`${noto_sans_thai.className} flex flex-col justify-between min-h-screen`}
      >
        <div className="">
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
