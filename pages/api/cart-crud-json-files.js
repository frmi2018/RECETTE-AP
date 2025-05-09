import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const cartFilePath = path.join(process.cwd(), "data", "cart.json");

// Fonction pour obtenir l'ID utilisateur unique ou créer un nouveau UUID
const getUserId = req => {
  // Pour le développement, on génère simplement un UUID anonyme
  return uuidv4();
};

export default function handler(req, res) {
  const userId = getUserId(req);

  if (req.method === "GET") {
    try {
      const fileContents = fs.readFileSync(cartFilePath, "utf8");
      const cart = JSON.parse(fileContents);
      const userCart = cart.filter(item => item.user_id === userId);
      res.status(200).json(userCart);
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

      const existingItemIndex = cart.findIndex(
        item => item.id === id && item.user_id === userId,
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantité_a_acheter = quantité_a_acheter;
      } else {
        cart.push({ id, quantité_a_acheter, user_id: userId });
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

      cart = cart.filter(item => !(item.id === id && item.user_id === userId));

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
