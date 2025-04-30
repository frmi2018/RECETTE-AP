import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const router = useRouter();

  const links = [
    { href: "/", label: "Accueil", icon: "home.png" },
    {
      href: "/recipes",
      label: "Recettes",
      icon: "recipes.png",
    },
    {
      href: "/ingredients",
      label: "Ingrédients",
      icon: "ingredients.png",
    },
    {
      href: "/low-stock-ingredients",
      label: "Ingrédients : en rupture de stock",
      icon: "low-stock.png",
    },
    {
      href: "/shopping-cart",
      label: "Panier d'achats",
      icon: "shopping-cart.png",
    },
  ];

  return (
    <nav>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              style={{
                color: router.pathname === link.href ? "red" : "black",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Add a condition to check if the link is for adding an ingredient */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <img
                  src={`/images/icons/${link.icon}`}
                  alt={link.label}
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
              </div>
              <span style={{ textAlign: "center" }}>
                {link.label.includes(":") ? (
                  <>
                    {link.label.split(":")[0]}
                    <br />
                    {link.label.split(":")[1].trim()}
                  </>
                ) : (
                  link.label
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
