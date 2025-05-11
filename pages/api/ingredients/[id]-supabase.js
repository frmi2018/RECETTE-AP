import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  if (method === "GET") {
    try {
      const { data, error } = await supabase
        .from("ingredients")
        .select("*")
        .eq("id", numericId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de l'ingrédient", error);
        return res.status(404).json({ message: "Ingrédient non trouvé" });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(
        "Erreur serveur lors de la récupération de l'ingrédient",
        error,
      );
      res
        .status(500)
        .json({
          message: "Erreur serveur lors de la récupération de l'ingrédient",
        });
    }
  } else if (method === "PUT") {
    try {
      const updatedFields = req.body;

      const { error } = await supabase
        .from("ingredients")
        .update(updatedFields)
        .eq("id", numericId);

      if (error) {
        console.error("Erreur lors de la mise à jour de l'ingrédient", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour de l'ingrédient" });
      }

      res.status(200).json({ message: "Ingrédient mis à jour avec succès" });
    } catch (error) {
      console.error(
        "Erreur serveur lors de la mise à jour de l'ingrédient",
        error,
      );
      res
        .status(500)
        .json({
          message: "Erreur serveur lors de la mise à jour de l'ingrédient",
        });
    }
  } else if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("ingredients")
        .delete()
        .eq("id", numericId);

      if (error) {
        console.error("Erreur lors de la suppression de l'ingrédient", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression de l'ingrédient" });
      }

      res.status(200).json({ message: "Ingrédient supprimé avec succès" });
    } catch (error) {
      console.error(
        "Erreur serveur lors de la suppression de l'ingrédient",
        error,
      );
      res
        .status(500)
        .json({
          message: "Erreur serveur lors de la suppression de l'ingrédient",
        });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
