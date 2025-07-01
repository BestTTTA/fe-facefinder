import React from 'react'

function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t py-6 mt-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-2 px-4">
        <div className="text-xl font-bold text-gray-800">Face me now</div>
        <div className="text-gray-600 text-sm">
          ค้นหารูปภาพจากงาน กิจกรรม หรือเทศกาล ด้วยการอัปโหลดใบหน้า
        </div>
        <div className="text-xs text-gray-400 mt-2">
          © {new Date().getFullYear()} <a href="https://facemenow.co" className="underline hover:text-blue-500" target="_blank" rel="noopener noreferrer">Face me now</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer