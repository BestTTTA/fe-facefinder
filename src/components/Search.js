"use client";

import { useState } from "react";

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
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

function Search() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  return (
    <form className="w-full sm:border p-4 flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow">
      <div className="flex flex-col flex-1">
        <label
          htmlFor="event-name"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          ชื่องาน
        </label>
        <input
          id="event-name"
          type="text"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="กรอกชื่องาน"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex gap-2 sm:w-1/2">
        <div className="flex flex-col w-full">
          <label
            htmlFor="event-year"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            ปีที่จัดงาน
          </label>
          <select
            id="event-year"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">เลือกปี</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label
            htmlFor="event-month"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            เดือนที่จัดงาน
          </label>
          <select
            id="event-month"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">เลือกเดือน</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        style={{ background: "var(--btn-gradient)" }}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        ค้นหา
      </button>
    </form>
  );
}

export default Search;
