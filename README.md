# FIRST BLING

Application e-commerce streetwear React + Tailwind CSS, pensée mobile-first.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse indiquée par Vite.

## Build production

```bash
npm run build
npm run preview
```

## Fonctionnalités

- Accueil FIRST BLING noir et or
- Catalogue produits
- Recherche
- Filtres catégorie / prix / taille
- Pages produits
- Sélection de taille
- Panier persistant dans localStorage
- Quantités et suppression
- Frais de livraison : 1 500 FCFA, offerts dès 30 000 FCFA
- Checkout simulé
- Paiement à la livraison ou Mobile Money simulé
- Confirmation de commande
- Responsive mobile-first
- Assets SVG locaux, donc pas de dépendance à des images externes

## Personnalisation

Les produits et prix se trouvent dans `src/main.jsx`, dans le tableau `products`.
Les visuels locaux sont dans `public/products/`.
