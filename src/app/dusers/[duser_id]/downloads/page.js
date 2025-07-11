'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DuserDownloads() {
  const { duser_id } = useParams();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/dusers/${duser_id}/downloads`)
      .then(res => res.json())
      .then(data => setDownloads(data.downloads_by_event));
  }, [duser_id]);

  return (
    <div>
      <h1>Downloads by {duser_id}</h1>
      <ul>
        {downloads.map(event => (
          <li key={event.event_id}>{event.event_name} - {event.images_in_cart} images</li>
        ))}
      </ul>
    </div>
  );
}