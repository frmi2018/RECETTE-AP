import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const filePath = path.join(process.cwd(), "data", "ingredients.json");

  if (method === "GET") {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const ingredients = JSON.parse(fileContent);

      // Rechercher la recette par ID
      const ingredient = ingredients.find(r => r.id === parseInt(id));

      if (!ingredient) {
        return res
          .status(404)
          .json({ message: `Ingrédient avec id ${id} introuvable` });
      }

      res.status(200).json(ingredient);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'ingrédient" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
