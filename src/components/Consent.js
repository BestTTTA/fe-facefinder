"use client"
import { useState, useEffect } from "react";

function Consent({ value, onChange }) {
  const [hasConsent, setHasConsent] = useState(value ?? false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);

  useEffect(() => {
    if (typeof value === "boolean") setHasConsent(value);
  }, [value]);

  const handleConsentChange = (checked) => {
    setHasConsent(checked);
    localStorage.setItem("hasConsent", checked);
    if (onChange) onChange(checked);
  };

  return (
    <div className="mb-6 p-4 bg-text-primary rounded-lg border border-gray-200">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="consent"
            type="checkbox"
            checked={hasConsent}
            onChange={(e) => handleConsentChange(e.target.checked)}
            className="w-4 h-4 text-primary-dark rounded"
          />
        </div>
        <label
          htmlFor="consent"
          className="ml-2 text-sm text-gray-700 flex flex-col gap-2"
        >
          <span className="font-semibold">
            ข้อตกลงและเงื่อนไขการใช้ระบบจดจำใบหน้า
          </span>
          <button
            type="button"
            className="text-blue-500 underline text-xs w-fit"
            onClick={() => setShowConsentDetails((v) => !v)}
          >
            {showConsentDetails ? "ซ่อนรายละเอียด" : "อ่านเพิ่มเติม"}
          </button>
          {showConsentDetails && (
            <div className="mt-2 text-xs text-gray-600 space-y-3">
              <div>
                <div className="font-medium text-gray-800 mb-1">
                  ข้อควรระวังในการใช้ระบบจดจำใบหน้า:
                </div>
                <ul className="list-disc ml-6 text-gray-600 space-y-1">
                  <li>
                    ห้ามอัปโหลดรูปภาพใบหน้าของผู้อื่นโดยไม่ได้รับอนุญาต
                    หากจำเป็นต้องได้รับความยินยอมจากบุคคลนั้น (หรือผู้ปกครอง)
                    สำหรับการใช้ข้อมูลใบหน้าของพวกเขา
                  </li>
                  <li>
                    ห้ามแก้ไข แพร่กระจาย หรือดำเนินการอื่นๆ ที่ผิดกฎหมาย
                    ไม่มีจริยธรรม หรือไม่เหมาะสมกับรูปภาพที่พบ
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">
                  กฎการประมวลผลข้อมูลใบหน้า:
                </div>
                <ul className="list-disc ml-6 text-gray-600 space-y-1">
                  <li>
                    ข้อมูลใบหน้าเป็นข้อมูลส่วนบุคคลที่สำคัญ
                    การปฏิเสธการให้ข้อมูลใบหน้าจะไม่ส่งผลกระทบต่อการใช้งานปกติของระบบ
                  </li>
                  <li>การค้นหาด้วยใบหน้าจะแสดงผลเฉพาะกับผู้ค้นหาเท่านั้น</li>
                  <li>
                    ระบบจะไม่เก็บรวบรวม เก็บรักษา ใช้ ประมวลผล ส่งต่อ ให้
                    หรือเปิดเผยข้อมูลใบหน้าโดยพลการ
                    ยกเว้นเพื่อการค้นหารูปภาพอย่างรวดเร็ว
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">
                  ข้อจำกัดความรับผิดชอบ:
                </div>
                <ul className="list-disc ml-6 text-gray-600 space-y-1">
                  <li>
                    ข้อมูลใบหน้าเป็นข้อมูลส่วนบุคคลที่สำคัญ
                    การใช้ข้อมูลใบหน้าของผู้อื่นควรได้รับอนุญาตจากเจ้าของสิทธิ์
                  </li>
                  <li>
                    ผู้ใช้ควรใช้ข้อมูลใบหน้าอย่างระมัดระวังและหลีกเลี่ยงการละเมิดสิทธิ์ที่ชอบด้วยกฎหมายของผู้อื่น
                  </li>
                  <li>
                    หากมีข้อโต้แย้งเกี่ยวกับข้อกำหนดข้างต้น
                    คุณสามารถขอให้หยุดใช้ฟังก์ชันการจดจำใบหน้าที่เกี่ยวข้องกับข้อมูลส่วนบุคคลของคุณได้ทันที
                  </li>
                </ul>
              </div>
              <div className="text-gray-600 italic mt-2">
                โดยการคลิกที่ช่องทำเครื่องหมายนี้
                คุณยืนยันว่าคุณได้อ่านและยอมรับข้อกำหนดและเงื่อนไขทั้งหมดข้างต้น
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default Consent;
