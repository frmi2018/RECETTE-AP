// importRecipes.js
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importRecipes() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "data/recipes.json");
    const rawData = fs.readFileSync(filePath);
    const recipes = JSON.parse(rawData);

    for (const recipe of recipes) {
      const {
        id,
        nom,
        ingredients,
        description,
        etapes,
        temps_préparation,
        temps_cuisson,
        portions,
        type,
        calories,
        régime,
        image,
      } = recipe;

      const { error } = await supabase.from("recipes").insert([
        {
          nom,
          ingredients,
          description,
          etapes,
          temps_preparation: temps_préparation,
          temps_cuisson,
          portions,
          type,
          calories,
          regime: régime,
          image,
        },
      ]);

      if (error) {
        console.error(
          `Erreur lors de l'importation de la recette "${nom}":`,
          error.message,
        );
      } else {
        console.log(`Recette "${nom}" importée avec succès.`);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'importation des recettes :", error);
  }
}

importRecipes();
