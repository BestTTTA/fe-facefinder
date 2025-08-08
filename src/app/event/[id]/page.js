import EventPageClient from "./EventPageClient";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events/${id}`, {
    headers: { cookie },
  });
  if (!res.ok) return {};

  const event = await res.json();

  return {
    title: `Facefinder | ${event.event_name}`,
    description: event.event_details || "รายละเอียดกิจกรรม",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: event.event_name,
      description: event.event_details || "รายละเอียดกิจกรรม",
      images: [
        {
          url: event.event_img_url || "/placeholder-image.jpg",
          width: 600,
          height: 400,
          alt: event.event_name,
        },
      ],
      type: "website",
    },
  };
}
export default async function Page({ params }) {
  const { id } = await params;
  // return <EventPageClient eventId={id} />;
  return (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center">
    <h2 className="text-xl font-bold mb-3">🚧 กำลังปรับปรุงระบบ<br />🚧 System Maintenance</h2>
    <p className="text-gray-600 mb-5">
      ขณะนี้ระบบกำลังอยู่ในระหว่างการปรับปรุง<br />
      The system is currently under maintenance.<br />
      กรุณากลับมาใหม่อีกครั้งในภายหลัง<br />
      Please try again later.
    </p>
  </div>
</div>

  );
}
