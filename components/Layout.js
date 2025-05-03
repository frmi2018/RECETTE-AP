import Navigation from "./Navigation";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className="appContainer">
      <header>
        <h1>Application de Recettes</h1>
        <Navigation />
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <span>Réalisé en 2025 par MICHAUD Franck</span>
      </footer>
    </div>
  );
}
