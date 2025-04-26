import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "recipes.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);
      res.status(200).json(recipes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la lecture des recettes" });
    }
  } else if (req.method === "POST") {
    try {
      const newRecipe = req.body; // 🎯 La nouvelle recette à ajouter

      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);

      // Ajouter la nouvelle recette
      recipes.push(newRecipe);

      // Sauvegarder le nouveau tableau dans recipes.json
      fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf8");

      res.status(200).json({ message: "Recette ajoutée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de la recette" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
