import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "ingredients.json");

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  const { ids } = req.body;

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every(id => Number.isInteger(id))
  ) {
    return res.status(400).json({ message: "IDs manquants ou incorrects" });
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const ingredients = JSON.parse(fileContent);

    const filteredIngredients = ingredients.filter(ingredient =>
      ids.includes(ingredient.id),
    );

    if (filteredIngredients.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun ingrédient trouvé pour les IDs fournis" });
    }

    res.status(200).json(filteredIngredients);
  } catch (error) {
    console.error(
      "Erreur serveur lors de la récupération des ingrédients",
      error,
    );
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la récupération des ingrédients",
      });
  }
}
