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
  return <EventPageClient eventId={id} />;
}
