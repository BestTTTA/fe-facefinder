"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import SearchPage from "@/components/SearchPage";
import DonateBox from "@/components/DonateBox";
import LeaderBox from "@/components/LeaderBox";
import formatThaiDateTime from "@/lib/formatThaiDateTime";

export default function EventPageClient({ eventId }) {
  const id = eventId;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/events/${id}`
        );
        const data = await res.json();
        console.log(data);

        if (!res.ok)
          throw new Error(data.detail || "ไม่สามารถโหลดข้อมูลอีเวนต์ได้");

        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event)
    return (
      <div className="p-8 text-center text-red-500">Event Not Found</div>
    );

  return (
    <div className="bg-background py-4 px-4 sm:px-0">
      <div className="p-4">
        <div className="relative sm:aspect-[12/4] aspect-square rounded-lg overflow-hidden mb-6 shadow border">
          {/* Blurred background image */}
          <Image
            src={event.event_img_url || "/placeholder-image.jpg"}
            alt={event.event_name}
            fill
            className="object-cover blur-sm scale-200 brightness-100"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />

          {/* Foreground square image */}
          <div className="relative z-10 flex justify-center items-center w-full h-full">
            <Image
              src={event.event_img_url || "/placeholder-image.jpg"}
              alt={event.event_name}
              fill
              className="object-contain rounded-lg w-full h-full"
              sizes="(max-width: 768px) 100vw, 400px"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
        </div>

        <div className="w-full px-4">
          <div className="mb text-h1 text-text-primary font-bold">
            {event.event_name}
          </div>
          <div className="text-h3 text-text-secondary font-thin mb-4">
            {event.event_details}
          </div>
          <div className="text-h4 text-text-primary font-thin mb-4">
                  {formatThaiDateTime(event.start_at)} -{" "}
                  {formatThaiDateTime(event.end_at)}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* <LeaderBox eventId={event.id} /> */}
        <SearchPage eventId={event.id} />
        {/* <DonateBox eventId={event.id} /> */}
      </div>
    </div>
  );
}
