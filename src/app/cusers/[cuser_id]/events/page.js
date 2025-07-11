'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CuserEventsPage() {
  const { cuser_id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/cusers/${cuser_id}/events`)
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, [cuser_id]);

  return (
    <div>
      <h1>Events uploaded by CUser: {cuser_id}</h1>
      <ul>{events.map(e => <li key={e.event_id}>{e.event_name} ({e.image_count} images)</li>)}</ul>
    </div>
  );
}