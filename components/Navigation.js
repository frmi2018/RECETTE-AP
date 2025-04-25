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
    { href: "/add-recipe", label: "Ajouter une recette", icon: "recipes.png" },
    {
      href: "/ingredients",
      label: "Ingrédients",
      icon: "ingredients.png",
    },
    {
      href: "/add-ingredient",
      label: "Ajouter un ingrédient",
      icon: "ingredients.png",
    },

    {
      href: "/low-stock-ingredients",
      label: "Ingrédients en rupture de stock",
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
            {/* Add a condition to check if the link is for adding an ingredient */}
            {(link.href === "/add-ingredient" ||
              link.href === "/add-recipe") && (
              <img
                src="/images/icons/add.png"
                alt={link.label}
                style={{
                  width: "25px",
                  height: "25px",
                  marginRight: "5px",
                }}
              />
            )}
            <img
              src={`/images/icons/${link.icon}`}
              alt={link.label}
              style={{
                width: "50px",
                height: "50px",
              }}
            />
            <Link
              href={link.href}
              style={{
                color: router.pathname === link.href ? "red" : "black",
                textDecoration: "none",
                display: "flex",
                justifyItems: "center",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
