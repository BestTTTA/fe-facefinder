function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t py-8 mt-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 text-sm">
        {/* Company Info */}
        <div className="col-span-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <img src="/favicon.png" alt="Facemenow Logo" className="h-8 w-10" />
            <span className="text-2xl font-bold text-gray-800">Facemenow</span>
          </div>
          <div className="text-gray-600">อนาคตของการถ่ายภาพ การจดจำใบหน้า และประสบการณ์ที่ราบรื่น</div>
          <div className="mt-2">
            <div className="text-gray-800 font-semibold">xxx-xxx-xxxx</div>
            <div className="text-gray-800 font-semibold">hello@facemenow.co</div>
            <div className="text-gray-500">กรุงเทพฯ ประเทศไทย</div>
          </div>
        </div>
        {/* Navigation */}
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-700 mb-1">บริษัท</div>
          <a href="#about" className="hover:text-blue-500">เกี่ยวกับเรา</a>
          <a href="#careers" className="hover:text-blue-500">ตำแหน่งงาน</a>
          <a href="#articles" className="hover:text-blue-500">บทความ</a>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-700 mb-1">ผลิตภัณฑ์</div>
          <a href="#features" className="hover:text-blue-500">ฟีเจอร์</a>
          <a href="#pricing" className="hover:text-blue-500">ราคา</a>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-700 mb-1">แหล่งข้อมูล</div>
          <a href="#videos" className="hover:text-blue-500">วีดีโอสอน</a>
          <a href="#help" className="hover:text-blue-500">ศูนย์ช่วยเหลือ</a>
          <a href="#community" className="hover:text-blue-500">ชุมชน</a>
        </div>
        {/* Legal & Social */}
        <div className="md:col-span-4 flex flex-col md:flex-row justify-between items-center border-t pt-6 mt-8 gap-4 text-xs text-gray-400">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
            <a href="#privacy" className="hover:text-blue-500">นโยบายความเป็นส่วนตัว</a>
            <a href="#terms" className="hover:text-blue-500">ข้อกำหนดการให้บริการ</a>
            <a href="#cookies" className="hover:text-blue-500">นโยบายคุกกี้</a>
          </div>
          <div className="text-center">© 2025 Facemenow. สงวนลิขสิทธิ์</div>
          <div className="flex gap-3 items-center">
            <span className="text-gray-500">ติดตามเรา:</span>
            {/* Social icons placeholder */}
            <a href="#" className="hover:text-blue-500">FB</a>
            <a href="#" className="hover:text-blue-500">X</a>
            <a href="#" className="hover:text-blue-500">IG</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer