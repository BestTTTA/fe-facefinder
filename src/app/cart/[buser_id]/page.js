'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { buser_id } = useParams();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/cart/${buser_id}`)
      .then(res => res.json())
      .then(data => setCart(data.cart_items));
  }, [buser_id]);

  return (
    <div>
      <h1>Cart for {buser_id}</h1>
      <ul>{cart.map(item => <li key={item.cart_id}>{item.img_id}</li>)}</ul>
    </div>
  );
}
