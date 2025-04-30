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
      const newIngredient = req.body;
      const fileContent = fs.readFileSync(filePath, "utf8");
      const ingredients = JSON.parse(fileContent);

      ingredients.push(newIngredient);
      fs.writeFileSync(filePath, JSON.stringify(ingredients, null, 2), "utf8");

      res.status(200).json({ message: "Ingrédient ajouté avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de l'ingrédient" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, ...updatedFields } = req.body;
      const fileContent = fs.readFileSync(filePath, "utf8");
      const ingredients = JSON.parse(fileContent);

      const index = ingredients.findIndex(ing => ing.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Ingrédient non trouvé" });
      }

      ingredients[index] = { ...ingredients[index], ...updatedFields };
      fs.writeFileSync(filePath, JSON.stringify(ingredients, null, 2), "utf8");

      res.status(200).json({ message: "Ingrédient mis à jour avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de l'ingrédient" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      const fileContent = fs.readFileSync(filePath, "utf8");
      let ingredients = JSON.parse(fileContent);

      const initialLength = ingredients.length;
      ingredients = ingredients.filter(ing => ing.id !== id);

      if (ingredients.length === initialLength) {
        return res.status(404).json({ message: "Ingrédient non trouvé" });
      }

      fs.writeFileSync(filePath, JSON.stringify(ingredients, null, 2), "utf8");
      res.status(200).json({ message: "Ingrédient supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de l'ingrédient" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
