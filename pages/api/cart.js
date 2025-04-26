import fs from "fs";
import path from "path";

const cartFilePath = path.join(process.cwd(), "data", "cart.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    try {
      const fileContents = fs.readFileSync(cartFilePath, "utf8");
      const cart = JSON.parse(fileContents);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la lecture du panier" });
    }
  } else if (req.method === "POST") {
    try {
      const newItem = req.body;

      const fileContents = fs.readFileSync(cartFilePath, "utf8");
      const cart = JSON.parse(fileContents);

      // Recherche d'un ingrédient existant (par nom ici)
      const existingItemIndex = cart.findIndex(
        item => item.nom === newItem.nom,
      );

      if (existingItemIndex !== -1) {
        // Ingrédient déjà présent ➔ augmenter la quantité
        cart[existingItemIndex].quantité += newItem.quantité;
      } else {
        // Nouvel ingrédient ➔ ajout normal
        cart.push(newItem);
      }

      fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), "utf8");

      res.status(200).json({ message: "Panier mis à jour avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
