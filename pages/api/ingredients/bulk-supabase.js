import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  const { ids } = req.body;
  // console.log("IDs reçus dans l'API :", ids);

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every(id => Number.isInteger(id))
  ) {
    return res.status(400).json({ message: "IDs manquants ou incorrects" });
  }

  try {
    const { data, error } = await supabase
      .from("ingredients")
      .select("id, nom, quantite, unite, image, marque")
      .in("id", ids);

    // console.log("Données des ingrédients récupérées :", data);
    // console.log("Erreur Supabase :", error);

    if (error) {
      console.error("Erreur lors de la récupération des ingrédients :", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des ingrédients" });
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun ingrédient trouvé pour les IDs fournis" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des ingrédients",
    });
  }
}
