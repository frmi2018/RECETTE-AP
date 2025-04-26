import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "ingredients.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const ingredients = JSON.parse(fileContent);
      res.status(200).json(ingredients);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la lecture des ingrédients" });
    }
  } else if (req.method === "POST") {
    try {
      const newIngredient = req.body; // 🎯 Le nouveau ingrédient à ajouter

      const fileContent = fs.readFileSync(filePath, "utf8");
      const ingredients = JSON.parse(fileContent);

      // Ajouter le nouveau ingrédient
      ingredients.push(newIngredient);

      // Sauvegarder le nouveau tableau dans ingredients.json
      fs.writeFileSync(filePath, JSON.stringify(ingredients, null, 2), "utf8");

      res.status(200).json({ message: "Ingrédient ajouté avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de l'ingrédient" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
