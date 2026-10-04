# Menu QR Code - Premium Prototype

Un prototype premium pour un système de menu par QR code avec suivi de commande en temps réel.

## Caractéristiques
- **4 Restaurants Uniques** : Napoli Forno, Urban Grill, Dar El Bey, Sakura Bar.
- **Thèmes dynamiques** : Couleurs et typographies adaptées via des variables CSS.
- **Multilingue** : Français, Anglais et Arabe (avec support RTL automatique).
- **Suivi des commandes en temps réel** : Via `BroadcastChannel` pour un affichage synchronisé entre le client (`index.html`) et le staff (`staff.html`).
- **Accessibilité et Animations** : Skeleton loading, support de `prefers-reduced-motion`, pas de layout shifts (CLS).

## Lancement du prototype
1. Ouvrir `index.html` pour la vue client.
2. Ouvrir `staff.html` dans un autre onglet pour le dashboard de gestion.
3. Utiliser les sélecteurs de `index.html` pour changer de restaurant ou de langue.
4. Les commandes validées dans `index.html` apparaîtront dans `staff.html` où leur statut (Reçue, En préparation, Prête, Servie) peut être mis à jour en temps réel.

## Dépendances
- Playwright (pour l'assurance qualité et tests end-to-end)
- Images fournies (Unsplash)
