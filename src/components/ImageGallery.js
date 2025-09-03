// components/ImageGallery.js
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Filter, Search, Eye, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

const ImageGallery = () => {
  // State management
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  // Filter state
  const [filters, setFilters] = useState({
    event_id: '',
    cuser_id: '',
    start_date: '',
    end_date: '',
    month: '',
    year: new Date().getFullYear(),
    has_faces: null,
    processed: null,
    sort_by: 'newest'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [events, setEvents] = useState([]);
  const [photographers, setPhotographers] = useState([]);

  // Fetch data functions
  const fetchImages = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/images?${params}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      
      const data = await response.json();
      setImages(data.images);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/images/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchPhotographers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cusers`);
      if (!response.ok) throw new Error('Failed to fetch photographers');
      const data = await response.json();
      setPhotographers(data.cusers);
    } catch (err) {
      console.error('Error fetching photographers:', err);
    }
  };

  const fetchImageDetails = async (imageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${imageId}`);
      if (!response.ok) throw new Error('Failed to fetch image details');
      const data = await response.json();
      setSelectedImage(data);
    } catch (err) {
      console.error('Error fetching image details:', err);
    }
  };

  const deleteImage = async (imageId) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      
      // Refresh the image list
      fetchImages(currentPage);
      fetchStats();
      alert('ลบรูปภาพเรียบร้อยแล้ว');
      
    } catch (err) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchImages(1);
  };

  const handleResetFilters = () => {
    setFilters({
      event_id: '',
      cuser_id: '',
      start_date: '',
      end_date: '',
      month: '',
      year: new Date().getFullYear(),
      has_faces: null,
      processed: null,
      sort_by: 'newest'
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchImages(newPage);
    }
  };

  // Effects
  useEffect(() => {
    fetchImages();
    fetchStats();
    fetchEvents();
    fetchPhotographers();
  }, []);

  // Render functions
  const renderFilters = () => (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="mr-2" size={20} />
        ตัวกรองการค้นหา
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
          <select
            value={filters.event_id}
            onChange={(e) => handleFilterChange('event_id', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุก Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.event_name}</option>
            ))}
          </select>
        </div>

        {/* Photographer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ช่างภาพ</label>
          <select
            value={filters.cuser_id}
            onChange={(e) => handleFilterChange('cuser_id', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุกคน</option>
            {photographers.map((photographer) => (
              <option key={photographer.id} value={photographer.id}>
                {photographer.show_name || photographer.first_name || photographer.email}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันที่เริ่ม</label>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันที่สิ้นสุด</label>
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Month and Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เดือน</label>
          <select
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุกเดือน</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(2024, i, 1).toLocaleDateString('th-TH', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ปี</label>
          <input
            type="number"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            min="2020"
            max="2030"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Has Faces Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">มีใบหน้า</label>
          <select
            value={filters.has_faces === null ? '' : filters.has_faces.toString()}
            onChange={(e) => handleFilterChange('has_faces', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทั้งหมด</option>
            <option value="true">มีใบหน้า</option>
            <option value="false">ไม่มีใบหน้า</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เรียงตาม</label>
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">ใหม่สุด</option>
            <option value="oldest">เก่าสุด</option>
            <option value="most_faces">มีใบหน้ามากสุด</option>
            <option value="event_name">ชื่อ Event</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Search className="mr-2" size={16} />
          ค้นหา
        </button>
        <button
          onClick={handleResetFilters}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          รีเซ็ต
        </button>
      </div>
    </div>
  );

  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">รูปทั้งหมด</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total_images?.toLocaleString()}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">มีใบหน้า</h3>
          <p className="text-2xl font-bold text-green-600">{stats.images_with_faces?.toLocaleString()}</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800">ไม่มีใบหน้า</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.images_without_faces?.toLocaleString()}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">หน้าปัจจุบัน</h3>
          <p className="text-2xl font-bold text-purple-600">{currentPage} / {totalPages}</p>
        </div>
      </div>
    );
  };

  const renderImageGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 aspect-square rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ไม่พบรูปภาพ</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={image.img_url}
                alt={`Image ${image.id}`}
                fill
                className="object-cover cursor-pointer"
                onClick={() => fetchImageDetails(image.id)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchImageDetails(image.id);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(image.img_url, '_blank');
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(image.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm truncate">
                  {image.event_name || 'No Event'}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {image.face_count} หน้า
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mb-1">
                ช่างภาพ: {image.photographer_name || 'Unknown'}
              </p>
              
              <p className="text-xs text-gray-400">
                {new Date(image.create_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      
      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }
      
      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }
      
      rangeWithDots.push(...range);
      
      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
      
      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-700">
          แสดง {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} จาก {totalCount.toLocaleString()} รูป
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              disabled={page === '...'}
              className={`px-3 py-1 rounded-md text-sm ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'cursor-default'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">แสดง:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
              fetchImages(1);
            }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">รูป/หน้า</span>
        </div>
      </div>
    );
  };

  const renderImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">รายละเอียดรูปภาพ</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-square">
                <Image
                  src={selectedImage.img_url}
                  alt="Selected image"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">ข้อมูลทั่วไป</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="font-medium">Event:</span> {selectedImage.event_name || 'ไม่ระบุ'}</p>
                    <p><span className="font-medium">ช่างภาพ:</span> {selectedImage.photographer_name || 'ไม่ระบุ'}</p>
                    <p><span className="font-medium">จำนวนใบหน้า:</span> {selectedImage.face_count}</p>
                    <p><span className="font-medium">ประมวลผลแล้ว:</span> {selectedImage.processed ? 'ใช่' : 'ไม่'}</p>
                    <p><span className="font-medium">อัปโลดเมื่อ:</span> {new Date(selectedImage.create_at).toLocaleDateString('th-TH')}</p>
                  </div>
                </div>
                
                {selectedImage.faces && selectedImage.faces.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700">ใบหน้าที่พบ</h3>
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      {selectedImage.faces.map((face, index) => (
                        <div key={face.id} className="text-sm py-1">
                          Face {index + 1}: Confidence {face.confidence_score?.toFixed(2) || 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <a
                    href={selectedImage.img_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Download className="mr-2" size={16} />
                    ดาวน์โหลด
                  </a>
                  <button
                    onClick={() => {
                      deleteImage(selectedImage.id);
                      setSelectedImage(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <Trash2 className="mr-2" size={16} />
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">จัดการรูปภาพ</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Filter className="mr-2" size={16} />
          {showFilters ? 'ซ่อน' : 'แสดง'}ตัวกรอง
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          เกิดข้อผิดพลาด: {error}
        </div>
      )}

      {/* Statistics */}
      {renderStats()}

      {/* Filters */}
      {renderFilters()}

      {/* Image Grid */}
      {renderImageGrid()}

      {/* Pagination */}
      {renderPagination()}

      {/* Image Modal */}
      {renderImageModal()}
    </div>
  );
};

export default ImageGallery;