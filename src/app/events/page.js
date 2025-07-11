'use client';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events`)
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, []);

  return (
    <div>
      <h1>All Events</h1>
      <ul>
        {events.map(e => (
          <li key={e.id}>{e.event_name}</li>
        ))}
      </ul>
    </div>
  );
}
