import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("API sans ID)");
    try {
      const { data, error } = await supabase.from("recipes").select("*");

      if (error) {
        console.error("Erreur lors de la récupération des recettes", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des recettes" });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(
        "Erreur serveur lors de la récupération des recettes",
        error,
      );
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des recettes",
      });
    }
  } else if (req.method === "POST") {
    try {
      const newRecipe = req.body;

      const { error } = await supabase.from("recipes").insert([newRecipe]);

      if (error) {
        console.error("Erreur lors de l'ajout de la recette", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout de la recette" });
      }

      res.status(200).json({ message: "Recette ajoutée avec succès" });
    } catch (error) {
      console.error("Erreur serveur lors de l'ajout de la recette", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de l'ajout de la recette" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
