import Navigation from "./Navigation";

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <h1>Application de Recettes</h1>
        <Navigation />
      </header>
      <main>{children}</main>
      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>Make in 2025 with</span>
        <img
          src="/images/icons/coeur.png"
          alt="heart-icon"
          style={{ height: "20px", width: "20px", margin: "0 5px" }}
        />
        <span>by MICHAUD Franck</span>
      </footer>
    </div>
  );
}
