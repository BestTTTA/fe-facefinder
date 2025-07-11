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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-2">
      {events.map(event => (
        <button
          key={event.id}
          className="w-full aspect-[16/9] bg-white rounded-lg shadow overflow-hidden flex flex-col text-left hover:shadow-lg transition cursor-pointer"
          onClick={() => router.push(`/event/${event.id}`)}
        >
          <div className="relative w-full h-full">
            <Image
              src={event.event_img_url || "/default-event.jpg"} // fallback
              alt={event.event_name}
              fill
              className="object-cover border"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center p-4">
            <div className="text-lg font-semibold mb-2">{event.event_name}</div>
            <div className="text-gray-500 text-sm">{formatThaiDateTime(event.start_at)}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ShowEvent;
