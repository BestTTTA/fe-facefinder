'use client';
import { useEffect, useState } from 'react';

export default function CUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/cusers')
      .then(res => res.json())
      .then(data => setUsers(data.cusers));
  }, []);

  return (
    <div>
      <h1>Camera Users</h1>
      <ul>{users.map(u => <li key={u.id}>{u.email}</li>)}</ul>
    </div>
  );
}
