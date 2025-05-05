const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "ingredients.json");

try {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const ingredients = JSON.parse(fileContent);

  const fixedIngredients = ingredients.map(ingredient => ({
    ...ingredient,
    id:
      typeof ingredient.id === "string"
        ? parseInt(ingredient.id, 10)
        : ingredient.id,
  }));

  fs.writeFileSync(filePath, JSON.stringify(fixedIngredients, null, 2), "utf8");
  console.log("✅ Tous les IDs des ingrédients ont été convertis en nombres.");
} catch (err) {
  console.error(
    "❌ Erreur lors de la conversion des IDs des ingrédients :",
    err,
  );
}
