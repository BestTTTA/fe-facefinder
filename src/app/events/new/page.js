'use client';
import { useState } from 'react';

export default function CreateEventPage() {

  const [form, setForm] = useState({
    event_name: '',
    event_details: '',
    start_at: '',
    end_at: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  const add7Hours = (datetimeLocalStr) => {
    const date = new Date(datetimeLocalStr);
    date.setHours(date.getHours() + 7);
    return date.toISOString();
  };
  
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('event_name', form.event_name);
    formData.append('event_details', form.event_details);
    formData.append('start_at', add7Hours(form.start_at));
    formData.append('end_at', add7Hours(form.end_at));
    if (imageFile) formData.append('event_img', imageFile);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events`, {
        method: 'POST',
        body: formData
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to create event');
      alert(`Event created: ${data.event_name}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Event</h1>

      <input
        name="event_name"
        placeholder="Event Name"
        value={form.event_name}
        onChange={handleChange}
        className="block w-full border p-2 mb-2"
      />

      <textarea
        name="event_details"
        placeholder="Event Details"
        value={form.event_details}
        onChange={handleChange}
        className="block w-full border p-2 mb-2"
      />

      <label className="block mb-1">Start At (Thailand Time)</label>
      <input
        name="start_at"
        type="datetime-local"
        value={form.start_at}
        onChange={handleChange}
        className="block w-full border p-2 mb-2"
      />

      <label className="block mb-1">End At (Thailand Time)</label>
      <input
        name="end_at"
        type="datetime-local"
        value={form.end_at}
        onChange={handleChange}
        className="block w-full border p-2 mb-2"
      />

      <label className="block mb-1">Event Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full border p-2 mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Event
      </button>
    </div>
  );
}
