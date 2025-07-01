"use client"
import Image from 'next/image';
import { useParams } from 'next/navigation';
import SearchPage from '@/components/SearchPage';

const mockEvents = [
  {
    id: 1,
    name: "BNI POWER",
    datetime: "2025-07-01T18:30:00",
    image: "/bni-banner.jpg",
  },
  {
    id: 2,
    name: "งานแสดงศิลปะร่วมสมัย",
    datetime: "2024-08-10T14:00:00",
    image: "/op.png",
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

export default function EventPage() {
  const params = useParams();
  const eventId = Number(params.id);
  const event = mockEvents.find(e => e.id === eventId);

  if (!event) {
    return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลอีเวนต์นี้</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="w-full aspect-[16/9] relative rounded-lg overflow-hidden mb-6 shadow">
        <Image src={event.image} alt={event.name} fill className="object-cover" />
      </div>
      <div className="mb-2 text-2xl font-bold">{event.name}</div>
      <div className="mb-8 text-gray-500">{formatThaiDateTime(event.datetime)}</div>
      <SearchPage />
    </div>
  );
}