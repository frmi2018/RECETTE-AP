import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const filePath = path.join(process.cwd(), "data", "cart.json");

const getUserId = req => {
  // UserId brute
  return "dfd4c05f-7d21-4c1e-b94b-d193b02ca007";
  // A utiliser quand connection supabase sera active
  return uuidv4();
};

export default function handler(req, res) {
  const userId = getUserId(req);

  if (req.method === "GET") {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const cart = JSON.parse(fileContent);

      const userCart = cart.filter(item => item.user_id === userId);

      res.status(200).json(userCart);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération du panier" });
    }
  } else if (req.method === "POST") {
    try {
      const { id, quantité_a_acheter } = req.body;

      if (typeof id !== "number" || typeof quantité_a_acheter !== "number") {
        return res.status(400).json({ message: "Format invalide" });
      }

      const fileContent = fs.readFileSync(filePath, "utf8");
      const cart = JSON.parse(fileContent);

      // Met à jour ou ajoute l'élément dans le panier
      const existingItemIndex = cart.findIndex(
        item => item.id === id && item.user_id === userId,
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantité_a_acheter = quantité_a_acheter;
      } else {
        cart.push({ id, quantité_a_acheter, user_id: userId });
      }

      fs.writeFileSync(filePath, JSON.stringify(cart, null, 2), "utf8");
      res.status(200).json({ message: "Panier mis à jour avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier", error);
      res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (typeof id !== "number") {
        return res.status(400).json({ message: "ID invalide" });
      }

      const fileContent = fs.readFileSync(filePath, "utf8");
      let cart = JSON.parse(fileContent);

      console.log(userId);
      cart = cart.filter(item => !(item.id === id && item.user_id === userId));

      fs.writeFileSync(filePath, JSON.stringify(cart, null, 2), "utf8");
      res.status(200).json({ message: `Ingrédient ${id} supprimé du panier` });
    } catch (error) {
      console.error("Erreur lors de la suppression du panier", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du panier" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
