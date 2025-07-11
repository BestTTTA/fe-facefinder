'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CuserImagesPage() {
  const { cuser_id } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/cusers/${cuser_id}/images`)
      .then(res => res.json())
      .then(data => setImages(data.images));
  }, [cuser_id]);

  return (
    <div>
      <h1>Images uploaded by CUser: {cuser_id}</h1>
      <ul>{images.map(i => <li key={i.img_id}>{i.img_url}</li>)}</ul>
    </div>
  );
}