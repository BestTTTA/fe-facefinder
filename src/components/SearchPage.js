"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function SearchPage({ eventId }) {
  const [searchFile, setSearchFile] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);
  const [mode, setMode] = useState("upload");
  const [searchResults, setSearchResults] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      closeCamera();
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  useEffect(() => {
    const initializeCameraStream = async () => {
      if (isCameraOpen) {
        setSearchFile(null);
        setPreviewImage(null);
        setSearchMessage("");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          } else {
            console.warn(
              "videoRef.current was null even after setting isCameraOpen to true. Retrying or handling differently."
            );
            closeCamera();
            setSearchMessage("❌ เกิดข้อผิดพลาดในการเตรียมกล้อง");
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setSearchMessage(
            "❌ ไม่สามารถเข้าถึงกล้องได้: โปรดตรวจสอบการอนุญาตของเบราว์เซอร์หรือไม่มีกล้อง"
          );
          closeCamera();
        }
      } else {
        closeCamera();
      }
    };

    initializeCameraStream();

    return () => {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      const video = videoRef.current;
      if (video) {
        video.srcObject = null;
      }
    };
  }, [isCameraOpen]);

  useEffect(() => {
    const storedConsent = localStorage.getItem("hasConsent");
    if (storedConsent === "true") {
      setHasConsent(true);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSearchFile(file);
    setSearchMessage("");
    if (isCameraOpen) closeCamera();

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    } else {
      setPreviewImage(null);
    }
  };

  const capturePhoto = () => {
    if (!hasConsent) {
      setSearchMessage("กรุณายอมรับเงื่อนไขการใช้งานก่อนดำเนินการต่อ");
      return;
    }
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera_capture.png", {
            type: "image/png",
          });
          setSearchFile(file);
          closeCamera();

          const objectUrl = URL.createObjectURL(file);
          setPreviewImage(objectUrl);
        } else {
          setSearchMessage("❌ ไม่สามารถจับภาพจากกล้องได้");
        }
      }, "image/png");
    } else {
      setSearchMessage("❌ กล้องไม่พร้อมสำหรับการจับภาพ");
    }
  };

  const handleSearchImage = async () => {
    if (!hasConsent) {
      setSearchMessage("กรุณายอมรับเงื่อนไขการใช้งานก่อนดำเนินการต่อ");
      return;
    }
    if (!searchFile) {
      setSearchMessage("โปรดเลือกรูปภาพหรือถ่ายภาพจากกล้องเพื่อค้นหา");
      return;
    }
    if (!eventId) {
      setSearchMessage("❌ ไม่พบ event_id ที่จำเป็นสำหรับการค้นหา");
      return;
    }

    const formData = new FormData();
    formData.append("file", searchFile);

    setIsSearching(true);
    setSearchMessage("กำลังค้นหาใบหน้าที่คล้ายกัน...");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API}/search-image?event_id=${eventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.results) {
        setSearchResults(response.data);
        setSearchMessage("");
      } else {
        setSearchMessage(
          `❌ ข้อผิดพลาด: ${
            response.data.message || "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการค้นหา"
          }`
        );
        setSearchResults(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchMessage(
        `❌ ไม่สามารถค้นหารูปภาพได้: ${
          err.response?.data?.detail || err.message
        }`
      );
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Modal for image preview and sliding
  const handleImageClick = (index) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };
  const handleClosePreview = () => setIsPreviewOpen(false);
  const handlePrev = () => setPreviewIndex((i) => Math.max(i - 1, 0));
  const handleNext = (images) =>
    setPreviewIndex((i) => Math.min(i + 1, images.length - 1));

  const handleClearImage = () => {
    setPreviewImage(null);
    setSearchFile(null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-heading font-bold mb-6 text-center text-secondary-dark">
        🔍 ค้นหาใบหน้าที่คล้ายกัน
      </h1>
      <p className="text-gray-700 mb-6 text-center text-sm">
        อัปโหลดรูปภาพจากไฟล์
        หรือถ่ายภาพจากกล้องเพื่อค้นหาใบหน้าที่คล้ายกันในฐานข้อมูล FaceMeNow
      </p>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          className={`py-2 px-6 w-full border border-gray-300 text-sm font-semibold rounded-l-full ${
            mode === "upload"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          style={
            mode === "upload"
              ? { background: "var(--btn-select-solid)" }
              : { background: "#f3f4f6" }
          }
          onClick={() => setMode("upload")}
        >
          อัพโหลดรูป
        </button>
        <button
          type="button"
          className={`py-2 px-6 w-full border border-gray-300 text-sm font-semibold rounded-r-full -ml-px ${
            mode === "camera"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          style={
            mode === "camera"
              ? { background: "var(--btn-select-solid)" }
              : { background: "#f3f4f6" }
          }
          onClick={() => setMode("camera")}
        >
          ถ่ายรูป
        </button>
      </div>

      {/* Upload Section */}
      {mode === "upload" && !previewImage && (
        <label
          htmlFor="search-file"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition mb-6"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-12 h-12 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4h6v4a1 1 0 01-1 1z"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">อัพโหลดรูป</span>
            </p>
            <p className="text-xs text-gray-500">
              คลิกที่นี่เพื่ออัปโหลดรูปภาพ
            </p>
          </div>
          <input
            id="search-file"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* Camera Section */}
      {mode === "camera" && !previewImage && (
        <div className="mb-6 flex justify-center">
          {!isCameraOpen ? (
            <button
              onClick={() => {
                setIsCameraOpen(true);
              }}
              className="h-40 w-40 flex outline-6 outline-offset-2 outline-double items-center flex-col outline-gray-500/50 justify-center bg-gray-100 gap-2 text-gray-500 font-bold py-3 px-6 rounded-lg text-lg shadow-md font-heading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25v1.5m-2.25 0h12a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25v-9A2.25 2.25 0 016 6.75zm6 3a3 3 0 100 6 3 3 0 000-6z"
                />
              </svg>
              เปิดกล้อง
              <p className="text-xs font-thin">กดที่นี่เพื่อเปิดกล้อง</p>
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <video
                ref={videoRef}
                className="w-full max-w-50 h-60 object-cover rounded-lg shadow-md mb-4"
                autoPlay
                playsInline
                muted
              ></video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <div className="flex space-x-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 [background:var(--btn-solid)] hover:bg-secondary-dark bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                >
                  ถ่าย
                </button>
                <button
                  onClick={closeCamera}
                  className="flex-1 bg-danger-DEFAULT bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Section */}
      {previewImage && (
        <div className="mb-6 text-center">
          <h2 className="text-base font-heading font-bold mb-2 text-primary-dark">
            ภาพที่เลือก/ถ่าย
          </h2>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-xs h-32 object-contain mx-auto rounded-lg shadow-md border border-gray-300"
          />
          <button
            onClick={handleClearImage}
            className="mt-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition inline-flex items-center justify-center"
            title="ล้างรูปภาพ"
            aria-label="ล้างรูปภาพ"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Consent Checkbox (moved below preview) */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="consent"
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => {
                setHasConsent(e.target.checked);
                localStorage.setItem("hasConsent", e.target.checked);
              }}
              className="w-4 h-4 text-primary-dark bg-gray-100 border-gray-300 rounded focus:ring-primary-dark"
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

      {searchMessage && (
        <p
          className={`mt-4 text-md font-medium text-center ${
            searchMessage.startsWith("❌")
              ? "text-danger-DEFAULT"
              : "text-secondary-dark"
          }`}
        >
          {searchMessage}
        </p>
      )}

      {/* Search Button */}
      <button
        onClick={handleSearchImage}
        className="w-full text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 text-lg shadow-md font-heading"
        style={{ background: "var(--btn-gradient)" }}
      >
        {isSearching ? "กำลังค้นหา..." : "เริ่มต้นค้นหาใบหน้า"}
      </button>

      {/* Search Results Section */}
      {searchResults &&
      searchResults.results &&
      searchResults.results.matches ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-center">
            ผลลัพธ์การค้นหา
          </h2>

          {/* Statistics */}
          {searchResults.results.statistics && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center text-lg font-semibold text-gray-800 mb-2">
                สถิติการค้นหา
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {searchResults.results.statistics.total_matches || 0}
                  </div>
                  <div className="text-sm text-gray-600">รวมทั้งหมด</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {searchResults.results.statistics.exact_matches || 0}
                  </div>
                  <div className="text-sm text-gray-600">ตรงกัน 100%</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">
                    {searchResults.results.statistics.high_matches || 0}
                  </div>
                  <div className="text-sm text-gray-600">ความคล้ายสูง</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">
                    {searchResults.results.statistics.partial_matches || 0}
                  </div>
                  <div className="text-sm text-gray-600">ความคล้ายปานกลาง</div>
                </div>
              </div>
            </div>
          )}

          {/* All Matches */}
          {(() => {
            const allMatches = [
              ...(searchResults.results.matches.exact_matches || []),
              ...(searchResults.results.matches.high_matches || []),
              ...(searchResults.results.matches.partial_matches || []),
            ];

            if (allMatches.length === 0) {
              return (
                <div className="mt-8 text-center text-gray-500">
                  ไม่พบผลลัพธ์การค้นหา
                </div>
              );
            }

            return (
              <div>
                <div className="mb-4 text-center text-lg font-semibold text-gray-800">
                  พบรูปภาพทั้งหมด: {allMatches.length} รายการ
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allMatches.map((match, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg p-4 shadow-md bg-white flex flex-col items-center text-center cursor-pointer"
                      onClick={() => handleImageClick(i)}
                    >
                      {match.image?.img_url && (
                        <div className="relative w-full h-48">
                          <img
                            src={match.image.img_url}
                            alt={`Match ${i + 1}`}
                            className="object-cover rounded-lg mb-3 shadow-sm w-full h-48"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {Math.round(match.confidence * 100)}%
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-2">
                        ความคล้าย: {Math.round(match.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview Modal */}
                {isPreviewOpen && (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-4 max-w-3xl w-full h-[500px] sm:h-[600px] overflow-auto relative flex flex-col items-center justify-center">
                      <button
                        onClick={handleClosePreview}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <div className="flex items-center justify-center w-full h-[60vh]">
                        <button
                          onClick={handlePrev}
                          disabled={previewIndex === 0}
                          className="p-2 text-gray-700 hover:text-blue-600 disabled:opacity-30"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                          </svg>
                        </button>

                        <div className="flex flex-col items-center mx-4">
                          <img
                            src={allMatches[previewIndex].image.img_url}
                            alt={`Preview ${previewIndex + 1}`}
                            className="object-contain rounded-lg shadow-md max-h-[60vh] max-w-full"
                          />
                          <div className="mt-2 text-sm text-gray-600">
                            ความคล้าย:{" "}
                            {Math.round(
                              allMatches[previewIndex].confidence * 100
                            )}
                            %
                          </div>
                          <a
                            href={allMatches[previewIndex].image.img_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            บันทึกรูปภาพ
                          </a>
                        </div>

                        <button
                          onClick={() => handleNext(allMatches)}
                          disabled={previewIndex === allMatches.length - 1}
                          className="p-2 text-gray-700 hover:text-blue-600 disabled:opacity-30"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ) : searchResults && !searchResults.results?.matches ? (
        <div className="mt-8 text-center text-gray-500">
          ไม่พบผลลัพธ์การค้นหา
        </div>
      ) : null}
    </div>
  );
}
