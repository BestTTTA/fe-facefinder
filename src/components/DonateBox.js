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
      alert(
        "กรุณากรอกข้อมูลให้ครบถ้วน และจำนวนเงินขั้นต่ำ 10 บาท และยินยอมให้เผยแพร่ชื่อ"
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
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      {/* Animated background elements - matching footer */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      
      {/* Main content */}
      <div className="relative z-10 bg-white/5 border border-gray-700/50 shadow-2xl p-8 md:p-12">
        {/* Header section with enhanced styling */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg shadow-purple-500/25">
            <span className="text-3xl">❤️</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            ร่วมบริจาคให้กับกิจกรรม
          </h1>
        </div>

        {/* Description with enhanced styling */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
          <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-3">
            <p className="flex items-start gap-2">
              <span className="text-2xl">🎥</span>
              <span>เพราะเบื้องหลังภาพเท่ๆ คือคนธรรมดาที่ทุ่มเทสุดใจ</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-2xl">📱</span>
              <span>บริจาควันนี้ เพื่อสนับสนุนตากล้อง ผู้อยู่หลังเลนส์ และแพลตฟอร์มที่เก็บทุกโมเมนต์ของคุณไว้ตลอดไป</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-2xl">💸</span>
              <span><span className="font-bold text-purple-400">บริจาคขั้นต่ำเพียง 10 บาท</span></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-2xl">🫶</span>
              <span><span className="font-bold text-pink-400">ทุกยอดคือแรงใจ</span> ให้เรายืนอยู่หลังกล้องอย่างมีพลัง</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-2xl">🌐</span>
              <span>สนับสนุนแพลตฟอร์ม <span className="font-bold text-blue-400">FaceMeNow</span> ให้เติบโตไปกับทุกกิจกรรมดีๆ</span>
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          {/* Name input */}
          <div className="relative">
            <label className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-xl">👤</span>
              ชื่อผู้บริจาค
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="กรอกชื่อของคุณ"
                className="w-full bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow-lg text-lg transition-all text-white placeholder:text-gray-400 hover:bg-white/10"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Details textarea */}
          <div className="relative">
            <label className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-xl">💬</span>
              ข้อความหรือรายละเอียดเพิ่มเติม
            </label>
            <div className="relative">
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="ขอให้กิจกรรมประสบความสำเร็จ..."
                className="w-full bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow-lg text-lg transition-all text-white placeholder:text-gray-400 min-h-[80px] resize-none hover:bg-white/10"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Amount selector */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🪙</span>
              <span className="text-xl font-bold text-white">เลือกจำนวนเงิน</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[10, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  disabled={loading}
                  onClick={() => handleAmountButton(amt)}
                  className={`relative group flex flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition-all duration-300 font-bold text-2xl select-none overflow-hidden
                    ${Number(amount) === amt 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 shadow-purple-500/25' 
                      : 'bg-white/5 backdrop-blur-sm border border-gray-700/50 text-white hover:bg-white/10 hover:scale-105 hover:shadow-lg'
                    }
                    disabled:opacity-50`}
                >
                  <div className="relative z-10">
                    {amt.toLocaleString()} 
                    <span className="block text-base font-medium mt-1">บาท</span>
                  </div>
                  {Number(amount) === amt && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}
              
              <div className={`relative group flex flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition-all duration-300 font-bold text-xl select-none overflow-hidden
                ${![10,50,100].includes(Number(amount)) 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 shadow-purple-500/25' 
                  : 'bg-white/5 backdrop-blur-sm border border-gray-700/50 text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <label className="block text-base font-bold mb-3 text-white">ระบุจำนวน</label>
                <input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  disabled={loading}
                  className="w-24 text-center bg-transparent border-0 border-b-2 border-gray-400 focus:border-white outline-none text-2xl font-bold text-white placeholder:text-gray-400"
                  placeholder="_ _ _ _"
                />
              </div>
            </div>
            
            <div className="text-sm text-purple-400 flex items-center justify-center gap-1">
              <span className="text-lg">⚡</span>
              ขั้นต่ำ <b className="mx-1">10</b> บาท
            </div>
          </div>

          {/* Consent checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none text-gray-300 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:bg-white/10 transition-all">
            <div className="relative">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-6 h-6 rounded border-gray-700/50 bg-white/5 checked:bg-gradient-to-r checked:from-purple-500 checked:to-pink-500 focus:ring-2 focus:ring-purple-400 transition-all"
              />
              {consent && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold pointer-events-none">
                  ✓
                </div>
              )}
            </div>
            <span className="text-base flex items-center gap-2">
              <span className="text-lg">🏆</span>
              ยินยอมให้แสดงชื่อบนกระดานผู้บริจาค (Leaderboard)
            </span>
          </label>

          {/* Donate button */}
          <button
            onClick={handleDonate}
            disabled={loading}
            className="relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-6 rounded-xl font-bold text-xl shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <span className="text-2xl">💖</span>
                  บริจาค {amount} บาท
                </>
              )}
            </div>
            
            {/* Button hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Animated sparkles */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-ping delay-200"></div>
              <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping delay-400"></div>
              <div className="absolute bottom-2 right-4 w-1 h-1 bg-white rounded-full animate-ping delay-600"></div>
            </div>
          </button>
        </div>
      </div>
      
      {/* Bottom glow effect - matching footer */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
    </div>
  );
}