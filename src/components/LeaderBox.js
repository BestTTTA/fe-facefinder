"use client";
import { useEffect, useState } from "react";

export default function LeaderBox({ eventId }) {
  const [board, setBoard] = useState([]);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState("recent"); // เพิ่ม state

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/events/${eventId}/leaderboard?sort_by=${sortBy}&limit=50`
        );
        const data = await res.json();
        setBoard(data.leaderboard || []);
        setStats(data.statistics);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, [eventId, sortBy]);

  const formatThaiDatetime = (isoString) => {
    const d = new Date(isoString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")} น.`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">ผู้บริจาคล่าสุด</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 p-1 rounded text-sm"
        >
          <option value="recent">เรียงตามล่าสุด</option>
          <option value="amount">เรียงตามจำนวนเงิน</option>
        </select>
      </div>

      {stats && (
        <div className="flex justify-center items-center w-full gap-4 text-sm text-gray-700 mb-4">
          <div className="bg-white rounded shadow p-3 w-full">
            <div className="text-gray-500">จำนวนผู้บริจาค</div>
            <div className="text-lg font-bold">{stats.total_donors}</div>
          </div>
          <div className="bg-white rounded shadow p-3 w-full">
            <div className="text-gray-500">รวมยอดเงิน</div>
            <div className="text-lg font-bold">{stats.total_amount} ฿</div>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {board.map((user) => (
          <li
            key={user.duser_id}
            className="bg-white p-4 rounded shadow flex gap-4 items-center"
          >
            <img
              src={
                user.profile_url && user.profile_url !== "string"
                  ? user.profile_url
                  : "https://via.placeholder.com/64"
              }
              alt={user.display_name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold">{user.display_name}</div>
              <div className="text-sm text-gray-600">
                {user.display_details}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ล่าสุด: {formatThaiDatetime(user.last_donation_at)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
