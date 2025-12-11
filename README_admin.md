# Commandes Admin – Mini RPG – Donjon Gamer

Les commandes admin sont des outils de **debug** cachés, destinés au formateur / dev.

Elles ne sont **jamais visibles dans l’UI** :  
👉 Pour les utiliser, tu dois :

1. Lancer le jeu dans ton navigateur.
2. Créer un personnage et entrer dans le donjon.
3. Dans la zone **Journal** (le bloc avec les logs), faire un **double-clic**.
4. Une boîte de dialogue apparaît.
5. Saisir une commande commençant par `/admin`.

Exemples rapides :
- `/admin help`
- `/admin potion 3`
- `/admin phoenix 1`
- `/admin gold 500`
- `/admin equip random`
- `/admin floor 3`
- `/admin tp 2 4`
- `/admin hp full`

---

## 1. Commande générale

### `/admin help`

Affiche dans le journal la liste des commandes disponibles et un résumé de leur usage.

---

## 2. Gestion de l’inventaire

### `/admin potion [n]`

Ajoute **n** potions de soin à l’inventaire.

- `n` optionnel, vaut **1** par défaut.
- Exemple :
  - `/admin potion` → 1 potion
  - `/admin potion 5` → 5 potions

---

### `/admin phoenix [n]`

Ajoute **n** **Ailes de Phénix** à l’inventaire.

- `n` optionnel, vaut **1** par défaut.
- Exemple :
  - `/admin phoenix` → 1 Aile
  - `/admin phoenix 2` → 2 Ailes

> L’Aile de Phénix :
> - ne peut être utilisée **qu’en cas de mort**,
> - soigne le héros à ~65% de ses HP max,
> - réinitialise la salle (nouveau combat).

---

### `/admin tent [n]`

Ajoute **n** tentes de campement à l’inventaire.

- `n` optionnel, vaut **1**.
- Exemple :
  - `/admin tent`
  - `/admin tent 3`

---

### `/admin equip random`

Ajoute **un équipement aléatoire** (arme/armure, normal ou rare) à l’inventaire.

- Exemple :
  - `/admin equip random`

---

## 3. Monnaie

### `/admin gold [n]`

Ajoute **n pièces de bronze** (automatiquement converties en or/argent/bronze) au héros.

- `n` optionnel, vaut **100**.
- Exemple :
  - `/admin gold` → 100 bronze
  - `/admin gold 500` → 500 bronze

---

## 4. Héros (HP / XP / niveau)

### `/admin hp full`

Soigne le héros à **100% de ses HP max**.

### `/admin hp X`

Fixe les HP actuels du héros à **X** (limités entre 0 et HP max).

- Exemple :
  - `/admin hp 10`
  - `/admin hp 1`

---

### `/admin xp X`

Ajoute **X points d’XP** au héros (passe par le système normal : `Hero.gainXp`).

- Exemple :
  - `/admin xp 50`
  - `/admin xp 500`

---

### `/admin level X`

Force le niveau du héros à **X** (≥ 1).

- Ajuste aussi `xpNext` approximativement.
- Recalcule les stats affichées.
- Exemple :
  - `/admin level 5`

---

## 5. Donjon & déplacement

### `/admin floor N`

Réinitialise complètement le donjon et place le héros à l’**étage N** (1 à 4).

- Exemple :
  - `/admin floor 2`
  - `/admin floor 4`

---

### `/admin tp X Y`

Téléporte le héros dans la **salle (X,Y)** de l’étage actuel.

- Les coordonnées vont de `0` à `5` (car donjon 6×6).
- La salle ciblée est marquée comme **découverte**, mais pas automatiquement en combat.
- Exemple :
  - `/admin tp 3 3`
  - `/admin tp 0 5`

---

## 6. Combat & Ennemi

### `/admin kill`

Tue immédiatement l’ennemi actuel (HP = 0 + résolution de fin de combat).

---

### `/admin spawn enemy`

Force un **combat normal** dans la salle actuelle :

- marque la salle comme **non nettoyée** (`cleared = false`) ;
- lance `Combat.startBattle()`.

---

### `/admin spawn boss`

Force la salle actuelle à devenir une **salle de boss** de l’étage :

- `room.isBoss = true`, `room.cleared = false` ;
- lance `Combat.startBattle()` contre le boss de cet étage.

---

## 7. Détails techniques

- Les commandes admin ne fonctionnent que si **un héros existe** (personnage créé).
- Les logs admin sont préfixés par `[ADMIN]` dans le journal.
- Toute commande invalide ou mal formée est signalée dans le journal.
- Les commandes sont **pensées pour le debug / la formation**, pas pour l’équilibrage de jeu.
