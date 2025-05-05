const fs = require("fs");
const path = require("path");

// Remonte d'un dossier pour atteindre /data/recipes.json
const filePath = path.join(__dirname, "..", "data", "recipes.json");

try {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const recipes = JSON.parse(fileContent);

  const fixedRecipes = recipes.map(recipe => ({
    ...recipe,
    id: typeof recipe.id === "string" ? parseInt(recipe.id, 10) : recipe.id,
  }));

  fs.writeFileSync(filePath, JSON.stringify(fixedRecipes, null, 2), "utf8");
  console.log("✅ Tous les IDs ont été convertis en nombres.");
} catch (err) {
  console.error("❌ Erreur lors de la conversion des IDs :", err);
}
