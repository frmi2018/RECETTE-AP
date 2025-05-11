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

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const ingredients = JSON.parse(fileContent);
    const ingredient = ingredients.find(item => item.id === numericId);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    if (method === "GET") {
      return res.status(200).json(ingredient);
    } else if (method === "PUT") {
      const updatedFields = req.body;
      const updatedIngredients = ingredients.map(item =>
        item.id === numericId ? { ...item, ...updatedFields } : item,
      );
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedIngredients, null, 2),
        "utf8",
      );
      return res
        .status(200)
        .json({ message: "Ingrédient mis à jour avec succès" });
    } else if (method === "DELETE") {
      const updatedIngredients = ingredients.filter(
        item => item.id !== numericId,
      );
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedIngredients, null, 2),
        "utf8",
      );
      return res
        .status(200)
        .json({ message: "Ingrédient supprimé avec succès" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Méthode ${method} non autorisée`);
    }
  } catch (error) {
    console.error("Erreur serveur lors de la gestion de l'ingrédient", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la gestion de l'ingrédient" });
  }
}
