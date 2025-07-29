"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import formatThaiDateTime from "@/lib/formatThaiDateTime";

function ShowEvent() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 text-text-primary">Loading...</div>;
  }

  if (events.length === 0) {
    return <div className="p-4 text-text-primary">Event Not Found</div>;
  }

  return (
    <div className="container p-4">
      <h1 className="text-h1 text-text-primary font-bold mb-4">
        EVENTS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {events.map((event) => (
          <button
            key={event.id}
            className="group w-full aspect-[16/9] rounded-2xl shadow-glow overflow-hidden flex flex-col text-left transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-glowMid border border-transparent hover:border-glowMid"
            onClick={() => router.push(`/event/${event.id}`)}
          >
            <div className="relative w-full h-full flex-1">
              <Image
                src={event.event_img_url || "/default-event.jpg"}
                alt={event.event_name}
                fill
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                priority
              />

              {/* Glassmorphism info box */}
              <div className="absolute bottom-0 left-0 w-full z-20 p-4 flex flex-col gap-1 backdrop-blur-md bg-glowMid/20 bg-opacity-50 rounded-b-2xl">
                <div
                  className="text-h2 text-text-primary drop-shadow-md "
                  title={event.event_name}
                >
                  {event.event_name}
                </div>
                <div className="text-h3 text-text-primary font-thin drop-shadow-md flex items-center gap-2">
                  <Image
                    src="/clock-icon.svg"
                    alt="Clock icon"
                    width={16}
                    height={16}
                  />
                  {formatThaiDateTime(event.start_at)} -{" "}
                  {formatThaiDateTime(event.end_at)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ShowEvent;
