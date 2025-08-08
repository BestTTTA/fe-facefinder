"use client";
import Carousel from "@/components/Carousel";
import Search from "@/components/Search";
import ShowEvent from "@/components/ShowEvent";
import AlertBar from "@/components/AlertBar";

export default function Home() {
  return (
    <div className="flex flex-col gap-9 bg-surface h-screen relative">
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

      <main className="flex flex-col items-center max-w-full gap-8">
        {/* <AlertBar /> */}
        {/* <Carousel /> */}
        {/* <Search /> */}
        <ShowEvent />
      </main>
    </div>
  );
}
