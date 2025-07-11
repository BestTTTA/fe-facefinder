"use client";
import { useState } from "react";

export default function DonateBox({ eventId }) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState(100);
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!name || !eventId || !amount || amount < 10 || !consent) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน และจำนวนเงินขั้นต่ำ 10 บาท และยินยอมให้เผยแพร่ชื่อ");
      return;
    }

    setLoading(true);

    try {
      const profileUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(name)}`;

      // 1. สร้าง duser
      const duserRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/dusers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: name,
          display_details: details,
          profile_url: profileUrl,
          consent: true,
        }),
      });

      const duserData = await duserRes.json();
      if (!duserRes.ok) throw new Error(duserData.detail || "สร้างผู้บริจาคไม่สำเร็จ");

      const duserId = duserData.duser_id;

      const payload = {
        event_id: eventId,
        duser_id: duserId,
        amount: parseFloat(amount),
        currency: "thb",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}`,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("Missing checkout_url");
      }
    } catch (err) {
      console.error(err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-8">
      <h1 className="text-xl font-bold mb-4">ร่วมบริจาคให้กับกิจกรรม</h1>

      <label className="block mb-1 font-medium">ชื่อผู้บริจาค</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="กรอกชื่อของคุณ"
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />

      <label className="block mb-1 font-medium">ข้อความหรือรายละเอียดเพิ่มเติม</label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="ขอให้กิจกรรมประสบความสำเร็จ..."
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />

      <label className="block mb-1 font-medium">จำนวนเงิน (บาท)</label>
      <input
        type="number"
        min="10"
        value={amount}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 10 || e.target.value === "") {
            setAmount(e.target.value);
          }
        }}
        className="w-full border border-gray-300 p-2 rounded mb-1"
      />
      <div className="text-sm text-orange-600 flex items-center mb-4">
ขั้นต่ำ <b>10</b> บาท
      </div>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mr-2"
        />
        ยินยอมให้แสดงชื่อบนกระดานผู้บริจาค (Leaderboard)
      </label>

      <button
        onClick={handleDonate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "กำลังดำเนินการ..." : `บริจาค ${amount} บาท`}
      </button>
    </div>
  );
}
