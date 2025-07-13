"use client";
import { useEffect, useState } from "react";

export default function LeaderBox({ eventId }) {
  const [board, setBoard] = useState([]);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/events/${eventId}/leaderboard?sort_by=${sortBy}&limit=10`
        );
        const data = await res.json();
        console.log("Leaderboard data:", data);
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

  // ฟังก์ชันสำหรับจัดรูปแบบเงิน
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('฿', '').trim();
  };

  // ฟังก์ชันสำหรับสร้าง initials
  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="max-w-container mx-auto p-4 bg-surface rounded-lg shadow-lg h-[600px] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">ผู้บริจาคล่าสุด</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-text-primary p-1 rounded text-h3 text-text-primary bg-surface"
        >
          <option value="recent">เรียงตามล่าสุด</option>
          <option value="amount">เรียงตามจำนวนเงิน</option>
        </select>
      </div>

      {stats && (
        <div className="flex justify-center items-center w-full gap-4 text-sm text-text-secondary mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-full text-white">
            <div className="text-text-secondary">จำนวนผู้บริจาค</div>
            <div className="text-lg font-bold">{stats.total_donors.toLocaleString()}</div>
          </div>
          <div className="bg-show backdrop-blur-sm rounded-lg p-3 w-full text-white">
            <div className="text-text-secondary">รวมยอดเงิน</div>
            <div className="text-lg font-bold">{formatCurrency(stats.total_amount)} บาท</div>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {board.map((user, index) => (
          <li
            key={user.duser_id}
            className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                {user.profile_url && user.profile_url !== "string" ? (
                  <img
                    src={user.profile_url}
                    alt={user.display_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.display_name)
                )}
              </div>
              <div>
                <div className="text-white font-medium">{user.display_name}</div>
                <div className="text-gray-300 text-sm">
                  {formatThaiDatetime(user.last_donation_at)}
                </div>
              </div>
            </div>
            <div className="text-white font-bold text-lg">
              {formatCurrency(user.total_donated)} บาท
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}