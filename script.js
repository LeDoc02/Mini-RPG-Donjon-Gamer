// MINI RPG – DONJON GAMER V5 (pseudo-modules)
// Donjon multi-étages + pièces + marchand + sorts + compétences
// Système de combat inspiré D&D 5e + Création de personnage + Aile de Phénix

document.addEventListener("DOMContentLoaded", () => {
  // --- Modèles de héros ---
  const heroTemplates = {
    warrior: {
      key: "warrior",
      name: "Guerrier",
      description:
        "Beaucoup de HP, dégâts corrects. Stable et solide pour débuter.",
      baseMaxHp: 130,
      baseAtk: 12,
      critChance: 0.15,
      startingPotions: 1,
      stats: { STR: 14, DEX: 10, INT: 8, VIT: 12 }
    },
    mage: {
      key: "mage",
      name: "Mage",
      description:
        "Peu de HP mais gros dégâts à distance. Idéal pour illustrer les risques/récompenses.",
      baseMaxHp: 80,
      baseAtk: 20,
      critChance: 0.2,
      startingPotions: 2,
      stats: { STR: 8, DEX: 10, INT: 16, VIT: 10 }
    },
    rogue: {
      key: "rogue",
      name: "Voleur",
      description:
        "Dégâts moyens mais forte chance de critique. Parfait pour parler de probabilités.",
      baseMaxHp: 90,
      baseAtk: 14,
      critChance: 0.3,
      startingPotions: 1,
      stats: { STR: 10, DEX: 16, INT: 10, VIT: 10 }
    }
  };

  // --- Bestiaire ---
  const floorEnemies = {
    1: [
      { name: "Rat géant", maxHp: 35, atk: 5, xp: 18 },
      { name: "Slime", maxHp: 45, atk: 6, xp: 22 },
      { name: "Gobelin", maxHp: 55, atk: 8, xp: 28 }
    ],
    2: [
      { name: "Orc éclaireur", maxHp: 70, atk: 11, xp: 40 },
      { name: "Chauve-souris vampirique", maxHp: 65, atk: 13, xp: 42 },
      { name: "Garde squelette", maxHp: 80, atk: 14, xp: 50 }
    ],
    3: [
      { name: "Mage noir", maxHp: 85, atk: 18, xp: 65 },
      { name: "Chevalier maudit", maxHp: 110, atk: 17, xp: 75 },
      { name: "Ogre enragé", maxHp: 130, atk: 20, xp: 85 }
    ],
    4: [
      { name: "Démon mineur", maxHp: 140, atk: 22, xp: 100 },
      { name: "Garde royal spectral", maxHp: 150, atk: 23, xp: 110 },
      { name: "Dragonnet ancien", maxHp: 165, atk: 24, xp: 120 }
    ]
  };

  // --- Loot d'équipement normal ---
  const lootTable = [
    { name: "Épée rouillée", slot: "weapon", atkBonus: 4, hpBonus: 0 },
    { name: "Épée en acier", slot: "weapon", atkBonus: 7, hpBonus: 0 },
    { name: "Bâton de novice", slot: "weapon", atkBonus: 5, hpBonus: 0 },
    { name: "Dague rapide", slot: "weapon", atkBonus: 3, hpBonus: 0 },
    { name: "Armure en cuir", slot: "armor", atkBonus: 0, hpBonus: 15 },
    { name: "Armure en maille", slot: "armor", atkBonus: 0, hpBonus: 25 },
    { name: "Cape mystique", slot: "armor", atkBonus: 2, hpBonus: 10 }
  ];

  // --- Loot rare du boss ---
  const rareLootTable = [
    {
      name: "Épée légendaire du Donjon",
      slot: "weapon",
      atkBonus: 12,
      hpBonus: 10,
      rare: true
    },
    {
      name: "Armure draconique",
      slot: "armor",
      atkBonus: 4,
      hpBonus: 40,
      rare: true
    },
    {
      name: "Anneau mystique ancien",
      slot: "weapon",
      atkBonus: 6,
      hpBonus: 20,
      rare: true
    },
    {
      name: "Aile de Phénix",
      type: "consumable",
      special: "roomReset"
    }
  ];

  // --- Marchand ---
  const shopItems = [
    {
      id: "potion",
      name: "Potion de soin",
      type: "potion",
      price: 30
    },
    {
      id: "tent",
      name: "Tente de campement",
      type: "tent",
      price: 100
    },
    {
      id: "sword_simple",
      name: "Épée simple",
      type: "equip",
      slot: "weapon",
      atkBonus: 6,
      hpBonus: 0,
      price: 120
    },
    {
      id: "armor_light",
      name: "Armure légère",
      type: "equip",
      slot: "armor",
      atkBonus: 0,
      hpBonus: 20,
      price: 110
    }
  ];

  // --- Quêtes ---
  const questTemplates = [
    {
      id: 1,
      title: "Première victoire",
      description: "Gagner au moins un combat.",
      check: (gs) => gs.stats.wins >= 1
    },
    {
      id: 2,
      title: "Alchimiste",
      description: "Utiliser au moins une potion.",
      check: (gs) => gs.stats.potionsUsed >= 1
    },
    {
      id: 3,
      title: "Explorateur",
      description: "Découvrir au moins 8 salles du donjon.",
      check: (gs) => gs.dungeon.discoveredCount >= 8
    },
    {
      id: 4,
      title: "Chasseur de monstres",
      description: "Vaincre 5 ennemis.",
      check: (gs) => gs.stats.wins >= 5
    }
  ];

  // --- Compétences ---
  const skillDefs = [
    {
      id: "strMastery",
      label: "Maîtrise de la Force",
      desc: "+2 FOR par niveau (augmente dégâts & PV).",
      max: 5
    },
    {
      id: "dexMastery",
      label: "Maîtrise de la Dextérité",
      desc: "+2 DEX par niveau (augmente critiques & esquive).",
      max: 5
    },
    {
      id: "intMastery",
      label: "Maîtrise de l'Intelligence",
      desc: "+2 INT par niveau (dégâts de sorts, nouveaux sorts).",
      max: 5
    },
    {
      id: "dodgeMastery",
      label: "Maîtrise de l'esquive",
      desc: "Augmente la probabilité d'esquiver les attaques.",
      max: 5
    }
  ];

  // --- Sorts du mage ---
  const spellDefs = {
    "Soin mineur": { type: "heal", amount: 25 },
    "Soin majeur": { type: "heal", amount: 45 },
    "Boule de feu": { type: "damage", multiplier: 1.6 }
  };

  // --- Donjon ---
  const dungeonWidth = 6;
  const dungeonHeight = 6;
  const maxFloor = 4;
  const trapDamage = 15;

  // --- État global ---
  const gameState = {
    heroKey: null,
    hero: null,
    enemy: null,
    inventory: [],
    equipment: {
      weapon: null,
      armor: null
    },
    quests: [],
    stats: {
      wins: 0,
      defeats: 0,
      potionsUsed: 0
    },
    dungeon: null
  };

  // --- DOM ---
  const heroSelectDiv = document.getElementById("hero-select");
  const gameDiv = document.getElementById("game");
  const heroDescriptionP = document.getElementById("hero-description");

  const heroNameSpan = document.getElementById("hero-name");
  const heroHpSpan = document.getElementById("hero-hp");
  const heroHpMaxSpan = document.getElementById("hero-hp-max");
  const heroLevelSpan = document.getElementById("hero-level");
  const heroXpSpan = document.getElementById("hero-xp");
  const heroXpNextSpan = document.getElementById("hero-xp-next");
  const equipWeaponSpan = document.getElementById("equip-weapon");
  const equipArmorSpan = document.getElementById("equip-armor");

  const statsList = document.getElementById("stats-list");
  const skillsList = document.getElementById("skills-list");
  const skillPointsSpan = document.getElementById("skill-points");

  const enemyNameSpan = document.getElementById("enemy-name");
  const enemyHpSpan = document.getElementById("enemy-hp");
  const enemyHpMaxSpan = document.getElementById("enemy-hp-max");

  const inventoryList = document.getElementById("inventory-list");
  const inventoryWeightSpan = document.getElementById("inventory-weight");
  const questList = document.getElementById("quest-list");
  const logDiv = document.getElementById("log");

  const btnAttack = document.getElementById("btn-attack");
  const btnPotion = document.getElementById("btn-potion");
  const btnEquip = document.getElementById("btn-equip");
  const btnRestart = document.getElementById("btn-restart");
  const btnCast = document.getElementById("btn-cast");
  const btnRest = document.getElementById("btn-rest");
  const btnShop = document.getElementById("btn-shop");
  const btnToggleInventory = document.getElementById("btn-toggle-inventory");
  const btnCloseInventory = document.getElementById("btn-close-inventory");
  const inventoryPanel = document.getElementById("inventory-panel");
  const modalPanel = document.getElementById("modal-panel");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalCloseBtn = document.getElementById("modal-close");

  const heroChoiceButtons = document.querySelectorAll(".hero-choice");
  const minimapGrid = document.getElementById("minimap-grid");
  const roomCoordSpan = document.getElementById("room-coord");

  const floorNumberSpan = document.getElementById("floor-number");
  const coinsGoldSpan = document.getElementById("coins-gold");
  const coinsSilverSpan = document.getElementById("coins-silver");
  const coinsBronzeSpan = document.getElementById("coins-bronze");

  // Builder
  const ccPanel = document.getElementById("character-creation");
  const ccPointsSpan = document.getElementById("cc-points");
  const builderStepsPanel = document.getElementById("builder-steps");
  const builderStepButtons = document.querySelectorAll(".builder-step-btn");
  const builderSummaryPanel = document.getElementById("builder-summary");
  const summaryClassSpan = document.getElementById("summary-class");
  const summaryStrSpan = document.getElementById("summary-STR");
  const summaryDexSpan = document.getElementById("summary-DEX");
  const summaryIntSpan = document.getElementById("summary-INT");
  const summaryVitSpan = document.getElementById("summary-VIT");
  const btnStartGame = document.getElementById("btn-start-game");

  // --- Modal global (sorts, marchand, etc.) ---
  function openModal(title, contentNode) {
    if (!modalPanel) return;
    modalTitle.textContent = title || "";
    modalBody.innerHTML = "";
    if (contentNode) {
      modalBody.appendChild(contentNode);
    }
    modalPanel.classList.remove("hidden");
  }

  function closeModal() {
    if (!modalPanel) return;
    modalPanel.classList.add("hidden");
    if (modalBody) modalBody.innerHTML = "";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  // --- LOG ---
  function addLog(message) {
    const p = document.createElement("p");
    p.textContent = message;
    logDiv.appendChild(p);
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // --- Helpers D&D ---
  function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
  }

  function abilityMod(score) {
    return Math.floor((score - 10) / 2);
  }

  // --- Pièces ---
  function getTotalBronze() {
    if (!gameState.hero || !gameState.hero.coins) return 0;
    const c = gameState.hero.coins;
    return c.bronze + c.silver * 10 + c.gold * 100;
  }

  function setCoinsFromTotal(total) {
    if (!gameState.hero) return;
    if (total < 0) total = 0;
    const gold = Math.floor(total / 100);
    total %= 100;
    const silver = Math.floor(total / 10);
    const bronze = total % 10;
    gameState.hero.coins = { gold, silver, bronze };
  }

  function addCoinsBronze(amount) {
    if (!gameState.hero) return;
    const total = getTotalBronze() + amount;
    setCoinsFromTotal(total);
    renderCoins();
  }

  function spendCoinsBronze(amount) {
    if (!gameState.hero) return false;
    const total = getTotalBronze();
    if (total < amount) return false;
    setCoinsFromTotal(total - amount);
    renderCoins();
    return true;
  }

  function renderCoins() {
    if (!gameState.hero || !gameState.hero.coins) {
      coinsGoldSpan.textContent = "0";
      coinsSilverSpan.textContent = "0";
      coinsBronzeSpan.textContent = "0";
      return;
    }

    const c = gameState.hero.coins;
    coinsGoldSpan.textContent = c.gold;
    coinsSilverSpan.textContent = c.silver;
    coinsBronzeSpan.textContent = c.bronze;
  }

  // --- INVENTAIRE (module) ---
  const Inventory = {
    BASE_INVENTORY_WEIGHT: 10,

    getMaxWeight() {
      const hero = gameState.hero;
      if (!hero) return 20;

      const STR =
        (hero.effectiveStats && hero.effectiveStats.STR) ||
        (hero.stats && hero.stats.STR) ||
        10;

      return Inventory.BASE_INVENTORY_WEIGHT + Math.floor(STR * 1.5);
    },

    getItemWeight(item) {
      if (!item) return 0;

      if (typeof item === "string") {
        if (item.toLowerCase().includes("potion")) return 1;
        return 1;
      }

      if (item.type === "tent") return 3;

      if (item.slot === "weapon") {
        return item.rare ? 4 : 3;
      }
      if (item.slot === "armor") {
        return item.rare ? 6 : 5;
      }

      return 1;
    },

    getTotalWeight() {
      return gameState.inventory.reduce(
        (sum, it) => sum + Inventory.getItemWeight(it),
        0
      );
    },

    describeItem(item) {
      if (!item) return "Objet inconnu";
      if (typeof item === "string") return item;

      if (item.type === "tent") return item.name || "Tente";
      if (item.type === "consumable" && item.special === "roomReset") {
        return item.name || "Aile de Phénix";
      }
      if (item.slot) {
        const rareTag = item.rare ? " (Rare)" : "";
        return `${item.name || "Équipement"}${rareTag}`;
      }
      return item.name || "Objet";
    },

    tryAdd(item) {
      const current = Inventory.getTotalWeight();
      const w = Inventory.getItemWeight(item);
      const maxW = Inventory.getMaxWeight();

      if (current + w <= maxW) {
        gameState.inventory.push(item);
        addLog(
          `Objet ajouté à l'inventaire : ${Inventory.describeItem(
            item
          )} (poids ${w}). ` + `Poids total : ${current + w}/${maxW}.`
        );
        Inventory.render();
        return true;
      }

      let msg =
        `Ton inventaire est plein (poids ${current}/${maxW}).\n\n` +
        `Objet trouvé : ${Inventory.describeItem(item)} (poids ${w}).\n\n` +
        `Que veux-tu faire ?\n` +
        `1) Abandonner l'objet\n` +
        `2) Remplacer un objet existant par celui-ci`;

      const choice = parseInt(window.prompt(msg) || "1", 10);
      if (choice !== 2) {
        addLog("Tu décides de laisser l'objet au sol.");
        return false;
      }

      let invMsg = "Quel objet veux-tu détruire pour faire de la place ?\n";
      gameState.inventory.forEach((it, idx) => {
        invMsg += `${idx + 1}) ${Inventory.describeItem(
          it
        )} (poids ${Inventory.getItemWeight(it)})\n`;
      });
      invMsg += "0) Annuler (abandonner le loot)";

      const idxChoice = parseInt(window.prompt(invMsg) || "0", 10);
      if (
        !idxChoice ||
        idxChoice < 1 ||
        idxChoice > gameState.inventory.length
      ) {
        addLog("Tu renonces au loot et repars sans l'objet.");
        return false;
      }

      const removed = gameState.inventory[idxChoice - 1];
      const newWeight =
        current -
        Inventory.getItemWeight(removed) +
        Inventory.getItemWeight(item);

      if (newWeight > maxW) {
        addLog(
          "Même en remplaçant cet objet, ton inventaire serait trop lourd. " +
            "Tu renonces finalement au loot."
        );
        return false;
      }

      gameState.inventory[idxChoice - 1] = item;
      addLog(
        `Tu détruis ${Inventory.describeItem(
          removed
        )} et prends ${Inventory.describeItem(item)} à la place. ` +
          `Poids total : ${newWeight}/${maxW}.`
      );
      Inventory.render();
      return true;
    },

    render() {
      inventoryList.innerHTML = "";

      if (gameState.inventory.length === 0) {
        const li = document.createElement("li");
        li.textContent = "(Inventaire vide)";
        li.classList.add("inventory-item");
        inventoryList.appendChild(li);
      } else {
        gameState.inventory.forEach((item, index) => {
          const li = document.createElement("li");
          li.classList.add("inventory-item");

          if (typeof item === "string") {
            li.textContent = item;
            li.classList.add("potion");
          } else if (item.type === "tent") {
            li.textContent = item.name;
            li.classList.add("tent");
          } else if (
            item.type === "consumable" &&
            item.special === "roomReset"
          ) {
            li.textContent = item.name || "Aile de Phénix";
          } else if (item.slot) {
            const rareTag = item.rare ? " ⭐[Rare]" : "";
            li.textContent = `${item.name}${rareTag} [${item.slot}] (+${item.atkBonus} ATK, +${item.hpBonus} HP)`;
            li.classList.add("equipment-item");
            if (item.rare) li.style.fontWeight = "bold";
            li.addEventListener("click", () =>
              Inventory.handleEquipClick(index)
            );
          } else {
            li.textContent = item.name || "Objet ?";
          }

          inventoryList.appendChild(li);
        });
      }

      if (inventoryWeightSpan) {
        const current = Inventory.getTotalWeight();
        const maxW = Inventory.getMaxWeight();
        const ratio = maxW > 0 ? current / maxW : 0;

        inventoryWeightSpan.textContent = `${current}/${maxW}`;

        if (ratio < 0.6) {
          inventoryWeightSpan.style.color = "#22c55e"; // vert
        } else if (ratio < 0.9) {
          inventoryWeightSpan.style.color = "#f97316"; // orange
        } else {
          inventoryWeightSpan.style.color = "#ef4444"; // rouge
        }
      }
    },

    handleEquipClick(index) {
      const item = gameState.inventory[index];
      if (
        !item ||
        typeof item === "string" ||
        (!item.slot && item.type !== "equip")
      ) {
        return;
      }

      if (item.slot === "weapon") {
        gameState.equipment.weapon = item;
        addLog(`Tu équipes l'arme : ${item.name} ⚔️`);
      } else if (item.slot === "armor") {
        gameState.equipment.armor = item;
        addLog(`Tu équipes l'armure : ${item.name} 🛡️`);
      }

      Hero.updateView();
    },

    autoEquipBest() {
      let bestWeapon = gameState.equipment.weapon;
      let bestArmor = gameState.equipment.armor;

      gameState.inventory.forEach((item) => {
        if (typeof item === "string") return;
        const candidate = item;
        if (candidate.slot === "weapon") {
          if (!bestWeapon || candidate.atkBonus > bestWeapon.atkBonus) {
            bestWeapon = candidate;
          }
        } else if (candidate.slot === "armor") {
          const bestScore =
            (bestArmor?.hpBonus || 0) + (bestArmor?.atkBonus || 0);
          const itemScore =
            (candidate.hpBonus || 0) + (candidate.atkBonus || 0);
          if (!bestArmor || itemScore > bestScore) {
            bestArmor = candidate;
          }
        }
      });

      gameState.equipment.weapon = bestWeapon || null;
      gameState.equipment.armor = bestArmor || null;

      if (bestWeapon || bestArmor) {
        addLog("Auto-équiper : meilleur équipement équipé 🛡️⚔️");
      } else {
        addLog("Pas d'équipement à auto-équiper pour l'instant.");
      }

      Hero.updateView();
    }
  };

  // --- QUÊTES (module simple) ---
  const Quests = {
    initFromTemplates() {
      gameState.quests = questTemplates.map((qt) => ({
        id: qt.id,
        title: qt.title,
        description: qt.description,
        check: qt.check,
        completed: false
      }));
    },

    render() {
      questList.innerHTML = "";
      gameState.quests.forEach((q) => {
        const li = document.createElement("li");
        if (q.completed) {
          li.classList.add("completed");
          li.textContent = `✅ ${q.title} – ${q.description}`;
        } else {
          li.textContent = `⏳ ${q.title} – ${q.description}`;
        }
        questList.appendChild(li);
      });
    },

    checkAll() {
      gameState.quests.forEach((q) => {
        if (!q.completed && q.check(gameState)) {
          q.completed = true;
          addLog(`Quête accomplie : ${q.title} 🎉`);
          if (q.id === 2) {
            if (Inventory.tryAdd("Potion de soin")) {
              addLog("Récompense : tu gagnes une potion supplémentaire 💊");
            } else {
              addLog(
                "Récompense : une potion supplémentaire aurait été ajoutée, " +
                  "mais ton inventaire est trop lourd. Elle est perdue."
              );
            }
          }
        }
      });
      Quests.render();
    }
  };

  // --- HÉROS (module) ---
  const Hero = {
    computeEffectiveStats() {
      const hero = gameState.hero;
      if (!hero) return;

      const STR = hero.stats.STR + (hero.skills.strMastery || 0) * 2;
      const DEX = hero.stats.DEX + (hero.skills.dexMastery || 0) * 2;
      const INT = hero.stats.INT + (hero.skills.intMastery || 0) * 2;
      const VIT = hero.stats.VIT;
      const DODGE_SKILL = hero.skills.dodgeMastery || 0;

      hero.effectiveStats = { STR, DEX, INT, VIT };

      const strMod = abilityMod(STR);
      const dexMod = abilityMod(DEX);
      const intMod = abilityMod(INT);

      const proficiency = 2 + Math.floor((hero.level - 1) / 4);

      hero.maxHp = hero.baseMaxHp + VIT * 2 + STR;
      if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;

      if (gameState.heroKey === "mage") {
        hero.attackStatMod = intMod;
      } else if (gameState.heroKey === "rogue") {
        hero.attackStatMod = dexMod;
      } else {
        hero.attackStatMod = strMod;
      }

      hero.attackBonus = proficiency + hero.attackStatMod;
      hero.critChance = hero.baseCritChance + DEX * 0.005;

      let dodge = 0.05 + DEX * 0.005 + DODGE_SKILL * 0.03;
      if (dodge > 0.9) dodge = 0.9;
      hero.dodgeChance = dodge;

      hero.spellPower = hero.baseAtk + Math.floor(INT * 1.5);

      let armorBonusAC = 0;
      if (gameState.equipment.armor) {
        const a = gameState.equipment.armor;
        armorBonusAC =
          Math.floor((a.hpBonus || 0) / 10) + Math.floor((a.atkBonus || 0) / 3);
      }
      hero.ac = 10 + dexMod + armorBonusAC;
    },

    render() {
      const hero = gameState.hero;
      if (!hero) return;

      heroNameSpan.textContent = hero.name;
      heroHpSpan.textContent = hero.hp;
      heroHpMaxSpan.textContent = hero.maxHp;
      heroLevelSpan.textContent = hero.level;
      heroXpSpan.textContent = hero.xp;
      heroXpNextSpan.textContent = hero.xpNext;

      equipWeaponSpan.textContent = gameState.equipment.weapon
        ? `${gameState.equipment.weapon.name} (+${gameState.equipment.weapon.atkBonus} ATK, +${gameState.equipment.weapon.hpBonus} HP)`
        : "Aucune";
      equipArmorSpan.textContent = gameState.equipment.armor
        ? `${gameState.equipment.armor.name} (+${gameState.equipment.armor.atkBonus} ATK, +${gameState.equipment.armor.hpBonus} HP)`
        : "Aucune";

      floorNumberSpan.textContent = gameState.dungeon
        ? gameState.dungeon.floor
        : 1;
      renderCoins();
      Hero.renderStats();
      Hero.renderSkills();
      Inventory.render();
    },

    renderStats() {
      const hero = gameState.hero;
      if (!hero || !hero.effectiveStats) return;
      const s = hero.effectiveStats;
      statsList.innerHTML = "";
      const items = [
        `FOR : ${s.STR}`,
        `DEX : ${s.DEX}`,
        `INT : ${s.INT}`,
        `VIT : ${s.VIT}`,
        `ESQ : ${Math.round((hero.dodgeChance || 0) * 100)} %`,
        `CA : ${hero.ac || 10}`
      ];
      items.forEach((txt) => {
        const li = document.createElement("li");
        li.textContent = txt;
        statsList.appendChild(li);
      });
    },

    renderSkills() {
      const hero = gameState.hero;
      if (!hero) return;
      skillsList.innerHTML = "";
      skillPointsSpan.textContent = hero.skillPoints;

      skillDefs.forEach((sd) => {
        const li = document.createElement("li");
        li.classList.add("skill-item");
        const lvl = hero.skills[sd.id] || 0;
        const textSpan = document.createElement("span");
        textSpan.textContent = `${sd.label} (Niv ${lvl}/${sd.max}) – ${sd.desc}`;

        const btn = document.createElement("button");
        btn.textContent = "+";
        btn.disabled = hero.skillPoints <= 0 || lvl >= sd.max;
        btn.addEventListener("click", () => Hero.improveSkill(sd.id));

        li.appendChild(textSpan);
        li.appendChild(btn);
        skillsList.appendChild(li);
      });

      btnCast.disabled = !hero.knownSpells || hero.knownSpells.length === 0;
    },

    improveSkill(skillId) {
      const hero = gameState.hero;
      if (!hero) return;
      if (hero.skillPoints <= 0) {
        addLog("Tu n'as pas de point de compétence disponible.");
        return;
      }
      const def = skillDefs.find((s) => s.id === skillId);
      if (!def) return;
      const current = hero.skills[skillId] || 0;
      if (current >= def.max) {
        addLog("Cette compétence est déjà au niveau maximum.");
        return;
      }
      hero.skills[skillId] = current + 1;
      hero.skillPoints--;
      addLog(
        `Compétence améliorée : ${def.label} (niveau ${hero.skills[skillId]}).`
      );

      // Sorts du mage en fonction de INT
      if (gameState.heroKey === "mage" && skillId === "intMastery") {
        if (
          hero.skills.intMastery >= 1 &&
          !hero.knownSpells.includes("Soin mineur")
        ) {
          hero.knownSpells.push("Soin mineur");
          addLog("Nouveau sort appris : Soin mineur ✨");
        }
        if (
          hero.skills.intMastery >= 3 &&
          !hero.knownSpells.includes("Boule de feu")
        ) {
          hero.knownSpells.push("Boule de feu");
          addLog("Nouveau sort appris : Boule de feu 🔥");
        }
        if (
          hero.skills.intMastery >= 4 &&
          !hero.knownSpells.includes("Soin majeur")
        ) {
          hero.knownSpells.push("Soin majeur");
          addLog("Nouveau sort appris : Soin majeur ✨");
        }
      }

      Hero.updateView();
    },

    gainXp(amount) {
      const hero = gameState.hero;
      hero.xp += amount;
      addLog(`Tu gagnes ${amount} XP ! (Total : ${hero.xp})`);

      if (hero.xp >= hero.xpNext) {
        hero.level++;
        hero.xp -= hero.xpNext;
        hero.xpNext = Math.round(hero.xpNext * 1.4);
        hero.baseMaxHp += 8;
        hero.baseAtk += 2;
        hero.skillPoints += 1;
        addLog(
          `LEVEL UP ! Tu passes niveau ${hero.level} 💪 (HP base +8, ATK base +2, +1 point de compétence)`
        );
        Hero.updateView();
      }
    },

    updateView() {
      Hero.computeEffectiveStats();
      Hero.render();
    },

    selectHero(heroKey) {
      const template = heroTemplates[heroKey];
      if (!template) return;

      gameState.heroKey = heroKey;
      gameState.hero = {
        name: template.name,
        baseMaxHp: template.baseMaxHp,
        baseAtk: template.baseAtk,
        baseCritChance: template.critChance,
        maxHp: template.baseMaxHp,
        hp: template.baseMaxHp,
        level: 1,
        xp: 0,
        xpNext: 50,
        stats: { ...template.stats },
        skillPoints: 0,
        skills: {
          strMastery: 0,
          dexMastery: 0,
          intMastery: 0,
          dodgeMastery: 0
        },
        effectiveStats: { ...template.stats },
        dodgeChance: 0.05,
        spellPower: template.baseAtk,
        knownSpells: [],
        coins: { gold: 0, silver: 0, bronze: 0 }
      };

      gameState.stats = { wins: 0, defeats: 0, potionsUsed: 0 };
      gameState.inventory = [];
      gameState.equipment.weapon = null;
      gameState.equipment.armor = null;

      // Kit de départ
      Inventory.tryAdd("Potion de soin");
      Inventory.tryAdd({ type: "tent", name: "Tente usée" });

      let starterWeapon = null;
      if (heroKey === "warrior") {
        starterWeapon = {
          name: "Épée usée",
          slot: "weapon",
          atkBonus: 3,
          hpBonus: 0
        };
      } else if (heroKey === "mage") {
        starterWeapon = {
          name: "Bâton fendu",
          slot: "weapon",
          atkBonus: 2,
          hpBonus: 0
        };
      } else if (heroKey === "rogue") {
        starterWeapon = {
          name: "Vieille dague",
          slot: "weapon",
          atkBonus: 2,
          hpBonus: 0
        };
      }
      if (starterWeapon) {
        Inventory.tryAdd(starterWeapon);
      }

      for (let i = 0; i < template.startingPotions; i++) {
        Inventory.tryAdd("Potion de soin");
      }

      Quests.initFromTemplates();

      // Réinitialise le donjon (étage 1)
      Dungeon.initFloor(1);

      pendingCustomStats = null;
      ccPoints = 27;
      ccStats.STR = 8;
      ccStats.DEX = 8;
      ccStats.INT = 8;
      ccStats.VIT = 8;
      updateCCDisplay();

      Hero.updateView();
      Quests.render();
      Dungeon.renderMinimap();

      setBuilderStep(2);
    },

    showInfo() {
      if (!gameState.heroKey) return;
      const template = heroTemplates[gameState.heroKey];
      if (!template) return;
      window.alert(
        `${template.name}\n\n${template.description}\n\nHP de base : ${template.baseMaxHp}\nATK de base : ${template.baseAtk}\nFOR : ${template.stats.STR}\nDEX : ${template.stats.DEX}\nINT : ${template.stats.INT}\nVIT : ${template.stats.VIT}`
      );
    }
  };

  // --- DONJON (module) ---
  const Dungeon = {
    createDungeon(floor) {
      const rooms = [];

      let bossX, bossY;
      do {
        bossX = Math.floor(Math.random() * dungeonWidth);
        bossY = Math.floor(Math.random() * dungeonHeight);
      } while (bossX === 3 && bossY === 3);

      for (let y = 0; y < dungeonHeight; y++) {
        for (let x = 0; x < dungeonWidth; x++) {
          const isStart = x === 3 && y === 3;
          const isBoss = x === bossX && y === bossY;
          const isTrap =
            (x === 2 && y === 2) ||
            (x === 1 && y === 4) ||
            (x === 4 && y === 1);

          rooms.push({
            x,
            y,
            discovered: isStart,
            cleared: false,
            isTrap,
            trapTriggered: false,
            isBoss,
            hasStairs: false
          });
        }
      }

      return {
        floor,
        maxFloor,
        width: dungeonWidth,
        height: dungeonHeight,
        rooms,
        currentX: 3,
        currentY: 3,
        discoveredCount: 1
      };
    },

    initFloor(floor) {
      gameState.dungeon = Dungeon.createDungeon(floor);
      Dungeon.renderMinimap();
    },

    getRoom(x, y) {
      const d = gameState.dungeon;
      return d.rooms.find((r) => r.x === x && r.y === y);
    },

    renderMinimap() {
      const d = gameState.dungeon;
      minimapGrid.innerHTML = "";
      for (let y = 0; y < d.height; y++) {
        for (let x = 0; x < d.width; x++) {
          const cell = document.createElement("div");
          cell.classList.add("minimap-cell");
          const room = Dungeon.getRoom(x, y);
          if (room.discovered) cell.classList.add("discovered");
          if (room.cleared) cell.classList.add("cleared");
          if (x === d.currentX && y === d.currentY) {
            cell.classList.add("current");
          }
          cell.dataset.x = x;
          cell.dataset.y = y;
          cell.addEventListener("click", () => Dungeon.moveToRoom(x, y));
          minimapGrid.appendChild(cell);
        }
      }
      roomCoordSpan.textContent = `${d.currentX},${d.currentY}`;
    },

    moveToRoom(x, y) {
      const enemy = gameState.enemy;
      if (enemy && enemy.hp > 0) {
        addLog(
          "Tu ne peux pas quitter cette salle tant que l'ennemi est vivant !"
        );
        return;
      }

      const d = gameState.dungeon;
      const currentX = d.currentX;
      const currentY = d.currentY;
      const dx = Math.abs(x - currentX);
      const dy = Math.abs(y - currentY);

      if (dx + dy !== 1) {
        addLog("Tu ne peux te déplacer que vers une salle adjacente.");
        return;
      }

      if (x < 0 || x >= d.width || y < 0 || y >= d.height) {
        addLog("Salle hors du donjon.");
        return;
      }

      d.currentX = x;
      d.currentY = y;

      const room = Dungeon.getRoom(x, y);
      const hero = gameState.hero;

      if (!room.discovered) {
        room.discovered = true;
        d.discoveredCount++;
        addLog(`Tu découvres une nouvelle salle (${x},${y}).`);
      } else {
        addLog(`Tu entres dans la salle (${x},${y}).`);
      }

      // Piège
      if (room.isTrap && !room.trapTriggered && hero) {
        room.trapTriggered = true;
        hero.hp -= trapDamage;
        if (hero.hp < 0) hero.hp = 0;
        window.alert(
          `💥 Piège !\nTu perds ${trapDamage} HP en entrant dans cette salle.`
        );
        addLog(
          `💥 Piège ! Tu perds ${trapDamage} HP en entrant dans cette salle.`
        );
        Hero.updateView();
        if (hero.hp <= 0) {
          addLog("Le piège t'a achevé… Game Over 💀");
          btnAttack.disabled = true;
          btnPotion.disabled = true;
          return;
        }
      }

      // Escalier
      if (room.hasStairs && d.floor < d.maxFloor) {
        const goUp = window.confirm(
          `Un escalier vers l'étage ${
            d.floor + 1
          } est ici.\nSouhaites-tu monter ?`
        );
        if (goUp) {
          Dungeon.goToNextFloor();
          return;
        }
      }

      // Combat ?
      if (!room.cleared) {
        Combat.startBattle();
      } else {
        gameState.enemy = null;
        addLog("Cette salle a déjà été nettoyée. Pas d'ennemi ici.");
        btnAttack.disabled = true;
        btnPotion.disabled = false;
        Combat.renderEnemy();
        Dungeon.renderMinimap();
        Hero.updateView();
        Inventory.render();
      }
    },

    goToNextFloor() {
      const currentFloor = gameState.dungeon.floor;
      if (currentFloor >= maxFloor) {
        addLog("Tu es déjà au dernier étage.");
        return;
      }
      const next = currentFloor + 1;
      gameState.dungeon = Dungeon.createDungeon(next);
      gameState.enemy = null;
      addLog(`Tu montes à l'étage ${next}. Les ennemis seront plus dangereux…`);
      Dungeon.renderMinimap();
      Hero.updateView();
      Combat.startBattle();
    },

    resetCurrentRoom() {
      const d = gameState.dungeon;
      const room = Dungeon.getRoom(d.currentX, d.currentY);
      if (room) {
        room.cleared = false;
      }
      Combat.startBattle();
    },

    resetFullDungeon() {
      gameState.heroKey = null;
      gameState.hero = null;
      gameState.enemy = null;
      gameState.inventory = [];
      gameState.equipment = { weapon: null, armor: null };
      gameState.quests = [];
      gameState.stats = { wins: 0, defeats: 0, potionsUsed: 0 };
      gameState.dungeon = Dungeon.createDungeon(1);

      logDiv.innerHTML = "";
      heroDescriptionP.textContent = "";

      pendingCustomStats = null;
      ccPoints = 27;
      ccStats.STR = 8;
      ccStats.DEX = 8;
      ccStats.INT = 8;
      ccStats.VIT = 8;
      updateCCDisplay();

      gameDiv.classList.add("hidden");
      if (builderStepsPanel) builderStepsPanel.classList.remove("hidden");
      if (builderSummaryPanel) builderSummaryPanel.classList.add("hidden");
      heroSelectDiv.classList.remove("hidden");
      ccPanel.classList.add("hidden");

      setBuilderStep(1);
      Dungeon.renderMinimap();
    }
  };

  // --- COMBAT (module) ---
  const Combat = {
    renderEnemy() {
      const enemy = gameState.enemy;
      if (!enemy) {
        enemyNameSpan.textContent = "Aucun";
        enemyHpSpan.textContent = "0";
        enemyHpMaxSpan.textContent = "0";
        return;
      }
      enemyNameSpan.textContent = enemy.name;
      enemyHpSpan.textContent = enemy.hp;
      enemyHpMaxSpan.textContent = enemy.maxHp;
    },

    heroDamageRoll(isCrit = false) {
      const hero = gameState.hero;
      if (!hero) return 0;

      let damageDie = 8;
      if (gameState.heroKey === "warrior") damageDie = 10;
      if (gameState.heroKey === "rogue") damageDie = 8;
      if (gameState.heroKey === "mage") damageDie = 6;

      const statMod = hero.attackStatMod || 0;

      function rollOnce() {
        return Math.floor(Math.random() * damageDie) + 1;
      }

      if (isCrit) {
        return rollOnce() + rollOnce() + statMod;
      } else {
        return rollOnce() + statMod;
      }
    },

    heroTurn() {
      const hero = gameState.hero;
      const enemy = gameState.enemy;
      if (!hero || !enemy) return;
      if (hero.hp <= 0 || enemy.hp <= 0) return;

      const d20 = rollD20();
      const attackTotal = d20 + (hero.attackBonus || 0);

      addLog(
        `Tu fais un jet d'attaque : d20 (${d20}) + bonus (${
          hero.attackBonus || 0
        }) = ${attackTotal}`
      );

      let isCrit = false;

      if (d20 === 1) {
        addLog("Échec critique ! Tu rates lamentablement ton attaque… 😬");
        Combat.enemyTurn();
        return;
      }

      if (d20 === 20) {
        addLog("Coup critique naturel (20) ! 💥");
        isCrit = true;
      }

      const enemyAC = enemy.ac || 10;
      if (!isCrit && attackTotal < enemyAC) {
        addLog(
          `Ton attaque n'atteint pas ${enemy.name} (CA ${enemyAC}). C'est un échec.`
        );
        Combat.enemyTurn();
        return;
      }

      const dmg = Combat.heroDamageRoll(isCrit);
      enemy.hp -= dmg;
      if (enemy.hp < 0) enemy.hp = 0;

      addLog(
        `Ton attaque touche ${enemy.name} et inflige ${dmg} dégâts ${
          isCrit ? "(critique)" : ""
        } !`
      );
      Combat.renderEnemy();

      if (Combat.checkEndOfBattle()) {
        addLog("Le combat est terminé.");
        Hero.updateView();
        Inventory.render();
        Dungeon.renderMinimap();
        return;
      }

      Combat.enemyTurn();
    },

    enemyTurn() {
      const hero = gameState.hero;
      const enemy = gameState.enemy;
      if (!hero || !enemy) return;

      const dodgeChance = hero.dodgeChance || 0;
      if (Math.random() < dodgeChance) {
        addLog(
          `${enemy.name} attaque mais tu esquives l'attaque avec agilité ! 🌀`
        );
        return;
      }

      const d20 = rollD20();
      const attackBonus = enemy.attackBonus || 0;
      const attackTotal = d20 + attackBonus;
      const heroAC = hero.ac || 10;

      addLog(
        `${enemy.name} fait un jet d'attaque : d20 (${d20}) + bonus (${attackBonus}) = ${attackTotal}`
      );

      if (d20 === 1) {
        addLog(
          `${enemy.name} fait un échec critique et rate complètement ! 😅`
        );
        return;
      }

      let isCrit = false;
      if (d20 === 20) {
        addLog(`${enemy.name} fait un coup critique naturel (20) ! 😱`);
        isCrit = true;
      }

      if (!isCrit && attackTotal < heroAC) {
        addLog(
          `${enemy.name} n'arrive pas à dépasser ta CA (${heroAC}). Tu bloques ou esquives le coup.`
        );
        return;
      }

      const dmgDie = enemy.damageDie || 6;
      const dmgBonus = enemy.damageBonus || 0;

      function rollOnce() {
        return Math.floor(Math.random() * dmgDie) + 1;
      }

      let dmg;
      if (isCrit) {
        dmg = rollOnce() + rollOnce() + dmgBonus;
      } else {
        dmg = rollOnce() + dmgBonus;
      }

      hero.hp -= dmg;
      if (hero.hp < 0) hero.hp = 0;

      addLog(
        `${enemy.name} te touche et t'inflige ${dmg} dégâts ${
          isCrit ? "(critique)" : ""
        } !`
      );
      Hero.updateView();

      Combat.checkEndOfBattle();
    },

    checkEndOfBattle() {
      const hero = gameState.hero;
      const enemy = gameState.enemy;
      const d = gameState.dungeon;
      const room = Dungeon.getRoom(d.currentX, d.currentY);

      if (hero.hp <= 0) {
        hero.hp = 0;
        addLog("Game Over… le héros est vaincu 💀");
        gameState.stats.defeats++;
        Combat.endBattle();
        Quests.checkAll();
        return true;
      }

      if (enemy.hp <= 0) {
        enemy.hp = 0;
        addLog(`Victoire ! ${enemy.name} est vaincu 🏆`);
        const isBoss = enemy.isBoss;
        gameState.stats.wins++;
        Hero.gainXp(enemy.xp);
        Combat.dropLoot(isBoss);

        if (room) {
          room.cleared = true;
          if (isBoss) {
            room.hasStairs = true;
            addLog(
              "En fouillant la salle, tu découvres un escalier menant à l'étage supérieur."
            );
            if (d.floor < d.maxFloor) {
              const goUp = window.confirm(
                `Souhaites-tu monter à l'étage ${d.floor + 1} ?`
              );
              if (goUp) {
                Dungeon.goToNextFloor();
                // Très important : on NE fait pas endBattle() après avoir lancé un nouveau combat.
                return true;
              } else {
                addLog(
                  "Tu restes pour l'instant à cet étage. Tu pourras revenir à cette salle pour monter."
                );
              }
            } else {
              window.alert(
                "Tu as vaincu le boss final du 4e étage ! 🎉\nLe donjon est complété."
              );
            }
          }
        }

        Quests.checkAll();
        Combat.endBattle();
        return true;
      }

      return false;
    },

    endBattle() {
      btnAttack.disabled = true;
      btnPotion.disabled = true;
    },

    createBossForFloor(floor) {
      const baseHp = 180;
      const baseAtk = 22;
      const baseXp = 150;
      return {
        name: `Boss de l'étage ${floor}`,
        maxHp: baseHp + (floor - 1) * 50,
        atk: baseAtk + (floor - 1) * 6,
        xp: baseXp * floor,
        isBoss: true
      };
    },

    pickRandomEnemy() {
      const floor = gameState.dungeon.floor;
      const list = floorEnemies[floor] || floorEnemies[1];
      const index = Math.floor(Math.random() * list.length);
      const base = list[index];

      const ac = 11 + floor + Math.floor(Math.random() * 3);
      const dmgDie = 6 + 2 * floor;
      const dmgBonus = 1 + floor;

      gameState.enemy = {
        name: base.name,
        maxHp: base.maxHp,
        hp: base.maxHp,
        atk: base.atk,
        xp: base.xp * floor,
        isBoss: false,
        ac,
        damageDie: dmgDie,
        damageBonus: dmgBonus,
        attackBonus: 2 + floor
      };
    },

    dropLoot(isBoss) {
      const floor = gameState.dungeon.floor;

      const normalChance = 0.7;
      if (Math.random() <= normalChance) {
        const index = Math.floor(Math.random() * lootTable.length);
        const loot = { ...lootTable[index] };
        if (!Inventory.tryAdd(loot)) {
          addLog(`Tu laisses ${Inventory.describeItem(loot)} derrière toi.`);
        }
      } else {
        addLog("Pas de butin classique cette fois…");
      }

      const coinsBronze = 15 * floor + Math.floor(Math.random() * 10);
      addCoinsBronze(coinsBronze);
      addLog(
        `Tu ramasses ${coinsBronze} pièces de bronze (converties en or/argent/bronze).`
      );

      if (isBoss) {
        const rareChance = 0.8;
        if (Math.random() <= rareChance) {
          const index = Math.floor(Math.random() * rareLootTable.length);
          const rareLoot = { ...rareLootTable[index] };
          if (!Inventory.tryAdd(rareLoot)) {
            addLog(
              `Tu abandonnes le butin rare : ${Inventory.describeItem(
                rareLoot
              )}… 😱`
            );
          }
        } else {
          addLog("Le boss ne laisse pas de butin rare cette fois…");
        }
      }

      Inventory.render();
    },

    startBattle() {
      const hero = gameState.hero;
      if (!hero) return;

      const d = gameState.dungeon;
      const room = Dungeon.getRoom(d.currentX, d.currentY);

      if (room && room.isBoss && !room.cleared) {
        const boss = Combat.createBossForFloor(d.floor);
        gameState.enemy = {
          name: boss.name,
          maxHp: boss.maxHp,
          hp: boss.maxHp,
          atk: boss.atk,
          xp: boss.xp,
          isBoss: true,
          ac: 14 + d.floor,
          damageDie: 8 + 2 * d.floor,
          damageBonus: 2 + d.floor,
          attackBonus: 3 + d.floor
        };
        window.alert(
          `⚠️ Boss détecté !\nTu entres dans la salle du Boss de l'étage ${d.floor}…`
        );
        addLog(
          `Tu fais face au ${boss.name}. Prépare-toi au combat le plus difficile de cet étage. 😈`
        );
      } else {
        Combat.pickRandomEnemy();
      }

      logDiv.innerHTML = "";

      btnAttack.disabled = false;
      btnPotion.disabled = false;

      // Garde-fou : si pour une raison quelconque aucun ennemi n'a été créé
      if (!gameState.enemy) {
        addLog("Aucun ennemi ne se trouve dans cette salle pour l'instant.");
        Combat.renderEnemy();
        Inventory.render();
        Dungeon.renderMinimap();
        return;
      }

      addLog(
        `Un ${gameState.enemy.name} apparaît ! HP ${gameState.enemy.maxHp}, ATK approximative ${gameState.enemy.atk}.`
      );
      Hero.updateView();
      Combat.renderEnemy();
      Inventory.render();
      Dungeon.renderMinimap();
    }
  };

  // --- SORTS ---
  function performSpell(spellName) {
    const hero = gameState.hero;
    const enemy = gameState.enemy;
    if (!hero) return;

    const def = spellDefs[spellName];
    if (!def) return;

    if (def.type === "heal") {
      const before = hero.hp;
      hero.hp += def.amount;
      if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
      const healed = hero.hp - before;
      addLog(`Tu lances ${spellName} et récupères ${healed} HP ✨`);
      Hero.updateView();
    } else if (def.type === "damage") {
      if (!enemy) {
        addLog("Aucun ennemi à viser avec un sort pour le moment.");
        return;
      }
      const base = hero.spellPower;
      const dmg = Math.round(base * def.multiplier);
      enemy.hp -= dmg;
      if (enemy.hp < 0) enemy.hp = 0;
      addLog(
        `Tu lances ${spellName} sur ${enemy.name} et infliges ${dmg} dégâts magiques 🔥`
      );
      Combat.renderEnemy();
      if (Combat.checkEndOfBattle()) {
        addLog("Le combat est terminé.");
        Hero.updateView();
        Inventory.render();
        Dungeon.renderMinimap();
        return;
      }
      Combat.enemyTurn();
    }
  }

  function castSpell() {
    const hero = gameState.hero;
    const enemy = gameState.enemy;
    if (!hero) return;
    if (!hero.knownSpells || hero.knownSpells.length === 0) {
      addLog("Tu ne connais encore aucun sort.");
      return;
    }
    if (!enemy) {
      addLog("Aucun ennemi à viser avec un sort pour le moment.");
      return;
    }

    const container = document.createElement("div");

    const info = document.createElement("p");
    info.textContent = "Choisis un sort à lancer :";
    container.appendChild(info);

    const list = document.createElement("div");
    hero.knownSpells.forEach((name) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.style.display = "block";
      btn.style.marginTop = "4px";
      btn.addEventListener("click", () => {
        performSpell(name);
        closeModal();
      });
      list.appendChild(btn);
    });
    container.appendChild(list);

    const cancel = document.createElement("button");
    cancel.textContent = "Annuler";
    cancel.classList.add("secondary");
    cancel.style.marginTop = "8px";
    cancel.addEventListener("click", () => {
      addLog("Tu renonces à lancer un sort pour ce tour.");
      closeModal();
    });
    container.appendChild(cancel);

    openModal("Lancer un sort", container);
  }

  // --- POTION & TENTE ---
  function usePotion() {
    const hero = gameState.hero;
    if (!hero) return;
    const index = gameState.inventory.indexOf("Potion de soin");
    if (index === -1) {
      addLog("Tu n'as plus de potion… 😢");
      return;
    }
    hero.hp += 25;
    if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;

    gameState.inventory.splice(index, 1);
    gameState.stats.potionsUsed++;
    addLog("Tu utilises une potion 💊 +25 HP !");
    Inventory.render();
    Hero.updateView();
    Quests.checkAll();
  }

  function useTent() {
    const hero = gameState.hero;
    const enemy = gameState.enemy;
    if (!hero) return;

    if (enemy && enemy.hp > 0) {
      addLog("Impossible de se reposer en plein combat !");
      return;
    }

    const index = gameState.inventory.findIndex(
      (it) => typeof it === "object" && it.type === "tent"
    );
    if (index === -1) {
      addLog("Tu n'as pas de tente dans ton inventaire.");
      return;
    }

    gameState.inventory.splice(index, 1);
    hero.hp = hero.maxHp;
    addLog(
      "Tu montes une tente et te reposes. Tes HP sont entièrement restaurés. 🏕️"
    );
    Inventory.render();
    Hero.updateView();
  }

  // --- MARCHAND (module) ---
  const Shop = {
    open() {
      const hero = gameState.hero;
      if (!hero) return;

      const d = gameState.dungeon;
      const room = Dungeon.getRoom(d.currentX, d.currentY);
      const isStartRoom = room && room.x === 3 && room.y === 3;

      if (!isStartRoom) {
        addLog(
          "Le marchand n'est présent que dans la salle de départ de l'étage."
        );
        return;
      }

      const container = document.createElement("div");

      const info = document.createElement("p");
      info.textContent =
        "Bienvenue chez le marchand ! Clique sur un objet pour l'acheter :";
      container.appendChild(info);

      const coinsInfo = document.createElement("p");
      coinsInfo.textContent = `Tu possèdes actuellement : ${getTotalBronze()} pièces de bronze (converties en or/argent/bronze).`;
      container.appendChild(coinsInfo);

      const list = document.createElement("div");
      shopItems.forEach((item) => {
        const btn = document.createElement("button");
        btn.textContent = `${item.name} – ${item.price} bronze`;
        btn.style.display = "block";
        btn.style.marginTop = "4px";

        btn.addEventListener("click", () => {
          if (!spendCoinsBronze(item.price)) {
            addLog("Tu n'as pas assez de pièces pour cet achat.");
            return;
          }

          let newItem = null;
          if (item.type === "potion") {
            newItem = "Potion de soin";
          } else if (item.type === "tent") {
            newItem = { type: "tent", name: "Tente de campement" };
          } else if (item.type === "equip") {
            newItem = {
              name: item.name,
              slot: item.slot,
              atkBonus: item.atkBonus || 0,
              hpBonus: item.hpBonus || 0
            };
          }

          if (!newItem) return;

          if (Inventory.tryAdd(newItem)) {
            addLog(`Tu achètes : ${item.name}.`);
          } else {
            addLog(
              "Ton inventaire est trop lourd pour cet achat. Le marchand te rembourse."
            );
            addCoinsBronze(item.price);
          }

          Inventory.render();
          Hero.updateView();
        });

        list.appendChild(btn);
      });
      container.appendChild(list);

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Fermer le marchand";
      closeBtn.classList.add("secondary");
      closeBtn.style.marginTop = "8px";
      closeBtn.addEventListener("click", () => {
        closeModal();
      });
      container.appendChild(closeBtn);

      openModal("Marchand", container);
    }
  };

  // --- BUILDER : création de perso façon D&D ---
  let pendingCustomStats = null;
  let currentBuilderStep = 1;

  let ccPoints = 27;
  const ccStats = { STR: 8, DEX: 8, INT: 8, VIT: 8 };

  function updateCCDisplay() {
    if (!ccPointsSpan) return;
    ccPointsSpan.textContent = ccPoints;
    ["STR", "DEX", "INT", "VIT"].forEach((stat) => {
      const span = document.getElementById("cc-" + stat);
      if (span) span.textContent = ccStats[stat];
    });
  }

  document.querySelectorAll(".cc-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stat = btn.dataset.stat;
      if (ccPoints > 0 && ccStats[stat] < 18) {
        ccStats[stat]++;
        ccPoints--;
        updateCCDisplay();
      }
    });
  });

  document.querySelectorAll(".cc-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stat = btn.dataset.stat;
      if (ccStats[stat] > 8) {
        ccStats[stat]--;
        ccPoints++;
        updateCCDisplay();
      }
    });
  });

  const ccValidateBtn = document.getElementById("cc-validate");
  if (ccValidateBtn) {
    ccValidateBtn.addEventListener("click", () => {
      if (ccPoints > 0) {
        alert(
          "Tu dois utiliser tous les points avant de valider !\n" +
            "Points restants : " +
            ccPoints
        );
        return;
      }

      pendingCustomStats = { ...ccStats };

      if (gameState.hero) {
        gameState.hero.stats = { ...pendingCustomStats };
        Hero.updateView();
      }

      setBuilderStep(3);
    });
  }

  function setBuilderStep(step) {
    currentBuilderStep = step;

    builderStepButtons.forEach((btn) => {
      const s = parseInt(btn.dataset.step, 10);
      btn.classList.toggle("active", s === step);
      btn.classList.toggle("completed", s < step);

      if (s === step) {
        btn.setAttribute("aria-current", "step");
      } else {
        btn.removeAttribute("aria-current");
      }
    });

    if (step === 1) {
      heroSelectDiv.classList.remove("hidden");
      ccPanel.classList.add("hidden");
      builderSummaryPanel.classList.add("hidden");
    } else if (step === 2) {
      heroSelectDiv.classList.add("hidden");
      ccPanel.classList.remove("hidden");
      builderSummaryPanel.classList.add("hidden");
    } else if (step === 3) {
      heroSelectDiv.classList.add("hidden");
      ccPanel.classList.add("hidden");
      builderSummaryPanel.classList.remove("hidden");
      updateSummaryPanel();
    }
  }

  function updateSummaryPanel() {
    if (!gameState.hero) return;
    const hero = gameState.hero;

    summaryClassSpan.textContent = hero.name || "-";

    const s = hero.stats || { STR: 0, DEX: 0, INT: 0, VIT: 0 };
    summaryStrSpan.textContent = s.STR;
    summaryDexSpan.textContent = s.DEX;
    summaryIntSpan.textContent = s.INT;
    summaryVitSpan.textContent = s.VIT;
  }

  builderStepButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = parseInt(btn.dataset.step, 10);
      if (step === 2 && !gameState.hero) {
        alert("Choisis d'abord une classe (Guerrier, Mage, Voleur).");
        return;
      }
      if (step === 3 && (!gameState.hero || !pendingCustomStats)) {
        alert("Tu dois d'abord distribuer tes caractéristiques.");
        return;
      }
      setBuilderStep(step);
    });
  });

  if (btnStartGame) {
    btnStartGame.addEventListener("click", () => {
      if (!gameState.hero || !pendingCustomStats) {
        alert("Il te manque encore des choix pour ton personnage.");
        return;
      }

      builderStepsPanel.classList.add("hidden");
      builderSummaryPanel.classList.add("hidden");
      heroSelectDiv.classList.add("hidden");
      ccPanel.classList.add("hidden");

      gameDiv.classList.remove("hidden");

      addLog("Bienvenue dans le donjon ! Tu commences à l'étage 1.");
      Combat.startBattle();
    });
  }

  // --- Sélection du héros (UI) ---
  heroChoiceButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const heroKey = btn.dataset.hero;
      const template = heroTemplates[heroKey];
      heroDescriptionP.textContent = template
        ? template.description
        : "Héros inconnu";

      const confirme = window.confirm(
        `Tu as choisi : ${template.name}.\n\n${template.description}\n\nConfirmer ce héros ?`
      );
      if (confirme) {
        Hero.selectHero(heroKey);
      }
    });
  });

  heroNameSpan.addEventListener("click", () => {
    Hero.showInfo();
  });

  // --- RESTART / AILE DE PHÉNIX ---
  btnRestart.addEventListener("click", () => {
    if (!gameState.hero) return;

    const hasPhoenix = gameState.inventory.some(
      (it) =>
        typeof it === "object" &&
        (it.name === "Aile de Phénix" ||
          (it.type === "consumable" && it.special === "roomReset"))
    );

    if (!hasPhoenix) {
      const full = window.confirm(
        "Tu ne possèdes pas d'Aile de Phénix.\n\n" +
          "Seule option : RÉINITIALISER TOUT LE DONJON.\n\n" +
          "OK = Reset donjon complet\nAnnuler = Annuler"
      );
      if (full) Dungeon.resetFullDungeon();
      return;
    }

    const choice = window.confirm(
      "Tu possèdes une Aile de Phénix !\n\n" +
        "OK = Réinitialiser uniquement la salle (l'objet sera consommé)\n" +
        "Annuler = Réinitialiser tout le donjon"
    );

    if (choice) {
      const index = gameState.inventory.findIndex(
        (it) =>
          typeof it === "object" &&
          (it.name === "Aile de Phénix" ||
            (it.type === "consumable" && it.special === "roomReset"))
      );
      if (index !== -1) {
        gameState.inventory.splice(index, 1);
        addLog("🔥 L'Aile de Phénix se consume et réinitialise la salle !");
        Inventory.render();
      }
      Dungeon.resetCurrentRoom();
    } else {
      Dungeon.resetFullDungeon();
    }
  });

  // --- BOUTONS UI ---
  btnAttack.addEventListener("click", () => Combat.heroTurn());
  btnPotion.addEventListener("click", () => usePotion());
  btnEquip.addEventListener("click", () => Inventory.autoEquipBest());
  btnCast.addEventListener("click", () => castSpell());
  btnRest.addEventListener("click", () => useTent());
  btnShop.addEventListener("click", () => Shop.open());

  if (btnToggleInventory && inventoryPanel) {
    btnToggleInventory.addEventListener("click", () => {
      inventoryPanel.classList.toggle("hidden");
    });
  }

  if (btnCloseInventory && inventoryPanel) {
    btnCloseInventory.addEventListener("click", () => {
      inventoryPanel.classList.add("hidden");
    });
  }

  // --- Initialisation minimale ---
  Dungeon.initFloor(1);

  if (builderStepsPanel) {
    builderStepsPanel.classList.remove("hidden");
    gameDiv.classList.add("hidden");
    heroSelectDiv.classList.remove("hidden");
    ccPanel.classList.add("hidden");
    builderSummaryPanel.classList.add("hidden");
    updateCCDisplay();
    setBuilderStep(1);
  }
});
