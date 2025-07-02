"use client";
import { useState } from "react";

export default function AlertBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-center py-2 px-4 text-sm font-medium shadow-sm relative">
      ⚠️ เว็บไซต์นี้เป็น{" "}
      <span className="font-bold">เวอร์ชันสาธิต (Demo Version)</span>{" "}
      ข้อมูลทั้งหมดใช้เพื่อการทดสอบเท่านั้น
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-900 hover:text-yellow-700 text-lg font-bold focus:outline-none"
        aria-label="ปิด"
        type="button"
      >
        ×
      </button>
    </div>
  );
}
