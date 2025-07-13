"use client";
import { useState } from "react";

export default function DonateBox({ eventId }) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(100);
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (
      !name ||
      !eventId ||
      !amount ||
      amount < 10 ||
      !consent ||
      !email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    ) {
      alert(
        "กรุณากรอกข้อมูลให้ครบถ้วน อีเมลถูกต้อง และจำนวนเงินขั้นต่ำ 10 บาท และยินยอมให้เผยแพร่ชื่อ"
      );
      return;
    }

    setLoading(true);

    try {
      const profileUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
        name
      )}`;

      // 1. สร้าง duser
      const duserRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/dusers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            display_name: name,
            display_details: details,
            profile_url: profileUrl,
            consent: true,
            email,
          }),
        }
      );

      const duserData = await duserRes.json();
      if (!duserRes.ok)
        throw new Error(duserData.detail || "สร้างผู้บริจาคไม่สำเร็จ");

      const duserId = duserData.duser_id;

      const payload = {
        event_id: eventId,
        duser_id: duserId,
        amount: parseFloat(amount),
        currency: "thb",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}`,
        email: email,
        user_details: details,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

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

  const handleAmountButton = (amt) => {
    setAmount(amt);
  };

  return (
    <div className="relative max-w-container mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-[#7b2ff2] via-[#f357a8] to-[#4e54c8] p-[2px] shadow-2xl">
      <div className="relative z-10 bg-[#1a1033]/90 rounded-2xl p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg shadow-purple-500/25">
            <span className="text-3xl">❤️</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            ร่วมบริจาคให้กับกิจกรรม
          </h1>
          <p className="text-sm text-gray-300 font-light">
            สนับสนุนผู้ที่ทุ่มเททั้งกายและใจเพื่อเก็บภาพความทรงจำดีๆ ในชุมชน
          </p>
        </div>

        {/* Form */}
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleDonate();
          }}
        >
          {/* Name */}
          <div>
            <label className="font-semibold text-white mb-1 flex items-center gap-2">
              <span className="text-xl">👤</span>
              ชื่อผู้บริจาค
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              className="w-full bg-white/10 border border-gray-700/50 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow text-base transition-all text-white placeholder:text-gray-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-white mb-1 flex items-center gap-2">
              <span className="text-xl">📧</span>
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/10 border border-gray-700/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow text-base transition-all text-white placeholder:text-gray-400"
            />
          </div>

          {/* Details */}
          <div>
            <label className="font-semibold text-white mb-1 flex items-center gap-2">
              <span className="text-xl">💬</span>
              ข้อความหรือรายละเอียดเพิ่มเติม
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ขอให้กิจกรรมประสบความสำเร็จ..."
              className="w-full bg-white/10 border border-gray-700/50 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow text-base transition-all text-white placeholder:text-gray-400 min-h-[60px] resize-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              จำนวนเงินบริจาค
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[10, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  disabled={loading}
                  onClick={() => handleAmountButton(amt)}
                  className={`rounded-lg py-3 font-bold text-lg transition-all border
                    ${
                      Number(amount) === amt
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 border-transparent"
                        : "bg-white/10 text-white border-gray-600 hover:bg-white/20 hover:scale-105"
                    }
                    disabled:opacity-50`}
                >
                  {amt.toLocaleString()} บาท
                </button>
              ))}
            </div>
            <input
              type="number"
              min="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="w-full text-center bg-white/10 border border-gray-700/50 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-lg font-bold text-white placeholder:text-gray-400"
              placeholder="ระบุจำนวน (ขั้นต่ำ 10 บาท)"
            />
            <div className="text-xs text-purple-300 mt-1 text-right">
              ขั้นต่ำ 10 บาท
            </div>
          </div>

          {/* Consent */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-pink-200 bg-white/10 rounded-lg p-3 border border-gray-700/50 hover:bg-white/20 transition-all">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-5 h-5 rounded border-gray-700/50 bg-white/5 checked:bg-gradient-to-r checked:from-purple-500 checked:to-pink-500 focus:ring-2 focus:ring-purple-400 transition-all"
            />
            <span className="text-base flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <span>แสดงชื่อในรายการผู้บริจาค</span>
            </span>
          </label>

          {/* Donate button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                กำลังดำเนินการ...
              </span>
            ) : (
              <>บริจาค {amount} บาท</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}