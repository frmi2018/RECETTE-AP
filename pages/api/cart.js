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
      const { id, quantité_a_acheter } = req.body;

      if (typeof id !== "number" || typeof quantité_a_acheter !== "number") {
        return res.status(400).json({ message: "Format invalide" });
      }

      const fileContents = fs.readFileSync(cartFilePath, "utf8");
      const cart = JSON.parse(fileContents);

      const existingItemIndex = cart.findIndex(item => item.id === id);

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantité_a_acheter = quantité_a_acheter;
      } else {
        cart.push({ id, quantité_a_acheter });
      }

      fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), "utf8");
      res.status(200).json({ message: "Panier mis à jour avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (typeof id !== "number") {
        return res.status(400).json({ message: "ID invalide" });
      }

      const fileContents = fs.readFileSync(cartFilePath, "utf8");
      let cart = JSON.parse(fileContents);

      cart = cart.filter(item => item.id !== id);

      fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), "utf8");
      res.status(200).json({ message: `Ingrédient ${id} supprimé du panier` });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
