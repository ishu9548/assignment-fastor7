import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import FoodImage from "../components/FoodImage.jsx";
import { getItem } from "../services/restaurantService.js";
import { formatCurrency } from "../utils/validators.js";
import "../styles/detail.css";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(3);
  const [portionId, setPortionId] = useState("jumbo");
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    getItem(id).then((result) => !cancelled && setItem(result));
    return () => { cancelled = true; };
  }, [id]);

  if (!item) return <div className="page"><div className="spinner" aria-label="Loading" /></div>;

  const portion = item.portions.find((p) => p.id === portionId);
  const total = (item.price + portion.price) * quantity;

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("fastor_cart") || "[]");
      cart.push({ itemId: item.id, name: item.name, portion: portion.id, quantity, total });
      localStorage.setItem("fastor_cart", JSON.stringify(cart));
    } catch { /* storage unavailable: still confirm to the user */ }
    setToast(`Added ${quantity} × ${item.name} (${portion.label}) · ${formatCurrency(total)}`);
    setTimeout(() => navigate("/home"), 1400);
  };

  return (
    <div className="page detail-page">
      <div className="detail-back"><BackButton to="/home" /></div>
      <FoodImage src={item.image} emoji={item.emoji} alt={item.name} className="detail-img" />

      <div className="price-row">
        <span className="detail-price">{formatCurrency(item.price)}</span>
        <div className="stepper">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(20, q + 1))}>+</button>
        </div>
      </div>

      <h2 className="detail-heading">Lorem ipsum dolor sit amet</h2>
      <p className="detail-desc">{item.description}</p>

      <h3 className="portion-title">Personal portion</h3>
      <div role="radiogroup" aria-label="Portion size" className="portion-list">
        {item.portions.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === portionId}
            className="portion-row"
            onClick={() => setPortionId(p.id)}
          >
            <span className="portion-label">{p.label}</span>
            <span className="portion-line" />
            <span className="portion-price">${p.price.toFixed(2)}</span>
            <span className={p.id === portionId ? "radio radio--on" : "radio"} />
          </button>
        ))}
      </div>

      <div className="detail-bottom">
        <button className="btn-primary" onClick={addToCart}>Add to cart</button>
        <div className="home-indicator" />
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
