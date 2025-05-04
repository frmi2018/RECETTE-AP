import Navigation from "./Navigation";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Application de Recettes</h1>
        <Navigation />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>
          réalisé en 2025 avec{" "}
          <img
            src="/images/icons/coeur.png"
            alt="heart icon"
            className={styles.heartIcon}
          />{" "}
          par MICHAUD Franck
        </span>
      </footer>
    </div>
  );
}
