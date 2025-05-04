import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const filePath = path.join(process.cwd(), "data", "recipes.json");

  if (method === "GET") {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);

      const recipe = recipes.find(r => r.id === parseInt(id));
      if (!recipe) {
        return res
          .status(404)
          .json({ message: `Recette avec id ${id} introuvable` });
      }

      res.status(200).json(recipe);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de la recette" });
    }
  } else if (method === "PUT") {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const recipes = JSON.parse(fileContent);

      const index = recipes.findIndex(r => r.id === parseInt(id));
      if (index === -1) {
        return res
          .status(404)
          .json({ message: `Recette avec id ${id} introuvable` });
      }

      const updatedFields = req.body;
      recipes[index] = { ...recipes[index], ...updatedFields };

      fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf8");
      res.status(200).json({ message: "Recette mise à jour avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la recette" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
