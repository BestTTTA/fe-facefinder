import React from "react";

function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full ">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-8 w-full">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src="/favicon.png"
                  alt="Facemenow Logo"
                  className="relative h-12 w-14 rounded-lg"
                />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Facemenow
              </span>
            </div>

            <div className="sm:flex w-full justify-between">
              <p className="text-lg text-gray-300 mb-2 leading-relaxed">
                อนาคตของการถ่ายภาพ การจดจำใบหน้า และประสบการณ์ที่ราบรื่น
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Made with ♥️ in Korat City
              </p>
            </div>

            <div className="space-y-3 hidden">
              <div className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors group">
                <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="font-semibold">xxx-xxx-xxxx</span>
              </div>
              <div className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors group">
                <div className="w-2 h-2 bg-pink-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="font-semibold">hello@facemenow.co</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>กรุงเทพฯ ประเทศไทย</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-6 hidden">
            <h3 className="text-xl font-bold text-white mb-4 relative">
              บริษัท
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </h3>
            <div className="space-y-3">
              {["เกี่ยวกับเรา", "ตำแหน่งงาน", "บทความ"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                >
                  <span className="border-b border-transparent group-hover:border-purple-400 pb-1">
                    {item}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6 hidden">
            <h3 className="text-xl font-bold text-white mb-4 relative">
              ผลิตภัณฑ์
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            </h3>
            <div className="space-y-3">
              {["ฟีเจอร์", "ราคา"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                >
                  <span className="border-b border-transparent group-hover:border-pink-400 pb-1">
                    {item}
                  </span>
                </a>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-4 mt-8 relative">
              แหล่งข้อมูล
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </h3>
            <div className="space-y-3">
              {["วีดีโอสอน", "ศูนย์ช่วยเหลือ", "ชุมชน"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                >
                  <span className="border-b border-transparent group-hover:border-blue-400 pb-1">
                    {item}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="hidden mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-gray-400">
              {[
                "นโยบายความเป็นส่วนตัว",
                "ข้อกำหนดการให้บริการ",
                "นโยบายคุกกี้",
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="hover:text-purple-400 transition-colors relative group"
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></div>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-center">
              © 2025 Facemenow. สงวนลิขสิทธิ์
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-gray-500">ติดตามเรา:</span>
              {["FB", "X", "IG"].map((social, index) => (
                <a key={index} href="#" className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-lg hover:shadow-purple-500/25">
                    {social}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
    </footer>
  );
}

export default Footer;
