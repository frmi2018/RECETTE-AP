# 🍲 RECETTE-APP

Application Next.js pour gérer des recettes de cuisine et les ingrédients associés.

---

[<img src="https://github.com/frmi2018/RECETTE-AP/blob/main/public/images/capture.png" width="240" height=auto>]

## 📁 Structure du projet

components/ # composants  
modules/ # fonctions utilitaires  
pages/  
public/images/recipes  
public/images/ingredients  
public/images/icons  
public/api/ recipes.json # Liste des recettes  
public/api/ ingredients.json # Liste des ingrédients  
styles/ globals.css # Styles globaux

## ✅ Fonctionnalités actuelles

- ✅ Affichage de 3 idées de recettes en page d'accueil
- ✅ Affichage des ingrédients
- ✅ Affichage des recettes
- ✅ Affichage des ingrédients en rupture de stock
- 📁 Importation de données mockées depuis JSON
- 🖼️ Support d’images statiques (via `public/images`)
- 📄 Pagination des recettes/ingrédients

## 🚀 Lancer le projet localement

```bash
npm install
npm run dev
```

L'application sera disponible sur http://localhost:3000.

## 🛠️ Tests

Fichiers de configuration présents pour Jest :

- 🧪 `jest.config.js` — Configuration principale de Jest
- ⚙️ `jest.setup.js` — Setup pour les tests (ex. mocks globaux, etc.)

## 🧠 À venir

- ➕➖ Ajout/suppression d'ingrédients/recettes
- 🔍 Composant de recherche
- ↕️ Composant de tri
- 🗄️ Connexion à une base de données

## ✍️ Auteur

Projet développé par Franck Michaud.
Ce projet a pour objectif d’expérimenter les fonctionnalités de Next.js le tout enrichi avec l’assistance de GitHub Copilot.
