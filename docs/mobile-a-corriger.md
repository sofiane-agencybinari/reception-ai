# Mobile : problèmes relevés le 10/10 (iPhone 390×844, Chrome headless)

Page totale : ~32 000 px de haut sur mobile (beaucoup trop long).

1. **Récit iPhone** (`marketing/marketing-scroll-story.tsx`, piste `h-[1200vh]` = 10 128 px)
   - Aux étapes 03-04, le téléphone montre son dos, énorme, il remplit l'écran (rotateY -230 à -310).
   - Les cartes de légende en verre recouvrent le bas du téléphone.
   - À corriger : piste plus courte sur mobile (~700vh), `phoneScale` plus petit, rotation limitée sur mobile (pas de dos), légendes sous le téléphone.
2. **Journée avec Ligne** (`immersive/day-timeline.tsx`) : un écran entier vide (beige) avec seulement le libellé « 01 — Une journée avec Ligne » en bas, avant le contenu.
3. **Tout ce que fait Ligne** (`immersive/orb-journey.tsx`, pin 7 174 px) : un écran sombre vide avec l'orbe tout en bas avant le début.
4. **Avant / Avec** (`immersive/compare.tsx`, pin 5 275 px) : deux écrans de ciel étoilé vides avant le contenu.
5. Fondus Cuisine → Analytics : les deux écrans se superposent un moment (texte fantôme).

Script de capture : puppeteer-core + Chrome installé, viewport mobile, captures toutes les 760 px.
