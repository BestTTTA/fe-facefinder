'use client';
import { useState } from 'react';

export default function CreateCUserPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/cusers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert((await res.json()).message);
  };

  return (
    <div>
      <h1>Create CUser</h1>
      <input name="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input name="password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
