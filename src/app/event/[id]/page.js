import EventPageClient from "./EventPageClient";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/events/${id}`,
    { headers: { cookie } }
  );
  if (!res.ok) return {};

  const event = await res.json();

  return {
    title: `Facemenow | ${event.event_name}`,
    description: event.event_description || "รายละเอียดกิจกรรม",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png}`,
    },
    openGraph: {
      title: event.event_name,
      description: event.event_description || "รายละเอียดกิจกรรม",
      images: [
        {
          url: event.event_img_url || "/placeholder-image.jpg",
          width: 800,
          height: 600,
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
