import fs from "fs";
import path from "path";

const brandFilePath = path.join(process.cwd(), "data", "brand.json");

export default function handler(req, res) {
  // ✅ Lire la liste des marques
  if (req.method === "GET") {
    try {
      const fileData = fs.readFileSync(brandFilePath, "utf-8");
      const brands = JSON.parse(fileData);
      return res.status(200).json({ success: true, brands });
    } catch (error) {
      console.error("Erreur lecture marques :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // ✅ Ajouter une marque si elle n'existe pas encore
  if (req.method === "POST") {
    const { newBrand } = req.body;

    if (!newBrand || typeof newBrand !== "string") {
      return res.status(400).json({ error: "Marque invalide" });
    }

    try {
      const fileData = fs.readFileSync(brandFilePath, "utf-8");
      const brands = JSON.parse(fileData);

      const normalized = newBrand.trim().toUpperCase();
      const exists = brands.some(b => b.trim().toUpperCase() === normalized);

      if (!exists) {
        brands.push(normalized);
        brands.sort((a, b) => a.localeCompare(b, "fr"));
        fs.writeFileSync(brandFilePath, JSON.stringify(brands, null, 2));
        return res.status(201).json({ success: true, added: true });
      }

      return res.status(200).json({ success: true, added: false });
    } catch (error) {
      console.error("Erreur écriture marque :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // ✅ Remplacer entièrement la liste des marques
  if (req.method === "PUT") {
    const { brands } = req.body;

    if (!Array.isArray(brands)) {
      return res
        .status(400)
        .json({ error: "Format de données invalide (tableau attendu)" });
    }

    try {
      const cleaned = brands
        .map(b => b?.trim()?.toUpperCase())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "fr"));

      fs.writeFileSync(brandFilePath, JSON.stringify(cleaned, null, 2));
      return res.status(200).json({ success: true, updated: true });
    } catch (error) {
      console.error("Erreur mise à jour marques :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // ❌ Méthode non autorisée
  res.setHeader("Allow", ["GET", "POST", "PUT"]);
  return res.status(405).end(`Méthode ${req.method} non autorisée`);
}
