✅ Analyse et commentaires du composant UpdateIngredientForm

1. Initialisation des états :

```javascript
const [form, setForm] = useState({
  nom: "",
  quantité: "",
  unité: "",
  catégorie: "",
  unite_facturation: "Pièce",
  prix_par_magasin: [],
  image: "",
  marque: "",
});

const [newStore, setNewStore] = useState({ magasin: "", prix: "" });
const [editIndex, setEditIndex] = useState(null);
const [editStore, setEditStore] = useState({ magasin: "", prix: "" });
```

- form : État principal qui contient les informations de l'ingrédient.

- newStore : Gère le nouvel enregistrement magasin/prix avant son ajout à la liste prix_par_magasin.

- editIndex : Indice de l'élément en cours d'édition dans prix_par_magasin.

- editStore : Stocke les informations du magasin/prix en cours d'édition.

2. Effet pour initialiser le formulaire avec les données de l'ingrédient :

```javascript
useEffect(() => {
  if (ingredient) {
    setForm({
      nom: ingredient.nom || "",
      quantité: ingredient.quantité || "",
      unité: ingredient.unité || "",
      catégorie: ingredient.catégorie || "",
      unite_facturation: ingredient.unite_facturation || "Pièce",
      prix_par_magasin: ingredient.prix_par_magasin
        ? [...ingredient.prix_par_magasin]
        : [],
      image: ingredient.image || "/images/icons/pas-image.png",
      marque: ingredient.marque || "",
    });
  }
}, [ingredient]);
```

Objectif : Initialiser le formulaire lorsque l'ingrédient est chargé ou mis à jour.

Utilise ingredient comme dépendance pour recharger les informations.

Utilisation de l'opérateur ...? pour garantir que prix_par_magasin est bien un tableau.

3. Gestion des modifications des champs du formulaire :

```javascript
const handleChange = e => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};
```

Fonction générique pour mettre à jour les champs du formulaire.

Utilisée pour tous les input sauf ceux liés aux magasins/prix.

4. Gestion de l'ajout d'un magasin/prix :

```javascript
const handleAddStore = () => {
  if (!newStore.magasin.trim() || newStore.prix === "") {
    alert("Veuillez remplir les champs Magasin et Prix.");
    return;
  }

  setForm(prev => ({
    ...prev,
    prix_par_magasin: [
      ...prev.prix_par_magasin,
      { magasin: newStore.magasin.trim(), prix: parseFloat(newStore.prix) },
    ],
  }));

  setNewStore({ magasin: "", prix: "" });
};
```

Vérifie que les champs magasin et prix sont remplis.

Crée un nouvel objet prix_par_magasin en ajoutant le nouveau magasin/prix.

Réinitialise newStore après l'ajout.

5. Gestion de l'édition d'un magasin/prix :

```javascript
const handleSaveEdit = () => {
  if (!editStore.magasin.trim() || editStore.prix === "") {
    alert("Veuillez remplir les champs Magasin et Prix.");
    return;
  }

  const updatedPrices = [...form.prix_par_magasin];
  updatedPrices[editIndex] = {
    magasin: editStore.magasin.trim(),
    prix: parseFloat(editStore.prix),
  };

  setForm({ ...form, prix_par_magasin: updatedPrices });
  setEditIndex(null);
  setEditStore({ magasin: "", prix: "" });
};
```

Vérifie la validité des champs avant de sauvegarder les modifications.

Met à jour l'élément prix_par_magasin ciblé en utilisant editIndex.

Réinitialise editIndex et editStore après la modification.

6. Suppression d'un magasin/prix :

```javascript
const handleDeleteStore = index => {
  const updatedStores = [...form.prix_par_magasin];
  if (updatedStores.length > 1) {
    updatedStores.splice(index, 1);
    setForm(prev => ({
      ...prev,
      prix_par_magasin: updatedStores,
    }));
  }
};
```

Permet de supprimer une ligne de prix_par_magasin.

Vérifie qu'il reste au moins une ligne (sinon, la suppression est bloquée).

7. Gestion du changement d'image :

```javascript
const handleImageChange = e => {
  const file = e.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, image: imageUrl }));
  }
};
```

Crée un URL temporaire pour afficher l'image sélectionnée.

Met à jour le champ image du formulaire.

8. Gestion de la soumission du formulaire :

```javascript
const handleSubmit = async e => {
  e.preventDefault();
  if (!ingredient) return;

  try {
    const { prix_par_magasin, ...ingredientData } = form;

    const updatedIngredient = {
      ...ingredientData,
      quantité: parseFloat(form.quantité) || 0,
      prix_par_magasin,
    };

    await updateIngredient(ingredient.id, updatedIngredient);

    onUpdated && onUpdated();
    onCloseUpdate();
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'ingrédient :", err);
    alert("Erreur lors de la mise à jour de l'ingrédient.");
  }
};
```

Empêche la soumission si ingredient est null.

Extrait prix_par_magasin du formulaire pour le traiter séparément.

Convertit quantité en float pour s'assurer qu'il est bien un nombre.

Appelle la fonction updateIngredient pour mettre à jour l'ingrédient via l'API.

9. Interface utilisateur :
   La section prix_par_magasin affiche une liste de magasins/prix avec options Modifier et Supprimer.

Les boutons Enregistrer et Annuler sont visibles uniquement en mode édition.

La section d'ajout d'un magasin est séparée de la liste des magasins existants.

✅ 1. Extraction de la fonction de validation :
On crée une fonction utilitaire pour valider le prix à 2 décimales :

```javascript
const formatPrice = value => {
  let formatted = value;

  if (formatted.includes(".")) {
    const parts = formatted.split(".");
    if (parts[1].length > 2) {
      formatted = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
  }

  return formatted;
};
```

La fonction formatPrice :

Vérifie si le prix contient une décimale.

Limite les décimales à 2 chiffres maximum.

Gestion des erreurs API :

Renvoyer un message d'erreur plus précis (err.message) dans le catch.

Gestion de l'édition :

Désactiver le bouton Ajouter si editIndex est défini (pour éviter les conflits).

Accessibilité :

Ajouter des aria-labels pour les boutons Modifier, Supprimer et Ajouter.
