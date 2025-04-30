# IngredientForm.jsx

Formulaire pour créer ou modifier un ingrédient

## sous-composants

| Composant                | Rôle                                                  |
| ------------------------ | ----------------------------------------------------- |
| PriceByStoreList.jsx     | Affiche et gère la liste des prix par magasin         |
| CategorySelector.jsx     | Gère la sélection ou saisie de la catégorie           |
| IngredientFieldGroup.jsx | Affiche les champs nom, quantité, unité, marque, etc. |
| StorePriceInput.jsx      | Gère un seul champ { magasin, prix } avec validation  |

## useIngredientForm

```js
import useIngredientForm from "@/hooks/useIngredientForm";
```

Ce hook centralise toute la logique liée à la gestion du formulaire : états, changements, validation, etc.

- Initialisation du formData

- Gestion des champs (prix, nom, etc.)

- Validation (ex : prix corrects)

- jout/suppression de magasins
