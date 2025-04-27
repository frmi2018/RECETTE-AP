let recette = {
  id: 2,
  nom: "Curry de Poulet",
  ingrédients: [9, 3, 4, 10, 11, 12, 7, 8],
  instructions: "Couper le poulet en cubes...",
  etapes: [
    "Couper le poulet en cubes.",
    "Chauffer l'huile dans une poêle, faire revenir l'oignon, l'ail et le gingembre.",
    "Ajouter le poulet et cuire jusqu'à ce qu'il soit doré.",
    "Incorporer la poudre de curry, le lait de coco, le sel et le poivre.",
    "Laisser mijoter pendant 20 minutes.",
    "Servir avec du riz.",
  ],
  temps_préparation: 20,
  temps_cuisson: 25,
  portions: 4,
  type: "plat principal",
  calories: 1850,
  régime: ["sans gluten", "sans lactose"],
  image: "/images/add-image.png",
};

// Ajouter une étape
recette.etapes.push("Parsemer de coriandre fraîche avant de servir.");

// Modifier l'étape 2
recette.etapes[2] =
  "Ajouter le poulet et cuire jusqu'à ce qu'il soit légèrement doré.";

// Supprimer l'étape 5
recette.etapes.splice(5, 1);

console.log(recette.etapes);
