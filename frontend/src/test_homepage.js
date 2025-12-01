import { useEffect, useState } from "react";

export default function HomePage({ userId }) {
  const [products, setProducts] = useState([]);
  const [recs, setRecs] = useState([]);


  const token = localStorage.getItem('token');
  useEffect(() => {
    fetch(`http://localhost:5000/recommendations`, {headers: {'Authorization': `Bearer ${token}`}})
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setRecs(data.recommendations || []);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to ShopHub</h1>

      <section>
        <h2>Featured Products</h2>
        <div className="grid">
          {products.map(p => (
            <div key={p._id} className="card">
              <img src={p.img} alt={p.name} width="150" />
              <h3>{p.name}</h3>
              <p>{p.brand} - ${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {recs.length > 0 && (
        <section>
          <h2>Recommended For You</h2>
          <div className="grid">
            {recs.map(r => (
              <div key={r.id} className="card">
                <img src={r.img} alt={r.name} width="150" />
                <h3>{r.name}</h3>
                <p>{r.brand} - ${r.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
