import { useState } from "react";

export default function CloseIcon({
  width = 24,
  height = 24,
  color = "red",
  onClick,
  className = "",
  style = {},
  label = "Fermer", // accessibilité
}) {
  const [hovered, setHovered] = useState(false);

  const hoverStyle = hovered
    ? { transform: "rotate(90deg)", opacity: 0.7 }
    : { transform: "rotate(0deg)", opacity: 1 };

  const defaultStyle = {
    cursor: "pointer",
    transition: "transform 0.2s ease, opacity 0.2s ease",
    ...hoverStyle,
    ...style,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="button"
      aria-label={label}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={defaultStyle}
      tabIndex={0} // rend le bouton focusable
      focusable="true"
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <title>{label}</title> {/* utile pour les lecteurs d'écran */}
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
