'use client';
import { useState } from 'react';

export default function CreateDUserPage() {
  const [form, setForm] = useState({ display_name: '' });

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/dusers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert((await res.json()).message);
  };

  return (
    <div>
      <h1>Create DUser</h1>
      <input name="display_name" onChange={e => setForm({ ...form, display_name: e.target.value })} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}