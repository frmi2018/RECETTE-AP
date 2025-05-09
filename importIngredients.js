// importIngredients.js
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importIngredients() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "data/ingredients.json");
    const rawData = fs.readFileSync(filePath);
    const ingredients = JSON.parse(rawData);

    for (const ingredient of ingredients) {
      const {
        id,
        nom,
        quantite,
        unite,
        categorie,
        unite_facturation,
        prix_par_magasin,
        image,
        marque,
      } = ingredient;

      // Insérer dans la table 'ingredients'
      const { data: ingredientData, error: ingredientError } = await supabase
        .from("ingredients")
        .insert([
          {
            id,
            nom,
            quantite,
            unite,
            categorie,
            unite_facturation,
            image,
            marque,
          },
        ]);

      if (ingredientError) {
        console.error(
          `Erreur lors de l'importation de l'ingrédient "${nom}":`,
          ingredientError.message,
        );
        continue;
      } else {
        console.log(
          `Ingrédient "${nom}" importé avec succès dans la table 'ingredients'.`,
        );
      }

      // Insérer les prix par magasin dans la table 'prix_par_magasin'
      for (const prix of prix_par_magasin) {
        const { magasin, prix: prixIngredient } = prix;

        const { error: priceError } = await supabase
          .from("prix_par_magasin")
          .insert([
            {
              ingredient_id: id,
              magasin,
              prix: prixIngredient,
            },
          ]);

        if (priceError) {
          console.error(
            `Erreur lors de l'importation du prix pour l'ingrédient "${nom}" chez "${magasin}":`,
            priceError.message,
          );
        } else {
          console.log(
            `Prix de l'ingrédient "${nom}" chez "${magasin}" importé avec succès.`,
          );
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'importation des ingrédients :", error);
  }
}

importIngredients();
