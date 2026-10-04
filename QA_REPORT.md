# Rapport d'Assurance Qualité (QA)

## Résumé
Les tests d'assurance qualité (QA) ont été effectués avec succès via **Playwright** suite aux ajustements exigés (menus complets et images distinctes).

## Statistiques par Restaurant
- **Napoli Forno** : 6 plats, 12 fichiers photos (6 photos distinctes déclinées en 2 tailles : 800w et 1600w).
- **Urban Grill** : 6 plats, 12 fichiers photos (6 photos distinctes déclinées en 2 tailles : 800w et 1600w).
- **Dar El Bey** : 6 plats, 12 fichiers photos (6 photos distinctes déclinées en 2 tailles : 800w et 1600w).
- **Sakura Bar** : 6 plats, 12 fichiers photos (6 photos distinctes déclinées en 2 tailles : 800w et 1600w).

Total : 24 plats, 48 fichiers images (soit 24 images distinctes en 2 résolutions). Les fichiers sont nommés selon l'ID du plat (ex. `nf-1-800.jpg`, `nf-1-1600.jpg`) et il n'y a aucun doublon.

## Configurations Testées
- **Restaurants** : Napoli Forno, Urban Grill, Dar El Bey, Sakura Bar.
- **Langues** : Français (LTR), Arabe (RTL).
- **Résolutions** :
  - Mobile : 375x812
  - Bureau : 1440x900

## Résultats des Vérifications Playwright
- ✅ **Chargement et validité des images** : Le test s'est assuré d'attendre le statut `.complete` de chaque image et a vérifié que le `naturalWidth` était strictement supérieur à `0`.
- ✅ **Absence de doublons** : Le test vérifie de manière exhaustive les métadonnées (`menus.json`) pour garantir qu'aucune ressource d'image n'est partagée.
- ✅ **Absence de chevauchement (Overlap)** : Le script de test vérifie les _bounding boxes_ de l'image, du texte (`.menu-item-info`) et du bouton d'ajout. Que ce soit en LTR (Français) ou en RTL (Arabe), les éléments ne se superposent pas grâce au modèle Flexbox sécurisé (`min-width: 0`).
- ✅ **Aucune erreur JavaScript dans la console** : Les scripts se chargent sans erreur.
- ✅ **Aucun débordement horizontal (overflow)** : L'interface est responsive et s'adapte sans créer de défilement horizontal.
- ✅ **Captures d'écran générées** : Les 16 captures pour chaque variante ont été régénérées avec succès dans le dossier `qa/`.

## Limites ou Problèmes Restants
- Les images étant issues de l'API Foodish (générées aléatoirement via le script), la cohérence sémantique n'est pas absolue (un Sushi peut avoir l'image d'un autre plat). Cela est acceptable pour le prototype technique, l'essentiel étant que chaque plat ait une photo réelle, téléchargée et non partagée.
- Le suivi des commandes est local (BroadcastChannel) et requiert donc que le Dashboard Staff et le Menu Client soient ouverts sur le même navigateur (onglets différents).

## Conclusion
Les exigences ont été intégralement respectées : le prototype UI est stable, riche (menus complets) et validé par des tests E2E stricts. Les 16 captures d'écran sont disponibles dans le dossier `qa/`.
