import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "recipes.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    console.log("Methode GET");
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);
      res.status(200).json(recipes);
    } catch (error) {
      console.error("Erreur lors de la lecture des recettes", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la lecture des recettes" });
    }
  } else if (req.method === "POST") {
    try {
      const newRecipe = req.body;
      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);

      recipes.push(newRecipe);

      fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf8");

      res.status(200).json({ message: "Recette ajoutée avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la recette", error);
      res.status(500).json({ message: "Erreur lors de l'ajout de la recette" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
