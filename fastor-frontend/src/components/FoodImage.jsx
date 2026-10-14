import { useState, useEffect } from "react";

// Shows the image if it loads; otherwise a fallback gradient with an emoji.
export default function FoodImage({ src, emoji = "🍽️", alt = "", className = "", style }) {
  const [failed, setFailed] = useState(false);

  // Reset failed state if src changes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={className}
        role="img"
        aria-label={alt}
        style={{
          ...style,
          display: "grid",
          placeItems: "center",
          fontSize: 32,
          background: "linear-gradient(135deg,#ffd9c2,#ffb48a)",
        }}
      >
        {emoji}
      </div>
    );
  }

  return (
    <img 
      className={className} 
      style={{ objectFit: "cover", width: "100%", height: "100%", ...style }} 
      src={src} 
      alt={alt} 
      onError={() => setFailed(true)} 
    />
  );
}