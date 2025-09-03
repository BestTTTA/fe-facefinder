import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Upload, Eye, Download } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

const ImageSearch = () => {
  const [searchFile, setSearchFile] = useState(null);
  const [searchPreview, setSearchPreview] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState('');
  const [events, setEvents] = useState([]);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSearchFile(file);
      setSearchPreview(URL.createObjectURL(file));
    }
  };

  const searchImage = async () => {
    if (!searchFile) {
      alert('กรุณาเลือกรูปภาพที่ต้องการค้นหา');
      return;
    }

    setSearching(true);
    setSearchResults(null);

    try {
      const formData = new FormData();
      formData.append('file', searchFile);
      if (selectedEventFilter) {
        formData.append('event_id', selectedEventFilter);
      }

      const response = await fetch(`${API_BASE_URL}/search-image`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      } else {
        const error = await response.text();
        alert(`เกิดข้อผิดพลาด: ${error}`);
      }
    } catch (error) {
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setSearching(false);
    }
  };

  const resetSearch = () => {
    if (searchPreview) {
      URL.revokeObjectURL(searchPreview);
    }
    setSearchFile(null);
    setSearchPreview(null);
    setSearchResults(null);
    setSelectedEventFilter('');
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const { statistics, matches } = searchResults;

    return (
      <div className="mt-8">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">ผลการค้นหา</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statistics.total_matches}</p>
              <p className="text-sm text-gray-600">ทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statistics.exact_matches}</p>
              <p className="text-sm text-gray-600">ตรงกันแน่นอน</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statistics.high_matches}</p>
              <p className="text-sm text-gray-600">ตรงกันสูง</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{statistics.partial_matches}</p>
              <p className="text-sm text-gray-600">ตรงกันบางส่วน</p>
            </div>
          </div>
        </div>

        {/* Exact Matches */}
        {matches.exact_matches.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4 text-green-800">
              ตรงกันแน่นอน ({matches.exact_matches.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matches.exact_matches.map((match, index) => renderMatchCard(match, index, 'exact'))}
            </div>
          </div>
        )}

        {/* High Matches */}
        {matches.high_matches.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4 text-yellow-800">
              ตรงกันสูง ({matches.high_matches.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matches.high_matches.map((match, index) => renderMatchCard(match, index, 'high'))}
            </div>
          </div>
        )}

        {/* Partial Matches */}
        {matches.partial_matches.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4 text-orange-800">
              ตรงกันบางส่วน ({matches.partial_matches.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matches.partial_matches.slice(0, 20).map((match, index) => renderMatchCard(match, index, 'partial'))}
            </div>
            {matches.partial_matches.length > 20 && (
              <p className="text-center text-gray-500 mt-4">
                แสดง 20 จาก {matches.partial_matches.length} รายการ
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMatchCard = (match, index, type) => {
    const borderColor = {
      exact: 'border-green-500',
      high: 'border-yellow-500',
      partial: 'border-orange-500'
    }[type];

    return (
      <div key={`${match.face_id}-${index}`} className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${borderColor}`}>
        <div className="relative aspect-square">
          <Image
            src={match.image.img_url}
            alt={`Match ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          <div className="absolute top-2 right-2">
            <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {(match.confidence * 100).toFixed(1)}%
            </span>
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={() => window.open(match.image.img_url, '_blank')}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => window.open(match.image.img_url, '_blank')}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-sm font-medium mb-1">
            {match.event?.event_name || 'ไม่ระบุ Event'}
          </p>
          <p className="text-xs text-gray-500 mb-1">
            ช่างภาพ: {match.user?.photographer_name || 'ไม่ระบุ'}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(match.face_create_at).toLocaleDateString('th-TH')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">ค้นหาใบหน้า</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Upload Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">อัปโลดรูปที่ต้องการค้นหา</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {searchPreview ? (
                <div className="relative">
                  <img
                    src={searchPreview}
                    alt="Search preview"
                    className="max-w-full max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    onClick={resetSearch}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto mb-4" size={48} />
                  <p className="mb-2">เลือกรูปภาพที่ต้องการค้นหา</p>
                  <p className="text-sm text-gray-500">รองรับ JPG, PNG, GIF</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Options Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">ตัวเลือกการค้นหา</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event (ไม่ระบุ = ค้นหาทุก Event)
                </label>
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">ทุก Event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>{event.event_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex gap-4">
          <button
            onClick={searchImage}
            disabled={searching || !searchFile}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Search className="mr-2" size={16} />
            {searching ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
          
          <button
            onClick={resetSearch}
            disabled={searching}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            รีเซ็ต
          </button>
        </div>

        {searching && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">กำลังค้นหาใบหน้าในฐานข้อมูล...</span>
          </div>
        )}

        {/* Search Results */}
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default ImageSearch;