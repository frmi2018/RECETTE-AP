import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "ingredients.json");

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const readIngredients = () => {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  };

  const writeIngredients = ingredients => {
    fs.writeFileSync(filePath, JSON.stringify(ingredients, null, 2), "utf8");
  };

  if (method === "GET") {
    try {
      const ingredients = readIngredients();
      const ingredient = ingredients.find(ing => ing.id === numericId);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingrédient non trouvé" });
      }
      res.status(200).json(ingredient);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur lors de la lecture" });
    }
  } else if (method === "PUT") {
    try {
      const updatedFields = req.body;
      const ingredients = readIngredients();
      const index = ingredients.findIndex(ing => ing.id === numericId);
      if (index === -1) {
        return res.status(404).json({ message: "Ingrédient non trouvé" });
      }

      ingredients[index] = { ...ingredients[index], ...updatedFields };
      writeIngredients(ingredients);

      res.status(200).json({ message: "Ingrédient mis à jour avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la mise à jour" });
    }
  } else if (method === "DELETE") {
    try {
      let ingredients = readIngredients();
      const filtered = ingredients.filter(ing => ing.id !== numericId);
      if (filtered.length === ingredients.length) {
        return res.status(404).json({ message: "Ingrédient non trouvé" });
      }
      writeIngredients(filtered);
      res.status(200).json({ message: "Ingrédient supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la suppression" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
