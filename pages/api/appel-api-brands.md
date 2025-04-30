## Appels à mettre dans le fichier modules/ingredients.js

GET /api/brands retourne toutes les marques.

```js
await remplaceBrand(["BONDUELLE", "D'AUCY"]);
```

POST /api/brands ajoute une marque si elle est nouvelle.

```js
await remplaceBrand(["BONDUELLE", "D'AUCY"]);
```

📝 PUT /api/brands remplace complètement la liste de marques.

```js
await remplaceBrand(["BONDUELLE", "D'AUCY"]);
```
