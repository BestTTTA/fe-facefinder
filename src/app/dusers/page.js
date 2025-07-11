'use client';
import { useEffect, useState } from 'react';

export default function DUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/dusers')
      .then(res => res.json())
      .then(data => setUsers(data.dusers));
  }, []);

  return (
    <div>
      <h1>Donor Users</h1>
      <ul>{users.map(u => <li key={u.id}>{u.display_name}</li>)}</ul>
    </div>
  );
}