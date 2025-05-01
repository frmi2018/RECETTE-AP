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
      const newRecipe = req.body;
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
  } else if (req.method === "PUT") {
    try {
      const { id, ...updatedFields } = req.body;
      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);

      const index = recipes.findIndex(rec => rec.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      recipes[index] = { ...recipes[index], ...updatedFields };
      fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf8");

      res.status(200).json({ message: "Recette mise à jour avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la recette" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      const fileContent = fs.readFileSync(filePath, "utf8");
      let recipes = JSON.parse(fileContent);

      const initialLength = recipes.length;
      recipes = recipes.filter(rec => rec.id !== id);

      if (recipes.length === initialLength) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf8");
      res.status(200).json({ message: "Recette supprimée avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de la recette" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
