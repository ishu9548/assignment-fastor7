import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getHomeData } from "../services/restaurantService.js";
import { formatCurrency } from "../utils/validators.js";
import "../styles/home.css";

const BANNER_COUNT = 5;

export default function HomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(2);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    getHomeData()
      .then((result) => !cancelled && setData(result))
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) { logout(); return; }
        setError(err.message);
      });
    return () => { cancelled = true; };
  }, [logout]);

  useEffect(() => {
    const timer = setInterval(() => setBanner((b) => (b + 1) % BANNER_COUNT), 3500);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="page home-page" style={{ padding: 0 }}>
      <header className="home-header">
        <p className="loc-label">Current Locations</p>
        <p className="loc-value">Model Town, New Delhi</p>
      </header>

      <div className="home-body">
        <div className="search-row">
          <div className="name-card" role="search">Karan</div>
          <button className="icon-btn icon-btn--orange" aria-label="Call" onClick={() => showToast("Calling support...")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </button>
          <button className="icon-btn icon-btn--blue" aria-label="Wallet" onClick={() => showToast("Wallet coming soon")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="14" rx="3" /><path d="M16 13h2M2 10h20M5 6l11-3v3" />
            </svg>
          </button>
        </div>

        {!data && !error && <div className="spinner" aria-label="Loading" />}
        {error && <p className="error-text" role="alert" style={{ marginTop: 20 }}>{error}</p>}

        {data && (
          <>
            <h2 className="section-title">Best Seller</h2>
            <div className="best-row">
              {data.bestSellers.map((item) => (
                <Link key={item.id} to={`/item/${item.id}`} className="best-card">
                  <img src={item.image} alt={item.name} className="best-img" />
                  <span className="price-badge">{formatCurrency(item.price).replace(".00", ".0")}</span>
                </Link>
              ))}
            </div>

            <div className="promo" role="group" aria-label="Offer">
              <div className="promo-text">
                <p>Experience our<br />delicious new dish</p>
                <strong>30% OFF</strong>
              </div>
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Pizza offer" className="promo-img" />
            </div>
            <div className="dots" aria-hidden="true">
              {Array.from({ length: BANNER_COUNT }).map((_, i) => (
                <span key={i} className={i === banner ? "dot dot--on" : "dot"} />
              ))}
            </div>

            <h2 className="section-title section-title--popular">Popular Items</h2>
            <ul className="popular-list">
              {data.popular.map((item) => (
                <li key={item.id} className="popular-item">
                  <Link to={`/item/${item.id}`} className="popular-img-wrap">
                    <img src={item.image} alt={item.name} className="popular-img" />
                  </Link>
                  <div className="popular-info">
                    <div className="popular-top">
                      <span className="popular-name">{item.name}</span>
                      <span className="popular-price">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="popular-meta">
                      <span>{item.date}</span>
                      <span>{item.items} {item.items === 1 ? "item" : "items"}</span>
                    </div>
                    <div className="popular-actions">
                      <button className="pill pill--solid" onClick={() => showToast(`Order for ${item.name} cancelled`)}>Cancel Order</button>
                      <button className="pill pill--soft" onClick={() => showToast("Driver tracking will open here")}>Track Driver</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <button className="logout" onClick={() => { logout(); navigate("/signup"); }}>Log out</button>
          </>
        )}
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}