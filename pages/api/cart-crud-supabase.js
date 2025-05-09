import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour obtenir l'ID utilisateur unique ou créer un nouveau UUID
const getUserId = req => {
  // Vérifier si l'utilisateur a un identifiant déjà stocké dans les cookies ou session
  // Si non, générer un UUID anonyme pour l'utilisateur
  return uuidv4();
};

export default async function handler(req, res) {
  const userId = getUserId(req);

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Erreur lors de la récupération du panier", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération du panier" });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur serveur lors de la récupération du panier", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la récupération du panier" });
    }
  } else if (req.method === "POST") {
    try {
      const { id, quantité_a_acheter } = req.body;

      if (typeof id !== "number" || typeof quantité_a_acheter !== "number") {
        return res.status(400).json({ message: "Format invalide" });
      }

      const { error } = await supabase
        .from("cart")
        .upsert([{ id, quantité_a_acheter, user_id: userId }]);

      if (error) {
        console.error("Erreur lors de l'ajout au panier", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout au panier" });
      }

      res.status(200).json({ message: "Panier mis à jour avec succès" });
    } catch (error) {
      console.error("Erreur serveur lors de l'ajout au panier", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de l'ajout au panier" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (typeof id !== "number") {
        return res.status(400).json({ message: "ID invalide" });
      }

      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        console.error("Erreur lors de la suppression du panier", error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression du panier" });
      }

      res.status(200).json({ message: `Ingrédient ${id} supprimé du panier` });
    } catch (error) {
      console.error("Erreur serveur lors de la suppression du panier", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la suppression du panier" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
