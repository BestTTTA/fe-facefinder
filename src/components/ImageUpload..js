import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

const ImageUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedPhotographer, setSelectedPhotographer] = useState('');
  const [events, setEvents] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    fetchEvents();
    fetchPhotographers();
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

  const fetchPhotographers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cusers`);
      if (response.ok) {
        const data = await response.json();
        setPhotographers(data.cusers);
      }
    } catch (error) {
      console.error('Error fetching photographers:', error);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isImage && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Math.random().toString(36),
      status: 'pending',
      preview: URL.createObjectURL(file)
    }))]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up preview URLs
      prev.forEach(f => {
        if (f.id === fileId && f.preview) {
          URL.revokeObjectURL(f.preview);
        }
      });
      return updated;
    });
  };

  const uploadFiles = async () => {
    if (!selectedEvent || !selectedPhotographer) {
      alert('กรุณาเลือก Event และช่างภาพ');
      return;
    }

    if (files.length === 0) {
      alert('กรุณาเลือกไฟล์รูปภาพ');
      return;
    }

    setUploading(true);
    const results = [];

    for (const fileObj of files) {
      try {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('cuser_id', selectedPhotographer);
        formData.append('event_id', selectedEvent);

        const response = await fetch(`${API_BASE_URL}/upload-to-db`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          results.push({
            ...fileObj,
            status: 'success',
            result: result
          });
        } else {
          const error = await response.text();
          results.push({
            ...fileObj,
            status: 'error',
            error: error
          });
        }
      } catch (error) {
        results.push({
          ...fileObj,
          status: 'error',
          error: error.message
        });
      }
    }

    setUploadResults(results);
    setUploading(false);
    
    // Call success callback if provided
    if (onUploadSuccess) {
      onUploadSuccess(results);
    }
  };

  const resetUpload = () => {
    files.forEach(f => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview);
      }
    });
    setFiles([]);
    setUploadResults([]);
    setSelectedEvent('');
    setSelectedPhotographer('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">อัปโลดรูปภาพ</h2>
      
      {/* Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event *</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">เลือก Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.event_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ช่างภาพ *</label>
          <select
            value={selectedPhotographer}
            onChange={(e) => setSelectedPhotographer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">เลือกช่างภาพ</option>
            {photographers.map((photographer) => (
              <option key={photographer.id} value={photographer.id}>
                {photographer.show_name || photographer.first_name || photographer.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-4" size={48} />
        <p className="text-lg mb-2">คลิกเพื่อเลือกไฟล์รูปภาพ</p>
        <p className="text-sm text-gray-500">รองรับ JPG, PNG, GIF (สูงสุด 10MB ต่อไฟล์)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">ไฟล์ที่เลือก ({files.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={fileObj.preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={uploading}
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">ผลการอัปโลด</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {result.status === 'success' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                  <div>
                    <p className="font-medium">{result.file.name}</p>
                    {result.status === 'success' && result.result && (
                      <p className="text-sm text-green-600">
                        พบใบหน้า {result.result.faces_found} หน้า
                      </p>
                    )}
                    {result.status === 'error' && (
                      <p className="text-sm text-red-600">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={uploadFiles}
          disabled={uploading || files.length === 0 || !selectedEvent || !selectedPhotographer}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Upload className="mr-2" size={16} />
          {uploading ? 'กำลังอัปโลด...' : 'อัปโลด'}
        </button>
        
        <button
          onClick={resetUpload}
          disabled={uploading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          รีเซ็ต
        </button>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">กำลังอัปโลดและประมวลผลรูปภาพ...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;