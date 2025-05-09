import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("ingredients").select("*");

      if (error) {
        console.error("Erreur lors de la récupération des ingrédients", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des ingrédients" });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(
        "Erreur serveur lors de la récupération des ingrédients",
        error,
      );
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des ingrédients",
      });
    }
  } else if (req.method === "POST") {
    try {
      const newIngredient = req.body;

      const { error } = await supabase
        .from("ingredients")
        .insert([newIngredient]);

      if (error) {
        console.error("Erreur lors de l'ajout de l'ingrédient", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout de l'ingrédient" });
      }

      res.status(200).json({ message: "Ingrédient ajouté avec succès" });
    } catch (error) {
      console.error("Erreur serveur lors de l'ajout de l'ingrédient", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de l'ajout de l'ingrédient" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
