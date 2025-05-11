import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "recipes.json");

const isUUID = id => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (!id) {
    return res.status(400).json({ message: "ID manquant" });
  }

  if (!isUUID(id)) {
    return res
      .status(400)
      .json({ message: "ID non valide. Un UUID est attendu." });
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const recipes = JSON.parse(fileContent);
    const recipe = recipes.find(item => item.id === id);

    if (!recipe) {
      return res
        .status(404)
        .json({ message: `Recette avec id ${id} introuvable` });
    }

    if (method === "GET") {
      return res.status(200).json(recipe);
    } else if (method === "PUT") {
      const updatedFields = req.body;
      const updatedRecipes = recipes.map(item =>
        item.id === id ? { ...item, ...updatedFields } : item,
      );
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedRecipes, null, 2),
        "utf8",
      );
      return res
        .status(200)
        .json({ message: "Recette mise à jour avec succès" });
    } else if (method === "DELETE") {
      const updatedRecipes = recipes.filter(item => item.id !== id);
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedRecipes, null, 2),
        "utf8",
      );
      return res.status(200).json({ message: "Recette supprimée avec succès" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Méthode ${method} non autorisée`);
    }
  } catch (error) {
    console.error("Erreur serveur lors de la gestion de la recette", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la gestion de la recette" });
  }
}
