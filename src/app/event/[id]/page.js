"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchPage from "@/components/SearchPage";
import DonateBox from "@/components/DonateBox";
import LeaderBox from "@/components/LeaderBox";

function formatThaiDateTime(datetime) {
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const d = new Date(datetime);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year} เวลา ${hour}:${min} น.`;
}

export default function EventPage() {
  const { id } = useParams();
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

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event)
    return (
      <div className="p-8 text-center text-red-500">ไม่พบข้อมูลอีเวนต์นี้</div>
    );

  return (
    <div className="">
      <div className="w-full p-4">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-6 shadow border">
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
          <div className="mb-2 text-2xl font-bold">{event.event_name}</div>
          <div className="mb-8 text-gray-500">
            {formatThaiDateTime(event.start_at)}
          </div>
        </div>
      </div>

      <LeaderBox eventId={event.id} />
      <SearchPage eventId={event.id} />
      <DonateBox eventId={event.id} />
    </div>
  );
}
