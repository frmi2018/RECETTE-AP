# RecipeIngredients.jsx

![alt text](image.png)

## Description :

Affiche un tableau qui contient la liste des ingrédients de la recette.

## Utilisation :

```jsx
<RecipeIngredients ingredients={recipe.ingrédients} />
```

## Styles

```js
import styles from "./Recipe.module.css";
```

## sous-composants

```jsx
<div className={styles.ingredientGrid}>
  {selectedIngredients.map((ingredient, index) => (
    <div key={index} className={styles.ingredientCard}>
      <div className={styles.cardImageWrapper}>
        <img
          src={ingredient.image}
          alt={ingredient.nom}
          className={styles.cardImage}
        />
      </div>
      <div className={styles.cardContent}>
        <strong>{ingredient.nom}</strong>
        <div>
          {ingredient.quantité} {ingredient.unité}
        </div>
      </div>
    </div>
  ))}
</div>
```

## A venir
