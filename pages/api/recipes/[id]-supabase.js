import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Vérifie si une chaîne est un UUID
 * @param {string} id - L'ID à vérifier
 * @returns {boolean}
 */
const isUUID = id => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log("API avec ID :", id);

  if (!id) {
    return res.status(400).json({ message: "ID manquant" });
  }

  if (!isUUID(id)) {
    return res
      .status(400)
      .json({ message: "ID non valide. Un UUID est attendu." });
  }

  if (method === "GET") {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de la recette :", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération de la recette" });
      }

      if (!data) {
        return res
          .status(404)
          .json({ message: `Recette avec id ${id} introuvable` });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(
        "Erreur serveur lors de la récupération de la recette :",
        error,
      );
      res.status(500).json({
        message: "Erreur serveur lors de la récupération de la recette",
      });
    }
  } else if (method === "PUT") {
    try {
      const updatedFields = req.body;

      const { data, error } = await supabase
        .from("recipes")
        .update(updatedFields)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour de la recette :", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour de la recette" });
      }

      res
        .status(200)
        .json({ message: "Recette mise à jour avec succès", data });
    } catch (error) {
      console.error(
        "Erreur serveur lors de la mise à jour de la recette :",
        error,
      );
      res.status(500).json({
        message: "Erreur serveur lors de la mise à jour de la recette",
      });
    }
  } else if (method === "DELETE") {
    try {
      const { error } = await supabase.from("recipes").delete().eq("id", id);

      if (error) {
        console.error("Erreur lors de la suppression de la recette :", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression de la recette" });
      }

      res.status(200).json({ message: "Recette supprimée avec succès" });
    } catch (error) {
      console.error(
        "Erreur serveur lors de la suppression de la recette :",
        error,
      );
      res.status(500).json({
        message: "Erreur serveur lors de la suppression de la recette",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
