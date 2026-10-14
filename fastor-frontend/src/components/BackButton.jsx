import { useNavigate } from "react-router-dom";

export default function BackButton({ to }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      style={{ width: 28, height: 28, display: "grid", placeItems: "center", marginTop: 14 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7a2f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
