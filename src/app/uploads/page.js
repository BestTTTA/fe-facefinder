"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HARDCODED_PASSWORD = process.env.NEXT_PUBLIC_HARDCODED_PASSWORD;

export default function UploadPage() {
  const [uploadFilesToDb, setUploadFilesToDb] = useState([]);
  const [uploadDbMessage, setUploadDbMessage] = useState('');
  const [isUploadingToDb, setIsUploadingToDb] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [showProgressDetails, setShowProgressDetails] = useState(true);

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [cuserId, setCuserId] = useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true); 
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const MAX_FILES = 1000;

  useEffect(() => {
    if (!isPasswordModalOpen) {
      fetchEvents();
    }
  }, [isPasswordModalOpen]);


  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_UPLOAD}/events`);
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === HARDCODED_PASSWORD) {
      setIsPasswordModalOpen(false);
      setPasswordError('');
    } else {
      setPasswordError('รหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง');
    }
  };

  const handleUploadToDatabase = async () => {
    if (!selectedEventId || !cuserId) {
      setUploadDbMessage("กรุณาเลือก Event และกรอก cuser_id");
      return;
    }

    if (uploadFilesToDb.length === 0) {
      setUploadDbMessage('โปรดเลือกรูปภาพอย่างน้อยหนึ่งไฟล์');
      return;
    }

    setIsUploadingToDb(true);
    setUploadDbMessage(`กำลังอัปโหลด ${uploadFilesToDb.length} ไฟล์...`);

    let successfulUploads = 0;
    let failedUploads = 0;

    const uploadPromises = uploadFilesToDb.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('event_id', selectedEventId);
      formData.append('cuser_id', cuserId);

      try {
        setCurrentFileIndex(index);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API}/upload-to-db`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percentCompleted
            }));
          },
        });

        if (response.status === 200) {
          successfulUploads++;
        } else {
          failedUploads++;
        }
      } catch (err) {
        failedUploads++;
      }
    });

    await Promise.all(uploadPromises);
    setIsUploadingToDb(false);
    setUploadFilesToDb([]);

    if (successfulUploads > 0) {
      setUploadDbMessage(`✅ อัปโหลดรูปภาพทั้งหมด ${successfulUploads} รูปเรียบร้อย`);
    } else if (successfulUploads > 0 && failedUploads > 0) {
      setUploadDbMessage(`⚠️ สำเร็จ ${successfulUploads} ไฟล์, ล้มเหลว ${failedUploads} ไฟล์`);
    } else {
      setUploadDbMessage(`❌ ล้มเหลวทั้งหมด ${failedUploads} ไฟล์`);
    }
  };

  return isPasswordModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">🔒 ต้องระบุรหัสผ่าน</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              รหัสผ่าน:
            </label>
            <input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              placeholder="ป้อนรหัสผ่าน"
              required
            />
          </div>
          {passwordError && <p className="text-red-600 text-sm text-center mb-4">{passwordError}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">📤 อัปโหลดรูปภาพ</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">เลือกกิจกรรม (Event)</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">-- เลือกกิจกรรม --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.event_name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">ID ของ Cameraman *</label>
        <input
          type="text"
          value={cuserId}
          onChange={(e) => setCuserId(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="เช่น 1"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">เลือกรูปภาพสำหรับอัปโหลด</label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > MAX_FILES) {
              setUploadDbMessage(`❌ จำนวนไฟล์เกิน ${MAX_FILES}`);
              setUploadFilesToDb([]);
              e.target.value = '';
            } else {
              setUploadFilesToDb(files);
              setUploadDbMessage('');
            }
          }}
          className="block w-full text-sm text-gray-700 file:[background:var(--btn-solid)] file:p-2 file:text-white file:rounded-full"
        />
        {uploadFilesToDb.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">เลือก: {uploadFilesToDb.length} ไฟล์</p>
        )}
      </div>

      <button
        onClick={handleUploadToDatabase}
        disabled={uploadFilesToDb.length === 0 || isUploadingToDb}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg"
      >
        {isUploadingToDb ? 'กำลังอัปโหลด...' : `อัปโหลด ${uploadFilesToDb.length} ไฟล์`}
      </button>

      {uploadDbMessage && (
        <p className="mt-4 text-md text-center font-medium text-gray-800">{uploadDbMessage}</p>
      )}

    </div>
  );
}