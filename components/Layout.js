import Navigation from "./Navigation";

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <h1>Application de Recettes</h1>
        <Navigation />
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2025 Recette App</p>
      </footer>
    </div>
  );
}
