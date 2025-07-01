"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

const mockEvents = [
  {
    id: 1,
    name: "BNI POWER",
    datetime: "2025-07-01T18:30:00",
    image: "/bni-banner.jpg",
  },
];

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-2">
      {mockEvents.map(event => (
        <button
          key={event.id}
          className="w-full aspect-[16/9] bg-white rounded-lg shadow overflow-hidden flex flex-col text-left hover:shadow-lg transition cursor-pointer"
          onClick={() => router.push(`/event/${event.id}`)}
        >
          <div className="relative w-full h-full">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover border"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center p-4">
            <div className="text-lg font-semibold mb-2">{event.name}</div>
            <div className="text-gray-500 text-sm">{formatThaiDateTime(event.datetime)}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ShowEvent;