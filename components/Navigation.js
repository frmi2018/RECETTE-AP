import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const router = useRouter();

  const links = [
    { href: "/", label: "Accueil", icon: "home.png" },
    { href: "/recipes", label: "Recettes", icon: "recipes.png" },
    { href: "/ingredients", label: "Ingrédients", icon: "ingredients.png" },
    {
      href: "/shopping-cart",
      label: "Panier d'achats",
      icon: "icons8-panier-50.png",
    },
    {
      href: "/gestion-bdd",
      label: "Gestion bdd",
      icon: "icons8-base-de-données-50.png",
    },
  ];

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {links.map(link => {
          const isActive = router.pathname === link.href;
          return (
            <li key={link.href} className={styles.navItem}>
              <Link href={link.href} legacyBehavior>
                <a className={isActive ? styles.activeLink : styles.link}>
                  <div className={styles.navContent}>
                    <img
                      src={`/images/icons/${link.icon}`}
                      alt={link.label}
                      className={styles.icon}
                    />
                    <span className={styles.label}>
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
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
