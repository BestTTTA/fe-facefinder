"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function formatThaiDateTime(datetime) {
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const d = new Date(datetime);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  const hour = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year} เวลา ${hour}:${min} น.`;
}

function ShowEvent() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch events", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">กำลังโหลด...</div>;
  }

  if (events.length === 0) {
    return <div className="p-4">ไม่พบอีเวนต์</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-4">
      {events.map(event => (
        <button
          key={event.id}
          className="group w-full aspect-[16/9] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col text-left transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer border border-transparent hover:border-pink-400"
          onClick={() => router.push(`/event/${event.id}`)}
        >
          <div className="relative w-full h-full flex-1">
            <Image
              src={event.event_img_url || "/default-event.jpg"}
              alt={event.event_name}
              fill
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 border-none"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
            {/* Glassmorphism info box */}
            <div className="absolute bottom-0 left-0 w-full z-20 p-4 flex flex-col gap-1 backdrop-blur-md bg-white/20 bg-opacity-60 rounded-b-2xl">
              <div className="text-white text-lg md:text-xl font-bold drop-shadow-md truncate" title={event.event_name}>{event.event_name}</div>
              <div className="text-pink-200 text-sm md:text-base font-medium drop-shadow-md flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v4.5l3 1.5m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {formatThaiDateTime(event.start_at)}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ShowEvent;
