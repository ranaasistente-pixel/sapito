(() => {
  "use strict";

  const GAME_DURATION = 60;
  const GRAND_PRIZE_BUTTERFLY_GOAL = 10000;
  const GRAND_PRIZE_COIN_REWARD = 100;
  const PLAY_TYPES = {
    solo: {
      id: "solo",
      label: "Solo",
      targetScore: 100,
      hint: "Solo mode: one player, target 100 in 60 seconds."
    },
    team: {
      id: "team",
      label: "Team Co-op",
      targetScore: 160,
      hint: "Team mode: 2 players can click together (great for Discord screen-share). Team target is 160."
    },
    trio: {
      id: "trio",
      label: "Trio Co-op",
      targetScore: 210,
      hint: "Trio mode: 3 players can click together. Trio target is higher."
    }
  };
  const WIN_FOOD_REWARD = 100;
  const FOOD_PER_DOLLAR = 50;
  const FOOD_PACK_COIN_COST = 1;
  const FOOD_MARKET_PACK_UNITS = 50;
  const FOOD_MARKET_PACK_COST = 4;
  const DAILY_FOOD_PER_FROG = 12;
  const DECOR_MAX_PER_TYPE = 18;
  const SAPITO_MAIN_GREEN = "#58d56f";
  const LEVELS_PER_STAGE = 8;
  const PATH_LEVEL_COUNT = 15;
  const MAX_FROGS = 6;
  const GOLDEN_BUTTERFLY_VALUE = 50;
  const GOLDEN_BUTTERFLY_HELPER_DODGES = 5;
  const GOLDEN_BUTTERFLY_HELPER_DODGE_COOLDOWN_MS = 680;
  const GOLDEN_GUARD_COUNT = 50;
  const GOLDEN_GUARD_HITS = 3;
  const MAX_ACTIVE_SOLO_TARGETS = 48;
  const MAX_ACTIVE_TEAM_TARGETS = 64;
  const COIN_PACKS = [
    { id: "pack1", usd: 0.99, coins: 3, bonus: 0 },
    { id: "pack2", usd: 1.99, coins: 7, bonus: 1 },
    { id: "pack5", usd: 4.99, coins: 20, bonus: 0 }
  ];
  const COIN_PAYMENT = {
    demoMode: false,
    allowClientReturnCredit: false,
    discordClientId: "1499102503021838357",
    discordStoreAppId: "1499102503021838357",
    discordSdkModuleUrl: "https://cdn.jsdelivr.net/npm/@discord/embedded-app-sdk/+esm",
    discordSkuIds: {
      pack1: "1499163258878300205",
      pack2: "1499169911543562250",
      pack5: "1499170403325706412"
    },
    // Add your real checkout links here per pack.
    // Supported placeholders:
    // {RETURN_URL} (encoded), {RETURN_URL_RAW}, {CANCEL_URL} (encoded), {CANCEL_URL_RAW}, {PACK_ID}, {TX_ID}
    checkoutUrls: {
      pack1: "",
      pack2: "",
      pack5: ""
    },
    successParam: "coin_paid",
    txParam: "coin_tx",
    statusParam: "coin_status"
  };
  const BASE_GAME_TARGETS = [30, 40, 50, 60, 70, 80, 90, 100];
  const LEVEL_RULE_BOOK = (() => {
    const stage1PrizeButterflies = [30, 50, 50, 60, 70, 80, 90, 100];
    const stage5PrizeYellow = [20, 25, 25, 25, 25, 25, 25, 25];
    const stage5PrizeRed = [10, 15, 15, 15, 15, 15, 15, 15];
    const makeGames = ({
      requirementMainKey = "butterflies",
      prizeMainKey = requirementMainKey,
      requirementExtras = {},
      prizeExtras = {},
      prizeMainValues = null,
      targetScale = 1
    }) => BASE_GAME_TARGETS.map((target, index) => {
      const mainTarget = Math.max(1, Math.round(target * targetScale));
      const requirement = {
        ...requirementExtras,
        [requirementMainKey]: mainTarget
      };
      const prize = {
        ...prizeExtras,
        [prizeMainKey]: prizeMainValues ? (prizeMainValues[index] ?? mainTarget) : mainTarget
      };
      return {
        game: index + 1,
        requirement,
        prize
      };
    });

    const baseStages = [
      {
        stageId: 1,
        titleEn: "1 Green Frog · 1 Helper · 1st Level",
        titleEs: "1 sapito verde · 1 helper · 1er nivel",
        games: makeGames({
          requirementMainKey: "butterflies",
          prizeMainKey: "butterflies",
          prizeMainValues: stage1PrizeButterflies
        }),
        passPrize: {
          butterflies: 500,
          coins: 2,
          medals: 1,
          medalNameEn: "First Level Medal: golden butterfly crest in teddy bear",
          medalNameEs: "Medalla de primer nivel: cresta de mariposa dorada en teddy bear",
          helperUnlockEn: "Add additional pink frog helper",
          helperUnlockEs: "Agregar helper sapito rosa"
        }
      },
      {
        stageId: 2,
        titleEn: "2 Frogs · 2 Helpers (green and pink) · 2nd Level",
        titleEs: "2 sapitos · 2 helpers (verde y rosa) · 2do nivel",
        games: makeGames({
          requirementMainKey: "butterflies",
          prizeMainKey: "butterflies",
          requirementExtras: { worms: 23 },
          prizeExtras: { worms: 20 }
        }),
        passPrize: {
          butterflies: 500,
          worms: 100,
          coins: 4,
          medals: 1,
          medalNameEn: "Second Level Medal: additional golden butterfly next to teddy bear",
          medalNameEs: "Medalla de segundo nivel: mariposa dorada adicional junto al teddy bear",
          helperUnlockEn: "Add additional yellow frog helper",
          helperUnlockEs: "Agregar helper sapito amarillo"
        }
      },
      {
        stageId: 3,
        titleEn: "3 Frogs · 3 Helpers (green, pink, yellow) · 3rd Level",
        titleEs: "3 sapitos · 3 helpers (verde, rosa, amarillo) · 3er nivel",
        games: makeGames({
          requirementMainKey: "butterflies",
          prizeMainKey: "butterflies",
          requirementExtras: { worms: 25, flies: 30 },
          prizeExtras: { worms: 25, flies: 30 }
        }),
        passPrize: {
          butterflies: 500,
          worms: 100,
          flies: 75,
          coins: 5,
          medals: 1,
          medalNameEn: "Third Level Medal: another golden butterfly next to the others",
          medalNameEs: "Medalla de tercer nivel: otra mariposa dorada junto a las demas",
          helperUnlockEn: "Add additional purple frog helper",
          helperUnlockEs: "Agregar helper sapito morado"
        }
      },
      {
        stageId: 4,
        titleEn: "4 Frog Helpers (green, pink, yellow, purple) · 4th Level",
        titleEs: "4 helpers sapito (verde, rosa, amarillo, morado) · 4to nivel",
        games: makeGames({
          requirementMainKey: "blueButterflies",
          prizeMainKey: "blueButterflies",
          requirementExtras: { yellowButterflies: 15, worms: 30, flies: 30 },
          prizeExtras: { yellowButterflies: 15, worms: 30, flies: 30 }
        }),
        passPrize: {
          butterflies: 500,
          worms: 100,
          yellowButterflies: 75,
          flies: 75,
          coins: 5,
          medals: 1,
          medalNameEn: "Fourth Level Medal: golden butterfly next to the health bar",
          medalNameEs: "Medalla de cuarto nivel: mariposa dorada junto a la barra de salud",
          helperUnlockEn: "Add additional red frog helper",
          helperUnlockEs: "Agregar helper sapito rojo"
        }
      },
      {
        stageId: 5,
        titleEn: "5 Frog Helpers (green, pink, yellow, purple, red) · 5th Level",
        titleEs: "5 helpers sapito (verde, rosa, amarillo, morado, rojo) · 5to nivel",
        games: BASE_GAME_TARGETS.map((target, index) => ({
          game: index + 1,
          requirement: {
            blueButterflies: target,
            yellowButterflies: 25,
            redButterflies: 15,
            worms: 30,
            flies: 30
          },
          prize: {
            blueButterflies: target,
            yellowButterflies: stage5PrizeYellow[index],
            redButterflies: stage5PrizeRed[index],
            worms: 30,
            flies: 30
          }
        })),
        passPrize: {
          butterflies: 500,
          yellowButterflies: 200,
          redButterflies: 150,
          worms: 100,
          flies: 300,
          coins: 10,
          medals: 1,
          medalNameEn: "Grand Final Medal: archived golden butterfly next to health bar",
          medalNameEs: "Gran medalla final: mariposa dorada archivada junto a la barra de salud",
          helperUnlockEn: "Sapito Home Garden warm event for this game",
          helperUnlockEs: "Evento calido del jardin de Sapito Home para este juego"
        }
      }
    ];

    const extendedStages = [
      {
        stageId: 6,
        titleEn: "Ancient Bridge · River Crossing · 6th Level",
        titleEs: "Puente antiguo · Cruce del rio · 6to nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.1,
        requirementExtras: { yellowButterflies: 28, redButterflies: 18, worms: 34, flies: 34 },
        prizeExtras: { yellowButterflies: 28, redButterflies: 18, worms: 34, flies: 34 },
        passPrize: {
          butterflies: 650,
          yellowButterflies: 120,
          redButterflies: 90,
          worms: 140,
          flies: 140,
          coins: 8,
          medals: 1,
          medalNameEn: "Bridge Medal: moss stone crossing",
          medalNameEs: "Medalla del puente: cruce de piedra y musgo",
          helperUnlockEn: "Bridge route unlocked",
          helperUnlockEs: "Ruta del puente desbloqueada"
        }
      },
      {
        stageId: 7,
        titleEn: "Waterfall Steps · Fast Current · 7th Level",
        titleEs: "Escalones de cascada · Corriente rapida · 7mo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.18,
        requirementExtras: { yellowButterflies: 30, redButterflies: 20, worms: 36, flies: 38 },
        prizeExtras: { yellowButterflies: 30, redButterflies: 20, worms: 36, flies: 38 },
        passPrize: {
          butterflies: 700,
          yellowButterflies: 135,
          redButterflies: 100,
          worms: 150,
          flies: 160,
          coins: 8,
          medals: 1,
          medalNameEn: "Waterfall Medal: silver ripple",
          medalNameEs: "Medalla de cascada: onda plateada",
          helperUnlockEn: "Fast current route unlocked",
          helperUnlockEs: "Ruta de corriente rapida desbloqueada"
        }
      },
      {
        stageId: 8,
        titleEn: "Sakura Pond · Pink Bloom · 8th Level",
        titleEs: "Estanque sakura · Flor rosa · 8vo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.26,
        requirementExtras: { yellowButterflies: 34, redButterflies: 22, worms: 38, flies: 40 },
        prizeExtras: { yellowButterflies: 34, redButterflies: 22, worms: 38, flies: 40 },
        passPrize: {
          butterflies: 760,
          yellowButterflies: 150,
          redButterflies: 115,
          worms: 165,
          flies: 175,
          coins: 9,
          medals: 1,
          medalNameEn: "Sakura Medal: petal pond crest",
          medalNameEs: "Medalla sakura: cresta de petalos",
          helperUnlockEn: "Sakura pond route unlocked",
          helperUnlockEs: "Ruta del estanque sakura desbloqueada"
        }
      },
      {
        stageId: 9,
        titleEn: "Lotus Middle · Glow Water · 9th Level",
        titleEs: "Loto central · Agua brillante · 9no nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.34,
        requirementExtras: { yellowButterflies: 38, redButterflies: 24, worms: 40, flies: 42 },
        prizeExtras: { yellowButterflies: 38, redButterflies: 24, worms: 40, flies: 42 },
        passPrize: {
          butterflies: 820,
          yellowButterflies: 165,
          redButterflies: 125,
          worms: 180,
          flies: 190,
          coins: 9,
          medals: 1,
          medalNameEn: "Lotus Medal: glowing bloom",
          medalNameEs: "Medalla loto: flor brillante",
          helperUnlockEn: "Lotus route unlocked",
          helperUnlockEs: "Ruta del loto desbloqueada"
        }
      },
      {
        stageId: 10,
        titleEn: "Umbrella Dock · Rest Island · 10th Level",
        titleEs: "Muelle sombrilla · Isla de descanso · 10mo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.42,
        requirementExtras: { yellowButterflies: 42, redButterflies: 26, worms: 42, flies: 45 },
        prizeExtras: { yellowButterflies: 42, redButterflies: 26, worms: 42, flies: 45 },
        passPrize: {
          butterflies: 900,
          yellowButterflies: 180,
          redButterflies: 140,
          worms: 200,
          flies: 210,
          coins: 10,
          medals: 1,
          medalNameEn: "Dock Medal: tiny umbrella badge",
          medalNameEs: "Medalla del muelle: insignia de sombrilla",
          helperUnlockEn: "Rest island route unlocked",
          helperUnlockEs: "Ruta de isla de descanso desbloqueada"
        }
      },
      {
        stageId: 11,
        titleEn: "Deep Blue Pond · Night Sparks · 11th Level",
        titleEs: "Estanque azul profundo · Chispas nocturnas · 11vo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.5,
        requirementExtras: { yellowButterflies: 46, redButterflies: 30, worms: 46, flies: 48 },
        prizeExtras: { yellowButterflies: 46, redButterflies: 30, worms: 46, flies: 48 },
        passPrize: {
          butterflies: 980,
          yellowButterflies: 200,
          redButterflies: 155,
          worms: 220,
          flies: 230,
          coins: 10,
          medals: 1,
          medalNameEn: "Night Spark Medal: blue firefly shine",
          medalNameEs: "Medalla chispa nocturna: brillo azul",
          helperUnlockEn: "Night pond route unlocked",
          helperUnlockEs: "Ruta del estanque nocturno desbloqueada"
        }
      },
      {
        stageId: 12,
        titleEn: "Purple Lotus · Mystic Middle · 12th Level",
        titleEs: "Loto morado · Centro mistico · 12vo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.58,
        requirementExtras: { yellowButterflies: 50, redButterflies: 34, worms: 50, flies: 52 },
        prizeExtras: { yellowButterflies: 50, redButterflies: 34, worms: 50, flies: 52 },
        passPrize: {
          butterflies: 1060,
          yellowButterflies: 220,
          redButterflies: 175,
          worms: 240,
          flies: 250,
          coins: 11,
          medals: 1,
          medalNameEn: "Mystic Lotus Medal: purple bloom",
          medalNameEs: "Medalla loto mistico: flor morada",
          helperUnlockEn: "Mystic middle route unlocked",
          helperUnlockEs: "Ruta del centro mistico desbloqueada"
        }
      },
      {
        stageId: 13,
        titleEn: "Skull Shore · Danger Bend · 13th Level",
        titleEs: "Orilla calavera · Curva peligrosa · 13er nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.66,
        requirementExtras: { yellowButterflies: 55, redButterflies: 38, worms: 54, flies: 56 },
        prizeExtras: { yellowButterflies: 55, redButterflies: 38, worms: 54, flies: 56 },
        passPrize: {
          butterflies: 1160,
          yellowButterflies: 240,
          redButterflies: 195,
          worms: 260,
          flies: 275,
          coins: 12,
          medals: 1,
          medalNameEn: "Skull Shore Medal: brave bend",
          medalNameEs: "Medalla orilla calavera: curva valiente",
          helperUnlockEn: "Danger bend route unlocked",
          helperUnlockEs: "Ruta de curva peligrosa desbloqueada"
        }
      },
      {
        stageId: 14,
        titleEn: "Lava Lily · Final Heat · 14th Level",
        titleEs: "Lirio de lava · Calor final · 14vo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.74,
        requirementExtras: { yellowButterflies: 60, redButterflies: 44, worms: 58, flies: 60 },
        prizeExtras: { yellowButterflies: 60, redButterflies: 44, worms: 58, flies: 60 },
        passPrize: {
          butterflies: 1280,
          yellowButterflies: 265,
          redButterflies: 220,
          worms: 290,
          flies: 300,
          coins: 13,
          medals: 1,
          medalNameEn: "Lava Lily Medal: ember bloom",
          medalNameEs: "Medalla lirio de lava: flor brasa",
          helperUnlockEn: "Final heat route unlocked",
          helperUnlockEs: "Ruta de calor final desbloqueada"
        }
      },
      {
        stageId: 15,
        titleEn: "Treasure Lily · Golden Chest · 15th Level",
        titleEs: "Lirio tesoro · Cofre dorado · 15vo nivel",
        requirementMainKey: "blueButterflies",
        prizeMainKey: "blueButterflies",
        targetScale: 1.85,
        requirementExtras: { yellowButterflies: 70, redButterflies: 50, worms: 65, flies: 70 },
        prizeExtras: { yellowButterflies: 70, redButterflies: 50, worms: 65, flies: 70 },
        passPrize: {
          butterflies: 2000,
          yellowButterflies: 500,
          redButterflies: 400,
          worms: 500,
          flies: 500,
          coins: 25,
          medals: 3,
          medalNameEn: "Golden Chest Medal: Sapito path champion",
          medalNameEs: "Medalla cofre dorado: campeon de la ruta Sapito",
          helperUnlockEn: "Treasure route complete",
          helperUnlockEs: "Ruta del tesoro completa"
        }
      }
    ].map((stage) => ({
      stageId: stage.stageId,
      titleEn: stage.titleEn,
      titleEs: stage.titleEs,
      games: makeGames(stage),
      passPrize: stage.passPrize
    }));

    return [...baseStages, ...extendedStages].slice(0, PATH_LEVEL_COUNT);
  })();
  const SAPITO_COLOR_SKINS = [
    { id: "green", color: SAPITO_MAIN_GREEN, cost: 0, nameEn: "Classic Green", nameEs: "Verde clasico" },
    { id: "aqua", color: "#6de2d9", cost: 5, nameEn: "Aqua Mint", nameEs: "Menta Aqua" },
    { id: "sky", color: "#63b6ff", cost: 5, nameEn: "Sky Blue", nameEs: "Azul Cielo" },
    { id: "violet", color: "#b184ff", cost: 5, nameEn: "Violet Pop", nameEs: "Violeta Pop" },
    { id: "sun", color: "#ffd45c", cost: 5, nameEn: "Sun Gold", nameEs: "Dorado Sol" },
    { id: "rose", color: "#ff84bc", cost: 5, nameEn: "Rose Glow", nameEs: "Rosa Glow" }
  ];
  const SAPITO_TATTOOS = [
    { id: "none", symbol: "", cost: 0, nameEn: "None", nameEs: "Ninguno" },
    { id: "star", symbol: "⭐", cost: 5, nameEn: "Star", nameEs: "Estrella" },
    { id: "heart", symbol: "💚", cost: 5, nameEn: "Heart", nameEs: "Corazon" },
    { id: "moon", symbol: "🌙", cost: 5, nameEn: "Moon", nameEs: "Luna" },
    { id: "bolt", symbol: "⚡", cost: 5, nameEn: "Bolt", nameEs: "Rayo" }
  ];
  const PUZZLE_ROWS = 4;
  const PUZZLE_COLS = 5;
  const PUZZLE_PIECE_COIN_COST = 2;
  const PUZZLE_PIECE_DATA = [
    { id: "fernCanopyWest", labelEn: "Fern Canopy West", labelEs: "Helecho oeste" },
    { id: "rockRipple", labelEn: "Rock Ripple", labelEs: "Rocas del agua" },
    { id: "sunBeamMist", labelEn: "Sun Beam Mist", labelEs: "Rayos de luz" },
    { id: "bloomDrift", labelEn: "Bloom Drift", labelEs: "Flores flotantes" },
    { id: "fernCanopyEast", labelEn: "Fern Canopy East", labelEs: "Helecho este" },
    { id: "westPondShore", labelEn: "West Pond Shore", labelEs: "Orilla oeste" },
    { id: "softCurrent", labelEn: "Soft Current", labelEs: "Corriente suave" },
    { id: "sparkTrail", labelEn: "Spark Trail", labelEs: "Brillos del agua" },
    { id: "petalStream", labelEn: "Petal Stream", labelEs: "Corriente floral" },
    { id: "eastPondShore", labelEn: "East Pond Shore", labelEs: "Orilla este" },
    { id: "waterleafGarden", labelEn: "Waterleaf Garden", labelEs: "Jardin acuatico" },
    { id: "lilyNest", labelEn: "Lily Nest", labelEs: "Nido de lirio" },
    { id: "midpondLily", labelEn: "Midpond Lily", labelEs: "Lirio central" },
    { id: "snailCorner", labelEn: "Snail Corner", labelEs: "Esquina del caracol" },
    { id: "reedLilyEdge", labelEn: "Reed Lily Edge", labelEs: "Lirio del junco" },
    { id: "fernFloor", labelEn: "Fern Floor", labelEs: "Suelo de helecho" },
    { id: "purpleSapitoHome", labelEn: "Purple Sapito Home", labelEs: "Hogar de sapito morado" },
    { id: "whiteLotusShine", labelEn: "White Lotus Shine", labelEs: "Loto brillante" },
    { id: "bambooRise", labelEn: "Bamboo Rise", labelEs: "Bambu del lago" },
    { id: "cattailGuard", labelEn: "Cattail Guard", labelEs: "Guardian de juncos" }
  ];
  const DECOR_ITEMS = Object.fromEntries(
    PUZZLE_PIECE_DATA.map((piece) => [
      piece.id,
      {
        id: piece.id,
        coinCost: PUZZLE_PIECE_COIN_COST,
        maxCount: 1,
        labelEn: piece.labelEn,
        labelEs: piece.labelEs
      }
    ])
  );
  const DECOR_ORDER = PUZZLE_PIECE_DATA.map((piece) => piece.id);
  const HABITAT_TARGET_IMAGE = "assets/decor/sapito-habitat-clean.png";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const PUZZLE_TILE_UNITS = 100;
  const PUZZLE_TAB_DEPTH = 12;
  const PUZZLE_TAB_START = 38;
  const PUZZLE_TAB_END = 62;
  const PUZZLE_VIEWBOX_PAD = 14;
  const MAIN_PUZZLE_SEAM_BLEED_PX = 1.75;
  let puzzlePieceSvgIdCounter = 0;

  function buildPuzzlePieceMap(pieceIds, rows, cols) {
    const safeRows = Math.max(1, Math.floor(rows));
    const safeCols = Math.max(1, Math.floor(cols));
    const tileW = 1 / safeCols;
    const tileH = 1 / safeRows;
    const map = {};
    pieceIds.forEach((id, index) => {
      const row = Math.floor(index / safeCols);
      const col = index % safeCols;
      map[id] = {
        x: Number((col * tileW).toFixed(6)),
        y: Number((row * tileH).toFixed(6)),
        w: Number(tileW.toFixed(6)),
        h: Number(tileH.toFixed(6)),
        z: 2 + row
      };
    });
    return map;
  }

  const HABITAT_PUZZLE_PIECES = buildPuzzlePieceMap(DECOR_ORDER, PUZZLE_ROWS, PUZZLE_COLS);
  const PERSONALITY_STAGES = [
    {
      id: 1,
      name: "Crying Baby",
      lines: [
        "Waa... juega conmigo. / Waa... play with me.",
        "Necesito abrazos y mariposas. / Need hugs and butterflies."
      ]
    },
    {
      id: 2,
      name: "Nino Travieso",
      lines: [
        "Jeje, atrapame si puedes. / Hehe, catch me if you can.",
        "Modo travieso activado. / Mischief mode on."
      ]
    },
    {
      id: 3,
      name: "Rebel Teen",
      lines: [
        "Como sea... seguimos jugando. / Whatever... we still grind.",
        "Reglas opcionales, estilo obligatorio. / Rules optional, style required."
      ]
    },
    {
      id: 4,
      name: "Confuse Dude",
      lines: [
        "Espera... a donde voy? / Wait... where am I going?",
        "Tenia un plan... creo. / I had a plan... maybe."
      ]
    },
    {
      id: 5,
      name: "Midage Control Freak",
      lines: [
        "Checklist: jugar, alimentar, repetir. / Checklist: play, feed, repeat.",
        "Primero orden, luego orden. / Order first, chaos never."
      ]
    },
    {
      id: 6,
      name: "Grampy Grampa",
      lines: [
        "En mis dias de estanque... / Back in my pond days...",
        "Saltos tranquilos ganan largo plazo. / Steady hops win long games."
      ],
      legendLines: [
        "Energia gran maestro del estanque. / Grand Master pond energy.",
        "Rango leyenda desbloqueado. / Legend rank unlocked."
      ]
    }
  ];

  const STORAGE = {
    level: "bc_level",
    highestCleared: "bc_highest_cleared",
    bestScore: "bc_best_score",
    sound: "bc_sound",
    reduceMotion: "bc_reduce_motion",
    language: "bc_language",
    skin: "bc_skin",
    mode: "bc_mode",
    playType: "bc_play_type",
    foodBalance: "bc_food_balance",
    decorCounts: "bc_decor_counts",
    sapitoColor: "bc_sapito_color",
    ownedSapitoColors: "bc_owned_sapito_colors",
    sapitoTattoo: "bc_sapito_tattoo",
    ownedSapitoTattoos: "bc_owned_sapito_tattoos",
    lastDailyCheck: "bc_last_daily_check",
    ownedSkins: "bc_owned_skins",
    lastActivityAt: "bc_last_activity_at",
    wormBank: "bc_worm_bank",
    flyBank: "bc_fly_bank",
    yellowButterflyBank: "bc_yellow_butterfly_bank",
    redButterflyBank: "bc_red_butterfly_bank",
    medalCount: "bc_medal_count",
    coinBalance: "bc_coin_balance",
    sapitoHealth: "bc_sapito_health",
    totalButterfliesCaught: "bc_total_butterflies_caught",
    grandPrizeAwarded: "bc_grand_prize_awarded",
    discordUserId: "bc_discord_user_id",
    coinPaymentTxHistory: "bc_coin_payment_tx_history",
    coinCreditHistory: "bc_coin_credit_history"
  };

  const SKINS = [
    {
      id: "default",
      name: "Classic Meadow",
      unlockLevel: 1,
      vars: {
        "--bg-1": "#c9f8ff",
        "--bg-2": "#8fd6ff",
        "--panel-bg": "#ffffff",
        "--panel-text": "#1b1b1b",
        "--hud-bg": "rgba(0, 0, 0, 0.84)",
        "--hud-text": "#ffffff",
        "--accent": "#0f7bff",
        "--accent-text": "#ffffff",
        "--player-bg": "#2267ff",
        "--player-border": "#07223f",
        "--butterfly-filter": "hue-rotate(0deg) saturate(1.1)"
      }
    },
    {
      id: "sunset",
      name: "Sunset Garden",
      unlockLevel: 2,
      vars: {
        "--bg-1": "#ffd0a8",
        "--bg-2": "#ff8e8e",
        "--panel-bg": "#fff7ef",
        "--panel-text": "#261103",
        "--hud-bg": "rgba(41, 12, 0, 0.9)",
        "--hud-text": "#fff3e6",
        "--accent": "#f9652f",
        "--accent-text": "#ffffff",
        "--player-bg": "#ff8a29",
        "--player-border": "#4f2100",
        "--butterfly-filter": "hue-rotate(30deg) saturate(1.4)"
      }
    },
    {
      id: "moonlight",
      name: "Moonlight Glow",
      unlockLevel: 3,
      vars: {
        "--bg-1": "#1f2a69",
        "--bg-2": "#3f57b5",
        "--panel-bg": "#edf2ff",
        "--panel-text": "#131a3f",
        "--hud-bg": "rgba(6, 9, 37, 0.92)",
        "--hud-text": "#f1f4ff",
        "--accent": "#6f88ff",
        "--accent-text": "#ffffff",
        "--player-bg": "#8fa1ff",
        "--player-border": "#15225a",
        "--butterfly-filter": "hue-rotate(160deg) saturate(1.2)"
      }
    },
    {
      id: "sakura",
      name: "Sakura Dream",
      unlockLevel: 4,
      vars: {
        "--bg-1": "#ffe3ee",
        "--bg-2": "#ffc5de",
        "--panel-bg": "#fff9fc",
        "--panel-text": "#3d1026",
        "--hud-bg": "rgba(79, 20, 53, 0.9)",
        "--hud-text": "#fff0f8",
        "--accent": "#d74186",
        "--accent-text": "#ffffff",
        "--player-bg": "#ff76b9",
        "--player-border": "#5f1236",
        "--butterfly-filter": "hue-rotate(290deg) saturate(1.25)"
      }
    },
    {
      id: "golden",
      name: "Golden Royal",
      unlockLevel: 5,
      vars: {
        "--bg-1": "#fff2ba",
        "--bg-2": "#f8cd4f",
        "--panel-bg": "#fffdf4",
        "--panel-text": "#3f2e00",
        "--hud-bg": "rgba(54, 38, 0, 0.92)",
        "--hud-text": "#fff9dc",
        "--accent": "#be8c00",
        "--accent-text": "#ffffff",
        "--player-bg": "#ffcf2d",
        "--player-border": "#4f3700",
        "--butterfly-filter": "hue-rotate(70deg) saturate(1.6)"
      }
    }
  ];
  const SKIN_PRICES = {
    sunset: 90,
    moonlight: 130,
    sakura: 180,
    golden: 260
  };

  const BUTTERFLY_EMOJIS = ["🦋", "🦋", "🦋", "🌸", "✨"];
  const GOLDEN_BUTTERFLY_EMOJI = "🦋";
  const MANUAL_FEED_BURST_UNITS = 12;
  const URL_QUERY = new URLSearchParams(window.location.search);
  const QA_MODE = URL_QUERY.has("qa");

  const ui = {
    gameArea: document.getElementById("gameArea"),
    homeScene: document.getElementById("homeScene"),
    homeDecorLayer: document.getElementById("homeDecorLayer"),
    homeItemsLayer: document.getElementById("homeItemsLayer"),
    homeSapito: document.getElementById("homeSapito"),
    homeSapitoSpeech: document.getElementById("homeSapitoSpeech"),
    homeCoinBtn: document.getElementById("homeCoinBtn"),
    homeCoinLabel: document.getElementById("homeCoinLabel"),
    homeCoinValue: document.getElementById("homeCoinValue"),
    homeFoodBtn: document.getElementById("homeFoodBtn"),
    homeFoodLabel: document.getElementById("homeFoodLabel"),
    homeFoodValue: document.getElementById("homeFoodValue"),
    homeFoodBreakdown: document.getElementById("homeFoodBreakdown"),
    homeFoodBtfLine: document.getElementById("homeFoodBtfLine"),
    homeFoodWrmLine: document.getElementById("homeFoodWrmLine"),
    homeFoodFlyLine: document.getElementById("homeFoodFlyLine"),
    homeHealthMeter: document.getElementById("homeHealthMeter"),
    homeHealthTitle: document.getElementById("homeHealthTitle"),
    homeHealthTrack: document.getElementById("homeHealthTrack"),
    homeHealthFill: document.getElementById("homeHealthFill"),
    homeHealthText: document.getElementById("homeHealthText"),
    roadMapBtn: document.getElementById("roadMapBtn"),
    roadMapPopup: document.getElementById("roadMapPopup"),
    closeRoadMapBtn: document.getElementById("closeRoadMapBtn"),
    player: document.getElementById("player"),
    score: document.getElementById("score"),
    time: document.getElementById("time"),
    target: document.getElementById("target"),
    food: document.getElementById("food"),
    level: document.getElementById("level"),

    startScreen: document.getElementById("startScreen"),
    pauseScreen: document.getElementById("pauseScreen"),
    resultScreen: document.getElementById("resultScreen"),
    settingsToggleBtn: document.getElementById("settingsToggleBtn"),
    settingsBox: document.getElementById("settingsBox"),
    settingsTitle: document.getElementById("settingsTitle"),
    settingsDescription: document.getElementById("settingsDescription"),
    desktopHelp: document.getElementById("desktopHelp"),
    mobileHelp: document.getElementById("mobileHelp"),
    modeFieldLabel: document.getElementById("modeFieldLabel"),
    puzzleFieldLabel: document.getElementById("puzzleFieldLabel"),
    playersFieldLabel: document.getElementById("playersFieldLabel"),
    languageFieldLabel: document.getElementById("languageFieldLabel"),
    soundToggleLabel: document.getElementById("soundToggleLabel"),
    motionToggleLabel: document.getElementById("motionToggleLabel"),
    shopSeparateNote: document.getElementById("shopSeparateNote"),
    shopBox: document.getElementById("shopBox"),
    shopSheet: document.getElementById("shopSheet"),
    petFrogPreview: document.getElementById("petFrogPreview"),
    petHomeTitle: document.getElementById("petHomeTitle"),
    petFoodButterfly: document.getElementById("petFoodButterfly"),
    petFoodWorm: document.getElementById("petFoodWorm"),
    petFoodFly: document.getElementById("petFoodFly"),
    homeShopBtn: document.getElementById("homeShopBtn"),
    openRulesBtn: document.getElementById("openRulesBtn"),
    openLegalBtn: document.getElementById("openLegalBtn"),
    closeRulesBtn: document.getElementById("closeRulesBtn"),
    rulesPopup: document.getElementById("rulesPopup"),
    rulesPopupTitle: document.getElementById("rulesPopupTitle"),
    rulesPopupSubtitle: document.getElementById("rulesPopupSubtitle"),
    rulesTableWrap: document.getElementById("rulesTableWrap"),
    coinTopupPopup: document.getElementById("coinTopupPopup"),
    coinTopupTitle: document.getElementById("coinTopupTitle"),
    coinTopupBalanceLine: document.getElementById("coinTopupBalanceLine"),
    coinTopupHint: document.getElementById("coinTopupHint"),
    coinTopupLegalNote: document.getElementById("coinTopupLegalNote"),
    coinTopupLegalText: document.getElementById("coinTopupLegalText"),
    coinTopupLegalBtn: document.getElementById("coinTopupLegalBtn"),
    coinTopupPack1Btn: document.getElementById("coinTopupPack1Btn"),
    coinTopupPack2Btn: document.getElementById("coinTopupPack2Btn"),
    coinTopupPack5Btn: document.getElementById("coinTopupPack5Btn"),
    coinTopupStoreLink: document.getElementById("coinTopupStoreLink"),
    coinTopupCloseBtn: document.getElementById("coinTopupCloseBtn"),
    legalPopup: document.getElementById("legalPopup"),
    legalNoticeTitle: document.getElementById("legalNoticeTitle"),
    legalNoticeBody: document.getElementById("legalNoticeBody"),
    closeLegalBtn: document.getElementById("closeLegalBtn"),
    openFoodMarketBtn: document.getElementById("openFoodMarketBtn"),
    foodMarketPopup: document.getElementById("foodMarketPopup"),
    foodMarketTitle: document.getElementById("foodMarketTitle"),
    foodMarketBalanceLine: document.getElementById("foodMarketBalanceLine"),
    foodMarketHint: document.getElementById("foodMarketHint"),
    foodMarketBuyCoinsBtn: document.getElementById("foodMarketBuyCoinsBtn"),
    buyFoodMix50Btn: document.getElementById("buyFoodMix50Btn"),
    buyFoodWorm50Btn: document.getElementById("buyFoodWorm50Btn"),
    buyFoodFly50Btn: document.getElementById("buyFoodFly50Btn"),
    foodMarketCloseBtn: document.getElementById("foodMarketCloseBtn"),
    foodEmptyPopup: document.getElementById("foodEmptyPopup"),
    foodEmptyTitle: document.getElementById("foodEmptyTitle"),
    foodEmptyText: document.getElementById("foodEmptyText"),
    foodEmptyBuyBtn: document.getElementById("foodEmptyBuyBtn"),
    foodEmptyPlayBtn: document.getElementById("foodEmptyPlayBtn"),
    foodEmptyShopBtn: document.getElementById("foodEmptyShopBtn"),
    foodEmptyCloseBtn: document.getElementById("foodEmptyCloseBtn"),
    openShopFromSettingsBtn: document.getElementById("openShopFromSettingsBtn"),
    closeShopBtn: document.getElementById("closeShopBtn"),
    shopScrollDownBtn: document.getElementById("shopScrollDownBtn"),
    openPuzzleCatalogBtn: document.getElementById("openPuzzleCatalogBtn"),
    habitatPuzzleTitle: document.getElementById("habitatPuzzleTitle"),
    habitatPuzzleHint: document.getElementById("habitatPuzzleHint"),
    habitatPuzzleCta: document.getElementById("habitatPuzzleCta"),
    habitatPuzzlePreview: document.getElementById("habitatPuzzlePreview"),
    puzzleQuickPopup: document.getElementById("puzzleQuickPopup"),
    puzzleQuickTitle: document.getElementById("puzzleQuickTitle"),
    closePuzzleQuickBtn: document.getElementById("closePuzzleQuickBtn"),
    puzzleQuickHint: document.getElementById("puzzleQuickHint"),
    openHabitatViewBtn: document.getElementById("openHabitatViewBtn"),
    openPuzzleCatalogFromQuickBtn: document.getElementById("openPuzzleCatalogFromQuickBtn"),
    habitatViewPopup: document.getElementById("habitatViewPopup"),
    habitatViewTitle: document.getElementById("habitatViewTitle"),
    closeHabitatViewBtn: document.getElementById("closeHabitatViewBtn"),
    habitatViewHint: document.getElementById("habitatViewHint"),
    habitatViewPreview: document.getElementById("habitatViewPreview"),
    habitatViewProgress: document.getElementById("habitatViewProgress"),
    puzzleProgressInline: document.getElementById("puzzleProgressInline"),
    puzzleCatalogPopup: document.getElementById("puzzleCatalogPopup"),
    puzzleCatalogTitle: document.getElementById("puzzleCatalogTitle"),
    puzzleCatalogSubtitle: document.getElementById("puzzleCatalogSubtitle"),
    puzzleCatalogProgress: document.getElementById("puzzleCatalogProgress"),
    puzzleCatalogGrid: document.getElementById("puzzleCatalogGrid"),
    closePuzzleCatalogBtn: document.getElementById("closePuzzleCatalogBtn"),
    puzzlePiecePreviewPopup: document.getElementById("puzzlePiecePreviewPopup"),
    puzzlePiecePreviewTitle: document.getElementById("puzzlePiecePreviewTitle"),
    closePuzzlePiecePreviewBtn: document.getElementById("closePuzzlePiecePreviewBtn"),
    puzzlePiecePreviewArt: document.getElementById("puzzlePiecePreviewArt"),
    puzzlePiecePreviewName: document.getElementById("puzzlePiecePreviewName"),
    puzzlePiecePreviewStatus: document.getElementById("puzzlePiecePreviewStatus"),
    puzzlePiecePreviewBuyBtn: document.getElementById("puzzlePiecePreviewBuyBtn"),
    closeSettingsBtn: document.getElementById("closeSettingsBtn"),
    habitatPanel: document.getElementById("habitatPanel"),
    coinBankTitle: document.getElementById("coinBankTitle"),
    coinBankHint: document.getElementById("coinBankHint"),
    coinBalanceLine: document.getElementById("coinBalanceLine"),
    buyCoinPack1Btn: document.getElementById("buyCoinPack1Btn"),
    buyCoinPack2Btn: document.getElementById("buyCoinPack2Btn"),
    buyCoinPack5Btn: document.getElementById("buyCoinPack5Btn"),

    startBtn: document.getElementById("startBtn"),
    pauseBtn: document.getElementById("pauseBtn"),
    resumeBtn: document.getElementById("resumeBtn"),
    restartFromPauseBtn: document.getElementById("restartFromPauseBtn"),
    pauseQuitBtn: document.getElementById("pauseQuitBtn"),
    restartBtn: document.getElementById("restartBtn"),
    quitBtn: document.getElementById("quitBtn"),
    nextLevelBtn: document.getElementById("nextLevelBtn"),
    resultMapBtn: document.getElementById("resultMapBtn"),

    resultTitle: document.getElementById("resultTitle"),
    resultMessage: document.getElementById("resultMessage"),
    resultUnlockLine: document.getElementById("resultUnlockLine"),
    resultStats: document.getElementById("resultStats"),

    modeSelect: document.getElementById("modeSelect"),
    languageSelect: document.getElementById("languageSelect"),
    playTypeSelect: document.getElementById("playTypeSelect"),
    playTypeHint: document.getElementById("playTypeHint"),
    skinSelectStart: document.getElementById("skinSelectStart"),
    puzzleProgressLine: document.getElementById("puzzleProgressLine"),
    skinSelectPause: document.getElementById("skinSelectPause"),
    frogStatusLine: document.getElementById("frogStatusLine"),
    foodStatusLine: document.getElementById("foodStatusLine"),
    foodHealthLine: document.getElementById("foodHealthLine"),
    rewardStatusLine: document.getElementById("rewardStatusLine"),
    decorShopTitle: document.getElementById("decorShopTitle"),
    decorShopStatus: document.getElementById("decorShopStatus"),
    sapitoStyleTitle: document.getElementById("sapitoStyleTitle"),
    sapitoColorLabel: document.getElementById("sapitoColorLabel"),
    sapitoColorSelect: document.getElementById("sapitoColorSelect"),
    sapitoTattooLabel: document.getElementById("sapitoTattooLabel"),
    sapitoTattooSelect: document.getElementById("sapitoTattooSelect"),
    sapitoColorCatalog: document.getElementById("sapitoColorCatalog"),
    sapitoTattooCatalog: document.getElementById("sapitoTattooCatalog"),
    sapitoStyleInfo: document.getElementById("sapitoStyleInfo"),
    skinShopInfo: document.getElementById("skinShopInfo"),
    buyFoodBtn: document.getElementById("buyFoodBtn"),
    buySkinBtn: document.getElementById("buySkinBtn"),
    buyColorSkinBtn: document.getElementById("buyColorSkinBtn"),
    buyTattooBtn: document.getElementById("buyTattooBtn"),
    buyDecorLeafBtn: document.getElementById("buyDecorLeafBtn"),
    buyDecorLotusBtn: document.getElementById("buyDecorLotusBtn"),
    buyDecorGrassBtn: document.getElementById("buyDecorGrassBtn"),
    buyDecorStoneBtn: document.getElementById("buyDecorStoneBtn"),
    buyDecorPurpleFrogBtn: document.getElementById("buyDecorPurpleFrogBtn"),
    catalogThemeInfo: document.getElementById("catalogThemeInfo"),
    catalogLeafInfo: document.getElementById("catalogLeafInfo"),
    catalogLotusInfo: document.getElementById("catalogLotusInfo"),
    catalogGrassInfo: document.getElementById("catalogGrassInfo"),
    catalogStoneInfo: document.getElementById("catalogStoneInfo"),
    catalogPurpleFrogInfo: document.getElementById("catalogPurpleFrogInfo"),
    catalogColorInfo: document.getElementById("catalogColorInfo"),
    catalogTattooInfo: document.getElementById("catalogTattooInfo"),
    catalogBuyFoodBtn: document.getElementById("catalogBuyFoodBtn"),
    catalogBuyThemeBtn: document.getElementById("catalogBuyThemeBtn"),
    catalogBuyLeafBtn: document.getElementById("catalogBuyLeafBtn"),
    catalogBuyLotusBtn: document.getElementById("catalogBuyLotusBtn"),
    catalogBuyGrassBtn: document.getElementById("catalogBuyGrassBtn"),
    catalogBuyStoneBtn: document.getElementById("catalogBuyStoneBtn"),
    catalogBuyPurpleFrogBtn: document.getElementById("catalogBuyPurpleFrogBtn"),
    catalogBuyColorBtn: document.getElementById("catalogBuyColorBtn"),
    catalogBuyTattooBtn: document.getElementById("catalogBuyTattooBtn"),

    soundToggle: document.getElementById("soundToggle"),
    motionToggle: document.getElementById("motionToggle"),
    soundTogglePause: document.getElementById("soundTogglePause"),
    motionTogglePause: document.getElementById("motionTogglePause"),

    unlockToast: document.getElementById("unlockToast"),
    evolutionCeremony: document.getElementById("evolutionCeremony"),
    evolutionCard: document.getElementById("evolutionCard"),
    evolutionTitle: document.getElementById("evolutionTitle"),
    evolutionText: document.getElementById("evolutionText"),
    mobileControls: [...document.querySelectorAll(".control")],
    qaPanel: null,
    qaStatus: null,
    qaWinBtn: null,
    qaLossBtn: null
  };

  const state = {
    running: false,
    paused: false,
    score: 0,
    timeLeft: GAME_DURATION,
    level: 1,
    highestCleared: 0,
    bestScore: 0,
    foodBalance: 0,
    wormBank: 0,
    flyBank: 0,
    yellowButterflyBank: 0,
    redButterflyBank: 0,
    medalCount: 0,
    coinBalance: 0,
    sapitoHealth: 100,
    totalButterfliesCaught: 0,
    grandPrizeAwarded: false,
    decorCounts: {
      leaf: 0,
      lotus: 0,
      grass: 0,
      stone: 0
    },
    lastDailyCheck: "",
    dailyFeedMessage: "",
    settingsOpen: false,
    shopOpen: false,
    puzzleQuickOpen: false,
    habitatViewOpen: false,
    puzzleCatalogOpen: false,
    puzzlePiecePreviewOpen: false,
    activePuzzlePieceId: "",
    puzzleCatalogOrder: [],
    rulesOpen: false,
    legalOpen: false,
    roadMapOpen: false,
    coinTopupOpen: false,
    foodMarketOpen: false,
    foodEmptyOpen: false,
    mode: "easy",
    language: "en",
    playType: "solo",
    selectedSkin: "default",
    unlockedSkins: new Set(["default"]),
    ownedSkins: new Set(["default"]),
    sapitoColorId: "green",
    ownedSapitoColors: new Set(["green"]),
    sapitoTattooId: "none",
    ownedSapitoTattoos: new Set(["none"]),
    soundOn: false,
    reduceMotion: false,
    discordSdk: null,
    discordReady: false,
    discordUserId: "",
    lastActivityAt: Date.now(),
    lastActivityPersistAt: 0,
    neglectStage: 0,
    neglectSpeechIndex: 0,
    neglectSpeechNextAt: 0,
    homeRunning: false,
    homeItems: [],
    homeDecorElements: [],
    nextHomeItemId: 1,
    homeLastFrameTime: 0,
    homeSpawnAccumulator: 0,
    homeScatterCheckAt: 0,
    homeClusterStrikes: 0,
    homeSapito: {
      x: 0,
      y: 0,
      size: 104,
      speed: 112,
      wanderTimer: 0,
      wanderAngle: 0
    },

    butterflies: [],
    nextButterflyId: 1,
    frogs: [],
    nextFrogId: 1,
    helperScore: 0,
    helperCapToastShown: false,
    goldenButterflySpawned: false,
    goldenButterflyCaught: false,
    spawnAccumulator: 0,
    lastFrameTime: 0,

    player: {
      x: 0,
      y: 0,
      size: 62,
      speed: 220
    },

    move: {
      up: false,
      down: false,
      left: false,
      right: false
    }
  };

  let animationId = 0;
  let homeAnimationId = 0;
  let toastTimer = 0;
  let homeJumpTimer = 0;
  let homeJumpAnimation = null;
  let evolutionTimer = 0;
  let lastHomeJumpAt = 0;
  let neglectTickerId = 0;
  let neglectAmbientStage = 0;
  let neglectAmbientNoise = null;
  let neglectAmbientNoiseGain = null;
  let neglectAmbientHum = null;
  let discordSdkPromise = null;
  let neglectAmbientHumGain = null;
  let neglectAmbientLfo = null;
  let neglectAmbientLfoGain = null;
  let audioContext;

  function readNumber(key, fallback) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  }

  function normalizeLanguage(value) {
    if (value === "es" || value === "en") return value;
    return null;
  }

  function normalizeGameMode(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "normal") return "difficult";
    return ["easy", "difficult", "extra"].includes(normalized) ? normalized : "easy";
  }

  function getBrowserDefaultLanguage() {
    const browserLanguage = String(navigator.language || "").toLowerCase();
    return browserLanguage.startsWith("es") ? "es" : "en";
  }

  function localizeSpeechLine(line) {
    if (typeof line !== "string") return "";
    const parts = line.split(/\s*\/\s*/);
    if (parts.length < 2) return line;
    if (state.language === "es") {
      return parts[0].trim();
    }
    return parts.slice(1).join(" ").trim();
  }

  function coinIconHtml() {
    return '<span class="sapito-coin-icon" aria-hidden="true"></span>';
  }

  function formatCoinWithIcon(amount) {
    return `${Math.max(0, Math.floor(Number(amount) || 0))} ${coinIconHtml()}`;
  }

  function getDecorItem(typeId) {
    return DECOR_ITEMS[typeId] || null;
  }

  function getDecorMaxCount(typeId) {
    const item = getDecorItem(typeId);
    const max = Number(item && item.maxCount);
    if (Number.isFinite(max) && max > 0) {
      return Math.floor(max);
    }
    return DECOR_MAX_PER_TYPE;
  }

  function createDefaultDecorCounts() {
    const counts = {};
    DECOR_ORDER.forEach((id) => {
      counts[id] = 0;
    });
    return counts;
  }

  function normalizeDecorCounts(raw) {
    const normalized = createDefaultDecorCounts();
    if (!raw || typeof raw !== "object") return normalized;
    DECOR_ORDER.forEach((id) => {
      const value = Number(raw[id]);
      normalized[id] = Number.isFinite(value) ? clamp(Math.floor(value), 0, getDecorMaxCount(id)) : 0;
    });
    return normalized;
  }

  function getSapitoColorOption(id) {
    return SAPITO_COLOR_SKINS.find((item) => item.id === id) || SAPITO_COLOR_SKINS[0];
  }

  function getSapitoTattooOption(id) {
    return SAPITO_TATTOOS.find((item) => item.id === id) || SAPITO_TATTOOS[0];
  }

  function getLocalizedName(item) {
    return state.language === "es" ? item.nameEs : item.nameEn;
  }

  function normalizeOwnedSapitoColors(raw) {
    const allowed = new Set(SAPITO_COLOR_SKINS.map((item) => item.id));
    const owned = new Set(["green"]);
    if (!Array.isArray(raw)) return owned;
    raw.forEach((id) => {
      if (allowed.has(id)) owned.add(id);
    });
    return owned;
  }

  function normalizeOwnedSapitoTattoos(raw) {
    const allowed = new Set(SAPITO_TATTOOS.map((item) => item.id));
    const owned = new Set(["none"]);
    if (!Array.isArray(raw)) return owned;
    raw.forEach((id) => {
      if (allowed.has(id)) owned.add(id);
    });
    return owned;
  }

  function saveSettings() {
    localStorage.setItem(STORAGE.level, String(state.level));
    localStorage.setItem(STORAGE.highestCleared, String(state.highestCleared));
    localStorage.setItem(STORAGE.bestScore, String(state.bestScore));
    localStorage.setItem(STORAGE.foodBalance, String(state.foodBalance));
    localStorage.setItem(STORAGE.wormBank, String(state.wormBank));
    localStorage.setItem(STORAGE.flyBank, String(state.flyBank));
    localStorage.setItem(STORAGE.yellowButterflyBank, String(state.yellowButterflyBank));
    localStorage.setItem(STORAGE.redButterflyBank, String(state.redButterflyBank));
    localStorage.setItem(STORAGE.medalCount, String(state.medalCount));
    localStorage.setItem(STORAGE.coinBalance, String(state.coinBalance));
    localStorage.setItem(STORAGE.sapitoHealth, String(Math.round(state.sapitoHealth)));
    localStorage.setItem(STORAGE.totalButterfliesCaught, String(state.totalButterfliesCaught));
    localStorage.setItem(STORAGE.grandPrizeAwarded, String(state.grandPrizeAwarded));
    localStorage.setItem(STORAGE.discordUserId, state.discordUserId || "");
    localStorage.setItem(STORAGE.decorCounts, JSON.stringify(state.decorCounts));
    localStorage.setItem(STORAGE.lastDailyCheck, state.lastDailyCheck);
    localStorage.setItem(STORAGE.mode, state.mode);
    localStorage.setItem(STORAGE.language, state.language);
    localStorage.setItem(STORAGE.playType, state.playType);
    localStorage.setItem(STORAGE.sapitoColor, state.sapitoColorId);
    localStorage.setItem(STORAGE.ownedSapitoColors, JSON.stringify([...state.ownedSapitoColors]));
    localStorage.setItem(STORAGE.sapitoTattoo, state.sapitoTattooId);
    localStorage.setItem(STORAGE.ownedSapitoTattoos, JSON.stringify([...state.ownedSapitoTattoos]));
    localStorage.setItem(STORAGE.skin, state.selectedSkin);
    localStorage.setItem(STORAGE.ownedSkins, JSON.stringify([...state.ownedSkins]));
    localStorage.setItem(STORAGE.sound, String(state.soundOn));
    localStorage.setItem(STORAGE.reduceMotion, String(state.reduceMotion));
    localStorage.setItem(STORAGE.lastActivityAt, String(Math.floor(state.lastActivityAt)));
  }

  function loadSettings() {
    state.level = Math.max(1, readNumber(STORAGE.level, 1));
    state.highestCleared = Math.max(0, readNumber(STORAGE.highestCleared, 0));
    state.bestScore = Math.max(0, readNumber(STORAGE.bestScore, 0));
    state.foodBalance = Math.max(0, Math.floor(readNumber(STORAGE.foodBalance, 0)));
    state.wormBank = Math.max(0, Math.floor(readNumber(STORAGE.wormBank, 0)));
    state.flyBank = Math.max(0, Math.floor(readNumber(STORAGE.flyBank, 0)));
    state.yellowButterflyBank = Math.max(0, Math.floor(readNumber(STORAGE.yellowButterflyBank, 0)));
    state.redButterflyBank = Math.max(0, Math.floor(readNumber(STORAGE.redButterflyBank, 0)));
    state.medalCount = Math.max(0, Math.floor(readNumber(STORAGE.medalCount, 0)));
    state.coinBalance = Math.max(0, Math.floor(readNumber(STORAGE.coinBalance, 0)));
    state.sapitoHealth = localStorage.getItem(STORAGE.sapitoHealth) === null
      ? 100
      : clamp(readNumber(STORAGE.sapitoHealth, 100), 0, 100);
    state.totalButterfliesCaught = Math.max(0, Math.floor(readNumber(STORAGE.totalButterfliesCaught, 0)));
    state.grandPrizeAwarded = localStorage.getItem(STORAGE.grandPrizeAwarded) === "true";
    state.discordUserId = localStorage.getItem(STORAGE.discordUserId) || "";
    state.decorCounts = createDefaultDecorCounts();
    state.lastDailyCheck = localStorage.getItem(STORAGE.lastDailyCheck) || "";
    state.lastActivityAt = Math.max(0, Math.floor(readNumber(STORAGE.lastActivityAt, Date.now())));
    state.lastActivityPersistAt = 0;

    const mode = normalizeGameMode(localStorage.getItem(STORAGE.mode));
    state.mode = mode;

    const language = normalizeLanguage(localStorage.getItem(STORAGE.language));
    state.language = language || getBrowserDefaultLanguage();

    const playType = localStorage.getItem(STORAGE.playType);
    if (playType && PLAY_TYPES[playType]) {
      state.playType = playType;
    }

    state.ownedSapitoColors = new Set(["green"]);
    state.ownedSapitoTattoos = new Set(["none"]);
    state.sapitoColorId = "green";
    state.sapitoTattooId = "none";

    try {
      const rawOwnedColors = localStorage.getItem(STORAGE.ownedSapitoColors);
      if (rawOwnedColors) {
        state.ownedSapitoColors = normalizeOwnedSapitoColors(JSON.parse(rawOwnedColors));
      }
    } catch {
      state.ownedSapitoColors = new Set(["green"]);
    }
    try {
      const rawOwnedTattoos = localStorage.getItem(STORAGE.ownedSapitoTattoos);
      if (rawOwnedTattoos) {
        state.ownedSapitoTattoos = normalizeOwnedSapitoTattoos(JSON.parse(rawOwnedTattoos));
      }
    } catch {
      state.ownedSapitoTattoos = new Set(["none"]);
    }

    const savedColor = localStorage.getItem(STORAGE.sapitoColor);
    if (savedColor && state.ownedSapitoColors.has(savedColor)) {
      state.sapitoColorId = savedColor;
    }
    const savedTattoo = localStorage.getItem(STORAGE.sapitoTattoo);
    if (savedTattoo && state.ownedSapitoTattoos.has(savedTattoo)) {
      state.sapitoTattooId = savedTattoo;
    }

    const skin = localStorage.getItem(STORAGE.skin);
    if (skin) {
      state.selectedSkin = skin;
    }

    try {
      const rawOwned = localStorage.getItem(STORAGE.ownedSkins);
      if (rawOwned) {
        const parsed = JSON.parse(rawOwned);
        if (Array.isArray(parsed)) {
          state.ownedSkins = new Set(parsed.filter((id) => typeof id === "string"));
        }
      }
    } catch {
      state.ownedSkins = new Set(["default"]);
    }
    state.ownedSkins.add("default");

    try {
      const rawDecor = localStorage.getItem(STORAGE.decorCounts);
      if (rawDecor) {
        const parsedDecor = JSON.parse(rawDecor);
        state.decorCounts = normalizeDecorCounts(parsedDecor);
      }
    } catch {
      state.decorCounts = createDefaultDecorCounts();
    }

    state.soundOn = localStorage.getItem(STORAGE.sound) === "true";
    state.reduceMotion = localStorage.getItem(STORAGE.reduceMotion) === "true";
  }

  function refreshUnlockedSkins() {
    const unlocked = SKINS.filter((skin) =>
      skin.unlockLevel <= Math.max(1, state.highestCleared) || state.ownedSkins.has(skin.id)
    ).map((skin) => skin.id);
    if (!unlocked.includes("default")) {
      unlocked.unshift("default");
    }
    state.unlockedSkins = new Set(unlocked);

    if (!state.unlockedSkins.has(state.selectedSkin)) {
      state.selectedSkin = "default";
    }
  }

  function getSkinById(id) {
    return SKINS.find((skin) => skin.id === id) || SKINS[0];
  }

  function applySkin(id) {
    const skin = getSkinById(id);
    state.selectedSkin = skin.id;
    Object.entries(skin.vars).forEach(([name, value]) => {
      document.documentElement.style.setProperty(name, value);
    });

    ui.skinSelectStart.value = skin.id;
    ui.skinSelectPause.value = skin.id;
    saveSettings();
  }

  function populateSkinSelects() {
    [ui.skinSelectStart, ui.skinSelectPause].forEach((select) => {
      select.innerHTML = "";
      SKINS.filter((skin) => state.unlockedSkins.has(skin.id)).forEach((skin) => {
        const option = document.createElement("option");
        option.value = skin.id;
        option.textContent = skin.name;
        select.appendChild(option);
      });
      select.value = state.selectedSkin;
    });
    updateSkinShopInfo();
  }

  function setReduceMotion(enabled) {
    state.reduceMotion = enabled;
    document.body.classList.toggle("reduced-motion", enabled);
    ui.motionToggle.checked = enabled;
    ui.motionTogglePause.checked = enabled;
    saveSettings();
  }

  function setLanguage(language) {
    const nextLanguage = normalizeLanguage(language) || "en";
    state.language = nextLanguage;
    if (ui.languageSelect) {
      ui.languageSelect.value = nextLanguage;
    }
    updateSettingsLanguageText();
    state.neglectSpeechIndex = 0;
    state.neglectSpeechNextAt = 0;
    updateNeglectSpeech();
    if (ui.openRulesBtn) {
      ui.openRulesBtn.textContent = state.language === "es" ? "Ver reglas y premios" : "View Rules & Prizes";
    }
    if (ui.rulesPopupTitle) {
      ui.rulesPopupTitle.textContent = state.language === "es" ? "Reglas y Premios" : "Rules & Prizes";
    }
    if (ui.rulesPopupSubtitle) {
      ui.rulesPopupSubtitle.textContent = state.language === "es"
        ? "Estas reglas ya estan codificadas en la progresion del juego."
        : "These rules are codified in game progression.";
    }
    updateFoodEmptyPopupText();
    updateFoodMarketPopupText();
    updatePlayTypeHint();
    renderRulesTable();
    updateHabitatPanel();
    updateShopScrollButton();
    saveSettings();
  }

  function updateSettingsLanguageText() {
    const es = state.language === "es";
    if (ui.settingsTitle) ui.settingsTitle.textContent = es ? "Configuracion de Sapito" : "Sapito Settings";
    if (ui.settingsDescription) {
      ui.settingsDescription.textContent = es
        ? "Pantalla de inicio: Sapito recolecta comida automaticamente. Pantalla de juego: el jugador atrapa mariposas y alcanza la meta para ganar comida para Sapito."
        : "Home screen: sapito collects food automatically. Game screen: player catches butterflies and reaches target to earn food for sapito.";
    }
    if (ui.desktopHelp) {
      ui.desktopHelp.innerHTML = es ? "<strong>Computadora:</strong> Haz clic en las mariposas" : "<strong>Desktop:</strong> Click butterflies";
    }
    if (ui.mobileHelp) {
      ui.mobileHelp.innerHTML = es ? "<strong>Movil:</strong> Toca las mariposas" : "<strong>Mobile:</strong> Tap butterflies";
    }
    if (ui.modeFieldLabel) ui.modeFieldLabel.textContent = es ? "Modo" : "Mode";
    if (ui.puzzleFieldLabel) ui.puzzleFieldLabel.textContent = "Puzzle";
    if (ui.playersFieldLabel) ui.playersFieldLabel.textContent = es ? "Jugadores" : "Players";
    if (ui.languageFieldLabel) ui.languageFieldLabel.textContent = es ? "Idioma" : "Language";
    if (ui.soundToggleLabel) ui.soundToggleLabel.textContent = es ? "Sonido activo" : "Sound On";
    if (ui.motionToggleLabel) ui.motionToggleLabel.textContent = es ? "Reducir movimiento" : "Reduce Motion";
    if (ui.shopSeparateNote) {
      ui.shopSeparateNote.textContent = es
        ? "La tienda esta separada. Toca el boton `shop` para abrir el catalogo y pagar alli."
        : "Shop is now separate. Click the `shop` frog button to open the catalog and pay there.";
    }
    if (ui.openShopFromSettingsBtn) {
      ui.openShopFromSettingsBtn.textContent = es ? "Abrir catalogo tienda" : "Open Shop Catalog";
    }
    if (ui.openLegalBtn) {
      ui.openLegalBtn.textContent = es ? "Aviso legal" : "Legal Notice";
    }
    if (ui.modeSelect) {
      const modeText = es
        ? { easy: "Facil (default)", difficult: "Dificil", extra: "Extra dificil" }
        : { easy: "Easy (default)", difficult: "Difficult", extra: "Extra Difficult" };
      [...ui.modeSelect.options].forEach((option) => {
        option.textContent = modeText[option.value] || option.textContent;
      });
    }
    if (ui.playTypeSelect) {
      const playerText = es
        ? { solo: "Solo (1 jugador)", team: "Equipo (2 jugadores)", trio: "Trio (3 jugadores)" }
        : { solo: "Solo (1 player)", team: "Team Co-op (2 players)", trio: "Trio Co-op (3 players)" };
      [...ui.playTypeSelect.options].forEach((option) => {
        option.textContent = playerText[option.value] || option.textContent;
      });
    }
  }

  function setSound(enabled) {
    state.soundOn = enabled;
    ui.soundToggle.checked = enabled;
    ui.soundTogglePause.checked = enabled;
    saveSettings();
    syncNeglectAmbientSound();
  }

  function stopNeglectAmbientSound() {
    if (neglectAmbientNoise) {
      try {
        neglectAmbientNoise.stop();
      } catch {}
      neglectAmbientNoise.disconnect();
      neglectAmbientNoise = null;
    }
    if (neglectAmbientHum) {
      try {
        neglectAmbientHum.stop();
      } catch {}
      neglectAmbientHum.disconnect();
      neglectAmbientHum = null;
    }
    if (neglectAmbientLfo) {
      try {
        neglectAmbientLfo.stop();
      } catch {}
      neglectAmbientLfo.disconnect();
      neglectAmbientLfo = null;
    }
    if (neglectAmbientLfoGain) {
      neglectAmbientLfoGain.disconnect();
      neglectAmbientLfoGain = null;
    }
    if (neglectAmbientNoiseGain) {
      neglectAmbientNoiseGain.disconnect();
      neglectAmbientNoiseGain = null;
    }
    if (neglectAmbientHumGain) {
      neglectAmbientHumGain.disconnect();
      neglectAmbientHumGain = null;
    }
    neglectAmbientStage = 0;
  }

  function createLoopingNoiseBuffer(ctx, durationSec = 2.4) {
    const frameCount = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < frameCount; i += 1) {
      // Soft "brown-ish" noise to feel like muddy water movement.
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 2.4;
    }
    return buffer;
  }

  function startNeglectAmbientSound(stage) {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (neglectAmbientStage === stage && neglectAmbientNoise && neglectAmbientHum) {
      return;
    }
    stopNeglectAmbientSound();

    const isSevere = stage >= 3;
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = createLoopingNoiseBuffer(ctx, 2.6);
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(isSevere ? 340 : 470, now);
    noiseFilter.Q.value = 0.6;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(isSevere ? 0.035 : 0.018, now + 1.2);

    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.setValueAtTime(isSevere ? 43 : 58, now);

    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(isSevere ? 0.009 : 0.005, now);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(isSevere ? 0.09 : 0.14, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(isSevere ? 0.006 : 0.0032, now);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    hum.connect(humGain);
    humGain.connect(ctx.destination);

    lfo.connect(lfoGain);
    lfoGain.connect(noiseGain.gain);
    lfoGain.connect(humGain.gain);

    noise.start(now);
    hum.start(now);
    lfo.start(now);

    neglectAmbientStage = stage;
    neglectAmbientNoise = noise;
    neglectAmbientNoiseGain = noiseGain;
    neglectAmbientHum = hum;
    neglectAmbientHumGain = humGain;
    neglectAmbientLfo = lfo;
    neglectAmbientLfoGain = lfoGain;
  }

  function syncNeglectAmbientSound() {
    const shouldPlay =
      state.soundOn &&
      state.neglectStage >= 2 &&
      ui.startScreen &&
      !ui.startScreen.classList.contains("hidden");

    if (!shouldPlay) {
      stopNeglectAmbientSound();
      return;
    }

    startNeglectAmbientSound(state.neglectStage >= 3 ? 3 : 2);
  }

  function getNeglectMessages(stage = state.neglectStage) {
    if (stage >= 3) {
      return [
        "Necesito comida. / I need food.",
        "Limpia mi pod. / Clean my pod.",
        "Por que, human...? / Why, human...?"
      ];
    }
    if (stage === 2) {
      return ["Dame comida, human. / Feed me, human."];
    }
    if (stage === 1) {
      return ["Juega conmigo. / Play with me."];
    }
    return [];
  }

  function getNeglectStageByHours(hours) {
    if (hours >= 72) return 3;
    if (hours >= 48) return 2;
    if (hours >= 24) return 1;
    return 0;
  }

  function getInactiveHours() {
    return Math.max(0, (Date.now() - state.lastActivityAt) / 3600000);
  }

  function persistLastActivity(force = false) {
    const now = Date.now();
    if (!force && now - state.lastActivityPersistAt < 15000) return;
    localStorage.setItem(STORAGE.lastActivityAt, String(Math.floor(state.lastActivityAt)));
    state.lastActivityPersistAt = now;
  }

  function updateHomeSapitoSpeechPosition() {
    if (!ui.homeSapitoSpeech) return;
    const sapito = state.homeSapito;
    ui.homeSapitoSpeech.style.left = `${sapito.x + sapito.size * 0.5}px`;
    ui.homeSapitoSpeech.style.top = `${sapito.y - 8}px`;
  }

  function applyHomeItemMood(item) {
    if (!item || !item.el) return;
    item.el.classList.remove("wilt-1", "wilt-2", "wilt-3", "fading-star");

    if (item.kind === "flower-deco") {
      if (state.neglectStage === 0) {
        item.el.textContent = "🌸";
      } else if (state.neglectStage === 1) {
        item.el.textContent = Math.random() < 0.32 ? "🍂" : "🌸";
        item.el.classList.add("wilt-1");
      } else if (state.neglectStage === 2) {
        item.el.textContent = Math.random() < 0.54 ? "🍂" : "🥀";
        item.el.classList.add("wilt-2");
      } else {
        item.el.textContent = "🥀";
        item.el.classList.add("wilt-3");
      }
      item.el.style.display = "";
      return;
    }

    if (item.kind === "spark-deco") {
      if (state.neglectStage >= 2) {
        item.el.style.display = "none";
        return;
      }
      if (state.neglectStage === 1 && Math.random() < 0.72) {
        item.el.style.display = "none";
        return;
      }
      item.el.style.display = "";
      item.el.textContent = "✨";
      if (state.neglectStage === 1) {
        item.el.classList.add("fading-star");
      }
      return;
    }

    item.el.style.display = "";
  }

  function applyNeglectStage(force = false) {
    const nextStage = getNeglectStageByHours(getInactiveHours());
    if (!force && nextStage === state.neglectStage) {
      syncNeglectAmbientSound();
      return;
    }

    state.neglectStage = nextStage;
    state.neglectSpeechIndex = 0;
    state.neglectSpeechNextAt = 0;

    document.body.classList.toggle("neglect-stage-1", nextStage === 1);
    document.body.classList.toggle("neglect-stage-2", nextStage === 2);
    document.body.classList.toggle("neglect-stage-3", nextStage >= 3);

    for (let i = 0; i < state.homeItems.length; i += 1) {
      applyHomeItemMood(state.homeItems[i]);
    }
    syncNeglectAmbientSound();
  }

  function updateNeglectSpeech(now = performance.now()) {
    if (!ui.homeSapitoSpeech || !ui.startScreen || ui.startScreen.classList.contains("hidden")) {
      return;
    }

    const neglectMessages = getNeglectMessages();
    const personality = getPersonalityStageForLevel(state.level);
    const rawMessages = neglectMessages.length > 0 ? neglectMessages : personality.lines;
    const messages = rawMessages.map(localizeSpeechLine).filter(Boolean);
    if (messages.length === 0) {
      ui.homeSapitoSpeech.classList.add("hidden");
      return;
    }

    if (state.neglectSpeechNextAt === 0) {
      state.neglectSpeechNextAt = now + 2500;
    } else if (messages.length > 1 && now >= state.neglectSpeechNextAt) {
      state.neglectSpeechIndex = (state.neglectSpeechIndex + 1) % messages.length;
      state.neglectSpeechNextAt = now + (state.reduceMotion ? 2900 : 2400);
    }

    const speechIndex = state.neglectSpeechIndex % messages.length;
    ui.homeSapitoSpeech.textContent = messages[speechIndex];
    ui.homeSapitoSpeech.classList.remove("hidden");
    updateHomeSapitoSpeechPosition();
  }

  function markUserActivity(forcePersist = false) {
    state.lastActivityAt = Date.now();
    applyNeglectStage();
    persistLastActivity(forcePersist);
  }

  function getTodayKey() {
    const now = new Date();
    const y = String(now.getFullYear());
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getDaysBetween(startKey, endKey) {
    const start = new Date(`${startKey}T00:00:00`);
    const end = new Date(`${endKey}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    return Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000));
  }

  function getPersonalityStageForLevel(level = state.level) {
    const safeLevel = Math.max(1, Math.floor(level));
    const stageId = clamp(Math.floor((safeLevel - 1) / LEVELS_PER_STAGE) + 1, 1, PERSONALITY_STAGES.length);
    const base = PERSONALITY_STAGES[stageId - 1];
    const legendStartLevel = LEVELS_PER_STAGE * PERSONALITY_STAGES.length + 1;
    const isLegend = stageId === PERSONALITY_STAGES.length && safeLevel >= legendStartLevel;
    const lines = isLegend && Array.isArray(base.legendLines) && base.legendLines.length > 0
      ? base.legendLines
      : base.lines;
    return {
      stageId,
      name: base.name,
      lines,
      isLegend,
      label: isLegend ? `${base.name} (Legend)` : base.name
    };
  }

  function getFrogCountForLevel(level = state.level) {
    return clamp(getPersonalityStageForLevel(level).stageId, 1, MAX_FROGS);
  }

  function getPathLevelForLevel(level = state.level) {
    return getRulesStageForLevel(level).stageId;
  }

  function getDisplayLevel(level = state.level) {
    return getPathLevelForLevel(level);
  }

  function getDisplaySection(level = state.level) {
    return getRulesGameForLevel(level).game.game;
  }

  function getActiveSapitoColorValue() {
    return getSapitoColorOption(state.sapitoColorId).color || SAPITO_MAIN_GREEN;
  }

  function getActiveSapitoSwimFilter() {
    const filters = {
      green: "saturate(1.05) brightness(1.02)",
      aqua: "hue-rotate(68deg) saturate(1.35) brightness(1.08)",
      sky: "hue-rotate(105deg) saturate(1.32) brightness(1.1)",
      violet: "hue-rotate(170deg) saturate(1.42) brightness(1.08)",
      sun: "hue-rotate(300deg) saturate(1.42) brightness(1.16)",
      rose: "hue-rotate(220deg) saturate(1.55) brightness(1.16)"
    };
    return filters[state.sapitoColorId] || filters.green;
  }

  function getStageFrogColor(level = state.level, frogIndex = 0) {
    const stageId = getPersonalityStageForLevel(level).stageId;
    const helperPalette = [
      "#52d768", // green baby helper
      "#ff7ab8", // pink helper
      "#ffd54f", // yellow helper
      "#a55bff", // purple helper
      "#ef4c63", // red helper
      "#b47dff" // grampy/legend violet helper
    ];
    const maxVisibleIndex = clamp(stageId, 1, helperPalette.length) - 1;
    const index = clamp(Math.max(0, frogIndex), 0, maxVisibleIndex);
    return helperPalette[index] || helperPalette[0];
  }

  function getActiveSapitoTattooSymbol() {
    return getSapitoTattooOption(state.sapitoTattooId).symbol || "";
  }

  function getFrogColor(frogIndex = 0, level = state.level) {
    return getStageFrogColor(level, frogIndex);
  }

  function isStarTarget(item) {
    return Boolean(item && item.kind === "star");
  }

  function applyPersonalityVisuals(personality = getPersonalityStageForLevel(state.level)) {
    const personaClasses = [
      "sapito-persona-1",
      "sapito-persona-2",
      "sapito-persona-3",
      "sapito-persona-4",
      "sapito-persona-5",
      "sapito-persona-6",
      "sapito-persona-legend"
    ];
    const bodyClasses = [
      "sapito-stage-1",
      "sapito-stage-2",
      "sapito-stage-3",
      "sapito-stage-4",
      "sapito-stage-5",
      "sapito-stage-6",
      "sapito-stage-legend"
    ];

    bodyClasses.forEach((name) => document.body.classList.remove(name));
    document.body.classList.add(`sapito-stage-${personality.stageId}`);
    if (personality.isLegend) {
      document.body.classList.add("sapito-stage-legend");
    }

    [ui.homeSapito, ui.petFrogPreview].forEach((el) => {
      if (!el) return;
      personaClasses.forEach((name) => el.classList.remove(name));
      el.classList.add(`sapito-persona-${personality.stageId}`);
      if (personality.isLegend) {
        el.classList.add("sapito-persona-legend");
      }
      const label = personality.isLegend
        ? `${personality.name} Legend`
        : `${personality.name} Stage ${personality.stageId}`;
      el.setAttribute("data-personality", label);
      el.setAttribute("title", label);
    });
  }

  function ensureTattooElement(container) {
    if (!container) return null;
    let badge = container.querySelector(".sapito-tattoo");
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "sapito-tattoo hidden";
      badge.setAttribute("aria-hidden", "true");
      container.appendChild(badge);
    }
    return badge;
  }

  function applyTattooToElement(container) {
    if (!container) return;
    const badge = ensureTattooElement(container);
    if (!badge) return;
    const symbol = getActiveSapitoTattooSymbol();
    if (!symbol) {
      badge.textContent = "";
      badge.classList.add("hidden");
      container.classList.remove("has-sapito-tattoo");
      return;
    }
    badge.textContent = symbol;
    badge.classList.remove("hidden");
    container.classList.add("has-sapito-tattoo");
  }

  function applySapitoAppearanceToFrogs() {
    for (let i = 0; i < state.frogs.length; i += 1) {
      const frog = state.frogs[i];
      if (!frog || !frog.el) continue;
      // Helper froggies use progression colors only. Player-purchased skins/tattoos
      // belong to the player's Sapito in Home/preview and are never auto-changed here.
      frog.el.style.setProperty("--frog-color", getFrogColor(i, state.level));
    }
  }

  function updateSapitoLook() {
    const color = getActiveSapitoColorValue();
    const swimFilter = getActiveSapitoSwimFilter();
    if (ui.petFrogPreview) {
      ui.petFrogPreview.style.setProperty("--pet-frog-color", color);
      applyTattooToElement(ui.petFrogPreview);
    }
    if (ui.homeSapito) {
      ui.homeSapito.dataset.sapitoColor = state.sapitoColorId;
      ui.homeSapito.style.setProperty("--home-sapito-color", color);
      ui.homeSapito.style.setProperty("--home-sapito-skin-filter", swimFilter);
      ui.homeSapito.style.filter =
        `${swimFilter} drop-shadow(0 4px 0 rgba(22, 72, 54, 0.22)) drop-shadow(0 0 12px rgba(215, 255, 236, 0.26))`;
      applyTattooToElement(ui.homeSapito);
    }
    applySapitoAppearanceToFrogs();
  }

  function getNextLockedColorSkin() {
    return SAPITO_COLOR_SKINS.find((item) => item.cost > 0 && !state.ownedSapitoColors.has(item.id)) || null;
  }

  function getNextLockedTattoo() {
    return SAPITO_TATTOOS.find((item) => item.cost > 0 && !state.ownedSapitoTattoos.has(item.id)) || null;
  }

  function setSapitoColor(colorId, { save = true } = {}) {
    if (!state.ownedSapitoColors.has(colorId)) return;
    state.sapitoColorId = colorId;
    if (ui.sapitoColorSelect) {
      ui.sapitoColorSelect.value = colorId;
    }
    updateSapitoLook();
    updateHabitatPanel();
    updateSapitoStyleShopUi();
    updateSkinShopInfo();
    if (save) saveSettings();
  }

  function setSapitoTattoo(tattooId, { save = true } = {}) {
    if (!state.ownedSapitoTattoos.has(tattooId)) return;
    state.sapitoTattooId = tattooId;
    if (ui.sapitoTattooSelect) {
      ui.sapitoTattooSelect.value = tattooId;
    }
    updateSapitoLook();
    updateHabitatPanel();
    if (save) saveSettings();
  }

  function populateSapitoStyleSelects() {
    if (ui.sapitoColorSelect) {
      ui.sapitoColorSelect.innerHTML = "";
      SAPITO_COLOR_SKINS.forEach((item) => {
        if (!state.ownedSapitoColors.has(item.id)) return;
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = getLocalizedName(item);
        ui.sapitoColorSelect.appendChild(option);
      });
      if (!state.ownedSapitoColors.has(state.sapitoColorId)) {
        state.sapitoColorId = "green";
      }
      ui.sapitoColorSelect.value = state.sapitoColorId;
    }

    if (ui.sapitoTattooSelect) {
      ui.sapitoTattooSelect.innerHTML = "";
      SAPITO_TATTOOS.forEach((item) => {
        if (!state.ownedSapitoTattoos.has(item.id)) return;
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = getLocalizedName(item);
        ui.sapitoTattooSelect.appendChild(option);
      });
      if (!state.ownedSapitoTattoos.has(state.sapitoTattooId)) {
        state.sapitoTattooId = "none";
      }
      ui.sapitoTattooSelect.value = state.sapitoTattooId;
    }
  }

  function createStylePreview(kind, item) {
    const preview = document.createElement("span");
    preview.className = `sapito-style-preview ${kind === "tattoo" ? "tattoo-preview" : "color-preview"}`;
    preview.style.setProperty("--preview-sapito-color", item.color || SAPITO_MAIN_GREEN);

    const symbol = document.createElement("span");
    symbol.className = "sapito-style-preview-symbol";
    symbol.textContent = kind === "tattoo" ? (item.symbol || "•") : "";
    preview.appendChild(symbol);
    return preview;
  }

  function renderSapitoStyleCatalog() {
    if (ui.sapitoColorCatalog) {
      ui.sapitoColorCatalog.innerHTML = "";
      SAPITO_COLOR_SKINS.filter((item) => item.id !== "green").forEach((item) => {
        const owned = state.ownedSapitoColors.has(item.id);
        const active = state.sapitoColorId === item.id;
        const card = document.createElement("article");
        card.className = `sapito-style-item${owned ? " owned" : ""}${active ? " active" : ""}`;
        card.appendChild(createStylePreview("color", item));

        const name = document.createElement("strong");
        name.textContent = getLocalizedName(item);
        card.appendChild(name);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn small sapito-style-buy-btn";
        if (owned) {
          button.textContent = active
            ? (state.language === "es" ? "Activo" : "Active")
            : (state.language === "es" ? "Usar" : "Use");
          button.addEventListener("click", () => setSapitoColor(item.id));
        } else {
          button.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} - ${formatCoinWithIcon(getColorCoinPrice(item))}`;
          button.addEventListener("click", () => buySapitoColorSkin(item.id));
        }
        card.appendChild(button);
        ui.sapitoColorCatalog.appendChild(card);
      });
    }

    if (ui.sapitoTattooCatalog) {
      ui.sapitoTattooCatalog.innerHTML = "";
      SAPITO_TATTOOS.filter((item) => item.id !== "none").forEach((item) => {
        const owned = state.ownedSapitoTattoos.has(item.id);
        const active = state.sapitoTattooId === item.id;
        const card = document.createElement("article");
        card.className = `sapito-style-item${owned ? " owned" : ""}${active ? " active" : ""}`;
        card.appendChild(createStylePreview("tattoo", item));

        const name = document.createElement("strong");
        name.textContent = getLocalizedName(item);
        card.appendChild(name);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn small sapito-style-buy-btn";
        if (owned) {
          button.textContent = active
            ? (state.language === "es" ? "Activo" : "Active")
            : (state.language === "es" ? "Usar" : "Use");
          button.addEventListener("click", () => setSapitoTattoo(item.id));
        } else {
          button.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} - ${formatCoinWithIcon(getTattooCoinPrice(item))}`;
          button.addEventListener("click", () => buySapitoTattoo(item.id));
        }
        card.appendChild(button);
        ui.sapitoTattooCatalog.appendChild(card);
      });
    }
  }

  function updateSapitoStyleShopUi() {
    if (ui.sapitoStyleTitle) {
      ui.sapitoStyleTitle.textContent = state.language === "es" ? "Tienda de Estilo Sapito" : "Sapito Style Shop";
    }
    if (ui.sapitoColorLabel) {
      ui.sapitoColorLabel.textContent = state.language === "es" ? "Color de Sapito" : "Sapito Color";
    }
    if (ui.sapitoTattooLabel) {
      ui.sapitoTattooLabel.textContent = state.language === "es" ? "Tatuaje" : "Tattoo";
    }

    const nextColor = getNextLockedColorSkin();
    if (ui.buyColorSkinBtn) {
      if (!nextColor) {
        ui.buyColorSkinBtn.textContent = state.language === "es" ? "Todos los colores comprados" : "All Color Skins Owned";
        ui.buyColorSkinBtn.disabled = true;
      } else {
        const coinPrice = getColorCoinPrice(nextColor);
        ui.buyColorSkinBtn.innerHTML = `${getLocalizedName(nextColor)} (${formatCoinWithIcon(coinPrice)})`;
        ui.buyColorSkinBtn.disabled = false;
      }
    }
    if (ui.catalogBuyColorBtn) {
      if (!nextColor) {
        ui.catalogBuyColorBtn.textContent = state.language === "es" ? "Todos los colores comprados" : "All Color Skins Owned";
        ui.catalogBuyColorBtn.disabled = true;
      } else {
        const coinPrice = getColorCoinPrice(nextColor);
        ui.catalogBuyColorBtn.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} ${getLocalizedName(nextColor)} (${formatCoinWithIcon(coinPrice)})`;
        ui.catalogBuyColorBtn.disabled = false;
      }
    }

    const nextTattoo = getNextLockedTattoo();
    if (ui.buyTattooBtn) {
      if (!nextTattoo) {
        ui.buyTattooBtn.textContent = state.language === "es" ? "Todos los tattoos comprados" : "All Tattoos Owned";
        ui.buyTattooBtn.disabled = true;
      } else {
        const coinPrice = getTattooCoinPrice(nextTattoo);
        ui.buyTattooBtn.innerHTML = `${getLocalizedName(nextTattoo)} (${formatCoinWithIcon(coinPrice)})`;
        ui.buyTattooBtn.disabled = false;
      }
    }
    if (ui.catalogBuyTattooBtn) {
      if (!nextTattoo) {
        ui.catalogBuyTattooBtn.textContent = state.language === "es" ? "Todos los tattoos comprados" : "All Tattoos Owned";
        ui.catalogBuyTattooBtn.disabled = true;
      } else {
        const coinPrice = getTattooCoinPrice(nextTattoo);
        ui.catalogBuyTattooBtn.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} ${getLocalizedName(nextTattoo)} (${formatCoinWithIcon(coinPrice)})`;
        ui.catalogBuyTattooBtn.disabled = false;
      }
    }

    if (ui.sapitoStyleInfo) {
      const activeColor = getSapitoColorOption(state.sapitoColorId);
      const activeTattoo = getSapitoTattooOption(state.sapitoTattooId);
      if (state.language === "es") {
        ui.sapitoStyleInfo.textContent =
          `Base: verde. Activo -> color: ${activeColor.nameEs}, tattoo: ${activeTattoo.nameEs}.`;
      } else {
        ui.sapitoStyleInfo.textContent =
          `Base color is green. Active -> color: ${activeColor.nameEn}, tattoo: ${activeTattoo.nameEn}.`;
      }
    }
    renderSapitoStyleCatalog();
    if (ui.catalogColorInfo) {
      ui.catalogColorInfo.textContent = state.language === "es"
        ? `Color activo: ${getSapitoColorOption(state.sapitoColorId).nameEs}.`
        : `Active color: ${getSapitoColorOption(state.sapitoColorId).nameEn}.`;
    }
    if (ui.catalogTattooInfo) {
      ui.catalogTattooInfo.textContent = state.language === "es"
        ? `Tattoo activo: ${getSapitoTattooOption(state.sapitoTattooId).nameEs}.`
        : `Active tattoo: ${getSapitoTattooOption(state.sapitoTattooId).nameEn}.`;
    }
  }

  function buySapitoColorSkin(colorId) {
    markUserActivity();
    const item = getSapitoColorOption(colorId);
    if (!item || item.id === "green") return;
    if (state.ownedSapitoColors.has(item.id)) {
      setSapitoColor(item.id);
      return;
    }
    const coinPrice = getColorCoinPrice(item);
    if (!spendCoins(coinPrice)) {
      const missing = coinPrice - state.coinBalance;
      showToast(state.language === "es"
        ? `Necesitas ${missing} Sapito Coins para ${item.nameEs}.`
        : `Need ${missing} Sapito Coins for ${item.nameEn}.`);
      return;
    }
    state.ownedSapitoColors.add(item.id);
    populateSapitoStyleSelects();
    setSapitoColor(item.id, { save: false });
    updateSapitoStyleShopUi();
    updateSkinShopInfo();
    saveSettings();
    showToast(state.language === "es" ? `Color comprado: ${item.nameEs}.` : `Color skin unlocked: ${item.nameEn}.`);
  }

  function buySapitoTattoo(tattooId) {
    markUserActivity();
    const item = getSapitoTattooOption(tattooId);
    if (!item || item.id === "none") return;
    if (state.ownedSapitoTattoos.has(item.id)) {
      setSapitoTattoo(item.id);
      return;
    }
    const coinPrice = getTattooCoinPrice(item);
    if (!spendCoins(coinPrice)) {
      const missing = coinPrice - state.coinBalance;
      showToast(state.language === "es"
        ? `Necesitas ${missing} Sapito Coins para ${item.nameEs}.`
        : `Need ${missing} Sapito Coins for ${item.nameEn}.`);
      return;
    }
    state.ownedSapitoTattoos.add(item.id);
    populateSapitoStyleSelects();
    setSapitoTattoo(item.id, { save: false });
    saveSettings();
    showToast(state.language === "es" ? `Tattoo comprado: ${item.nameEs}.` : `Tattoo unlocked: ${item.nameEn}.`);
  }

  function buyNextColorSkin() {
    markUserActivity();
    const next = getNextLockedColorSkin();
    if (!next) {
      showToast(state.language === "es" ? "Ya tienes todos los colores." : "All color skins already unlocked.");
      return;
    }
    buySapitoColorSkin(next.id);
  }

  function buyNextTattoo() {
    markUserActivity();
    const next = getNextLockedTattoo();
    if (!next) {
      showToast(state.language === "es" ? "Ya tienes todos los tattoos." : "All tattoos already unlocked.");
      return;
    }
    buySapitoTattoo(next.id);
  }

  function getWormCount() {
    return Math.max(0, Math.floor(state.wormBank));
  }

  function getFlyCount() {
    return Math.max(0, Math.floor(state.flyBank));
  }

  function getDailyFeedNeed(level = state.level) {
    return getFrogCountForLevel(level) * DAILY_FOOD_PER_FROG;
  }

  function getFoodCoverageDays() {
    const dailyNeed = getDailyFeedNeed();
    if (dailyNeed <= 0) return 0;
    return state.foodBalance / dailyNeed;
  }

  function getSapitoHealthPercent() {
    return clamp(Number(state.sapitoHealth) || 0, 0, 100);
  }

  function getSapitoHealthBand(healthPercent = getSapitoHealthPercent()) {
    if (healthPercent >= 70) return "safe";
    if (healthPercent >= 35) return "low";
    return "critical";
  }

  function adjustSapitoHealth(delta) {
    const amount = Number(delta);
    if (!Number.isFinite(amount) || amount === 0) return false;
    state.sapitoHealth = clamp(getSapitoHealthPercent() + amount, 0, 100);
    updateHabitatPanel();
    saveSettings();
    return true;
  }

  function updateHomeHealthMeter(healthPercent = getSapitoHealthPercent(), healthBand = getSapitoHealthBand(healthPercent)) {
    if (!ui.homeHealthFill || !ui.homeHealthTrack) return;

    const meterPercent = clamp(healthPercent, 0, 100);
    const roundedPercent = Math.round(meterPercent);

    ui.homeHealthFill.style.width = `${meterPercent}%`;
    ui.homeHealthTrack.classList.remove("health-safe", "health-low", "health-critical");
    ui.homeHealthTrack.classList.add(`health-${healthBand}`);
    ui.homeHealthTrack.setAttribute("aria-valuenow", String(roundedPercent));
    ui.homeHealthTrack.setAttribute(
      "aria-label",
      state.language === "es" ? "Nivel de salud de Sapito" : "Sapito health level"
    );

    if (ui.homeHealthTitle) {
      ui.homeHealthTitle.textContent = state.language === "es" ? "Medidor de Salud" : "Health Meter";
    }

    let statusText = "";
    if (state.language === "es") {
      if (healthBand === "safe") {
        statusText = `Vida alta • ${roundedPercent}% de salud.`;
      } else if (healthBand === "low") {
        statusText = `Vida media • ${roundedPercent}% de salud. Alimenta pronto.`;
      } else {
        statusText = `Vida critica • ${roundedPercent}% de salud. Alimenta a Sapito ahora.`;
      }
    } else if (healthBand === "safe") {
      statusText = `High life • ${roundedPercent}% health.`;
    } else if (healthBand === "low") {
      statusText = `Medium life • ${roundedPercent}% health. Feed soon.`;
    } else {
      statusText = `Critical life • ${roundedPercent}% health. Feed Sapito now.`;
    }

    if (ui.homeHealthText) {
      ui.homeHealthText.textContent = statusText;
    }
    ui.homeHealthTrack.setAttribute("aria-valuetext", `${roundedPercent}% • ${statusText}`);
  }

  function toggleStartSettings(force, options = {}) {
    if (!ui.settingsBox || !ui.settingsToggleBtn) return;

    const next = typeof force === "boolean" ? force : !state.settingsOpen;
    state.settingsOpen = next;
    ui.settingsBox.classList.toggle("hidden", !next);
    ui.settingsToggleBtn.setAttribute("aria-expanded", String(next));
    ui.settingsToggleBtn.title = next ? "Hide settings" : "Show settings";
    if (!next) {
      toggleRulesPopup(false);
    }
    if (next) {
      toggleFoodEmptyPopup(false);
      toggleCoinTopupPopup(false);
      toggleFoodMarketPopup(false);
      togglePuzzleQuickPopup(false);
      toggleHabitatViewPopup(false);
    }
    if (next && !options.keepShopOpen) {
      toggleShop(false, { keepSettingsOpen: true });
    }
  }

  function getShopScrollButtonLabel(atBottom = false) {
    if (state.language === "es") {
      return atBottom ? "Subir ↑" : "Bajar ↓";
    }
    return atBottom ? "Scroll Top ↑" : "Scroll Down ↓";
  }

  function updateShopScrollButton() {
    if (!ui.shopSheet || !ui.shopScrollDownBtn) return;
    const maxScroll = ui.shopSheet.scrollHeight - ui.shopSheet.clientHeight;
    const hasOverflow = maxScroll > 6;
    ui.shopScrollDownBtn.classList.toggle("hidden", !hasOverflow);
    if (!hasOverflow) return;

    const atBottom = ui.shopSheet.scrollTop >= maxScroll - 8;
    ui.shopScrollDownBtn.textContent = getShopScrollButtonLabel(atBottom);
    ui.shopScrollDownBtn.setAttribute(
      "aria-label",
      state.language === "es"
        ? (atBottom ? "Volver arriba de la tienda" : "Bajar en la tienda")
        : (atBottom ? "Scroll shop to top" : "Scroll shop down")
    );
  }

  function scrollShopByButton() {
    if (!ui.shopSheet) return;
    const maxScroll = ui.shopSheet.scrollHeight - ui.shopSheet.clientHeight;
    const atBottom = ui.shopSheet.scrollTop >= maxScroll - 8;
    if (atBottom) {
      ui.shopSheet.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const jump = Math.max(240, ui.shopSheet.clientHeight * 0.78);
      ui.shopSheet.scrollBy({ top: jump, behavior: "smooth" });
    }
    window.setTimeout(updateShopScrollButton, 260);
  }

  const SCROLL_NUDGE_SELECTORS = [
    ".puzzle-piece-preview-popup:not(.hidden) .puzzle-piece-preview-card",
    ".puzzle-catalog-popup:not(.hidden) .puzzle-catalog-card",
    ".habitat-view-popup:not(.hidden) .habitat-view-card",
    ".puzzle-quick-popup:not(.hidden) .puzzle-quick-card",
    ".rules-popup:not(.hidden) .rules-card",
    ".legal-popup:not(.hidden) .legal-card",
    ".food-empty-popup:not(.hidden) .food-empty-card",
    ".coin-topup-popup:not(.hidden) .coin-topup-card",
    ".food-market-popup:not(.hidden) .food-market-card",
    "#pauseScreen:not(.hidden) .panel",
    "#resultScreen:not(.hidden) .panel",
    ".settings-box:not(.hidden) .settings-sheet",
    ".shop-box:not(.hidden) .shop-sheet"
  ];

  function getActiveScrollContainer() {
    for (const selector of SCROLL_NUDGE_SELECTORS) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const styles = window.getComputedStyle(el);
      if (styles.display === "none" || styles.visibility === "hidden") continue;
      if (el.scrollHeight > el.clientHeight + 8) return el;
    }
    return null;
  }

  function updateScrollNudgeControls() {
    if (!ui.scrollNudgeControls) return;
    const target = getActiveScrollContainer();
    ui.scrollNudgeControls.classList.toggle("hidden", !target);
    if (!target) return;

    const maxScroll = Math.max(0, target.scrollHeight - target.clientHeight);
    const atTop = target.scrollTop <= 8;
    const atBottom = target.scrollTop >= maxScroll - 8;
    ui.scrollNudgeUp.disabled = atTop;
    ui.scrollNudgeDown.disabled = atBottom;
  }

  function scrollActivePanel(direction) {
    const target = getActiveScrollContainer();
    if (!target) return;
    const amount = Math.max(180, target.clientHeight * 0.72);
    target.scrollBy({ top: direction * amount, behavior: "smooth" });
    window.setTimeout(updateScrollNudgeControls, 260);
    window.setTimeout(updateShopScrollButton, 260);
  }

  function ensureScrollNudgeControls() {
    if (ui.scrollNudgeControls) return;
    const appRoot = document.querySelector(".app");
    if (!appRoot) return;

    const controls = document.createElement("div");
    controls.id = "scrollNudgeControls";
    controls.className = "scroll-nudge-controls hidden";
    controls.innerHTML = [
      '<button id="scrollNudgeUp" class="scroll-nudge-btn" type="button" aria-label="Scroll up">↑</button>',
      '<button id="scrollNudgeDown" class="scroll-nudge-btn" type="button" aria-label="Scroll down">↓</button>'
    ].join("\n");
    appRoot.appendChild(controls);

    ui.scrollNudgeControls = controls;
    ui.scrollNudgeUp = controls.querySelector("#scrollNudgeUp");
    ui.scrollNudgeDown = controls.querySelector("#scrollNudgeDown");

    ui.scrollNudgeUp.addEventListener("click", () => scrollActivePanel(-1));
    ui.scrollNudgeDown.addEventListener("click", () => scrollActivePanel(1));
    window.addEventListener("resize", updateScrollNudgeControls);
    document.addEventListener("scroll", updateScrollNudgeControls, true);
    window.setInterval(updateScrollNudgeControls, 450);
    updateScrollNudgeControls();
  }

  function toggleShop(force, options = {}) {
    if (!ui.shopBox) return;

    const next = typeof force === "boolean" ? force : !state.shopOpen;
    state.shopOpen = next;
    ui.shopBox.classList.toggle("hidden", !next);
    if (!next) {
      togglePuzzleQuickPopup(false);
      toggleHabitatViewPopup(false);
      togglePuzzleCatalogPopup(false);
      toggleFoodMarketPopup(false);
    }
    if (next && !options.keepSettingsOpen) {
      toggleStartSettings(false, { keepShopOpen: true });
    }
    if (next) {
      toggleRulesPopup(false);
      toggleCoinTopupPopup(false);
      toggleFoodEmptyPopup(false);
      updatePuzzleCatalogUiText();
      window.requestAnimationFrame(updateShopScrollButton);
    }
  }

  function togglePuzzleQuickPopup(force) {
    if (!ui.puzzleQuickPopup) return;
    const next = typeof force === "boolean" ? force : !state.puzzleQuickOpen;
    state.puzzleQuickOpen = next;
    ui.puzzleQuickPopup.classList.toggle("hidden", !next);
    if (!next) return;

    if (!state.shopOpen) {
      toggleShop(true);
    }
    toggleHabitatViewPopup(false);
    togglePuzzleCatalogPopup(false);
    toggleRulesPopup(false);
    toggleCoinTopupPopup(false);
    toggleFoodMarketPopup(false);
    toggleFoodEmptyPopup(false);
    updatePuzzleCatalogUiText();
    renderHabitatPuzzlePreview();
    window.setTimeout(() => {
      const focusTarget = ui.openHabitatViewBtn || ui.openPuzzleCatalogFromQuickBtn;
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus({ preventScroll: true });
      }
    }, 80);
  }

  function toggleHabitatViewPopup(force) {
    if (!ui.habitatViewPopup) return;
    const next = typeof force === "boolean" ? force : !state.habitatViewOpen;
    state.habitatViewOpen = next;
    ui.habitatViewPopup.classList.toggle("hidden", !next);
    if (!next) return;

    if (!state.shopOpen) {
      toggleShop(true);
    }
    togglePuzzleQuickPopup(false);
    togglePuzzleCatalogPopup(false);
    toggleRulesPopup(false);
    toggleCoinTopupPopup(false);
    toggleFoodMarketPopup(false);
    toggleFoodEmptyPopup(false);
    updatePuzzleCatalogUiText();
    renderHabitatViewPreview();
    window.setTimeout(() => {
      if (ui.closeHabitatViewBtn && typeof ui.closeHabitatViewBtn.focus === "function") {
        ui.closeHabitatViewBtn.focus({ preventScroll: true });
      }
    }, 80);
  }

  function togglePuzzleCatalogPopup(force) {
    if (!ui.puzzleCatalogPopup) return;
    const next = typeof force === "boolean" ? force : !state.puzzleCatalogOpen;
    state.puzzleCatalogOpen = next;
    ui.puzzleCatalogPopup.classList.toggle("hidden", !next);
    if (!next) {
      togglePuzzlePiecePreviewPopup(false);
      return;
    }
    if (next) {
      if (!state.shopOpen) {
        toggleShop(true);
      }
      togglePuzzleQuickPopup(false);
      toggleHabitatViewPopup(false);
      toggleRulesPopup(false);
      toggleCoinTopupPopup(false);
      toggleFoodMarketPopup(false);
      toggleFoodEmptyPopup(false);
      updatePuzzleCatalogUiText();
      renderPuzzleCatalog();
      window.setTimeout(() => {
        const firstBuyButton = ui.puzzleCatalogGrid?.querySelector(".puzzle-piece-buy-btn:not(:disabled)");
        if (firstBuyButton && typeof firstBuyButton.focus === "function") {
          firstBuyButton.focus({ preventScroll: true });
        }
      }, 80);
    }
  }

  function togglePuzzlePiecePreviewPopup(force, pieceId = state.activePuzzlePieceId) {
    if (!ui.puzzlePiecePreviewPopup) return;
    if (pieceId) {
      state.activePuzzlePieceId = pieceId;
    }

    const wantsOpen = typeof force === "boolean" ? force : !state.puzzlePiecePreviewOpen;
    const canOpen = wantsOpen && Boolean(getDecorItem(state.activePuzzlePieceId));
    state.puzzlePiecePreviewOpen = canOpen;
    ui.puzzlePiecePreviewPopup.classList.toggle("hidden", !canOpen);

    if (canOpen) {
      updatePuzzlePiecePreviewCard();
      window.setTimeout(() => {
        if (ui.puzzlePiecePreviewBuyBtn && typeof ui.puzzlePiecePreviewBuyBtn.focus === "function") {
          ui.puzzlePiecePreviewBuyBtn.focus({ preventScroll: true });
        }
      }, 80);
    }
  }

  function toggleCoinTopupPopup(force) {
    if (!ui.coinTopupPopup) return;
    const next = typeof force === "boolean" ? force : !state.coinTopupOpen;
    state.coinTopupOpen = next;
    ui.coinTopupPopup.classList.toggle("hidden", !next);
    if (next) {
      toggleRulesPopup(false);
      toggleStartSettings(false);
      toggleShop(false);
      toggleFoodMarketPopup(false);
      toggleFoodEmptyPopup(false);
      updateCoinBankUi();
      window.setTimeout(() => {
        if (ui.coinTopupPack1Btn && typeof ui.coinTopupPack1Btn.focus === "function") {
          ui.coinTopupPack1Btn.focus({ preventScroll: true });
        }
      }, 80);
    }
  }

  function toggleFoodMarketPopup(force) {
    if (!ui.foodMarketPopup) return;
    const next = typeof force === "boolean" ? force : !state.foodMarketOpen;
    state.foodMarketOpen = next;
    ui.foodMarketPopup.classList.toggle("hidden", !next);
    if (!next) return;

    if (!state.shopOpen) {
      toggleShop(true);
    }
    toggleRulesPopup(false);
    toggleCoinTopupPopup(false);
    toggleFoodEmptyPopup(false);
    togglePuzzleQuickPopup(false);
    toggleHabitatViewPopup(false);
    togglePuzzleCatalogPopup(false);
    updateFoodMarketPopupText();
    window.setTimeout(() => {
      if (ui.buyFoodMix50Btn && typeof ui.buyFoodMix50Btn.focus === "function") {
        ui.buyFoodMix50Btn.focus({ preventScroll: true });
      }
    }, 80);
  }

  function openShopForCoinTopUp() {
    markUserActivity();
    toggleCoinTopupPopup(true);
  }

  function openShopForFoodPurchase() {
    markUserActivity();
    toggleShop(true);
    togglePuzzleQuickPopup(false);
    toggleHabitatViewPopup(false);
    if (ui.shopSheet) {
      ui.shopSheet.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.setTimeout(() => {
      const focusTarget = ui.openFoodMarketBtn || ui.openPuzzleCatalogBtn || ui.buyFoodBtn || ui.catalogBuyFoodBtn;
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus({ preventScroll: true });
      }
    }, 80);
  }

  function getTotalFoodUnits() {
    return (
      Math.max(0, Math.floor(state.foodBalance)) +
      getWormCount() +
      getFlyCount()
    );
  }

  function consumeFoodTypeForManualFeed(typeId) {
    if (typeId === "butterfly" && state.foodBalance > 0) {
      state.foodBalance = Math.max(0, Math.floor(state.foodBalance - 1));
      return { className: "butterfly-food", emoji: "🦋", value: 1, size: 46 };
    }
    if (typeId === "worm" && state.wormBank > 0) {
      state.wormBank = Math.max(0, Math.floor(state.wormBank - 1));
      return { className: "worm-food", emoji: "🪱", value: 1, size: 32 };
    }
    if (typeId === "fly" && state.flyBank > 0) {
      state.flyBank = Math.max(0, Math.floor(state.flyBank - 1));
      return { className: "fly-food", emoji: "🪰", value: 1, size: 34 };
    }
    return null;
  }

  function consumeFoodForManualFeedBurst(maxUnits = MANUAL_FEED_BURST_UNITS) {
    const safeMax = Math.max(1, Math.floor(maxUnits));
    const released = [];

    // First pass: ensure variety when available.
    ["butterfly", "worm", "fly"].forEach((typeId) => {
      if (released.length >= safeMax) return;
      const unit = consumeFoodTypeForManualFeed(typeId);
      if (unit) released.push(unit);
    });

    // Second pass: weighted by available bank amounts.
    while (released.length < safeMax) {
      const pool = [];
      if (state.foodBalance > 0) pool.push({ id: "butterfly", weight: state.foodBalance });
      if (state.wormBank > 0) pool.push({ id: "worm", weight: state.wormBank });
      if (state.flyBank > 0) pool.push({ id: "fly", weight: state.flyBank });
      if (!pool.length) break;

      const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
      let roll = randBetween(0, totalWeight);
      let selectedId = pool[pool.length - 1].id;
      for (let i = 0; i < pool.length; i += 1) {
        roll -= pool[i].weight;
        if (roll <= 0) {
          selectedId = pool[i].id;
          break;
        }
      }
      const unit = consumeFoodTypeForManualFeed(selectedId);
      if (!unit) break;
      released.push(unit);
    }

    return released;
  }

  function animateHomeFoodRelease(feedTypes) {
    if (!ui.homeScene) return;
    const types = Array.isArray(feedTypes) && feedTypes.length
      ? feedTypes
      : [{ className: "butterfly-food", emoji: "🦋", value: 1, size: 46 }];
    const sceneRect = ui.homeScene.getBoundingClientRect();
    const centerX = sceneRect.width * 0.5;
    const centerY = sceneRect.height * 0.5;

    const maxSpreadX = sceneRect.width * 0.46;
    const maxSpreadY = sceneRect.height * 0.44;

    types.forEach((type, index) => {
      const endX = clamp(
        centerX + randBetween(-maxSpreadX, maxSpreadX),
        10,
        Math.max(10, sceneRect.width - 56)
      );
      const endY = clamp(
        centerY + randBetween(-maxSpreadY, maxSpreadY),
        10,
        Math.max(10, sceneRect.height - 56)
      );

      const pellet = document.createElement("div");
      pellet.className = "home-feed-release";
      pellet.setAttribute("aria-hidden", "true");
      pellet.textContent = type.emoji || "🦋";
      pellet.style.left = `${centerX}px`;
      pellet.style.top = `${centerY}px`;
      pellet.style.setProperty("--tx", `${endX - centerX}px`);
      pellet.style.setProperty("--ty", `${endY - centerY}px`);
      ui.homeScene.appendChild(pellet);

      window.setTimeout(() => {
        pellet.classList.add("flying");
      }, index * 20);

      window.setTimeout(() => {
        pellet.remove();
        addHomeItem(
          {
            className: type.className || "butterfly-food",
            emoji: type.emoji || "🦋",
            value: Number.isFinite(type.value) ? type.value : 1,
            size: Number.isFinite(type.size) ? type.size : 46
          },
          endX,
          endY,
          { source: "manual-feed", vx: randBetween(-24, 24), vy: randBetween(-20, 20) }
        );
      }, 620 + index * 20);
    });

    if (ui.homeSapito && !ui.homeSapito.classList.contains("tap-jump")) {
      ui.homeSapito.classList.add("tap-jump");
      window.setTimeout(() => ui.homeSapito && ui.homeSapito.classList.remove("tap-jump"), 420);
    }
  }

  function releaseFoodForSapito() {
    markUserActivity();
    const feedTypes = consumeFoodForManualFeedBurst();
    if (!feedTypes.length) {
      toggleFoodEmptyPopup(true);
      return;
    }

    updateHud();
    updateCoinBankUi();
    updateHabitatPanel();
    saveSettings();
    animateHomeFoodRelease(feedTypes);

    if (ui.homeSapitoSpeech) {
      ui.homeSapitoSpeech.textContent = state.language === "es" ? "Yum. Gracias, human." : "Yum. Thanks, human.";
      ui.homeSapitoSpeech.classList.remove("hidden");
      updateHomeSapitoSpeechPosition();
      state.neglectSpeechNextAt = performance.now() + 1600;
    }

    const btfCount = feedTypes.filter((item) => item.className === "butterfly-food").length;
    const wrmCount = feedTypes.filter((item) => item.className === "worm-food").length;
    const flyCount = feedTypes.filter((item) => item.className === "fly-food").length;
    if (state.language === "es") {
      showToast(`Comida lanzada desde el centro: ${btfCount}🦋 ${wrmCount}🪱 ${flyCount}🪰.`);
    } else {
      showToast(`Food spread from center: ${btfCount}🦋 ${wrmCount}🪱 ${flyCount}🪰.`);
    }
  }

  function renderRulesTable() {
    if (!ui.rulesTableWrap) return;
    const headers = state.language === "es"
      ? ["Etapa", "Juego", "Regla", "Premio", "Helper"]
      : ["Stage", "Game", "Rule", "Prize", "Helper"];
    const passLabel = state.language === "es" ? "PASA LOS 8 JUEGOS" : "PASS ALL 8 GAMES";
    const helperLabel = state.language === "es" ? "Helper" : "Helper";
    const grandPrizeProgress = Math.min(GRAND_PRIZE_BUTTERFLY_GOAL, Math.max(0, Math.floor(state.totalButterfliesCaught)));
    const grandPrizeRule = state.language === "es"
      ? `Recolecta ${GRAND_PRIZE_BUTTERFLY_GOAL.toLocaleString()} mariposas acumuladas. Progreso: ${grandPrizeProgress.toLocaleString()}/${GRAND_PRIZE_BUTTERFLY_GOAL.toLocaleString()}.`
      : `Collect ${GRAND_PRIZE_BUTTERFLY_GOAL.toLocaleString()} total butterflies. Progress: ${grandPrizeProgress.toLocaleString()}/${GRAND_PRIZE_BUTTERFLY_GOAL.toLocaleString()}.`;
    const grandPrizeText = state.language === "es"
      ? `${GRAND_PRIZE_COIN_REWARD} Sapito Coins para usar en este juego. Credito digital sin valor en efectivo; compras finales excepto donde la ley o politica de Discord/plataforma requiera otra cosa.`
      : `${GRAND_PRIZE_COIN_REWARD} Sapito Coins to use in this game. Digital credit with no cash value; purchases are final except where law or Discord/platform policy requires otherwise.`;
    const grandPrizeStatus = state.grandPrizeAwarded
      ? (state.language === "es" ? "Desbloqueado" : "Unlocked")
      : (state.language === "es" ? "Pendiente" : "Pending");

    const rows = LEVEL_RULE_BOOK.map((stage) => {
      const stageTitle = state.language === "es" ? stage.titleEs : stage.titleEn;
      const stageHeaderRow = `
        <tr class="stage-row stage-${stage.stageId}">
          <td colspan="5">${stageTitle}</td>
        </tr>
      `;
      const gameRows = stage.games.map((game) => `
        <tr>
          <td>${stage.stageId}</td>
          <td>${game.game}</td>
          <td>${formatRequirementBundle(game.requirement)}</td>
          <td>${formatPrizeBundle(game.prize)}</td>
          <td>0</td>
        </tr>
      `).join("");
      const helperUnlock = state.language === "es" ? stage.passPrize.helperUnlockEs : stage.passPrize.helperUnlockEn;
      const medalName = state.language === "es" ? stage.passPrize.medalNameEs : stage.passPrize.medalNameEn;
      const bonusText = `${formatPrizeBundle(stage.passPrize)}${medalName ? ` • ${medalName}` : ""}`;
      const bonusRow = `
        <tr class="bonus-row stage-${stage.stageId}">
          <td>${stage.stageId}</td>
          <td>${LEVELS_PER_STAGE}/${LEVELS_PER_STAGE}</td>
          <td>${passLabel}</td>
          <td>${bonusText}</td>
          <td>${helperUnlock ? `${helperLabel}: ${helperUnlock}` : "0"}</td>
        </tr>
      `;
      return `${stageHeaderRow}${gameRows}${bonusRow}`;
    }).join("");

    ui.rulesTableWrap.innerHTML = `
      <table class="rules-table">
        <thead>
          <tr>
            <th>${headers[0]}</th>
            <th>${headers[1]}</th>
            <th>${headers[2]}</th>
            <th>${headers[3]}</th>
            <th>${headers[4]}</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="grand-prize-row">
            <td>★</td>
            <td>${state.language === "es" ? "Gran premio" : "Grand Prize"}</td>
            <td>${grandPrizeRule}</td>
            <td>${grandPrizeText}</td>
            <td>${grandPrizeStatus}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function toggleRulesPopup(force) {
    if (!ui.rulesPopup) return;
    const next = typeof force === "boolean" ? force : !state.rulesOpen;
    state.rulesOpen = next;
    ui.rulesPopup.classList.toggle("hidden", !next);
    if (next) {
      togglePuzzleCatalogPopup(false);
      togglePuzzleQuickPopup(false);
      toggleHabitatViewPopup(false);
      toggleCoinTopupPopup(false);
      toggleFoodMarketPopup(false);
      renderRulesTable();
      if (ui.rulesPopupTitle) {
        ui.rulesPopupTitle.textContent = state.language === "es" ? "Reglas y Premios" : "Rules & Prizes";
      }
      if (ui.rulesPopupSubtitle) {
        ui.rulesPopupSubtitle.textContent = state.language === "es"
          ? "Estas reglas ya estan codificadas en la progresion del juego."
          : "These rules are codified in game progression.";
      }
    }
  }

  function renderLegalDisclaimer() {
    if (ui.legalNoticeTitle) {
      ui.legalNoticeTitle.textContent = state.language === "es" ? "Aviso Legal y de Seguridad" : "Legal & Safety Notice";
    }
    if (!ui.legalNoticeBody) return;

    if (state.language === "es") {
      ui.legalNoticeBody.innerHTML = `
        <p>Sapito es una app gratuita de entretenimiento. No es consejo financiero, apuesta, sorteo, inversion ni producto con valor monetario.</p>
        <ul>
          <li>Sapito Coins son creditos digitales opcionales para articulos dentro del juego. No tienen valor en efectivo y no se pueden cambiar por dinero.</li>
          <li>Todas las compras son finales, excepto cuando la ley aplicable o la politica de Discord/plataforma de pago requiera otra cosa.</li>
          <li>El jugador es responsable de sus decisiones de compra. No gastes mas de lo que puedas permitirte. Si el gasto se vuelve preocupante, deja de comprar y contacta soporte de la plataforma.</li>
          <li>La app esta en pruebas y desarrollo activo. Bugs, cambios de balance, interrupciones o malfunctions pueden ocurrir.</li>
          <li>Reporta fallas, compras faltantes o comportamientos raros en el canal de soporte de Sapito/Discord para revision.</li>
        </ul>
        <p class="legal-link-row">
          <a href="terms.html" target="_blank" rel="noopener">Terminos de Servicio</a>
          <a href="privacy.html" target="_blank" rel="noopener">Politica de Privacidad</a>
        </p>
      `;
      return;
    }

    ui.legalNoticeBody.innerHTML = `
      <p>Sapito is a free entertainment app. It is not financial advice, gambling, betting, a sweepstakes, an investment, or a product with real-world cash value.</p>
      <ul>
        <li>Sapito Coins are optional digital game credits for in-game items only. They have no cash value and cannot be exchanged for money.</li>
        <li>All purchases are final except where required by applicable law or Discord/payment-platform policy.</li>
        <li>Players are responsible for their own purchase decisions. Do not spend more than you can afford. If spending becomes concerning, stop purchasing and contact platform support.</li>
        <li>The app is in testing and active development. Bugs, balance changes, outages, or malfunctions may happen.</li>
        <li>Report malfunctions, missing purchases, or unusual behavior through Sapito/Discord support for review.</li>
      </ul>
      <p class="legal-link-row">
        <a href="terms.html" target="_blank" rel="noopener">Terms of Service</a>
        <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
      </p>
    `;
  }

  function toggleLegalPopup(force) {
    if (!ui.legalPopup) return;
    const next = typeof force === "boolean" ? force : !state.legalOpen;
    state.legalOpen = next;
    ui.legalPopup.classList.toggle("hidden", !next);
    if (!next) return;

    renderLegalDisclaimer();
    window.setTimeout(() => {
      if (ui.closeLegalBtn && typeof ui.closeLegalBtn.focus === "function") {
        ui.closeLegalBtn.focus({ preventScroll: true });
      }
    }, 80);
  }

  function toggleRoadMapPopup(force) {
    if (!ui.roadMapPopup) return;
    const next = typeof force === "boolean" ? force : !state.roadMapOpen;
    state.roadMapOpen = next;
    ui.roadMapPopup.classList.toggle("hidden", !next);
    document.body.classList.toggle("road-map-open", next);
    if (!next) return;

    togglePuzzleCatalogPopup(false);
    togglePuzzleQuickPopup(false);
    toggleHabitatViewPopup(false);
    toggleRulesPopup(false);
    toggleLegalPopup(false);
    toggleCoinTopupPopup(false);
    toggleFoodMarketPopup(false);
    toggleFoodEmptyPopup(false);

    window.setTimeout(() => {
      if (ui.closeRoadMapBtn && typeof ui.closeRoadMapBtn.focus === "function") {
        ui.closeRoadMapBtn.focus({ preventScroll: true });
      }
    }, 80);
  }

  function updateFoodEmptyPopupText() {
    if (ui.foodEmptyTitle) {
      ui.foodEmptyTitle.textContent = state.language === "es" ? "Sin Comida En Banco" : "No Food In Bank";
    }
    if (ui.foodEmptyText) {
      ui.foodEmptyText.textContent = state.language === "es"
        ? "Sapito no tiene comida ahora. Abre el mercado de comida, juega para ganar, o abre la tienda."
        : "Sapito has no food right now. Open Food Market, play to win more, or open the shop.";
    }
    if (ui.foodEmptyBuyBtn) {
      ui.foodEmptyBuyBtn.textContent = state.language === "es"
        ? "Abrir mercado de comida"
        : "Open Food Market";
    }
    if (ui.foodEmptyPlayBtn) {
      ui.foodEmptyPlayBtn.textContent = state.language === "es" ? "Jugar por comida" : "Play for Food";
    }
    if (ui.foodEmptyShopBtn) {
      ui.foodEmptyShopBtn.textContent = state.language === "es" ? "Abrir tienda" : "Open Shop";
    }
  }

  function updateFoodMarketPopupText() {
    if (ui.openFoodMarketBtn) {
      ui.openFoodMarketBtn.textContent = state.language === "es" ? "Comprar comida" : "Buy Food";
    }
    if (ui.foodMarketTitle) {
      ui.foodMarketTitle.textContent = state.language === "es" ? "Mercado de Comida" : "Food Market";
    }
    if (ui.foodMarketCloseBtn) {
      ui.foodMarketCloseBtn.setAttribute(
        "aria-label",
        state.language === "es" ? "Cerrar mercado de comida" : "Close food market"
      );
    }

    const coinText = Math.max(0, Math.floor(state.coinBalance)).toLocaleString();
    const btfText = Math.max(0, Math.floor(state.foodBalance)).toLocaleString();
    const wrmText = getWormCount().toLocaleString();
    const flyText = getFlyCount().toLocaleString();

    if (ui.foodMarketBalanceLine) {
      ui.foodMarketBalanceLine.innerHTML = state.language === "es"
        ? `Saldo: ${coinText} Sapito Coins ${coinIconHtml()} • Banco: 🦋 ${btfText} • 🪱 ${wrmText} • 🪰 ${flyText}`
        : `Balance: ${coinText} Sapito Coins ${coinIconHtml()} • Bank: 🦋 ${btfText} • 🪱 ${wrmText} • 🪰 ${flyText}`;
    }
    if (ui.foodMarketBuyCoinsBtn) {
      ui.foodMarketBuyCoinsBtn.textContent = state.language === "es" ? "Comprar Sapito Coins" : "Buy Sapito Coins";
      ui.foodMarketBuyCoinsBtn.setAttribute(
        "aria-label",
        state.language === "es" ? "Abrir compra de Sapito Coins" : "Open Sapito Coins purchase"
      );
    }
    if (ui.foodMarketHint) {
      ui.foodMarketHint.textContent = state.language === "es"
        ? `Elige el tipo de comida. Cada pack trae +${FOOD_MARKET_PACK_UNITS} por ${FOOD_MARKET_PACK_COST} Sapito Coins.`
        : `Pick a food type. Each pack gives +${FOOD_MARKET_PACK_UNITS} for ${FOOD_MARKET_PACK_COST} Sapito Coins.`;
    }
    if (ui.buyFoodMix50Btn) {
      ui.buyFoodMix50Btn.innerHTML = state.language === "es"
        ? `Comprar +${FOOD_MARKET_PACK_UNITS} mariposas multicolor (${formatCoinWithIcon(FOOD_MARKET_PACK_COST)})`
        : `Buy +${FOOD_MARKET_PACK_UNITS} Multicolor Butterflies (${formatCoinWithIcon(FOOD_MARKET_PACK_COST)})`;
    }
    if (ui.buyFoodWorm50Btn) {
      ui.buyFoodWorm50Btn.innerHTML = state.language === "es"
        ? `Comprar +${FOOD_MARKET_PACK_UNITS} gusanitos (${formatCoinWithIcon(FOOD_MARKET_PACK_COST)})`
        : `Buy +${FOOD_MARKET_PACK_UNITS} Worms (${formatCoinWithIcon(FOOD_MARKET_PACK_COST)})`;
    }
    if (ui.buyFoodFly50Btn) {
      ui.buyFoodFly50Btn.innerHTML = state.language === "es"
        ? `Comprar +${FOOD_MARKET_PACK_UNITS} moscas (${formatCoinWithIcon(FOOD_MARKET_PACK_COST)})`
        : `Buy +${FOOD_MARKET_PACK_UNITS} Flies (${formatCoinWithIcon(FOOD_MARKET_PACK_COST)})`;
    }
  }

  function toggleFoodEmptyPopup(force) {
    if (!ui.foodEmptyPopup) return;
    const next = typeof force === "boolean" ? force : !state.foodEmptyOpen;
    state.foodEmptyOpen = next;
    ui.foodEmptyPopup.classList.toggle("hidden", !next);
    if (next) {
      togglePuzzleCatalogPopup(false);
      togglePuzzleQuickPopup(false);
      toggleHabitatViewPopup(false);
      toggleCoinTopupPopup(false);
      toggleFoodMarketPopup(false);
      updateFoodEmptyPopupText();
    }
  }

  function updatePetHomePreview() {
    if (!ui.petFrogPreview || !ui.petFoodButterfly || !ui.petFoodWorm || !ui.petHomeTitle) return;
    const frogCount = getFrogCountForLevel(state.level);
    const personality = getPersonalityStageForLevel(state.level);
    const routeText = state.language === "es"
      ? `Ruta ${getDisplayLevel()}/${PATH_LEVEL_COUNT} • Seccion ${getDisplaySection()}/${LEVELS_PER_STAGE}`
      : `Path ${getDisplayLevel()}/${PATH_LEVEL_COUNT} • Section ${getDisplaySection()}/${LEVELS_PER_STAGE}`;
    const frogText = state.language === "es"
      ? `${frogCount} sapito${frogCount === 1 ? "" : "s"} activo${frogCount === 1 ? "" : "s"}`
      : `${frogCount} pet frog${frogCount === 1 ? "" : "s"}`;
    ui.petHomeTitle.textContent = `${routeText} • ${personality.label} • ${frogText}`;
    ui.petFoodButterfly.textContent = state.language === "es"
      ? `🦋 Comida mariposa: ${state.foodBalance} • 🟡 ${state.yellowButterflyBank} • 🔴 ${state.redButterflyBank}`
      : `🦋 Butterfly food: ${state.foodBalance} • 🟡 ${state.yellowButterflyBank} • 🔴 ${state.redButterflyBank}`;
    ui.petFoodWorm.textContent = state.language === "es"
      ? `🪱 Gusanitos: ${getWormCount()}`
      : `🪱 Worms: ${getWormCount()}`;
    if (ui.petFoodFly) {
      ui.petFoodFly.textContent = state.language === "es"
        ? `🪰 Moscas: ${getFlyCount()} • ❤ Vida: ${Math.round(getSapitoHealthPercent())}% • 🏅 ${state.medalCount}`
        : `🪰 Flies: ${getFlyCount()} • ❤ Life: ${Math.round(getSapitoHealthPercent())}% • 🏅 ${state.medalCount}`;
    }
    if (ui.puzzleProgressLine) {
      const completed = getPuzzleCompletedCount();
      ui.puzzleProgressLine.textContent = state.language === "es"
        ? `Puzzle completado: ${completed}/${DECOR_ORDER.length}`
        : `Puzzle completed: ${completed}/${DECOR_ORDER.length}`;
    }
    applyPersonalityVisuals(personality);
    updateSapitoLook();
  }

  function getPuzzleCompletedCount() {
    return DECOR_ORDER.reduce((total, id) => total + (getDecorCount(id) > 0 ? 1 : 0), 0);
  }

  function getDecorLabel(item) {
    return state.language === "es" ? item.labelEs : item.labelEn;
  }

  function getDecorCount(typeId) {
    return state.decorCounts[typeId] || 0;
  }

  function getTotalDecorCount() {
    let total = 0;
    DECOR_ORDER.forEach((id) => {
      total += getDecorCount(id);
    });
    return total;
  }

  function getDecorSummaryText() {
    const parts = DECOR_ORDER.map((id) => {
      const count = getDecorCount(id);
      if (count <= 0) return null;
      const item = getDecorItem(id);
      if (!item) return null;
      return `${getDecorLabel(item)} ${count}`;
    }).filter(Boolean);

    if (!parts.length) {
      return state.language === "es"
        ? "Decor: aun no tienes objetos comprados."
        : "Decor: you do not own habitat items yet.";
    }
    return `Decor: ${parts.join(", ")}.`;
  }

  function getPuzzlePieceProgress() {
    const total = DECOR_ORDER.length;
    let owned = 0;
    DECOR_ORDER.forEach((id) => {
      if (getDecorCount(id) > 0) {
        owned += 1;
      }
    });
    return { owned, total };
  }

  function getPuzzleProgressInlineText() {
    const { owned, total } = getPuzzlePieceProgress();
    if (state.language === "es") {
      return `Piezas desbloqueadas: ${owned}/${total}`;
    }
    return `Pieces unlocked: ${owned}/${total}`;
  }

  function getPuzzleProgressDetailText() {
    const { owned, total } = getPuzzlePieceProgress();
    if (state.language === "es") {
      return `Progreso: ${owned}/${total} piezas desbloqueadas.`;
    }
    return `Progress: ${owned}/${total} pieces unlocked.`;
  }

  function renderPuzzleProgressPreview(targetEl, pieceClassName) {
    if (!targetEl) return;
    targetEl.innerHTML = "";

    const fragment = document.createDocumentFragment();
    DECOR_ORDER.forEach((id) => {
      if (getDecorCount(id) <= 0) return;
      const piece = HABITAT_PUZZLE_PIECES[id];
      if (!piece) return;

      const crop = getPuzzlePiecePreviewCrop(piece);
      const pieceEl = document.createElement("span");
      pieceEl.className = pieceClassName;
      pieceEl.style.left = `${(piece.x * 100).toFixed(4)}%`;
      pieceEl.style.top = `${(piece.y * 100).toFixed(4)}%`;
      pieceEl.style.width = `${(piece.w * 100).toFixed(4)}%`;
      pieceEl.style.height = `${(piece.h * 100).toFixed(4)}%`;
      pieceEl.style.backgroundImage = `url("${HABITAT_TARGET_IMAGE}")`;
      pieceEl.style.backgroundSize = `${crop.sizeX}% ${crop.sizeY}%`;
      pieceEl.style.backgroundPosition = `${crop.posX}% ${crop.posY}%`;
      fragment.appendChild(pieceEl);
    });

    targetEl.appendChild(fragment);
  }

  function renderHabitatPuzzlePreview() {
    renderPuzzleProgressPreview(ui.habitatPuzzlePreview, "habitat-puzzle-preview-piece");
  }

  function renderHabitatViewPreview() {
    renderPuzzleProgressPreview(ui.habitatViewPreview, "habitat-view-piece");
  }

  function getPuzzlePiecePreviewCrop(piece) {
    if (!piece) {
      return {
        sizeX: 100,
        sizeY: 100,
        posX: 50,
        posY: 50
      };
    }

    const safeW = clamp(Number(piece.w) || 0.25, 0.02, 1);
    const safeH = clamp(Number(piece.h) || 0.25, 0.02, 1);
    const safeX = clamp(Number(piece.x) || 0, 0, 1 - safeW);
    const safeY = clamp(Number(piece.y) || 0, 0, 1 - safeH);

    const sizeX = (100 / safeW);
    const sizeY = (100 / safeH);
    const posX = safeW >= 1 ? 0 : (safeX / (1 - safeW)) * 100;
    const posY = safeH >= 1 ? 0 : (safeY / (1 - safeH)) * 100;
    return { sizeX, sizeY, posX, posY };
  }

  function getPuzzlePieceGridIndex(pieceId) {
    const index = DECOR_ORDER.indexOf(pieceId);
    if (index < 0) return null;
    const row = Math.floor(index / PUZZLE_COLS);
    const col = index % PUZZLE_COLS;
    return { index, row, col };
  }

  function getPuzzlePieceEdges(pieceId) {
    const info = getPuzzlePieceGridIndex(pieceId);
    if (!info) return null;
    const { row, col } = info;

    const horizontalTypeAt = (r, c) => (((r + c) % 2 === 0) ? 1 : -1);
    const verticalTypeAt = (r, c) => ((((r * 2) + c) % 2 === 0) ? 1 : -1);

    const top = row === 0 ? 0 : -verticalTypeAt(row - 1, col);
    const right = col === PUZZLE_COLS - 1 ? 0 : horizontalTypeAt(row, col);
    const bottom = row === PUZZLE_ROWS - 1 ? 0 : verticalTypeAt(row, col);
    const left = col === 0 ? 0 : -horizontalTypeAt(row, col - 1);

    return { ...info, top, right, bottom, left };
  }

  function buildPuzzlePiecePath(edges) {
    const d = [];
    d.push("M 0 0");

    if (edges.top === 0) {
      d.push(`L ${PUZZLE_TILE_UNITS} 0`);
    } else if (edges.top > 0) {
      d.push(`L ${PUZZLE_TAB_START} 0`);
      d.push(`C 42 0 42 ${-PUZZLE_TAB_DEPTH} 50 ${-PUZZLE_TAB_DEPTH}`);
      d.push(`C 58 ${-PUZZLE_TAB_DEPTH} 58 0 ${PUZZLE_TAB_END} 0`);
      d.push(`L ${PUZZLE_TILE_UNITS} 0`);
    } else {
      d.push(`L ${PUZZLE_TAB_START} 0`);
      d.push(`C 42 0 42 ${PUZZLE_TAB_DEPTH} 50 ${PUZZLE_TAB_DEPTH}`);
      d.push(`C 58 ${PUZZLE_TAB_DEPTH} 58 0 ${PUZZLE_TAB_END} 0`);
      d.push(`L ${PUZZLE_TILE_UNITS} 0`);
    }

    if (edges.right === 0) {
      d.push(`L ${PUZZLE_TILE_UNITS} ${PUZZLE_TILE_UNITS}`);
    } else if (edges.right > 0) {
      d.push(`L ${PUZZLE_TILE_UNITS} ${PUZZLE_TAB_START}`);
      d.push(`C ${PUZZLE_TILE_UNITS} 42 ${PUZZLE_TILE_UNITS + PUZZLE_TAB_DEPTH} 42 ${PUZZLE_TILE_UNITS + PUZZLE_TAB_DEPTH} 50`);
      d.push(`C ${PUZZLE_TILE_UNITS + PUZZLE_TAB_DEPTH} 58 ${PUZZLE_TILE_UNITS} 58 ${PUZZLE_TILE_UNITS} ${PUZZLE_TAB_END}`);
      d.push(`L ${PUZZLE_TILE_UNITS} ${PUZZLE_TILE_UNITS}`);
    } else {
      d.push(`L ${PUZZLE_TILE_UNITS} ${PUZZLE_TAB_START}`);
      d.push(`C ${PUZZLE_TILE_UNITS} 42 ${PUZZLE_TILE_UNITS - PUZZLE_TAB_DEPTH} 42 ${PUZZLE_TILE_UNITS - PUZZLE_TAB_DEPTH} 50`);
      d.push(`C ${PUZZLE_TILE_UNITS - PUZZLE_TAB_DEPTH} 58 ${PUZZLE_TILE_UNITS} 58 ${PUZZLE_TILE_UNITS} ${PUZZLE_TAB_END}`);
      d.push(`L ${PUZZLE_TILE_UNITS} ${PUZZLE_TILE_UNITS}`);
    }

    if (edges.bottom === 0) {
      d.push(`L 0 ${PUZZLE_TILE_UNITS}`);
    } else if (edges.bottom > 0) {
      d.push(`L ${PUZZLE_TAB_END} ${PUZZLE_TILE_UNITS}`);
      d.push(`C 58 ${PUZZLE_TILE_UNITS} 58 ${PUZZLE_TILE_UNITS + PUZZLE_TAB_DEPTH} 50 ${PUZZLE_TILE_UNITS + PUZZLE_TAB_DEPTH}`);
      d.push(`C 42 ${PUZZLE_TILE_UNITS + PUZZLE_TAB_DEPTH} 42 ${PUZZLE_TILE_UNITS} ${PUZZLE_TAB_START} ${PUZZLE_TILE_UNITS}`);
      d.push(`L 0 ${PUZZLE_TILE_UNITS}`);
    } else {
      d.push(`L ${PUZZLE_TAB_END} ${PUZZLE_TILE_UNITS}`);
      d.push(`C 58 ${PUZZLE_TILE_UNITS} 58 ${PUZZLE_TILE_UNITS - PUZZLE_TAB_DEPTH} 50 ${PUZZLE_TILE_UNITS - PUZZLE_TAB_DEPTH}`);
      d.push(`C 42 ${PUZZLE_TILE_UNITS - PUZZLE_TAB_DEPTH} 42 ${PUZZLE_TILE_UNITS} ${PUZZLE_TAB_START} ${PUZZLE_TILE_UNITS}`);
      d.push(`L 0 ${PUZZLE_TILE_UNITS}`);
    }

    if (edges.left === 0) {
      d.push("L 0 0");
    } else if (edges.left > 0) {
      d.push(`L 0 ${PUZZLE_TAB_END}`);
      d.push(`C 0 58 ${-PUZZLE_TAB_DEPTH} 58 ${-PUZZLE_TAB_DEPTH} 50`);
      d.push(`C ${-PUZZLE_TAB_DEPTH} 42 0 42 0 ${PUZZLE_TAB_START}`);
      d.push("L 0 0");
    } else {
      d.push(`L 0 ${PUZZLE_TAB_END}`);
      d.push(`C 0 58 ${PUZZLE_TAB_DEPTH} 58 ${PUZZLE_TAB_DEPTH} 50`);
      d.push(`C ${PUZZLE_TAB_DEPTH} 42 0 42 0 ${PUZZLE_TAB_START}`);
      d.push("L 0 0");
    }

    d.push("Z");
    return d.join(" ");
  }

  function createPuzzlePieceSvg(pieceId, className = "puzzle-piece-svg", options = {}) {
    const edges = getPuzzlePieceEdges(pieceId);
    if (!edges) return null;
    const { row, col } = edges;
    const pathData = buildPuzzlePiecePath(edges);
    const size = PUZZLE_TILE_UNITS + (PUZZLE_VIEWBOX_PAD * 2);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `${-PUZZLE_VIEWBOX_PAD} ${-PUZZLE_VIEWBOX_PAD} ${size} ${size}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", className);

    const defs = document.createElementNS(SVG_NS, "defs");
    const clipPath = document.createElementNS(SVG_NS, "clipPath");
    const clipId = `puzzle-clip-${puzzlePieceSvgIdCounter += 1}`;
    clipPath.setAttribute("id", clipId);
    clipPath.setAttribute("clipPathUnits", "userSpaceOnUse");
    const clipPathShape = document.createElementNS(SVG_NS, "path");
    clipPathShape.setAttribute("d", pathData);
    clipPath.appendChild(clipPathShape);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    const shapeBase = document.createElementNS(SVG_NS, "path");
    shapeBase.setAttribute("d", pathData);
    shapeBase.setAttribute("fill", options.transparentBase ? "transparent" : "#bfe6ff");
    svg.appendChild(shapeBase);

    const image = document.createElementNS(SVG_NS, "image");
    image.setAttribute("href", HABITAT_TARGET_IMAGE);
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", HABITAT_TARGET_IMAGE);
    image.setAttribute("x", String(-col * PUZZLE_TILE_UNITS));
    image.setAttribute("y", String(-row * PUZZLE_TILE_UNITS));
    image.setAttribute("width", String(PUZZLE_COLS * PUZZLE_TILE_UNITS));
    image.setAttribute("height", String(PUZZLE_ROWS * PUZZLE_TILE_UNITS));
    image.setAttribute("preserveAspectRatio", "none");
    image.setAttribute("clip-path", `url(#${clipId})`);
    svg.appendChild(image);

    if (!options.hideOutline) {
      const outline = document.createElementNS(SVG_NS, "path");
      outline.setAttribute("d", pathData);
      outline.setAttribute("fill", "none");
      outline.setAttribute("stroke", "rgba(20, 60, 84, 0.78)");
      outline.setAttribute("stroke-width", "2.2");
      outline.setAttribute("stroke-linejoin", "round");
      outline.setAttribute("stroke-linecap", "round");
      svg.appendChild(outline);
    }

    return svg;
  }

  function renderPuzzlePieceSvg(targetEl, pieceId, className = "puzzle-piece-svg") {
    if (!targetEl) return;
    targetEl.innerHTML = "";
    const svg = createPuzzlePieceSvg(pieceId, className);
    if (svg) {
      targetEl.appendChild(svg);
    }
  }

  function ensurePuzzleCatalogOrder() {
    state.puzzleCatalogOrder = [...DECOR_ORDER];
    return state.puzzleCatalogOrder;
  }

  function updatePuzzleCatalogUiText() {
    if (ui.habitatPuzzleTitle) {
      ui.habitatPuzzleTitle.textContent = state.language === "es" ? "Puzzle del Habitat" : "Habitat Puzzle";
    }
    if (ui.habitatPuzzleHint) {
      ui.habitatPuzzleHint.textContent = state.language === "es"
        ? "Empieza con lago simple. Compra 20 piezas (2 coins cada una) para armar el habitat completo de Sapito."
        : "Start with a plain pond. Buy 20 puzzle pieces (2 coins each) to build Sapito's full habitat.";
    }
    if (ui.habitatPuzzleCta) {
      ui.habitatPuzzleCta.textContent = state.language === "es" ? "Abrir opciones del puzzle" : "Open Puzzle Options";
    }
    if (ui.openPuzzleCatalogBtn) {
      ui.openPuzzleCatalogBtn.setAttribute(
        "aria-label",
        state.language === "es" ? "Abrir opciones del puzzle del habitat" : "Open habitat puzzle options"
      );
    }
    if (ui.puzzleQuickTitle) {
      ui.puzzleQuickTitle.textContent = state.language === "es" ? "Puzzle del Habitat" : "Habitat Puzzle";
    }
    if (ui.puzzleQuickHint) {
      ui.puzzleQuickHint.textContent = state.language === "es"
        ? "Elige que quieres abrir ahora."
        : "Choose what to open now.";
    }
    if (ui.openHabitatViewBtn) {
      ui.openHabitatViewBtn.textContent = state.language === "es" ? "Vista del Habitat" : "Habitat View";
    }
    if (ui.openPuzzleCatalogFromQuickBtn) {
      ui.openPuzzleCatalogFromQuickBtn.textContent = state.language === "es" ? "Tienda" : "Shop";
    }
    if (ui.closePuzzleQuickBtn) {
      ui.closePuzzleQuickBtn.setAttribute(
        "aria-label",
        state.language === "es" ? "Cerrar opciones del puzzle" : "Close puzzle options"
      );
    }
    if (ui.habitatViewTitle) {
      ui.habitatViewTitle.textContent = state.language === "es" ? "Vista del Habitat" : "Habitat View";
    }
    if (ui.habitatViewHint) {
      ui.habitatViewHint.textContent = state.language === "es"
        ? "Vista grande del puzzle actual del habitat de Sapito."
        : "Large view of Sapito's current habitat puzzle.";
    }
    if (ui.habitatViewProgress) {
      ui.habitatViewProgress.textContent = getPuzzleProgressInlineText();
    }
    if (ui.closeHabitatViewBtn) {
      ui.closeHabitatViewBtn.setAttribute(
        "aria-label",
        state.language === "es" ? "Cerrar vista del habitat" : "Close habitat view"
      );
    }
    if (ui.puzzleProgressInline) {
      ui.puzzleProgressInline.textContent = getPuzzleProgressInlineText();
    }
    if (ui.puzzleCatalogTitle) {
      ui.puzzleCatalogTitle.textContent = state.language === "es" ? "Piezas del Puzzle Habitat" : "Habitat Puzzle Pieces";
    }
    if (ui.puzzleCatalogSubtitle) {
      ui.puzzleCatalogSubtitle.textContent = state.language === "es"
        ? "Compra piezas con Sapito Coins. Cada pieza cuesta 2 coins y aparece fija en su lugar del habitat principal."
        : "Buy pieces with Sapito Coins. Each piece costs 2 coins and appears in its fixed place in the main habitat.";
    }
    if (ui.puzzleCatalogProgress) {
      ui.puzzleCatalogProgress.textContent = getPuzzleProgressDetailText();
    }
    if (ui.puzzlePiecePreviewTitle) {
      ui.puzzlePiecePreviewTitle.textContent = state.language === "es" ? "Vista de Pieza Puzzle" : "Puzzle Piece Preview";
    }
    if (ui.closePuzzlePiecePreviewBtn) {
      ui.closePuzzlePiecePreviewBtn.setAttribute(
        "aria-label",
        state.language === "es" ? "Cerrar vista de pieza" : "Close piece preview"
      );
    }
  }

  function renderPuzzleCatalog() {
    if (!ui.puzzleCatalogGrid) return;
    ui.puzzleCatalogGrid.innerHTML = "";
    const catalogOrder = ensurePuzzleCatalogOrder();
    const fragment = document.createDocumentFragment();

    catalogOrder.forEach((id) => {
      const item = getDecorItem(id);
      if (!item) return;

      const coinPrice = getDecorCoinPrice(id);
      const currentCount = getDecorCount(id);
      const maxCount = getDecorMaxCount(id);
      const owned = currentCount >= maxCount;

      const card = document.createElement("article");
      card.className = `puzzle-piece-card${owned ? " owned" : ""}`;
      card.dataset.pieceId = id;

      const preview = document.createElement("button");
      preview.type = "button";
      preview.className = "puzzle-piece-preview puzzle-piece-open-btn";
      preview.setAttribute(
        "aria-label",
        state.language === "es"
          ? `Vista previa de ${getDecorLabel(item)}`
          : `Preview ${getDecorLabel(item)}`
      );
      preview.addEventListener("click", () => togglePuzzlePiecePreviewPopup(true, id));
      renderPuzzlePieceSvg(preview, id);

      const title = document.createElement("h4");
      title.className = "puzzle-piece-title";
      title.textContent = getDecorLabel(item);

      const meta = document.createElement("p");
      meta.className = "puzzle-piece-meta";
      meta.textContent = state.language === "es"
        ? `En habitat: ${currentCount}/${maxCount}`
        : `In habitat: ${currentCount}/${maxCount}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn small puzzle-piece-buy-btn";
      if (owned) {
        button.textContent = state.language === "es" ? "Pieza comprada" : "Piece owned";
        button.disabled = true;
      } else {
        button.innerHTML = `${state.language === "es" ? "Comprar pieza" : "Buy Piece"} - ${formatCoinWithIcon(coinPrice)}`;
        button.addEventListener("click", () => {
          buyDecor(id);
          renderPuzzleCatalog();
        });
      }

      card.appendChild(preview);
      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(button);
      fragment.appendChild(card);
    });

    ui.puzzleCatalogGrid.appendChild(fragment);
  }

  function updatePuzzlePiecePreviewCard() {
    if (!ui.puzzlePiecePreviewArt || !ui.puzzlePiecePreviewName || !ui.puzzlePiecePreviewStatus || !ui.puzzlePiecePreviewBuyBtn) {
      return;
    }

    const pieceId = state.activePuzzlePieceId;
    const item = getDecorItem(pieceId);
    const piece = HABITAT_PUZZLE_PIECES[pieceId];
    if (!item || !piece) {
      ui.puzzlePiecePreviewArt.innerHTML = "";
      ui.puzzlePiecePreviewName.textContent = "";
      ui.puzzlePiecePreviewStatus.textContent = "";
      ui.puzzlePiecePreviewBuyBtn.disabled = true;
      ui.puzzlePiecePreviewBuyBtn.textContent = state.language === "es" ? "Selecciona una pieza" : "Select a piece";
      return;
    }

    const currentCount = getDecorCount(pieceId);
    const maxCount = getDecorMaxCount(pieceId);
    const owned = currentCount >= maxCount;
    const coinPrice = getDecorCoinPrice(pieceId);

    renderPuzzlePieceSvg(ui.puzzlePiecePreviewArt, pieceId, "puzzle-piece-svg puzzle-piece-svg-large");
    ui.puzzlePiecePreviewName.textContent = getDecorLabel(item);
    ui.puzzlePiecePreviewStatus.textContent = state.language === "es"
      ? `En habitat: ${currentCount}/${maxCount} • Precio: ${coinPrice} Sapito Coins.`
      : `In habitat: ${currentCount}/${maxCount} • Price: ${coinPrice} Sapito Coins.`;

    if (owned) {
      ui.puzzlePiecePreviewBuyBtn.textContent = state.language === "es" ? "Pieza comprada" : "Piece owned";
      ui.puzzlePiecePreviewBuyBtn.disabled = true;
      return;
    }

    ui.puzzlePiecePreviewBuyBtn.innerHTML = `${state.language === "es" ? "Comprar pieza" : "Buy Piece"} - ${formatCoinWithIcon(coinPrice)}`;
    ui.puzzlePiecePreviewBuyBtn.disabled = false;
  }

  function updateDecorShopUi() {
    if (ui.decorShopTitle) {
      ui.decorShopTitle.textContent = state.language === "es" ? "Tienda de Decoracion del Lago" : "Pond Decor Shop";
    }

    if (ui.decorShopStatus) {
      const total = getTotalDecorCount();
      if (total <= 0) {
        ui.decorShopStatus.textContent = state.language === "es"
          ? "No hay decoracion todavia. Compra cositas para tu lago."
          : "No decor yet. Buy pond goodies for Sapito.";
      } else {
        ui.decorShopStatus.textContent = getDecorSummaryText();
      }
    }

    DECOR_ORDER.forEach((id) => {
      const item = DECOR_ITEMS[id];
      if (!item) return;
      const count = getDecorCount(id);
      const maxCount = getDecorMaxCount(id);
      const coinPrice = getDecorCoinPrice(id);
      const ownedText = state.language === "es" ? "tienes" : "owned";
      const legacyButton = item.legacyBuyButtonId ? document.getElementById(item.legacyBuyButtonId) : null;
      if (legacyButton) {
        legacyButton.innerHTML = `${getDecorLabel(item)} (${formatCoinWithIcon(coinPrice)}) • ${ownedText}: ${count}`;
        legacyButton.disabled = count >= maxCount;
      }

      const catalogButton = item.catalogButtonId ? document.getElementById(item.catalogButtonId) : null;
      if (catalogButton) {
        catalogButton.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} ${getDecorLabel(item)} (${formatCoinWithIcon(coinPrice)})`;
        catalogButton.disabled = count >= maxCount;
      }

      const catalogInfo = item.catalogInfoId ? document.getElementById(item.catalogInfoId) : null;
      if (catalogInfo) {
        catalogInfo.textContent = state.language === "es"
          ? `${getDecorLabel(item)} en lago: ${count}/${maxCount}`
          : `${getDecorLabel(item)} in pond: ${count}/${maxCount}`;
      }
    });

    updatePuzzleCatalogUiText();
    renderHabitatPuzzlePreview();
    if (state.habitatViewOpen) {
      renderHabitatViewPreview();
    }
    if (state.puzzleCatalogOpen) {
      renderPuzzleCatalog();
    }
    if (state.puzzlePiecePreviewOpen) {
      updatePuzzlePiecePreviewCard();
    }
  }

  function createDecorElement(typeId, x, y, scale = 1, rotateDeg = 0) {
    const item = DECOR_ITEMS[typeId];
    if (!item || !ui.homeDecorLayer) return null;
    const el = document.createElement("div");
    el.className = `pond-decor ${item.className}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `scale(${scale}) rotate(${rotateDeg}deg)`;
    el.style.zIndex = String(1 + Math.max(0, Math.floor(y)));
    ui.homeDecorLayer.appendChild(el);
    return el;
  }

  function createHabitatPieceElement(typeId, bounds) {
    const piece = HABITAT_PUZZLE_PIECES[typeId];
    if (!piece || !ui.homeDecorLayer) return null;

    const padRatio = PUZZLE_VIEWBOX_PAD / PUZZLE_TILE_UNITS;
    const bleed = MAIN_PUZZLE_SEAM_BLEED_PX;
    const x = bounds.left + ((piece.x - (piece.w * padRatio)) * bounds.width) - bleed;
    const y = bounds.top + ((piece.y - (piece.h * padRatio)) * bounds.height) - bleed;
    const w = Math.max(2, (piece.w * (1 + (padRatio * 2)) * bounds.width) + (bleed * 2));
    const h = Math.max(2, (piece.h * (1 + (padRatio * 2)) * bounds.height) + (bleed * 2));
    const el = createPuzzlePieceSvg(typeId, "pond-piece pond-piece-svg", { hideOutline: true, transparentBase: true });
    if (!el) return null;

    el.style.position = "absolute";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.zIndex = String(piece.z || 2);
    ui.homeDecorLayer.appendChild(el);
    return el;
  }

  function getHabitatPuzzleArtBounds(sceneBounds) {
    const sceneWidth = Math.max(1, Number(sceneBounds && sceneBounds.width) || 0);
    const sceneHeight = Math.max(1, Number(sceneBounds && sceneBounds.height) || 0);
    const puzzleAspect = PUZZLE_COLS / PUZZLE_ROWS;
    const sceneAspect = sceneWidth / sceneHeight;

    if (document.body.classList.contains("discord-activity") && sceneAspect > puzzleAspect * 1.22) {
      const edge = clamp(sceneWidth * 0.04, 34, 86);
      const topReserve = clamp(sceneHeight * 0.12, 66, 112);
      const bottomReserve = clamp(sceneHeight * 0.18, 94, 150);
      const availableWidth = Math.max(1, sceneWidth - (edge * 2));
      const availableHeight = Math.max(1, sceneHeight - topReserve - bottomReserve);
      let width = Math.min(availableWidth, availableHeight * puzzleAspect);
      let height = width / puzzleAspect;

      if (height > availableHeight) {
        height = availableHeight;
        width = height * puzzleAspect;
      }

      return {
        left: (sceneWidth - width) / 2,
        top: topReserve + ((availableHeight - height) / 2),
        width,
        height
      };
    }

    let width = sceneWidth;
    let height = width / puzzleAspect;
    let left = 0;
    const top = 0;

    if (height > sceneHeight) {
      height = sceneHeight;
      width = height * puzzleAspect;
      left = (sceneWidth - width) / 2;
    }

    return { left, top, width, height };
  }

  function clearHomeDecor() {
    state.homeDecorElements.forEach((el) => el.remove());
    state.homeDecorElements = [];
  }

  function getHomeSceneMetrics() {
    const rect = ui.homeScene ? ui.homeScene.getBoundingClientRect() : null;
    const appEl = document.querySelector(".app");
    const visual = window.visualViewport;

    const widthCandidates = [
      rect && Number.isFinite(rect.width) ? rect.width : 0,
      ui.homeScene ? Number(ui.homeScene.clientWidth) : 0,
      ui.homeScene ? Number(ui.homeScene.offsetWidth) : 0,
      ui.startScreen ? Number(ui.startScreen.clientWidth) : 0,
      appEl ? Number(appEl.clientWidth) : 0,
      Number(visual && visual.width) || 0,
      Number(window.innerWidth) || 0,
      Number(document.documentElement.clientWidth) || 0
    ].filter((n) => Number.isFinite(n) && n > 0);

    const heightCandidates = [
      rect && Number.isFinite(rect.height) ? rect.height : 0,
      ui.homeScene ? Number(ui.homeScene.clientHeight) : 0,
      ui.homeScene ? Number(ui.homeScene.offsetHeight) : 0,
      ui.startScreen ? Number(ui.startScreen.clientHeight) : 0,
      appEl ? Number(appEl.clientHeight) : 0,
      Number(visual && visual.height) || 0,
      Number(window.innerHeight) || 0,
      Number(document.documentElement.clientHeight) || 0
    ].filter((n) => Number.isFinite(n) && n > 0);

    const width = Math.max(1, ...widthCandidates);
    const height = Math.max(1, ...heightCandidates);
    const left = rect && Number.isFinite(rect.left) ? rect.left : 0;
    const top = rect && Number.isFinite(rect.top) ? rect.top : 0;
    return { width, height, left, top };
  }

  function ensureHomeLayerLayout(bounds = null) {
    if (!ui.homeScene || !ui.homeItemsLayer || !ui.homeDecorLayer) return;
    const metrics = bounds || getHomeSceneMetrics();
    const width = Math.max(1, Math.round(metrics.width));
    const height = Math.max(1, Math.round(metrics.height));

    ui.homeScene.style.position = "absolute";
    ui.homeScene.style.left = "0px";
    ui.homeScene.style.top = "0px";
    ui.homeScene.style.width = `${width}px`;
    ui.homeScene.style.height = `${height}px`;

    [ui.homeDecorLayer, ui.homeItemsLayer].forEach((layer, index) => {
      layer.style.position = "absolute";
      layer.style.left = "0px";
      layer.style.top = "0px";
      layer.style.width = `${width}px`;
      layer.style.height = `${height}px`;
      layer.style.overflow = "hidden";
      layer.style.pointerEvents = "none";
      layer.style.zIndex = String(index + 1);
    });
  }

  function ensureHomeItemElementStyle(el) {
    if (!el) return;
    el.style.position = "absolute";
    el.style.pointerEvents = "none";
    el.style.userSelect = "none";
  }

  function scatterHomeItemsAcrossScene(force = false) {
    if (!state.homeItems.length) return;
    const bounds = getHomeSceneMetrics();
    ensureHomeLayerLayout(bounds);
    const maxX = Math.max(2, bounds.width - 64);
    const maxY = Math.max(2, bounds.height - 64);
    const widthSafe = Math.max(1, bounds.width);

    let stuckLeftCount = 0;
    const xs = [];
    let minX = Number.POSITIVE_INFINITY;
    let maxObservedX = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < state.homeItems.length; i += 1) {
      const item = state.homeItems[i];
      ensureHomeItemElementStyle(item.el);
      const rect = item.el.getBoundingClientRect();
      const displayX = Number.isFinite(rect.left) ? rect.left - bounds.left : item.x;

      if (!Number.isFinite(displayX) || displayX <= 8) {
        stuckLeftCount += 1;
      }
      if (Number.isFinite(displayX)) {
        xs.push(displayX);
        minX = Math.min(minX, displayX);
        maxObservedX = Math.max(maxObservedX, displayX);
      }
    }
    const mostlyStacked = stuckLeftCount >= Math.ceil(state.homeItems.length * 0.68);
    const spread = Number.isFinite(minX) && Number.isFinite(maxObservedX) ? (maxObservedX - minX) : 0;
    const narrowBandCluster = spread <= widthSafe * 0.22;
    const leftBandCluster = Number.isFinite(maxObservedX) ? maxObservedX <= widthSafe * 0.28 : false;
    const clustered = mostlyStacked || (narrowBandCluster && leftBandCluster);

    state.homeClusterStrikes = clustered ? Math.min(7, state.homeClusterStrikes + 1) : 0;
    if (!force && !clustered) return;

    for (let i = 0; i < state.homeItems.length; i += 1) {
      const item = state.homeItems[i];
      ensureHomeItemElementStyle(item.el);
      item.x = randBetween(0, Math.max(2, maxX - item.size * 0.5));
      item.y = randBetween(0, Math.max(2, maxY - item.size * 0.5));
      if (!Number.isFinite(item.vx) || Math.abs(item.vx) < 2) {
        item.vx = randBetween(-22, 22);
      }
      if (!Number.isFinite(item.vy) || Math.abs(item.vy) < 2) {
        item.vy = randBetween(-16, 16);
      }
      item.el.style.left = `${item.x}px`;
      item.el.style.top = `${item.y}px`;
    }
  }

  function renderHomeDecor() {
    if (!ui.homeDecorLayer || !ui.homeScene) return;
    clearHomeDecor();
    const bounds = getHomeSceneMetrics();
    ensureHomeLayerLayout(bounds);
    const habitatBounds = getHabitatPuzzleArtBounds(bounds);
    DECOR_ORDER.forEach((id) => {
      const count = getDecorCount(id);
      if (count <= 0) return;
      const decorEl = createHabitatPieceElement(id, habitatBounds);
      if (decorEl) {
        state.homeDecorElements.push(decorEl);
      }
    });
  }

  function buyDecor(typeId) {
    const item = DECOR_ITEMS[typeId];
    if (!item) return;
    markUserActivity();
    const coinPrice = getDecorCoinPrice(typeId);

    const currentCount = getDecorCount(typeId);
    const maxCount = getDecorMaxCount(typeId);
    if (currentCount >= maxCount) {
      showToast(state.language === "es"
        ? `Limite alcanzado para ${getDecorLabel(item)}.`
        : `${getDecorLabel(item)} limit reached.`);
      return;
    }

    if (!spendCoins(coinPrice)) {
      const missing = coinPrice - state.coinBalance;
      showToast(state.language === "es"
        ? `Necesitas ${missing} Sapito Coins para ${getDecorLabel(item)}.`
        : `Need ${missing} Sapito Coins for ${getDecorLabel(item)}.`);
      return;
    }

    state.decorCounts[typeId] = currentCount + 1;
    updateHabitatPanel();
    renderHomeDecor();
    saveSettings();
    showToast(state.language === "es"
      ? `${getDecorLabel(item)} comprado.`
      : `${getDecorLabel(item)} purchased.`);
  }

  function clearHomeItems() {
    state.homeItems.forEach((item) => item.el.remove());
    state.homeItems = [];
  }

  function randomHomeItemType() {
    const roll = Math.random();
    if (roll < 0.56) {
      return { className: "butterfly-food", emoji: "🦋", value: 1, size: 46 };
    }
    if (roll < 0.73) {
      return { className: "worm-food", emoji: "🪱", value: 2, size: 30 };
    }
    if (roll < 0.92 || state.neglectStage >= 2) {
      return { className: "flower-deco", emoji: "🌸", value: 0, size: 40 };
    }
    if (state.neglectStage === 1 && roll < 0.985) {
      return { className: "flower-deco", emoji: "🌸", value: 0, size: 40 };
    }
    return { className: "spark-deco", emoji: "✨", value: 0, size: 33 };
  }

  function addHomeItem(type, x, y, options = {}) {
    if (!ui.homeItemsLayer || !ui.homeScene || !type) return null;
    const bounds = getHomeSceneMetrics();
    ensureHomeLayerLayout(bounds);
    const size = Number.isFinite(type.size) ? type.size : 40;

    const itemX = clamp(
      Number.isFinite(x) ? x : randBetween(0, Math.max(2, bounds.width - size)),
      0,
      Math.max(0, bounds.width - size)
    );
    const itemY = clamp(
      Number.isFinite(y) ? y : randBetween(0, Math.max(2, bounds.height - size)),
      0,
      Math.max(0, bounds.height - size)
    );

    const el = document.createElement("div");
    el.className = `home-item ${type.className}`;
    el.textContent = type.emoji;
    ensureHomeItemElementStyle(el);
    el.style.left = `${itemX}px`;
    el.style.top = `${itemY}px`;
    ui.homeItemsLayer.appendChild(el);

    const item = {
      id: state.nextHomeItemId++,
      el,
      kind: type.className,
      x: itemX,
      y: itemY,
      size,
      value: Number.isFinite(type.value) ? type.value : 0,
      vx: Number.isFinite(options.vx) ? options.vx : randBetween(-22, 22),
      vy: Number.isFinite(options.vy) ? options.vy : randBetween(-16, 16),
      source: options.source || "ambient"
    };
    state.homeItems.push(item);
    applyHomeItemMood(item);
    return item;
  }

  function spawnHomeItem() {
    const type = randomHomeItemType();
    addHomeItem(type);
  }

  function fillHomeItems(minCount = 56) {
    while (state.homeItems.length < minCount) {
      spawnHomeItem();
    }
  }

  function updateHomeItems(dt) {
    if (!ui.homeScene) return;
    const bounds = getHomeSceneMetrics();
    ensureHomeLayerLayout(bounds);
    for (let i = 0; i < state.homeItems.length; i += 1) {
      const item = state.homeItems[i];
      ensureHomeItemElementStyle(item.el);
      item.x += item.vx * dt;
      item.y += item.vy * dt;

      if (item.x <= 0 || item.x >= bounds.width - item.size) {
        item.vx *= -1;
        item.x = clamp(item.x, 0, Math.max(0, bounds.width - item.size));
      }
      if (item.y <= 0 || item.y >= bounds.height - item.size) {
        item.vy *= -1;
        item.y = clamp(item.y, 0, Math.max(0, bounds.height - item.size));
      }

      item.el.style.left = `${item.x}px`;
      item.el.style.top = `${item.y}px`;
    }
  }

  function getNearestHomeFood(x, y) {
    let best = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < state.homeItems.length; i += 1) {
      const item = state.homeItems[i];
      if (item.value <= 0) continue;
      const dx = item.x + item.size / 2 - x;
      const dy = item.y + item.size / 2 - y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = item;
      }
    }
    return best;
  }

  function removeHomeItem(id) {
    const index = state.homeItems.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const [item] = state.homeItems.splice(index, 1);
    item.el.remove();
    return item;
  }

  function positionHomeSapitoAtCenter() {
    if (!ui.homeScene || !ui.homeSapito) return;
    const bounds = getHomeSceneMetrics();
    state.homeSapito.x = bounds.width * 0.5 - state.homeSapito.size / 2;
    state.homeSapito.y = bounds.height * 0.55 - state.homeSapito.size / 2;
    ui.homeSapito.style.left = `${state.homeSapito.x}px`;
    ui.homeSapito.style.top = `${state.homeSapito.y}px`;
    updateHomeSapitoSpeechPosition();
  }

  function updateHomeSapito(dt) {
    if (!ui.homeScene || !ui.homeSapito) return;
    const bounds = getHomeSceneMetrics();
    const sapito = state.homeSapito;
    const centerX = sapito.x + sapito.size / 2;
    const centerY = sapito.y + sapito.size / 2;
    const target = getNearestHomeFood(centerX, centerY);
    let dx = 0;
    let dy = 0;

    if (target) {
      dx = target.x + target.size / 2 - centerX;
      dy = target.y + target.size / 2 - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance > 0.01) {
        const step = Math.min(sapito.speed * dt, distance);
        sapito.x += (dx / distance) * step;
        sapito.y += (dy / distance) * step;
      }

      if (distance < sapito.size * 0.42 + target.size * 0.36) {
        const eaten = removeHomeItem(target.id);
        if (eaten && eaten.value > 0) {
          // In Home view, Sapito eats food directly (no bank accumulation).
          if (eaten.source === "manual-feed") {
            adjustSapitoHealth(Math.max(1, Number(eaten.value) || 1) * 2);
          } else {
            spawnHomeItem();
          }
        }
      }
    } else {
      sapito.wanderTimer -= dt;
      if (sapito.wanderTimer <= 0) {
        sapito.wanderTimer = randBetween(0.5, 1.3);
        sapito.wanderAngle = Math.random() * Math.PI * 2;
      }
      sapito.x += Math.cos(sapito.wanderAngle) * sapito.speed * 0.4 * dt;
      sapito.y += Math.sin(sapito.wanderAngle) * sapito.speed * 0.4 * dt;
    }

    sapito.x = clamp(sapito.x, 0, Math.max(0, bounds.width - sapito.size));
    sapito.y = clamp(sapito.y, 0, Math.max(0, bounds.height - sapito.size));
    if (Math.abs(dx) > 0.01) {
      ui.homeSapito.style.setProperty("--home-sapito-dir", dx < 0 ? "-1" : "1");
    }
    ui.homeSapito.style.left = `${sapito.x}px`;
    ui.homeSapito.style.top = `${sapito.y}px`;
    updateHomeSapitoSpeechPosition();
  }

  function jumpHomeSapito(fromClientX, fromClientY) {
    if (!ui.homeSapito || !ui.homeScene) return;
    const now = performance.now();
    if (now - lastHomeJumpAt < 110) return;
    lastHomeJumpAt = now;

    const bounds = getHomeSceneMetrics();
    const sapito = state.homeSapito;
    const sourceX = sapito.x;
    const sourceY = sapito.y;
    const sourceCenterX = sourceX + sapito.size / 2;
    const sourceCenterY = sourceY + sapito.size / 2;

    const hasPoint = Number.isFinite(fromClientX) && Number.isFinite(fromClientY);
    const tapX = hasPoint
      ? clamp(fromClientX - bounds.left, 0, bounds.width)
      : sourceCenterX + randBetween(-40, 40);
    const tapY = hasPoint
      ? clamp(fromClientY - bounds.top, 0, bounds.height)
      : sourceCenterY + randBetween(-40, 40);

    let awayX = sourceCenterX - tapX;
    let awayY = sourceCenterY - tapY;
    if (Math.abs(awayX) + Math.abs(awayY) < 0.01) {
      awayX = randBetween(-1, 1);
      awayY = randBetween(-1, 1);
    }
    const awayLen = Math.hypot(awayX, awayY) || 1;
    awayX /= awayLen;
    awayY /= awayLen;

    const travel = state.reduceMotion ? randBetween(100, 150) : randBetween(140, 230);
    let targetX = sourceX + awayX * travel;
    let targetY = sourceY + awayY * travel;
    targetX = clamp(targetX, 0, Math.max(0, bounds.width - sapito.size));
    targetY = clamp(targetY, 0, Math.max(0, bounds.height - sapito.size));

    if (Math.hypot(targetX - sourceX, targetY - sourceY) < 26) {
      targetX = clamp(randBetween(0, Math.max(0, bounds.width - sapito.size)), 0, Math.max(0, bounds.width - sapito.size));
      targetY = clamp(randBetween(0, Math.max(0, bounds.height - sapito.size)), 0, Math.max(0, bounds.height - sapito.size));
    }

    sapito.x = targetX;
    sapito.y = targetY;
    ui.homeSapito.style.left = `${sapito.x}px`;
    ui.homeSapito.style.top = `${sapito.y}px`;
    updateHomeSapitoSpeechPosition();
    const dir = targetX < sourceX ? -1 : 1;
    ui.homeSapito.style.setProperty("--home-sapito-dir", String(dir));

    if (homeJumpTimer) {
      clearTimeout(homeJumpTimer);
      homeJumpTimer = 0;
    }
    if (homeJumpAnimation) {
      homeJumpAnimation.cancel();
      homeJumpAnimation = null;
    }

    ui.homeSapito.classList.remove("tap-jump");
    // Restart the swim nudge on repeated taps.
    void ui.homeSapito.offsetWidth;
    ui.homeSapito.classList.add("tap-jump");

    const swimDuration = state.reduceMotion ? 220 : 430;
    const fromDx = sourceX - targetX;
    const fromDy = sourceY - targetY;
    if (typeof ui.homeSapito.animate === "function") {
      homeJumpAnimation = ui.homeSapito.animate(
        [
          { transform: `translate(${fromDx}px, ${fromDy}px) scaleX(${dir})` },
          { transform: `translate(${fromDx * 0.58}px, ${fromDy * 0.58}px) rotate(${dir * 2}deg) scaleX(${dir})`, offset: 0.46 },
          { transform: `translate(${fromDx * 0.16}px, ${fromDy * 0.16}px) rotate(${dir * -1}deg) scaleX(${dir})`, offset: 0.78 },
          { transform: `translate(0px, 0px) rotate(0deg) scaleX(${dir})` }
        ],
        {
          duration: swimDuration,
          easing: "cubic-bezier(0.22, 0.72, 0.2, 1)",
          fill: "none"
        }
      );
      homeJumpAnimation.onfinish = () => {
        homeJumpAnimation = null;
      };
      homeJumpAnimation.oncancel = () => {
        homeJumpAnimation = null;
      };
    }

    homeJumpTimer = window.setTimeout(() => {
      ui.homeSapito.classList.remove("tap-jump");
      homeJumpTimer = 0;
    }, swimDuration);
  }

  function getEventClientPoint(event) {
    if (!event) return null;
    if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
      return { x: event.clientX, y: event.clientY };
    }
    if (event.touches && event.touches[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (event.changedTouches && event.changedTouches[0]) {
      return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }
    return null;
  }

  function shouldIgnoreHomeTap(event) {
    if (!ui.startScreen || ui.startScreen.classList.contains("hidden")) {
      return true;
    }
    const target = event?.target;
    if (!(target instanceof Element)) return false;
    if (target.closest(".home-controls")) return true;
    if (target.closest("#settingsBox")) return true;
    if (target.closest("#shopBox")) return true;
    if (target.closest("#puzzleQuickPopup")) return true;
    if (target.closest("#habitatViewPopup")) return true;
    if (target.closest("#puzzleCatalogPopup")) return true;
    if (target.closest("#puzzlePiecePreviewPopup")) return true;
    if (target.closest("#rulesPopup")) return true;
    if (target.closest("#legalPopup")) return true;
    if (target.closest("#roadMapPopup")) return true;
    if (target.closest("#coinTopupPopup")) return true;
    if (target.closest("#foodMarketPopup")) return true;
    if (target.closest("#foodEmptyPopup")) return true;
    return false;
  }

  function startHomeScene() {
    if (state.homeRunning) return;
    state.homeRunning = true;
    state.homeLastFrameTime = 0;
    state.homeSpawnAccumulator = 0;
    state.homeScatterCheckAt = 0;
    state.homeClusterStrikes = 0;
    applyNeglectStage(true);
    ensureHomeLayerLayout();
    renderHomeDecor();
    fillHomeItems(56);
    scatterHomeItemsAcrossScene(true);
    positionHomeSapitoAtCenter();
    updateNeglectSpeech(performance.now());
    window.setTimeout(() => {
      if (!state.homeRunning) return;
      scatterHomeItemsAcrossScene(true);
    }, 180);
    window.setTimeout(() => {
      if (!state.homeRunning) return;
      scatterHomeItemsAcrossScene(true);
    }, 520);
    window.setTimeout(() => {
      if (!state.homeRunning) return;
      scatterHomeItemsAcrossScene(true);
    }, 1200);
    if (!homeAnimationId) {
      homeAnimationId = requestAnimationFrame(homeLoop);
    }
  }

  function stopHomeScene() {
    state.homeRunning = false;
    state.homeLastFrameTime = 0;
    state.homeScatterCheckAt = 0;
    state.homeClusterStrikes = 0;
    if (homeJumpTimer) {
      clearTimeout(homeJumpTimer);
      homeJumpTimer = 0;
    }
    if (homeJumpAnimation) {
      homeJumpAnimation.cancel();
      homeJumpAnimation = null;
    }
    if (ui.homeSapito) {
      ui.homeSapito.classList.remove("tap-jump");
    }
    if (ui.homeSapitoSpeech) {
      ui.homeSapitoSpeech.classList.add("hidden");
    }
    if (homeAnimationId) {
      cancelAnimationFrame(homeAnimationId);
      homeAnimationId = 0;
    }
  }

  function homeLoop(timestamp) {
    if (!state.homeRunning) {
      homeAnimationId = 0;
      return;
    }
    if (!state.homeLastFrameTime) {
      state.homeLastFrameTime = timestamp;
    }
    const dt = Math.min(0.05, (timestamp - state.homeLastFrameTime) / 1000);
    state.homeLastFrameTime = timestamp;

    state.homeSpawnAccumulator += dt * 1000;
    while (state.homeSpawnAccumulator >= 1100 && state.homeItems.length < 62) {
      spawnHomeItem();
      state.homeSpawnAccumulator -= 1100;
    }

    updateHomeItems(dt);
    if (!state.homeScatterCheckAt || timestamp >= state.homeScatterCheckAt) {
      scatterHomeItemsAcrossScene();
      state.homeScatterCheckAt = timestamp + 2100;
    }
    updateHomeSapito(dt);
    updateNeglectSpeech(timestamp);
    homeAnimationId = requestAnimationFrame(homeLoop);
  }

  function toCoinCost(baseValue, min = 1) {
    if (!Number.isFinite(baseValue) || baseValue <= 0) return min;
    return Math.max(min, Math.ceil(baseValue / 30));
  }

  function getThemeCoinPrice(id) {
    return toCoinCost(getSkinPrice(id), 2);
  }

  function getDecorCoinPrice(typeId) {
    const item = getDecorItem(typeId);
    if (!item) return 0;
    if (Number.isFinite(item.coinCost) && item.coinCost > 0) {
      return Math.max(1, Math.floor(item.coinCost));
    }
    if (Number.isFinite(item.cost) && item.cost > 0) {
      return Math.max(1, Math.floor(item.cost));
    }
    return 0;
  }

  function getColorCoinPrice(colorSkin) {
    if (!colorSkin || colorSkin.id === "green") return 0;
    return 5;
  }

  function getTattooCoinPrice(tattoo) {
    if (!tattoo || tattoo.id === "none") return 0;
    return 5;
  }

  function getCoinPackById(packId) {
    return COIN_PACKS.find((pack) => pack.id === packId) || null;
  }

  function getCoinPackCredit(pack) {
    if (!pack) return 0;
    const base = Math.max(0, Math.floor(Number(pack.coins) || 0));
    const bonus = Math.max(0, Math.floor(Number(pack.bonus) || 0));
    return base + bonus;
  }

  function getDiscordSkuIdForPack(pack) {
    if (!pack || !COIN_PAYMENT || !COIN_PAYMENT.discordSkuIds) return "";
    return String(COIN_PAYMENT.discordSkuIds[pack.id] || "").trim();
  }

  async function loadCoinPaymentConfig() {
    try {
      const response = await fetch("/api/discord/config", { cache: "no-store" });
      if (!response.ok) return false;
      const data = await response.json();
      if (!data || data.ok === false) return false;
      if (typeof data.discordClientId === "string") {
        COIN_PAYMENT.discordClientId = data.discordClientId.trim();
      }
      if (typeof data.discordStoreAppId === "string") {
        COIN_PAYMENT.discordStoreAppId = data.discordStoreAppId.trim();
      }
      if (data.discordSkuIds && typeof data.discordSkuIds === "object") {
        Object.keys(COIN_PAYMENT.discordSkuIds).forEach((packId) => {
          const skuId = data.discordSkuIds[packId];
          if (typeof skuId === "string") {
            COIN_PAYMENT.discordSkuIds[packId] = skuId.trim();
          }
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function isDiscordActivityContext() {
    const hasDiscordQuery = (
      URL_QUERY.has("frame_id") ||
      URL_QUERY.has("instance_id") ||
      URL_QUERY.has("guild_id") ||
      URL_QUERY.has("channel_id")
    );
    try {
      return hasDiscordQuery || window.parent !== window;
    } catch (error) {
      return hasDiscordQuery;
    }
  }

  async function loadDiscordSdk() {
    if (state.discordSdk) return state.discordSdk;
    if (!COIN_PAYMENT.discordClientId || !COIN_PAYMENT.discordSdkModuleUrl) return null;
    if (!isDiscordActivityContext()) return null;
    if (discordSdkPromise) return discordSdkPromise;

    discordSdkPromise = (async () => {
      const sdkModule = await import(COIN_PAYMENT.discordSdkModuleUrl);
      const DiscordSDK = sdkModule.DiscordSDK || (sdkModule.default && sdkModule.default.DiscordSDK);
      if (typeof DiscordSDK !== "function") {
        throw new Error("Discord SDK module did not load.");
      }
      const sdk = new DiscordSDK(COIN_PAYMENT.discordClientId);
      if (typeof sdk.ready === "function") {
        await sdk.ready();
      }
      state.discordSdk = sdk;
      state.discordReady = true;
      return sdk;
    })().catch((error) => {
      discordSdkPromise = null;
      throw error;
    });

    return discordSdkPromise;
  }

  function normalizeDiscordEntitlements(value) {
    const candidates = [
      value && value.entitlements,
      value && value.data && value.data.entitlements,
      value
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate;
    }
    return [];
  }

  function findDiscordEntitlementForSku(entitlements, skuId) {
    const safeSkuId = String(skuId || "").trim();
    return normalizeDiscordEntitlements(entitlements).find((entitlement) => {
      if (!entitlement || String(entitlement.sku_id || "") !== safeSkuId) return false;
      return Boolean(String(entitlement.id || "").trim());
    }) || null;
  }

  async function readDiscordEntitlementAfterPurchase(sdk, skuId, purchaseResult) {
    const fromPurchase = findDiscordEntitlementForSku(purchaseResult, skuId);
    if (fromPurchase) return fromPurchase;
    if (sdk && sdk.commands && typeof sdk.commands.getEntitlements === "function") {
      const entitlementResult = await sdk.commands.getEntitlements();
      return findDiscordEntitlementForSku(entitlementResult, skuId);
    }
    return null;
  }

  async function postJson(path, payload) {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload || {})
    });
    const text = await response.text();
    let data = {};
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { error: text };
      }
    }
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || data.message || `Request failed with ${response.status}`);
    }
    return data;
  }

  function ensureCoinDropLayer() {
    let layer = document.getElementById("coinDropLayer");
    if (layer) return layer;
    const root = document.querySelector(".app") || document.body;
    layer = document.createElement("div");
    layer.id = "coinDropLayer";
    layer.className = "coin-drop-layer";
    layer.setAttribute("aria-hidden", "true");
    root.appendChild(layer);
    return layer;
  }

  function triggerCoinDrop(amount = 1, source = "reward") {
    const safeAmount = Math.max(1, Math.floor(Number(amount) || 1));
    const layer = ensureCoinDropLayer();
    if (!layer) return;

    const count = state.reduceMotion
      ? Math.min(10, Math.max(5, safeAmount))
      : Math.min(44, Math.max(14, safeAmount * 2));
    const burstClass = source === "purchase" ? " coin-drop-purchase" : " coin-drop-reward";

    for (let i = 0; i < count; i += 1) {
      const coin = document.createElement("span");
      coin.className = `coin-drop-coin${burstClass}`;
      coin.innerHTML = '<span class="coin-drop-face"></span>';
      coin.style.setProperty("--coin-x", `${Math.random() * 100}vw`);
      coin.style.setProperty("--coin-delay", `${Math.random() * 0.52}s`);
      coin.style.setProperty("--coin-fall", `${1.35 + Math.random() * 0.85}s`);
      coin.style.setProperty("--coin-spin", `${Math.random() > 0.5 ? 1 : -1}`);
      coin.style.setProperty("--coin-size", `${28 + Math.random() * 18}px`);
      coin.style.setProperty("--coin-drift", `${(Math.random() - 0.5) * 86}px`);
      layer.appendChild(coin);
      window.setTimeout(() => coin.remove(), 2900);
    }

    layer.classList.add("coin-drop-active");
    window.clearTimeout(layer._coinDropTimer);
    layer._coinDropTimer = window.setTimeout(() => {
      layer.classList.remove("coin-drop-active");
    }, 3000);
  }

  function syncCoinBalanceFromServer(balance, userId = "") {
    const safeBalance = Math.max(0, Math.floor(Number(balance) || 0));
    const previousBalance = Math.max(0, Math.floor(Number(state.coinBalance) || 0));
    state.coinBalance = safeBalance;
    if (userId) {
      state.discordUserId = String(userId);
    }
    updateCoinBankUi();
    updateHabitatPanel();
    saveSettings();
    if (safeBalance > previousBalance) {
      triggerCoinDrop(safeBalance - previousBalance, "purchase");
    }
  }

  async function claimDiscordCoinEntitlement(pack, entitlement) {
    const data = await postJson("/api/coins/discord-claim", {
      packId: pack.id,
      entitlementId: entitlement.id
    });
    syncCoinBalanceFromServer(data.coinBalance, data.userId);
    const amount = Math.max(0, Math.floor(Number(data.amount) || getCoinPackCredit(pack)));
    showToast(
      data.duplicate
        ? (state.language === "es"
          ? "Compra ya registrada. El saldo ya esta actualizado."
          : "Purchase already registered. Balance is already updated.")
        : (state.language === "es"
          ? `Compra confirmada: +${amount} Sapito Coins.`
          : `Purchase confirmed: +${amount} Sapito Coins.`)
    );
    return true;
  }

  async function startDiscordCoinPurchase(pack) {
    const skuId = getDiscordSkuIdForPack(pack);
    if (!skuId) return false;

    let sdk = null;
    try {
      sdk = await loadDiscordSdk();
    } catch (error) {
      showToast(state.language === "es"
        ? "No se pudo conectar con Discord para compras."
        : "Could not connect to Discord for purchases.");
      return false;
    }

    if (!sdk || !sdk.commands || typeof sdk.commands.startPurchase !== "function") {
      return false;
    }

    try {
      showToast(state.language === "es" ? "Abriendo compra de Discord..." : "Opening Discord purchase...");
      const purchaseResult = await sdk.commands.startPurchase({ sku_id: skuId });
      const entitlement = await readDiscordEntitlementAfterPurchase(sdk, skuId, purchaseResult);
      if (!entitlement) {
        showToast(state.language === "es"
          ? "Compra cerrada o pendiente. Si te cobraron, reportalo para revisar."
          : "Purchase closed or pending. If you were charged, report it for review.");
        return true;
      }
      await claimDiscordCoinEntitlement(pack, entitlement);
      return true;
    } catch (error) {
      showToast(state.language === "es"
        ? "Compra no completada o no verificada."
        : "Purchase was not completed or verified.");
      return false;
    }
  }

  function getCoinCheckoutUrlTemplate(packId) {
    if (!COIN_PAYMENT || !COIN_PAYMENT.checkoutUrls) return "";
    const template = COIN_PAYMENT.checkoutUrls[packId];
    return typeof template === "string" ? template.trim() : "";
  }

  function getDiscordStoreUrl(pack = null) {
    const appId = String(COIN_PAYMENT.discordStoreAppId || COIN_PAYMENT.discordClientId || "").trim();
    if (!/^\d{12,30}$/.test(appId)) return "";
    const skuId = pack ? getDiscordSkuIdForPack(pack) : "";
    const base = `https://discord.com/application-directory/${encodeURIComponent(appId)}/store`;
    return /^\d{12,30}$/.test(skuId) ? `${base}/${encodeURIComponent(skuId)}` : base;
  }

  async function openDiscordStore(pack = null) {
    const url = getDiscordStoreUrl(pack);
    if (!url) {
      showToast(state.language === "es"
        ? "No encontre el link de la tienda de Discord."
        : "Discord Store link was not found.");
      return false;
    }

    try {
      const sdk = await loadDiscordSdk();
      if (sdk && sdk.commands && typeof sdk.commands.openExternalLink === "function") {
        await sdk.commands.openExternalLink({ url });
        return true;
      }
    } catch (error) {
      // Fall back to browser navigation below when the SDK is unavailable.
    }

    try {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (opened) return true;
    } catch (error) {
      // Fall back to same-window navigation below.
    }

    window.location.assign(url);
    return true;
  }

  function hasCoinCheckoutConfigured() {
    return COIN_PACKS.some((pack) => Boolean(getCoinCheckoutUrlTemplate(pack.id)));
  }

  function createCoinTxId(prefix, packId) {
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    return `${prefix}-${packId}-${Date.now()}-${random}`;
  }

  function readCoinPaymentTxHistory() {
    try {
      const raw = localStorage.getItem(STORAGE.coinPaymentTxHistory);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((id) => String(id || "").trim())
        .filter((id) => id.length > 0)
        .slice(-200);
    } catch (error) {
      return [];
    }
  }

  function hasCoinPaymentTx(txId) {
    const safeId = String(txId || "").trim();
    if (!safeId) return false;
    return readCoinPaymentTxHistory().includes(safeId);
  }

  function rememberCoinPaymentTx(txId) {
    const safeId = String(txId || "").trim();
    if (!safeId) return;
    const seen = readCoinPaymentTxHistory();
    if (seen.includes(safeId)) return;
    seen.push(safeId);
    try {
      localStorage.setItem(STORAGE.coinPaymentTxHistory, JSON.stringify(seen.slice(-200)));
    } catch (error) {
      // Ignore localStorage errors.
    }
  }

  function readCoinCreditHistory() {
    try {
      const raw = localStorage.getItem(STORAGE.coinCreditHistory);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(-300) : [];
    } catch (error) {
      return [];
    }
  }

  function recordCoinCredit({ source, amount, balanceAfter, reason = "", txId = "" }) {
    const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0) return;
    const entry = {
      at: new Date().toISOString(),
      source: String(source || "unknown"),
      amount: safeAmount,
      balanceAfter: Math.max(0, Math.floor(Number(balanceAfter) || 0))
    };
    const safeTxId = String(txId || "").trim();
    const safeReason = String(reason || "").trim();
    if (safeTxId) entry.txId = safeTxId;
    if (safeReason) entry.reason = safeReason;

    try {
      const history = readCoinCreditHistory();
      history.push(entry);
      localStorage.setItem(STORAGE.coinCreditHistory, JSON.stringify(history.slice(-300)));
    } catch (error) {
      // Credit is already applied; history is best-effort only.
    }
  }

  function buildCoinPaymentReturnUrl(packId, txId, status = "success") {
    const url = new URL(window.location.href);
    url.searchParams.delete(COIN_PAYMENT.successParam);
    url.searchParams.delete(COIN_PAYMENT.txParam);
    url.searchParams.delete(COIN_PAYMENT.statusParam);
    if (status === "success") {
      url.searchParams.set(COIN_PAYMENT.successParam, packId);
    }
    url.searchParams.set(COIN_PAYMENT.txParam, txId);
    url.searchParams.set(COIN_PAYMENT.statusParam, status);
    return url.toString();
  }

  function clearCoinPaymentQueryParams() {
    if (!window.history || typeof window.history.replaceState !== "function") return;
    const url = new URL(window.location.href);
    url.searchParams.delete(COIN_PAYMENT.successParam);
    url.searchParams.delete(COIN_PAYMENT.txParam);
    url.searchParams.delete(COIN_PAYMENT.statusParam);
    const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", cleanUrl);
  }

  function getCoinCheckoutUrl(pack) {
    const template = getCoinCheckoutUrlTemplate(pack?.id);
    if (!template || !pack) return "";
    const txId = createCoinTxId("checkout", pack.id);
    const successUrl = buildCoinPaymentReturnUrl(pack.id, txId, "success");
    const cancelUrl = buildCoinPaymentReturnUrl(pack.id, txId, "cancel");
    return template
      .replaceAll("{PACK_ID}", encodeURIComponent(pack.id))
      .replaceAll("{TX_ID}", encodeURIComponent(txId))
      .replaceAll("{RETURN_URL_RAW}", successUrl)
      .replaceAll("{RETURN_URL}", encodeURIComponent(successUrl))
      .replaceAll("{CANCEL_URL_RAW}", cancelUrl)
      .replaceAll("{CANCEL_URL}", encodeURIComponent(cancelUrl));
  }

  function completeCoinPackPurchase(pack, txId, source = "demo") {
    if (!pack) return false;
    const safeTxId = String(txId || "").trim();
    if (safeTxId && hasCoinPaymentTx(safeTxId)) {
      showToast(
        state.language === "es"
          ? "Pago ya registrado. El saldo ya fue actualizado."
          : "Payment already registered. Balance is already updated."
      );
      return false;
    }

    const credit = getCoinPackCredit(pack);
    if (credit <= 0) return false;

    if (safeTxId) {
      rememberCoinPaymentTx(safeTxId);
    }

    const reason = state.language === "es"
      ? (source === "checkout"
        ? `Pago confirmado: +${credit} Sapito Coins.`
        : `Recarga demo: +${credit} Sapito Coins.`)
      : (source === "checkout"
        ? `Payment confirmed: +${credit} Sapito Coins.`
        : `Demo top-up: +${credit} Sapito Coins.`);
    creditCoins(credit, {
      reason,
      source: source === "checkout" ? "purchase" : "demo-purchase",
      txId: safeTxId
    });
    return true;
  }

  function processCoinPaymentReturn() {
    const hasPaymentParams =
      URL_QUERY.has(COIN_PAYMENT.successParam) ||
      URL_QUERY.has(COIN_PAYMENT.txParam) ||
      URL_QUERY.has(COIN_PAYMENT.statusParam);
    if (!hasPaymentParams) return false;

    const status = String(URL_QUERY.get(COIN_PAYMENT.statusParam) || "success").toLowerCase();
    const packId = String(URL_QUERY.get(COIN_PAYMENT.successParam) || "").trim();
    const txId = String(URL_QUERY.get(COIN_PAYMENT.txParam) || "").trim() || createCoinTxId("return", packId || "unknown");

    if (status === "cancel" || status === "canceled" || status === "cancelled") {
      showToast(state.language === "es" ? "Pago cancelado." : "Payment canceled.");
      clearCoinPaymentQueryParams();
      return true;
    }

    const pack = getCoinPackById(packId);
    if (!pack) {
      showToast(state.language === "es" ? "Pago recibido con pack invalido." : "Payment return received with invalid pack.");
      clearCoinPaymentQueryParams();
      return false;
    }

    if (!COIN_PAYMENT.allowClientReturnCredit) {
      showToast(
        state.language === "es"
          ? "Pago detectado. En publico, las coins se depositan solo con verificacion del servidor."
          : "Payment return detected. In public, coins deposit only after server verification."
      );
      clearCoinPaymentQueryParams();
      return true;
    }

    completeCoinPackPurchase(pack, txId, "checkout");
    clearCoinPaymentQueryParams();
    return true;
  }

  function updateCoinBankUi() {
    const coinCount = Math.max(0, Math.floor(state.coinBalance));
    const butterflyFoodCount = Math.max(0, Math.floor(state.foodBalance));
    const wormFoodCount = getWormCount();
    const flyFoodCount = getFlyCount();
    const foodCount = butterflyFoodCount + wormFoodCount + flyFoodCount;
    const coinText = coinCount.toLocaleString();
    const foodText = foodCount.toLocaleString();

    if (ui.homeCoinLabel) {
      ui.homeCoinLabel.textContent = "coins";
    }
    if (ui.homeCoinValue) {
      ui.homeCoinValue.innerHTML = `${coinText} ${coinIconHtml()}`;
    }
    if (ui.homeFoodLabel) {
      ui.homeFoodLabel.textContent = "food";
    }
    if (ui.homeFoodValue) {
      ui.homeFoodValue.textContent = foodText;
    }
    if (ui.homeFoodBtfLine) {
      ui.homeFoodBtfLine.textContent = `Btf: ${butterflyFoodCount.toLocaleString()}`;
    }
    if (ui.homeFoodWrmLine) {
      ui.homeFoodWrmLine.textContent = `Wrm: ${wormFoodCount.toLocaleString()}`;
    }
    if (ui.homeFoodFlyLine) {
      ui.homeFoodFlyLine.textContent = `Fly: ${flyFoodCount.toLocaleString()}`;
    }
    if (ui.homeFoodBtn) {
      const label = state.language === "es"
        ? `Comida total ${foodText}. Mariposas ${butterflyFoodCount}, gusanitos ${wormFoodCount}, moscas ${flyFoodCount}.`
        : `Total food ${foodText}. Butterflies ${butterflyFoodCount}, worms ${wormFoodCount}, flies ${flyFoodCount}.`;
      ui.homeFoodBtn.setAttribute("aria-label", label);
    }

    if (ui.coinBankTitle) {
      ui.coinBankTitle.textContent = state.language === "es" ? "Banco de Sapito Coins" : "Sapito Coins Bank";
    }
    if (ui.coinTopupTitle) {
      ui.coinTopupTitle.textContent = state.language === "es" ? "Banco de Sapito Coins" : "Sapito Coins Bank";
    }
    if (ui.coinBankHint) {
      ui.coinBankHint.textContent = state.language === "es"
        ? "Compra comida, skins y tattoos con coins. En Discord, el servidor verifica cada compra antes de depositar coins."
        : "Buy food, skins and tattoos with coins. In Discord, the server verifies every purchase before depositing coins.";
    }
    if (ui.coinTopupHint) {
      ui.coinTopupHint.textContent = state.language === "es"
        ? "Recarga Sapito Coins con compra nativa de Discord. El servidor deposita coins solo despues de verificar."
        : "Top up Sapito Coins with native Discord purchase. The server deposits coins only after verification.";
    }
    if (ui.coinTopupLegalNote) {
      ui.coinTopupLegalNote.setAttribute(
        "aria-label",
        state.language === "es"
          ? "Las compras son finales excepto donde la ley o politica de plataforma requiera otra cosa."
          : "Purchases are final except where required by law or platform policy."
      );
    }
    if (ui.coinTopupLegalText) {
      ui.coinTopupLegalText.textContent = state.language === "es"
        ? "Las compras son finales excepto donde la ley o politica de plataforma requiera otra cosa."
        : "Purchases are final except where required by law or platform policy.";
    }
    if (ui.coinTopupLegalBtn) {
      ui.coinTopupLegalBtn.textContent = state.language === "es" ? "Aviso legal" : "Legal notice";
    }
    if (ui.coinBalanceLine) {
      ui.coinBalanceLine.innerHTML = state.language === "es"
        ? `Saldo: ${coinText} Sapito Coins ${coinIconHtml()}`
        : `Balance: ${coinText} Sapito Coins ${coinIconHtml()}`;
    }
    if (ui.coinTopupBalanceLine) {
      ui.coinTopupBalanceLine.innerHTML = state.language === "es"
        ? `Saldo: ${coinText} Sapito Coins ${coinIconHtml()}`
        : `Balance: ${coinText} Sapito Coins ${coinIconHtml()}`;
    }

    if (ui.buyCoinPack1Btn) {
      ui.buyCoinPack1Btn.textContent = state.language === "es"
        ? "Comprar 3 Coins ($0.99)"
        : "Buy 3 Coins ($0.99)";
    }
    if (ui.coinTopupPack1Btn) {
      ui.coinTopupPack1Btn.textContent = state.language === "es"
        ? "Comprar 3 Coins ($0.99)"
        : "Buy 3 Coins ($0.99)";
    }
    if (ui.buyCoinPack2Btn) {
      ui.buyCoinPack2Btn.textContent = state.language === "es"
        ? "Comprar 7 Coins ($1.99) +1 regalo"
        : "Buy 7 Coins ($1.99) +1 bonus";
    }
    if (ui.coinTopupPack2Btn) {
      ui.coinTopupPack2Btn.textContent = state.language === "es"
        ? "Comprar 7 Coins ($1.99) +1 regalo"
        : "Buy 7 Coins ($1.99) +1 bonus";
    }
    if (ui.buyCoinPack5Btn) {
      ui.buyCoinPack5Btn.textContent = state.language === "es"
        ? "Comprar 20 Coins ($4.99)"
        : "Buy 20 Coins ($4.99)";
    }
    if (ui.coinTopupPack5Btn) {
      ui.coinTopupPack5Btn.textContent = state.language === "es"
        ? "Comprar 20 Coins ($4.99)"
        : "Buy 20 Coins ($4.99)";
    }
    if (ui.coinTopupStoreLink) {
      const storeUrl = getDiscordStoreUrl();
      ui.coinTopupStoreLink.textContent = state.language === "es" ? "Abrir tienda de Discord" : "Open Discord Store";
      ui.coinTopupStoreLink.setAttribute(
        "aria-label",
        state.language === "es" ? "Abrir Sapito Store en Discord" : "Open Sapito Store in Discord"
      );
      ui.coinTopupStoreLink.classList.toggle("hidden", !storeUrl);
      if (storeUrl) {
        ui.coinTopupStoreLink.href = storeUrl;
      }
    }

    if (ui.buyFoodBtn) {
      ui.buyFoodBtn.innerHTML = state.language === "es"
        ? `Comprar +${FOOD_PER_DOLLAR} comida (${formatCoinWithIcon(FOOD_PACK_COIN_COST)})`
        : `Buy +${FOOD_PER_DOLLAR} Food (${formatCoinWithIcon(FOOD_PACK_COIN_COST)})`;
    }
    if (ui.catalogBuyFoodBtn) {
      ui.catalogBuyFoodBtn.innerHTML = state.language === "es"
        ? `Comprar +${FOOD_PER_DOLLAR} comida (${formatCoinWithIcon(FOOD_PACK_COIN_COST)})`
        : `Buy +${FOOD_PER_DOLLAR} Food (${formatCoinWithIcon(FOOD_PACK_COIN_COST)})`;
    }

    updateFoodMarketPopupText();
  }

  function creditCoins(amount, options = {}) {
    const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0) return false;
    const reason = String(options.reason || "");
    const source = String(options.source || "game");
    const txId = String(options.txId || "");
    const shouldToast = options.toast !== false;

    state.coinBalance = Math.max(0, Math.floor(state.coinBalance + safeAmount));
    triggerCoinDrop(safeAmount, source === "purchase" || source === "checkout" || source === "demo" ? "purchase" : "reward");
    recordCoinCredit({
      source,
      amount: safeAmount,
      balanceAfter: state.coinBalance,
      reason,
      txId
    });
    updateCoinBankUi();
    updateHabitatPanel();
    saveSettings();
    if (shouldToast && reason) {
      showToast(reason);
    }
    return true;
  }

  function checkGrandPrizeProgress() {
    if (state.grandPrizeAwarded) return false;
    if (state.totalButterfliesCaught < GRAND_PRIZE_BUTTERFLY_GOAL) return false;

    state.grandPrizeAwarded = true;
    creditCoins(GRAND_PRIZE_COIN_REWARD, {
      source: "win",
      reason: state.language === "es"
        ? `Gran premio: ${GRAND_PRIZE_COIN_REWARD} Sapito Coins por ${GRAND_PRIZE_BUTTERFLY_GOAL.toLocaleString()} mariposas acumuladas.`
        : `Grand prize: ${GRAND_PRIZE_COIN_REWARD} Sapito Coins for ${GRAND_PRIZE_BUTTERFLY_GOAL.toLocaleString()} total butterflies.`,
      txId: `grand-prize-${GRAND_PRIZE_BUTTERFLY_GOAL}`,
      toast: false
    });
    showToast(state.language === "es"
      ? `Gran premio desbloqueado: +${GRAND_PRIZE_COIN_REWARD} Sapito Coins.`
      : `Grand prize unlocked: +${GRAND_PRIZE_COIN_REWARD} Sapito Coins.`);
    saveSettings();
    renderRulesTable();
    return true;
  }

  function addCoins(amount, reason = "") {
    return creditCoins(amount, { reason, source: "game" });
  }

  function spendCoins(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    const safeAmount = Math.floor(amount);
    if (state.coinBalance < safeAmount) return false;
    state.coinBalance -= safeAmount;
    updateCoinBankUi();
    updateHabitatPanel();
    saveSettings();
    return true;
  }

  async function buyCoinPack(packId) {
    const pack = getCoinPackById(packId);
    if (!pack) return;
    markUserActivity();

    const discordPurchaseHandled = await startDiscordCoinPurchase(pack);
    if (discordPurchaseHandled) return;

    const checkoutUrl = getCoinCheckoutUrl(pack);
    if (checkoutUrl) {
      window.location.assign(checkoutUrl);
      return;
    }

    const discordStoreUrl = getDiscordStoreUrl(pack);
    if (discordStoreUrl) {
      showToast(state.language === "es" ? "Abriendo Sapito Store..." : "Opening Sapito Store...");
      await openDiscordStore(pack);
      return;
    }

    if (COIN_PAYMENT.demoMode) {
      const txId = createCoinTxId("demo", pack.id);
      completeCoinPackPurchase(pack, txId, "demo");
      return;
    }

    showToast(
      state.language === "es"
        ? "Compra de Discord no configurada: falta conectar el link de tienda o los SKU IDs."
        : "Discord purchase is not configured yet: store link or SKU IDs are missing."
    );
  }

  function getSkinPrice(id) {
    return SKIN_PRICES[id] || 0;
  }

  function getNextLockedSkin() {
    return SKINS.find((skin) => !state.unlockedSkins.has(skin.id) && getSkinPrice(skin.id) > 0) || null;
  }

  function updateSkinShopInfo() {
    if (!ui.skinShopInfo || !ui.buySkinBtn) return;
    const nextSkin = getNextLockedSkin();
    if (!nextSkin) {
      ui.skinShopInfo.textContent = state.language === "es"
        ? `Todas las skins de fondo desbloqueadas. Color de Sapito activo: ${getSapitoColorOption(state.sapitoColorId).nameEs}.`
        : `All background skins unlocked. Active Sapito color: ${getSapitoColorOption(state.sapitoColorId).nameEn}.`;
      ui.buySkinBtn.classList.add("hidden");
      ui.buySkinBtn.textContent = "";
      ui.buySkinBtn.disabled = true;
      if (ui.catalogThemeInfo) {
        ui.catalogThemeInfo.textContent = state.language === "es"
          ? `Todas las skins tematicas desbloqueadas. Color activo: ${getSapitoColorOption(state.sapitoColorId).nameEs}.`
          : `All theme skins unlocked. Active color: ${getSapitoColorOption(state.sapitoColorId).nameEn}.`;
      }
      if (ui.catalogBuyThemeBtn) {
        ui.catalogBuyThemeBtn.textContent = state.language === "es" ? "Todas las skins compradas" : "All Theme Skins Owned";
        ui.catalogBuyThemeBtn.disabled = true;
      }
      return;
    }
    const price = getThemeCoinPrice(nextSkin.id);
    ui.skinShopInfo.textContent = `Next skin: ${nextSkin.name} costs ${price} Sapito Coins.`;
    ui.buySkinBtn.classList.remove("hidden");
    ui.buySkinBtn.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} ${nextSkin.name} (${formatCoinWithIcon(price)})`;
    ui.buySkinBtn.disabled = false;
    if (ui.catalogThemeInfo) {
      ui.catalogThemeInfo.textContent = state.language === "es"
        ? `Siguiente skin: ${nextSkin.name} cuesta ${price} Sapito Coins.`
        : `Next theme: ${nextSkin.name} costs ${price} Sapito Coins.`;
    }
    if (ui.catalogBuyThemeBtn) {
      ui.catalogBuyThemeBtn.innerHTML = `${state.language === "es" ? "Comprar" : "Buy"} ${nextSkin.name} (${formatCoinWithIcon(price)})`;
      ui.catalogBuyThemeBtn.disabled = false;
    }
  }

  function updateHabitatPanel() {
    if (!ui.frogStatusLine || !ui.foodStatusLine) return;
    const frogCount = getFrogCountForLevel(state.level);
    const dailyNeed = getDailyFeedNeed();
    const daysLeft = getFoodCoverageDays();
    const healthPercent = getSapitoHealthPercent();
    const healthBand = getSapitoHealthBand(healthPercent);
    const daysShort = daysLeft >= 10 ? Math.floor(daysLeft) : Number(daysLeft.toFixed(1));
    const healthShort = Math.round(healthPercent);
    const frogLabel = state.language === "es"
      ? (frogCount === 1 ? "sapito" : "sapitos")
      : (frogCount === 1 ? "froggy" : "froggies");
    const personality = getPersonalityStageForLevel(state.level);
    const pathLevel = getDisplayLevel();
    const pathSection = getDisplaySection();
    const completedGames = Math.max(0, state.level - 1);
    const gamesIntoStage = completedGames % LEVELS_PER_STAGE;
    const gamesToNextStage = personality.isLegend ? 0 : LEVELS_PER_STAGE - gamesIntoStage;
    const pathProgress = state.language === "es"
      ? `Ruta ${pathLevel}/${PATH_LEVEL_COUNT} • Seccion ${pathSection}/${LEVELS_PER_STAGE}`
      : `Path ${pathLevel}/${PATH_LEVEL_COUNT} • Section ${pathSection}/${LEVELS_PER_STAGE}`;
    const progressText = state.language === "es"
      ? (personality.isLegend
        ? "Personalidad leyenda activa."
        : `${gamesToNextStage} victorias para la siguiente personalidad.`)
      : (personality.isLegend
        ? "Legend personality active."
        : `${gamesToNextStage} wins to next personality stage.`);

    if (state.language === "es") {
      ui.frogStatusLine.textContent =
        `${pathProgress} • ${personality.label} • ${frogCount} ${frogLabel} activos. ${progressText}`;
      ui.foodStatusLine.textContent =
        `Banco de comida: ${state.foodBalance} mariposas. Consumo diario: ${dailyNeed}.`;
    } else {
      ui.frogStatusLine.textContent =
        `${pathProgress} • ${personality.label} • ${frogCount} ${frogLabel} active. ${progressText}`;
      ui.foodStatusLine.textContent =
        `Food bank: ${state.foodBalance} butterflies. Daily feed: ${dailyNeed}.`;
    }

    updateCoinBankUi();

    if (ui.rewardStatusLine) {
      const rules = getRulesGameForLevel(state.level);
      const levelPrizeText = formatPrizeBundle(rules.game.prize);
      const stagePrizeText = formatPrizeBundle(rules.stage.passPrize);
      if (state.language === "es") {
        ui.rewardStatusLine.textContent =
          `Premio ruta ${getDisplayLevel()}/${PATH_LEVEL_COUNT} seccion ${rules.game.game}/${LEVELS_PER_STAGE}: ${levelPrizeText}. ` +
          (rules.stageEndsOnWin
            ? `Tambien desbloqueas bono de etapa: ${stagePrizeText}.`
            : `Bono al completar ${LEVELS_PER_STAGE} juegos de etapa: ${stagePrizeText}.`) +
          ` La tienda usa Sapito Coins.`;
      } else {
        ui.rewardStatusLine.textContent =
          `Path ${getDisplayLevel()}/${PATH_LEVEL_COUNT} section ${rules.game.game}/${LEVELS_PER_STAGE} reward: ${levelPrizeText}. ` +
          (rules.stageEndsOnWin
            ? `You also unlock stage bonus: ${stagePrizeText}.`
            : `Stage bonus at ${LEVELS_PER_STAGE}/${LEVELS_PER_STAGE}: ${stagePrizeText}.`) +
          ` Shop uses Sapito Coins.`;
      }
    }

    if (ui.foodHealthLine) {
      ui.foodHealthLine.classList.remove("food-health-safe", "food-health-low", "food-health-critical");
      ui.foodHealthLine.classList.add(`food-health-${healthBand}`);
      if (state.language === "es") {
        if (healthBand === "safe") {
          ui.foodHealthLine.textContent = `Vida de Sapito: estable (${healthShort}%). Banco: ~${daysShort} dias.`;
        } else if (healthBand === "low") {
          ui.foodHealthLine.textContent = `Vida de Sapito: baja (${healthShort}%). Alimenta pronto.`;
        } else {
          ui.foodHealthLine.textContent = `Vida de Sapito: critica (${healthShort}%). Alimenta ahora.`;
        }
      } else if (healthBand === "safe") {
        ui.foodHealthLine.textContent = `Sapito life: Stable (${healthShort}%). Food bank: ~${daysShort} days.`;
      } else if (healthBand === "low") {
        ui.foodHealthLine.textContent = `Sapito life: Low (${healthShort}%). Feed soon.`;
      } else {
        ui.foodHealthLine.textContent = `Sapito life: Critical (${healthShort}%). Feed now.`;
      }
    }

    updateHomeHealthMeter(healthPercent, healthBand);

    updatePetHomePreview();
    updateDecorShopUi();
    populateSapitoStyleSelects();
    updateSapitoStyleShopUi();
    updateSkinShopInfo();
  }

  function addFood(amount, reason = "") {
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.foodBalance = Math.max(0, Math.floor(state.foodBalance + amount));
    updateHud();
    updateHabitatPanel();
    saveSettings();
    if (reason) {
      showToast(`${reason} +${amount} food`);
    }
  }

  function spendFood(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (state.foodBalance < amount) return false;
    state.foodBalance -= Math.floor(amount);
    updateHud();
    updateHabitatPanel();
    saveSettings();
    return true;
  }

  function buyFoodPack() {
    markUserActivity();
    if (!spendCoins(FOOD_PACK_COIN_COST)) {
      const missing = FOOD_PACK_COIN_COST - state.coinBalance;
      showToast(state.language === "es"
        ? `Necesitas ${missing} Sapito Coin para comprar comida.`
        : `Need ${missing} Sapito Coin to buy food.`);
      return;
    }
    addFood(
      FOOD_PER_DOLLAR,
      state.language === "es"
        ? `Comida comprada: +${FOOD_PER_DOLLAR}.`
        : `Food purchased: +${FOOD_PER_DOLLAR}.`
    );
  }

  function buyFoodMarketPack(typeId) {
    markUserActivity();
    if (!spendCoins(FOOD_MARKET_PACK_COST)) {
      const missing = FOOD_MARKET_PACK_COST - state.coinBalance;
      showToast(state.language === "es"
        ? `Necesitas ${missing} Sapito Coins para comprar este pack.`
        : `Need ${missing} Sapito Coins to buy this pack.`);
      return;
    }

    if (typeId === "worms") {
      state.wormBank = Math.max(0, Math.floor(state.wormBank + FOOD_MARKET_PACK_UNITS));
      showToast(state.language === "es"
        ? `Pack comprado: +${FOOD_MARKET_PACK_UNITS} gusanitos.`
        : `Pack purchased: +${FOOD_MARKET_PACK_UNITS} worms.`);
    } else if (typeId === "flies") {
      state.flyBank = Math.max(0, Math.floor(state.flyBank + FOOD_MARKET_PACK_UNITS));
      showToast(state.language === "es"
        ? `Pack comprado: +${FOOD_MARKET_PACK_UNITS} moscas.`
        : `Pack purchased: +${FOOD_MARKET_PACK_UNITS} flies.`);
    } else {
      state.foodBalance = Math.max(0, Math.floor(state.foodBalance + FOOD_MARKET_PACK_UNITS));
      showToast(state.language === "es"
        ? `Pack comprado: +${FOOD_MARKET_PACK_UNITS} mariposas multicolor.`
        : `Pack purchased: +${FOOD_MARKET_PACK_UNITS} multicolor butterflies.`);
    }

    updateHud();
    updateCoinBankUi();
    updateHabitatPanel();
    saveSettings();
  }

  function buyNextSkin() {
    const skin = getNextLockedSkin();
    if (!skin) {
      showToast(state.language === "es" ? "Todas las skins ya estan desbloqueadas." : "All skins already unlocked.");
      return;
    }
    const price = getThemeCoinPrice(skin.id);
    if (!spendCoins(price)) {
      const missing = price - state.coinBalance;
      showToast(state.language === "es"
        ? `Necesitas ${missing} Sapito Coins para ${skin.name}.`
        : `Need ${missing} Sapito Coins for ${skin.name}.`);
      return;
    }
    state.ownedSkins.add(skin.id);
    refreshUnlockedSkins();
    populateSkinSelects();
    applySkin(skin.id);
    updateHabitatPanel();
    saveSettings();
    showToast(state.language === "es" ? `Skin desbloqueada: ${skin.name}` : `Skin unlocked: ${skin.name}`);
  }

  function applyDailyFeedingDecay() {
    const today = getTodayKey();
    if (!state.lastDailyCheck) {
      state.lastDailyCheck = today;
      saveSettings();
      return;
    }
    if (state.lastDailyCheck === today) return;

    const daysAway = getDaysBetween(state.lastDailyCheck, today);
    const frogCount = getFrogCountForLevel(state.level);
    const foodToEat = daysAway * frogCount * DAILY_FOOD_PER_FROG;
    const eaten = Math.min(state.foodBalance, foodToEat);
    const missingFood = Math.max(0, foodToEat - eaten);
    const dailyNeed = Math.max(1, frogCount * DAILY_FOOD_PER_FROG);

    state.foodBalance -= eaten;
    if (missingFood > 0) {
      const healthLoss = Math.min(70, Math.ceil((missingFood / dailyNeed) * 28));
      state.sapitoHealth = clamp(getSapitoHealthPercent() - healthLoss, 0, 100);
    } else if (eaten > 0) {
      state.sapitoHealth = clamp(getSapitoHealthPercent() + Math.min(18, daysAway * 6), 0, 100);
    }
    state.lastDailyCheck = today;
    if (missingFood > 0) {
      state.dailyFeedMessage = state.language === "es"
        ? `Sapito no tuvo suficiente comida. Vida: ${Math.round(getSapitoHealthPercent())}%.`
        : `Sapito did not have enough food. Life: ${Math.round(getSapitoHealthPercent())}%.`;
    } else {
      state.dailyFeedMessage = eaten > 0
        ? (state.language === "es"
          ? `Sapito comio ${eaten} comida mientras no estabas. Vida: ${Math.round(getSapitoHealthPercent())}%.`
          : `Sapito ate ${eaten} food while you were away. Life: ${Math.round(getSapitoHealthPercent())}%.`)
        : (state.language === "es"
          ? "Sapito tiene hambre. Juega para conseguir comida."
          : "Sapito is hungry. Play to feed him.");
    }
    updateHud();
    updateHabitatPanel();
    saveSettings();
  }

  function getPlayTypeConfig() {
    return PLAY_TYPES[state.playType] || PLAY_TYPES.solo;
  }

  function getRulesStageForLevel(level = state.level) {
    const safeLevel = Math.max(1, Math.floor(level));
    const stageIndex = Math.floor((safeLevel - 1) / BASE_GAME_TARGETS.length);
    return LEVEL_RULE_BOOK[Math.min(stageIndex, LEVEL_RULE_BOOK.length - 1)];
  }

  function getRulesGameForLevel(level = state.level) {
    const safeLevel = Math.max(1, Math.floor(level));
    const stage = getRulesStageForLevel(safeLevel);
    const gameIndex = (safeLevel - 1) % BASE_GAME_TARGETS.length;
    const game = stage.games[gameIndex];
    const stageEndsOnWin = gameIndex === BASE_GAME_TARGETS.length - 1;
    return {
      stage,
      game,
      gameIndex,
      stageEndsOnWin
    };
  }

  function getBundleNumber(bundle, key) {
    const value = bundle && Number(bundle[key]);
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }

  function makeEmptyPrizeBundle() {
    return {
      butterflies: 0,
      blueButterflies: 0,
      yellowButterflies: 0,
      redButterflies: 0,
      worms: 0,
      flies: 0,
      medals: 0,
      coins: 0
    };
  }

  function sumPrizeBundles(...bundles) {
    const total = makeEmptyPrizeBundle();
    bundles.forEach((bundle) => {
      if (!bundle) return;
      total.butterflies += getBundleNumber(bundle, "butterflies");
      total.blueButterflies += getBundleNumber(bundle, "blueButterflies");
      total.yellowButterflies += getBundleNumber(bundle, "yellowButterflies");
      total.redButterflies += getBundleNumber(bundle, "redButterflies");
      total.worms += getBundleNumber(bundle, "worms");
      total.flies += getBundleNumber(bundle, "flies");
      total.medals += getBundleNumber(bundle, "medals");
      total.coins += getBundleNumber(bundle, "coins");
    });
    return total;
  }

  function formatPrizeBundle(bundle, language = state.language) {
    const parts = [];
    const butterflies = getBundleNumber(bundle, "butterflies");
    const blueButterflies = getBundleNumber(bundle, "blueButterflies");
    const yellowButterflies = getBundleNumber(bundle, "yellowButterflies");
    const redButterflies = getBundleNumber(bundle, "redButterflies");
    const worms = getBundleNumber(bundle, "worms");
    const flies = getBundleNumber(bundle, "flies");
    const medals = getBundleNumber(bundle, "medals");
    const coins = getBundleNumber(bundle, "coins");

    if (butterflies > 0) {
      parts.push(language === "es" ? `${butterflies} mariposas` : `${butterflies} butterflies`);
    }
    if (blueButterflies > 0) {
      parts.push(language === "es" ? `${blueButterflies} mariposas azules` : `${blueButterflies} blue butterflies`);
    }
    if (yellowButterflies > 0) {
      parts.push(language === "es" ? `${yellowButterflies} mariposas amarillas` : `${yellowButterflies} yellow butterflies`);
    }
    if (redButterflies > 0) {
      parts.push(language === "es" ? `${redButterflies} mariposas rojas` : `${redButterflies} red butterflies`);
    }
    if (worms > 0) {
      parts.push(language === "es" ? `${worms} gusanitos` : `${worms} worms`);
    }
    if (flies > 0) {
      parts.push(language === "es" ? `${flies} moscas` : `${flies} flies`);
    }
    if (medals > 0) {
      parts.push(language === "es" ? `${medals} medalla${medals > 1 ? "s" : ""}` : `${medals} medal${medals > 1 ? "s" : ""}`);
    }
    if (coins > 0) {
      parts.push(language === "es" ? `${coins} Sapito Coins` : `${coins} Sapito Coins`);
    }
    if (parts.length === 0) {
      return language === "es" ? "sin premio" : "no prize";
    }
    return parts.join(", ");
  }

  function formatRequirementBundle(bundle, language = state.language) {
    const text = formatPrizeBundle(bundle, language);
    return language === "es" ? `Atrapa ${text}.` : `Catch ${text}.`;
  }

  function applyPrizeBundle(bundle) {
    if (!bundle) return;
    const butterflies = getBundleNumber(bundle, "butterflies") + getBundleNumber(bundle, "blueButterflies");
    const yellowButterflies = getBundleNumber(bundle, "yellowButterflies");
    const redButterflies = getBundleNumber(bundle, "redButterflies");
    const worms = getBundleNumber(bundle, "worms");
    const flies = getBundleNumber(bundle, "flies");
    const medals = getBundleNumber(bundle, "medals");
    const coins = getBundleNumber(bundle, "coins");

    state.foodBalance = Math.max(0, Math.floor(state.foodBalance + butterflies));
    state.wormBank = Math.max(0, Math.floor(state.wormBank + worms));
    state.flyBank = Math.max(0, Math.floor(state.flyBank + flies));
    state.yellowButterflyBank = Math.max(0, Math.floor(state.yellowButterflyBank + yellowButterflies));
    state.redButterflyBank = Math.max(0, Math.floor(state.redButterflyBank + redButterflies));
    state.medalCount = Math.max(0, Math.floor(state.medalCount + medals));
    if (coins > 0) {
      creditCoins(coins, {
        source: "win",
        reason: "",
        toast: false
      });
    }
  }

  function getTargetScore() {
    const levelRule = getRulesGameForLevel(state.level).game;
    const baseTarget = Math.max(
      getBundleNumber(levelRule.requirement, "butterflies"),
      getBundleNumber(levelRule.requirement, "blueButterflies")
    );
    const playerMultipliers = {
      solo: 1,
      team: 1.6,
      trio: 2.1
    };
    const difficultyMultipliers = {
      easy: 1,
      difficult: 1.18,
      extra: 1.38
    };
    const playerMultiplier = playerMultipliers[state.playType] || 1;
    const difficultyMultiplier = difficultyMultipliers[state.mode] || 1;
    return Math.max(1, Math.round(baseTarget * playerMultiplier * difficultyMultiplier));
  }

  function getHelperMaxScoreContribution() {
    const target = getTargetScore();
    const modeRatios = {
      easy: 0.26,
      difficult: 0.2,
      extra: 0.16
    };
    const modeRatio = modeRatios[state.mode] || modeRatios.easy;
    const teamBonus = state.playType === "team" ? 0.08 : (state.playType === "trio" ? 0.12 : 0);
    const motionBonus = state.reduceMotion ? 0.05 : 0;
    const ratio = clamp(modeRatio + teamBonus + motionBonus, 0.18, 0.42);
    return Math.max(8, Math.floor(target * ratio));
  }

  function getHelperCatchChance() {
    const modeChances = {
      easy: 0.56,
      difficult: 0.46,
      extra: 0.38
    };
    let chance = modeChances[state.mode] || modeChances.easy;
    if (state.playType === "team") chance += 0.08;
    if (state.playType === "trio") chance += 0.12;
    if (state.reduceMotion) chance += 0.06;
    return clamp(chance, 0.35, 0.72);
  }

  function getFrogBiteCooldownMs() {
    if (state.mode === "extra") return 860;
    if (state.mode === "difficult") return 760;
    return 620;
  }

  function canHelperAssist() {
    return state.helperScore < getHelperMaxScoreContribution();
  }

  function updateQaStatus() {
    if (!QA_MODE || !ui.qaStatus) return;
    const gameState = state.running ? (state.paused ? "PAUSED" : "RUN") : "IDLE";
    ui.qaStatus.textContent = `QA ${gameState} • Helper ${state.helperScore}/${getHelperMaxScoreContribution()}`;
  }

  function forceQaResult(forceWin) {
    if (!state.running || state.paused) {
      showToast("Start an active game first.");
      return;
    }
    const target = getTargetScore();
    state.score = forceWin
      ? Math.max(state.score, target)
      : Math.min(state.score, Math.max(0, target - 1));
    state.timeLeft = 0;
    updateHud();
    finishGame();
  }

  function ensureQaPanel() {
    if (!QA_MODE) return;
    const appRoot = document.querySelector(".app");
    if (!appRoot) return;

    const panel = document.createElement("aside");
    panel.id = "qaPanel";
    panel.className = "qa-panel";
    panel.innerHTML = [
      '<p class="qa-title">QA Tools</p>',
      '<p id="qaStatus" class="qa-status">QA IDLE</p>',
      '<div class="qa-row">',
      '  <button id="qaWinBtn" class="qa-btn" type="button">Force Win</button>',
      '  <button id="qaLossBtn" class="qa-btn qa-danger" type="button">Force Loss</button>',
      "</div>"
    ].join("\n");
    appRoot.appendChild(panel);

    ui.qaPanel = panel;
    ui.qaStatus = panel.querySelector("#qaStatus");
    ui.qaWinBtn = panel.querySelector("#qaWinBtn");
    ui.qaLossBtn = panel.querySelector("#qaLossBtn");

    if (ui.qaWinBtn) {
      ui.qaWinBtn.addEventListener("click", () => forceQaResult(true));
    }
    if (ui.qaLossBtn) {
      ui.qaLossBtn.addEventListener("click", () => forceQaResult(false));
    }
    updateQaStatus();
  }

  function updatePlayTypeHint() {
    const config = getPlayTypeConfig();
    const target = getTargetScore();
    const modeLabels = {
      easy: state.language === "es" ? "facil" : "easy",
      difficult: state.language === "es" ? "dificil" : "difficult",
      extra: state.language === "es" ? "extra dificil" : "extra difficult"
    };
    const modeLabel = modeLabels[state.mode] || modeLabels.easy;
    if (state.language === "es") {
      const playerText = config.id === "trio"
        ? "Modo trio: 3 jugadores pueden jugar juntos."
        : (config.id === "team" ? "Modo equipo: 2 jugadores pueden jugar juntos." : "Modo solo: 1 jugador.");
      ui.playTypeHint.textContent = `${playerText} Dificultad ${modeLabel}. Meta actual: ${target} en 60 segundos.`;
    } else {
      const playerText = config.id === "trio"
        ? "Trio mode: 3 players can click together."
        : (config.id === "team" ? "Team mode: 2 players can click together." : "Solo mode: 1 player.");
      ui.playTypeHint.textContent = `${playerText} ${modeLabel} mode. Current target: ${target} in 60 seconds.`;
    }
  }

  function setPlayType(playTypeId) {
    const normalized = PLAY_TYPES[playTypeId] ? playTypeId : "solo";
    state.playType = normalized;
    ui.playTypeSelect.value = normalized;
    updatePlayTypeHint();
    updateHud();
    updateHabitatPanel();
    saveSettings();
  }

  function setGameMode(modeId) {
    const normalized = normalizeGameMode(modeId);
    state.mode = normalized;
    if (ui.modeSelect) {
      ui.modeSelect.value = normalized;
    }
    updatePlayTypeHint();
    updateHud();
    updateHabitatPanel();
    saveSettings();
  }

  function updateHud() {
    ui.score.textContent = String(state.score);
    ui.time.textContent = String(Math.max(0, Math.ceil(state.timeLeft)));
    ui.target.textContent = String(getTargetScore());
    ui.food.textContent = String(state.foodBalance);
    ui.level.textContent = String(getDisplayLevel());
    ui.level.setAttribute(
      "aria-label",
      state.language === "es"
        ? `Ruta visible ${getDisplayLevel()} de ${PATH_LEVEL_COUNT}, seccion ${getDisplaySection()}`
        : `Display path ${getDisplayLevel()} of ${PATH_LEVEL_COUNT}, section ${getDisplaySection()}`
    );
    updateQaStatus();
  }

  function showOnlyScreen(screenName) {
    ui.startScreen.classList.add("hidden");
    ui.pauseScreen.classList.add("hidden");
    ui.resultScreen.classList.add("hidden");
    if (screenName !== "start") {
      togglePuzzleQuickPopup(false);
      toggleHabitatViewPopup(false);
      toggleCoinTopupPopup(false);
      toggleFoodMarketPopup(false);
      toggleFoodEmptyPopup(false);
      toggleRoadMapPopup(false);
    }
    if (screenName !== "result") {
      clearEvolutionCeremony();
    }
    document.body.classList.toggle("home-mode", screenName === "start");

    if (screenName === "start") {
      ui.startScreen.classList.remove("hidden");
      startHomeScene();
    } else {
      stopHomeScene();
    }
    if (screenName === "pause") ui.pauseScreen.classList.remove("hidden");
    if (screenName === "result") ui.resultScreen.classList.remove("hidden");
    syncNeglectAmbientSound();
  }

  function centerPlayer() {
    const bounds = ui.gameArea.getBoundingClientRect();
    state.player.x = bounds.width / 2 - state.player.size / 2;
    state.player.y = bounds.height / 2 - state.player.size / 2;
    renderPlayer();
  }

  function clampPlayerToArea() {
    const bounds = ui.gameArea.getBoundingClientRect();
    state.player.x = clamp(state.player.x, 0, bounds.width - state.player.size);
    state.player.y = clamp(state.player.y, 0, bounds.height - state.player.size);
    renderPlayer();
  }

  function renderPlayer() {
    ui.player.style.left = `${state.player.x}px`;
    ui.player.style.top = `${state.player.y}px`;
  }

  function clearButterflies() {
    state.butterflies.forEach((b) => b.el.remove());
    state.butterflies = [];
  }

  function clearFrogs() {
    state.frogs.forEach((frog) => frog.el.remove());
    state.frogs = [];
  }

  function spawnFrogs() {
    clearFrogs();
    const bounds = ui.gameArea.getBoundingClientRect();
    const frogCount = getFrogCountForLevel(state.level);

    for (let i = 0; i < frogCount; i += 1) {
      const size = 48;
      const x = randBetween(0, Math.max(0, bounds.width - size));
      const y = randBetween(0, Math.max(0, bounds.height - size));
      const el = document.createElement("div");
      const id = state.nextFrogId++;
      el.className = "frog";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--frog-color", getFrogColor(i, state.level));
      el.style.setProperty("--frog-dir", "1");
      el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        jumpFrogAwayFromPoint(id, {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top
        });
      });
      ui.gameArea.appendChild(el);

      state.frogs.push({
        id,
        el,
        x,
        y,
        size,
        speed: 70 + state.level * 2 + i * 4,
        wanderTimer: randBetween(0.35, 1.1),
        wanderAngle: Math.random() * Math.PI * 2,
        nextBiteAt: 0
      });
    }
  }

  function getNearestButterfly(x, y, options = {}) {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < state.butterflies.length; i += 1) {
      const b = state.butterflies[i];
      if (options.goldenOnly && b.kind !== "golden") continue;
      if (options.bronzeGuardOnly && b.kind !== "bronze-guard") continue;
      if (options.excludeGolden && b.kind === "golden") continue;
      if (options.excludeStars && isStarTarget(b)) continue;
      const dx = b.x + b.size / 2 - x;
      const dy = b.y + b.size / 2 - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < bestDistance) {
        bestDistance = distSq;
        best = b;
      }
    }
    return best;
  }

  function getActiveGoldenGuardCount() {
    return state.butterflies.filter((item) => item.kind === "bronze-guard").length;
  }

  function getIncidentalStarUnderFrog(frog) {
    if (!frog) return null;
    const frogCenterX = frog.x + frog.size / 2;
    const frogCenterY = frog.y + frog.size / 2;
    for (let i = 0; i < state.butterflies.length; i += 1) {
      const item = state.butterflies[i];
      if (!isStarTarget(item)) continue;
      const itemCenterX = item.x + item.size / 2;
      const itemCenterY = item.y + item.size / 2;
      const overlapRange = frog.size * 0.34 + item.size * 0.34;
      if (Math.hypot(itemCenterX - frogCenterX, itemCenterY - frogCenterY) <= overlapRange) {
        return item;
      }
    }
    return null;
  }

  function jumpFrogAwayFromPoint(frogId, sourcePoint) {
    const frog = state.frogs.find((item) => item.id === frogId);
    if (!frog || !sourcePoint) return;
    const bounds = ui.gameArea.getBoundingClientRect();
    const centerX = frog.x + frog.size / 2;
    const centerY = frog.y + frog.size / 2;
    let awayX = centerX - sourcePoint.x;
    let awayY = centerY - sourcePoint.y;
    let distance = Math.hypot(awayX, awayY);
    if (distance < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      awayX = Math.cos(angle);
      awayY = Math.sin(angle);
      distance = 1;
    }

    const jump = randBetween(180, 280);
    const sidePush = randBetween(-90, 90);
    const normalX = -awayY / distance;
    const normalY = awayX / distance;
    frog.x = clamp(
      frog.x + (awayX / distance) * jump + normalX * sidePush,
      0,
      Math.max(0, bounds.width - frog.size)
    );
    frog.y = clamp(
      frog.y + (awayY / distance) * jump + normalY * sidePush,
      0,
      Math.max(0, bounds.height - frog.size)
    );
    frog.wanderAngle = Math.random() * Math.PI * 2;
    frog.wanderTimer = randBetween(0.6, 1.2);
    frog.el.classList.add("frog-startled");
    frog.el.style.left = `${frog.x}px`;
    frog.el.style.top = `${frog.y}px`;
    window.setTimeout(() => {
      if (frog.el && frog.el.isConnected) {
        frog.el.classList.remove("frog-startled");
      }
    }, 360);
  }

  function updateFrogs(dt) {
    if (state.frogs.length === 0) return;
    const bounds = ui.gameArea.getBoundingClientRect();
    const nowMs = performance.now();

    for (let i = 0; i < state.frogs.length; i += 1) {
      const frog = state.frogs[i];
      const centerX = frog.x + frog.size / 2;
      const centerY = frog.y + frog.size / 2;
      const helperAssistEnabled = canHelperAssist();
      const guardTarget = getNearestButterfly(centerX, centerY, { bronzeGuardOnly: true });
      const goldenTarget = getNearestButterfly(centerX, centerY, { goldenOnly: true });
      if (!helperAssistEnabled && !goldenTarget && !state.helperCapToastShown) {
        state.helperCapToastShown = true;
        showToast("Sapito helper is resting. Your clicks finish the level.");
      }
      const target = guardTarget || goldenTarget;

      let dx = 0;
      let dy = 0;
      let chaseDistance = Number.POSITIVE_INFINITY;

      if (target) {
        dx = target.x + target.size / 2 - centerX;
        dy = target.y + target.size / 2 - centerY;
        chaseDistance = Math.hypot(dx, dy);

        if (chaseDistance > 0.001) {
          const step = Math.min(frog.speed * dt, chaseDistance);
          frog.x += (dx / chaseDistance) * step;
          frog.y += (dy / chaseDistance) * step;
        }

        const biteRange = frog.size * 0.4 + target.size * 0.4;
        if (chaseDistance <= biteRange && nowMs >= frog.nextBiteAt) {
          frog.nextBiteAt = nowMs + getFrogBiteCooldownMs() + randBetween(120, 280);
          if (target.kind === "bronze-guard") {
            damageBronzeGuard(target, frog);
          } else if (target.kind === "golden") {
            if (tryHelperCatchGoldenButterfly(target, frog, nowMs)) {
              catchButterfly(target.id, "frog");
            }
          } else if (Math.random() <= getHelperCatchChance()) {
            catchButterfly(target.id, "frog");
          }
        }
      } else {
        frog.wanderTimer -= dt;
        if (frog.wanderTimer <= 0) {
          frog.wanderTimer = randBetween(0.35, 1.1);
          frog.wanderAngle = Math.random() * Math.PI * 2;
        }
        frog.x += Math.cos(frog.wanderAngle) * frog.speed * 0.22 * dt;
        frog.y += Math.sin(frog.wanderAngle) * frog.speed * 0.22 * dt;
      }

      const incidentalStar = getIncidentalStarUnderFrog(frog);
      if (incidentalStar && nowMs >= frog.nextBiteAt) {
        frog.nextBiteAt = nowMs + getFrogBiteCooldownMs() + randBetween(120, 280);
        catchButterfly(incidentalStar.id, "frog");
      }

      frog.x = clamp(frog.x, 0, Math.max(0, bounds.width - frog.size));
      frog.y = clamp(frog.y, 0, Math.max(0, bounds.height - frog.size));
      frog.el.style.left = `${frog.x}px`;
      frog.el.style.top = `${frog.y}px`;
      if (Math.abs(dx) > 0.001) {
        frog.el.style.setProperty("--frog-dir", dx < 0 ? "-1" : "1");
      }
    }
  }

  function spawnButterfly(options = {}) {
    const bounds = ui.gameArea.getBoundingClientRect();
    const isGolden = options.kind === "golden";
    if (!isGolden) {
      const maxActiveTargets = state.playType === "team" ? MAX_ACTIVE_TEAM_TARGETS : MAX_ACTIVE_SOLO_TARGETS;
      const activeTargets = state.butterflies.filter((item) => item.kind !== "golden" && item.kind !== "bronze-guard").length;
      if (activeTargets >= maxActiveTargets) return null;
    }
    const size = isGolden ? 64 : randBetween(42, 60);

    const x = Math.random() * Math.max(10, bounds.width - size - 10);
    const y = Math.random() * Math.max(10, bounds.height - size - 10);

    const baseSpeedByMode = { easy: 42, difficult: 58, extra: 72 };
    const baseSpeed = baseSpeedByMode[state.mode] || baseSpeedByMode.easy;
    const levelSpeed = Math.min(34, (state.level - 1) * 2.6);
    const motionScale = state.reduceMotion ? 0.58 : 1;
    const goldenScale = isGolden ? 0.64 : 1;
    const speed = (baseSpeed + levelSpeed + randBetween(-5, 9)) * motionScale * goldenScale;

    const angle = Math.random() * Math.PI * 2;

    const el = document.createElement("div");
    el.className = isGolden ? "butterfly golden-butterfly" : "butterfly";
    const emoji = isGolden
      ? GOLDEN_BUTTERFLY_EMOJI
      : BUTTERFLY_EMOJIS[Math.floor(Math.random() * BUTTERFLY_EMOJIS.length)];
    el.textContent = emoji;
    if (isGolden) {
      el.setAttribute("aria-label", "Golden butterfly, helper frogi only");
      el.title = "Golden butterfly: helper frogi only, +50 points";
    }
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.fontSize = `${Math.floor(size * 0.7)}px`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    const id = state.nextButterflyId++;
    el.dataset.id = String(id);
    el.addEventListener("click", (event) => catchButterfly(id, "player", event));

    ui.gameArea.appendChild(el);

    const butterfly = {
      id,
      el,
      x,
      y,
      size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      kind: isGolden ? "golden" : (emoji === "✨" ? "star" : "normal"),
      value: isGolden ? GOLDEN_BUTTERFLY_VALUE : 1,
      nextPlayerEscapeAt: 0,
      nextHelperEscapeAt: 0,
      helperDodgesRemaining: isGolden ? GOLDEN_BUTTERFLY_HELPER_DODGES : 0
    };
    state.butterflies.push(butterfly);
    return butterfly;
  }

  function spawnGoldenButterfly() {
    if (state.goldenButterflySpawned) return null;
    const butterfly = spawnButterfly({ kind: "golden" });
    if (butterfly) {
      state.goldenButterflySpawned = true;
      spawnBronzeGuardsForGolden(butterfly);
    }
    return butterfly;
  }

  function spawnBronzeGuardsForGolden(golden) {
    if (!golden || golden.kind !== "golden") return;
    const bounds = ui.gameArea.getBoundingClientRect();
    const centerX = golden.x + golden.size / 2;
    const centerY = golden.y + golden.size / 2;
    for (let i = 0; i < GOLDEN_GUARD_COUNT; i += 1) {
      const size = randBetween(22, 28);
      const angle = (i / GOLDEN_GUARD_COUNT) * Math.PI * 2;
      const ring = i % 3;
      const orbitRadius = golden.size * 0.76 + ring * 18 + randBetween(-3, 4);
      const x = clamp(centerX + Math.cos(angle) * orbitRadius - size / 2, 0, Math.max(0, bounds.width - size));
      const y = clamp(centerY + Math.sin(angle) * orbitRadius - size / 2, 0, Math.max(0, bounds.height - size));
      const el = document.createElement("div");
      el.className = "butterfly bronze-butterfly-soldier";
      el.textContent = "🦋";
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.fontSize = `${Math.floor(size * 0.74)}px`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.setAttribute("aria-label", "Bronze butterfly soldier");
      el.title = "Bronze soldier: frogi must hit 3 times";
      el.dataset.hits = String(GOLDEN_GUARD_HITS);
      const id = state.nextButterflyId++;
      el.dataset.id = String(id);
      el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        showToast(state.language === "es"
          ? "Los soldaditos bronce solo los derrotan los sapitos."
          : "Bronze soldiers are for frogi helpers to defeat.");
      });
      ui.gameArea.appendChild(el);
      state.butterflies.push({
        id,
        el,
        x,
        y,
        size,
        vx: 0,
        vy: 0,
        kind: "bronze-guard",
        value: 0,
        guardTargetId: golden.id,
        hitsRemaining: GOLDEN_GUARD_HITS,
        orbitAngle: angle,
        orbitRadius,
        orbitSpeed: randBetween(3.8, 6.4) * (i % 2 === 0 ? 1 : -1),
        orbitWobble: randBetween(0, Math.PI * 2),
        nextPlayerEscapeAt: 0,
        nextHelperEscapeAt: 0,
        helperDodgesRemaining: 0
      });
    }
  }

  function updateButterflies(dt) {
    const bounds = ui.gameArea.getBoundingClientRect();

    for (let i = 0; i < state.butterflies.length; i += 1) {
      const b = state.butterflies[i];
      if (b.kind === "bronze-guard") {
        const golden = state.butterflies.find((item) => item.id === b.guardTargetId && item.kind === "golden");
        if (!golden) {
          b.vx = randBetween(-40, 40);
          b.vy = randBetween(-40, 40);
        } else {
          b.orbitAngle += b.orbitSpeed * dt;
          const goldenCenterX = golden.x + golden.size / 2;
          const goldenCenterY = golden.y + golden.size / 2;
          const wobble = Math.sin(performance.now() / 220 + b.orbitWobble) * 7;
          const radius = b.orbitRadius + wobble;
          b.x = clamp(goldenCenterX + Math.cos(b.orbitAngle) * radius - b.size / 2, 0, Math.max(0, bounds.width - b.size));
          b.y = clamp(goldenCenterY + Math.sin(b.orbitAngle) * radius - b.size / 2, 0, Math.max(0, bounds.height - b.size));
          b.el.style.left = `${b.x}px`;
          b.el.style.top = `${b.y}px`;
          continue;
        }
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x <= 0 || b.x >= bounds.width - b.size) {
        b.vx *= -1;
        b.x = clamp(b.x, 0, bounds.width - b.size);
      }
      if (b.y <= 0 || b.y >= bounds.height - b.size) {
        b.vy *= -1;
        b.y = clamp(b.y, 0, bounds.height - b.size);
      }

      b.el.style.left = `${b.x}px`;
      b.el.style.top = `${b.y}px`;
    }
  }

  function getSpawnInterval() {
    const elapsed = GAME_DURATION - state.timeLeft;
    const modeBaseByMode = { easy: 820, difficult: 680, extra: 560 };
    const modeBase = modeBaseByMode[state.mode] || modeBaseByMode.easy;
    const levelPush = Math.min(260, (state.level - 1) * 18);
    const timePush = elapsed * 3.2;
    const motionScale = state.reduceMotion ? 1.45 : 1;
    const playTypeScale = state.playType === "team" ? 0.84 : 1;

    return Math.max(240, (modeBase - levelPush - timePush) * motionScale * playTypeScale);
  }

  function getPlayerAttemptPoint(event) {
    const bounds = ui.gameArea.getBoundingClientRect();
    if (event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      };
    }
    return {
      x: state.player.x + state.player.size / 2,
      y: state.player.y + state.player.size / 2
    };
  }

  function jumpGoldenButterflyAway(b, sourcePoint, options = {}) {
    if (!b || b.kind !== "golden") return;
    const bounds = ui.gameArea.getBoundingClientRect();
    const centerX = b.x + b.size / 2;
    const centerY = b.y + b.size / 2;
    let awayX = centerX - sourcePoint.x;
    let awayY = centerY - sourcePoint.y;
    let awayDistance = Math.hypot(awayX, awayY);
    if (awayDistance < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      awayX = Math.cos(angle);
      awayY = Math.sin(angle);
      awayDistance = 1;
    }

    const jump = options.jump || randBetween(140, 230);
    const maxSidePush = Number.isFinite(options.sidePush) ? Math.max(0, options.sidePush) : 80;
    const speedScale = Number.isFinite(options.speedScale) ? Math.max(0.2, options.speedScale) : 1;
    const sidePush = randBetween(-maxSidePush, maxSidePush);
    const normalX = -awayY / awayDistance;
    const normalY = awayX / awayDistance;
    let targetX = b.x + (awayX / awayDistance) * jump + normalX * sidePush;
    let targetY = b.y + (awayY / awayDistance) * jump + normalY * sidePush;

    targetX = clamp(targetX, 0, Math.max(0, bounds.width - b.size));
    targetY = clamp(targetY, 0, Math.max(0, bounds.height - b.size));
    if (Math.hypot(targetX - b.x, targetY - b.y) < 52) {
      targetX = randBetween(0, Math.max(0, bounds.width - b.size));
      targetY = randBetween(0, Math.max(0, bounds.height - b.size));
    }

    b.x = targetX;
    b.y = targetY;
    b.vx = randBetween(-120, 120) * speedScale;
    b.vy = randBetween(-120, 120) * speedScale;
    b.el.classList.add("evading");
    b.el.style.left = `${b.x}px`;
    b.el.style.top = `${b.y}px`;
    window.setTimeout(() => {
      if (b.el && b.el.isConnected) {
        b.el.classList.remove("evading");
      }
    }, 360);
  }

  function escapeGoldenButterfly(b, event = null) {
    if (!b || b.kind !== "golden") return;
    const nowMs = performance.now();
    if (nowMs < b.nextPlayerEscapeAt) return;
    b.nextPlayerEscapeAt = nowMs + 450;

    jumpGoldenButterflyAway(b, getPlayerAttemptPoint(event));
    showToast(state.language === "es"
      ? "La mariposa dorada salto. Solo frogi puede atraparla."
      : "Golden butterfly dodged you. Only frogi can catch it.");
  }

  function damageBronzeGuard(guard, frog) {
    if (!guard || guard.kind !== "bronze-guard") return;
    guard.hitsRemaining = Math.max(0, Math.floor((guard.hitsRemaining || GOLDEN_GUARD_HITS) - 1));
    guard.el.dataset.hits = String(guard.hitsRemaining);
    guard.el.classList.remove("guard-hit-1", "guard-hit-2", "guard-hit-3");
    guard.el.classList.add(`guard-hit-${GOLDEN_GUARD_HITS - guard.hitsRemaining}`);

    if (guard.hitsRemaining > 0) {
      const pushX = guard.x + guard.size / 2 - (frog.x + frog.size / 2);
      const pushY = guard.y + guard.size / 2 - (frog.y + frog.size / 2);
      const dist = Math.max(1, Math.hypot(pushX, pushY));
      guard.orbitRadius += 3;
      guard.x = clamp(guard.x + (pushX / dist) * 12, 0, Math.max(0, ui.gameArea.clientWidth - guard.size));
      guard.y = clamp(guard.y + (pushY / dist) * 12, 0, Math.max(0, ui.gameArea.clientHeight - guard.size));
      showToast(state.language === "es"
        ? `Soldado bronce golpeado. Faltan ${guard.hitsRemaining}.`
        : `Bronze soldier hit. ${guard.hitsRemaining} left.`);
      return;
    }

    const index = state.butterflies.findIndex((item) => item.id === guard.id);
    if (index >= 0) {
      const [removed] = state.butterflies.splice(index, 1);
      removed.el.remove();
    }
    const remaining = getActiveGoldenGuardCount();
    if (remaining <= 0) {
      showToast(state.language === "es"
        ? "Camino libre. ¡Ahora por la dorada!"
        : "Path cleared. Now frogi can reach the golden butterfly!");
    } else if (remaining % 5 === 0) {
      showToast(state.language === "es"
        ? `Soldados bronce restantes: ${remaining}.`
        : `Bronze soldiers left: ${remaining}.`);
    }
  }

  function tryHelperCatchGoldenButterfly(b, frog, nowMs) {
    if (!b || b.kind !== "golden") return false;
    const guardsLeft = getActiveGoldenGuardCount();
    if (guardsLeft > 0) {
      if (nowMs >= b.nextHelperEscapeAt) {
        b.nextHelperEscapeAt = nowMs + 900;
        showToast(state.language === "es"
          ? `La dorada esta protegida por ${guardsLeft} soldaditos bronce.`
          : `Golden butterfly is protected by ${guardsLeft} bronze soldiers.`);
      }
      return false;
    }
    if (b.helperDodgesRemaining <= 0) return true;
    if (nowMs < b.nextHelperEscapeAt) return false;

    b.helperDodgesRemaining = Math.max(0, b.helperDodgesRemaining - 1);
    b.nextHelperEscapeAt = nowMs + GOLDEN_BUTTERFLY_HELPER_DODGE_COOLDOWN_MS;
    jumpGoldenButterflyAway(
      b,
      { x: frog.x + frog.size / 2, y: frog.y + frog.size / 2 },
      { jump: randBetween(150, 240), sidePush: 170, speedScale: 0.58 }
    );
    if (b.helperDodgesRemaining <= 0) {
      b.vx *= 0.24;
      b.vy *= 0.24;
    }

    showToast(b.helperDodgesRemaining > 0
      ? (state.language === "es"
        ? `La dorada esquivo a frogi. Le faltan ${b.helperDodgesRemaining} intento${b.helperDodgesRemaining === 1 ? "" : "s"}.`
        : `Golden butterfly dodged frogi. ${b.helperDodgesRemaining} try${b.helperDodgesRemaining === 1 ? "" : "s"} left.`)
      : (state.language === "es"
        ? "Frogi la tiene acorralada."
        : "Frogi has it cornered."));
    return false;
  }

  function catchButterfly(id, source = "player", event = null) {
    const index = state.butterflies.findIndex((b) => b.id === id);
    if (index < 0) return;

    const targetButterfly = state.butterflies[index];
    const isGolden = targetButterfly.kind === "golden";
    if (isGolden && source !== "frog") {
      markUserActivity();
      playTone(740, 80, 0.012);
      escapeGoldenButterfly(targetButterfly, event);
      return;
    }
    if (source === "frog" && !isGolden && !canHelperAssist()) return;

    const [caughtButterfly] = state.butterflies.splice(index, 1);
    caughtButterfly.el.remove();

    const points = Math.max(1, Math.floor(caughtButterfly.value || 1));
    state.score += points;
    state.totalButterfliesCaught = Math.max(0, Math.floor(state.totalButterfliesCaught + points));
    if (source === "frog") {
      state.helperScore += points;
    }
    if (isGolden) {
      state.goldenButterflyCaught = true;
    }
    updateHud();
    checkGrandPrizeProgress();
    if (source === "player") {
      markUserActivity();
      playCatchSound();
    }

    if (isGolden) {
      showToast(state.language === "es"
        ? `¡Frogi atrapo la dorada! +${points} puntos.`
        : `Frogi caught the golden butterfly! +${points} points.`);
    } else if (state.score % 25 === 0) {
      showToast(`Great! ${state.score} butterflies!`);
    } else if (source === "frog" && state.helperScore % 5 === 0) {
      showToast("Froggy helper caught one.");
    }
  }

  function checkCatchCollisions() {
    const p = state.player;
    const hitBonusByMode = { easy: 16, difficult: 6, extra: 2 };
    const easyBonus = hitBonusByMode[state.mode] ?? hitBonusByMode.easy;
    const hitPadding = easyBonus + (state.reduceMotion ? 8 : 0);

    for (let i = state.butterflies.length - 1; i >= 0; i -= 1) {
      const b = state.butterflies[i];
      const intersects =
        p.x < b.x + b.size + hitPadding &&
        p.x + p.size > b.x - hitPadding &&
        p.y < b.y + b.size + hitPadding &&
        p.y + p.size > b.y - hitPadding;

      if (intersects) {
        catchButterfly(b.id);
      }
    }
  }

  function getPlayerSpeed() {
    const playerSpeedByMode = { easy: 240, difficult: 285, extra: 315 };
    const modeSpeed = playerSpeedByMode[state.mode] || playerSpeedByMode.easy;
    const levelSpeed = (state.level - 1) * 9;
    const motionScale = state.reduceMotion ? 0.85 : 1;
    return (modeSpeed + levelSpeed) * motionScale;
  }

  function movePlayer(dt) {
    const dirX = (state.move.right ? 1 : 0) - (state.move.left ? 1 : 0);
    const dirY = (state.move.down ? 1 : 0) - (state.move.up ? 1 : 0);

    if (dirX === 0 && dirY === 0) return;

    let nx = dirX;
    let ny = dirY;

    if (nx !== 0 && ny !== 0) {
      const factor = Math.SQRT1_2;
      nx *= factor;
      ny *= factor;
    }

    const speed = getPlayerSpeed();
    state.player.x += nx * speed * dt;
    state.player.y += ny * speed * dt;

    clampPlayerToArea();
  }

  function startGameFromHome() {
    setGameMode(ui.modeSelect.value);
    setPlayType(ui.playTypeSelect.value);
    applySkin(ui.skinSelectStart.value);
    saveSettings();
    toggleFoodEmptyPopup(false);
    toggleCoinTopupPopup(false);
    toggleStartSettings(false);
    toggleShop(false);
    startGame();
  }

  function startGame() {
    markUserActivity();
    // Always restart the RAF loop from a clean state.
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }

    state.score = 0;
    state.helperScore = 0;
    state.helperCapToastShown = false;
    state.goldenButterflySpawned = false;
    state.goldenButterflyCaught = false;
    state.timeLeft = GAME_DURATION;
    state.spawnAccumulator = 0;
    state.running = true;
    state.paused = false;
    state.lastFrameTime = 0;
    state.move.up = false;
    state.move.down = false;
    state.move.left = false;
    state.move.right = false;

    clearButterflies();
    spawnFrogs();
    centerPlayer();
    updateHud();
    updateHabitatPanel();
    showOnlyScreen(null);
    spawnGoldenButterfly();

    animationId = requestAnimationFrame(gameLoop);
  }

  function quitToStart() {
    state.running = false;
    state.paused = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
    clearButterflies();
    clearFrogs();
    state.score = 0;
    state.helperScore = 0;
    state.helperCapToastShown = false;
    state.goldenButterflySpawned = false;
    state.goldenButterflyCaught = false;
    state.timeLeft = GAME_DURATION;
    updateHud();
    updateHabitatPanel();
    toggleStartSettings(false);
    toggleShop(false);
    toggleRulesPopup(false);
    toggleCoinTopupPopup(false);
    toggleFoodEmptyPopup(false);
    showOnlyScreen("start");
  }

  function finishGame() {
    state.running = false;
    state.paused = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
    clearFrogs();

    const playType = getPlayTypeConfig();
    const targetScore = getTargetScore();
    const helperCap = getHelperMaxScoreContribution();
    const teamMode = state.playType === "team";
    const win = state.score >= targetScore;
    state.bestScore = Math.max(state.bestScore, state.score);
    const personalityBefore = getPersonalityStageForLevel(state.level);
    const levelRules = getRulesGameForLevel(state.level);
    const levelPrize = levelRules.game.prize;
    const stagePrize = levelRules.stageEndsOnWin ? levelRules.stage.passPrize : null;
    const totalPrize = sumPrizeBundles(levelPrize, stagePrize);
    const levelPrizeText = formatPrizeBundle(levelPrize);
    const totalPrizeText = formatPrizeBundle(totalPrize);

    let newlyUnlocked;
    let evolutionTrigger = null;
    let personalityAfter = personalityBefore;
    let stageBonusHelperUnlock = "";
    let stageBonusMedalName = "";
    if (win) {
      applyPrizeBundle(levelPrize);
      if (stagePrize) {
        applyPrizeBundle(stagePrize);
        stageBonusHelperUnlock = state.language === "es"
          ? (stagePrize.helperUnlockEs || "")
          : (stagePrize.helperUnlockEn || "");
        stageBonusMedalName = state.language === "es"
          ? (stagePrize.medalNameEs || "")
          : (stagePrize.medalNameEn || "");
      }
      const before = new Set(state.unlockedSkins);
      state.highestCleared = Math.max(state.highestCleared, state.level);
      refreshUnlockedSkins();
      newlyUnlocked = [...state.unlockedSkins].find((id) => !before.has(id));

      state.level += 1;
      if (state.level < 1) state.level = 1;
      personalityAfter = getPersonalityStageForLevel(state.level);
      if (
        personalityAfter.stageId !== personalityBefore.stageId ||
        personalityAfter.isLegend !== personalityBefore.isLegend
      ) {
        state.neglectSpeechIndex = 0;
        state.neglectSpeechNextAt = 0;
      }
      if (personalityAfter.stageId !== personalityBefore.stageId) {
        evolutionTrigger = {
          before: personalityBefore,
          after: personalityAfter
        };
        showToast(`New personality: ${personalityAfter.name}`);
      } else if (!personalityBefore.isLegend && personalityAfter.isLegend) {
        evolutionTrigger = {
          before: personalityBefore,
          after: personalityAfter
        };
        showToast("Legend personality unlocked.");
      }
    }

    // Keep top HUD in sync with rewards and new level immediately after level resolution.
    updateHud();
    saveSettings();
    populateSkinSelects();

    ui.resultScreen.classList.toggle("result-win", win);
    ui.resultScreen.classList.toggle("result-loss", !win);
    ui.resultTitle.textContent = win
      ? (state.language === "es" ? "¡Nivel Completado!" : "Level Complete!")
      : (state.language === "es" ? "Tiempo Terminado" : "Time Up");
    ui.resultMessage.textContent = win
      ? `${state.language === "es" ? "Premio" : "Reward"}: ${levelPrizeText}.`
      : (teamMode
        ? (state.language === "es"
          ? `Tu equipo atrapo ${state.score}. Lleguen a ${targetScore} para ganar este nivel.`
          : `Your team caught ${state.score}. Reach ${targetScore} to win this level.`)
        : (state.language === "es"
          ? `Atrapaste ${state.score}. Llega a ${targetScore} para ganar este nivel.`
          : `You caught ${state.score}. Reach ${targetScore} to win this level.`));
    if (ui.resultUnlockLine) {
      ui.resultUnlockLine.textContent = win
        ? (state.language === "es"
          ? `Ruta ${getDisplayLevel()} • Seccion ${getDisplaySection()}/${LEVELS_PER_STAGE} desbloqueada`
          : `Path ${getDisplayLevel()} • Section ${getDisplaySection()}/${LEVELS_PER_STAGE} unlocked`)
        : "";
    }

    if (win && stagePrize) {
      const stageBonusLine = state.language === "es"
        ? ` Bono etapa: ${formatPrizeBundle(stagePrize)}${stageBonusMedalName ? ` • ${stageBonusMedalName}` : ""}${stageBonusHelperUnlock ? ` • Helper: ${stageBonusHelperUnlock}` : ""}.`
        : ` Stage bonus: ${formatPrizeBundle(stagePrize)}${stageBonusMedalName ? ` • ${stageBonusMedalName}` : ""}${stageBonusHelperUnlock ? ` • Helper: ${stageBonusHelperUnlock}` : ""}.`;
      if (ui.resultUnlockLine) {
        ui.resultUnlockLine.textContent += stageBonusLine;
      } else {
        ui.resultMessage.textContent += stageBonusLine;
      }
    }

    ui.resultStats.textContent =
      `Best Score: ${state.bestScore} | Next Path: ${getDisplayLevel()}/${PATH_LEVEL_COUNT} | Section: ${getDisplaySection()}/${LEVELS_PER_STAGE} | ${playType.label} | Personality: ${personalityAfter.label} | Food: ${state.foodBalance} | Coins: ${state.coinBalance} | Worms: ${state.wormBank} | Flies: ${state.flyBank} | Medals: ${state.medalCount} | Helper: ${state.helperScore}/${helperCap}`;
    ui.nextLevelBtn.classList.toggle("hidden", !win);
    if (ui.resultMapBtn) {
      ui.resultMapBtn.classList.toggle("hidden", !win);
    }
    if (win) {
      ui.nextLevelBtn.textContent = state.language === "es" ? "Continuar" : "Continue";
      if (ui.resultMapBtn) {
        ui.resultMapBtn.textContent = state.language === "es" ? "Mapa" : "Map";
      }
      ui.restartBtn.textContent = "Play Again";
      ui.restartBtn.classList.add("hidden");
      ui.restartBtn.classList.remove("retry-frog");
      ui.quitBtn.classList.add("hidden");
      ui.quitBtn.classList.remove("quit-frog");
    } else {
      ui.nextLevelBtn.textContent = "Next Level";
      if (ui.resultMapBtn) {
        ui.resultMapBtn.classList.add("hidden");
      }
      ui.restartBtn.classList.remove("hidden");
      ui.restartBtn.innerHTML = `<span class="frog-icon" aria-hidden="true">🐸</span><span class="frog-text">${state.language === "es" ? "Intentar otra vez" : "Try Again"}</span>`;
      ui.restartBtn.classList.add("retry-frog");
      ui.quitBtn.innerHTML = `<span class="frog-icon" aria-hidden="true">🐸</span><span class="frog-text">${state.language === "es" ? "Salir" : "Quit"}</span>`;
      ui.quitBtn.classList.add("quit-frog");
      ui.quitBtn.classList.remove("hidden");
    }

    if (newlyUnlocked && newlyUnlocked !== "default") {
      const skin = getSkinById(newlyUnlocked);
      showToast(`New Skin Unlocked: ${skin.name}!`);
    }

    if (win) playWinSound();
    if (win) showToast(`Level clear reward: ${totalPrizeText}`);
    if (win && stagePrize && stageBonusHelperUnlock) {
      showToast(`Stage reward helper: ${stageBonusHelperUnlock}`);
    }
    updateHabitatPanel();
    showOnlyScreen("result");
    if (evolutionTrigger) {
      showEvolutionCeremony(evolutionTrigger.before, evolutionTrigger.after);
    }
  }

  function pauseGame() {
    if (!state.running) return;
    state.paused = true;
    showOnlyScreen("pause");
  }

  function resumeGame() {
    state.paused = false;
    showOnlyScreen(null);
  }

  function gameLoop(timestamp) {
    if (!state.running) {
      animationId = 0;
      return;
    }

    if (!state.lastFrameTime) {
      state.lastFrameTime = timestamp;
    }

    const dt = Math.min(0.05, (timestamp - state.lastFrameTime) / 1000);
    state.lastFrameTime = timestamp;

    if (!state.paused) {
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateHud();
        finishGame();
        return;
      }

      state.spawnAccumulator += dt * 1000;
      const interval = getSpawnInterval();
      while (state.spawnAccumulator >= interval) {
        spawnButterfly();
        state.spawnAccumulator -= interval;
      }

      updateButterflies(dt);
      updateFrogs(dt);
      updateHud();
    }

    animationId = requestAnimationFrame(gameLoop);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    ui.unlockToast.textContent = message;
    ui.unlockToast.classList.remove("hidden");
    toastTimer = window.setTimeout(() => {
      ui.unlockToast.classList.add("hidden");
    }, 2300);
  }

  function ensureEvolutionUi() {
    if (ui.evolutionCeremony && ui.evolutionCard && ui.evolutionTitle && ui.evolutionText) {
      return;
    }

    const appRoot = document.querySelector(".app") || document.body;
    let ceremony = document.getElementById("evolutionCeremony");
    if (!ceremony) {
      ceremony = document.createElement("section");
      ceremony.id = "evolutionCeremony";
      ceremony.className = "evolution-ceremony hidden";
      ceremony.setAttribute("aria-live", "assertive");
      ceremony.setAttribute("aria-label", "Evolution ceremony");
      ceremony.innerHTML = [
        '<div id="evolutionCard" class="evolution-card">',
        '  <p class="evolution-kicker">Evolution</p>',
        '  <h2 id="evolutionTitle">Sapito evolved!</h2>',
        '  <p id="evolutionText">New personality unlocked.</p>',
        "</div>"
      ].join("\n");
      appRoot.appendChild(ceremony);
    }

    const card = ceremony.querySelector("#evolutionCard");
    const title = ceremony.querySelector("#evolutionTitle");
    const text = ceremony.querySelector("#evolutionText");
    if (!card || !title || !text) return;

    // Inline fallback in case browser is using a stale cached CSS file.
    ceremony.style.position = "absolute";
    ceremony.style.inset = "0";
    ceremony.style.zIndex = "20";
    ceremony.style.display = "grid";
    ceremony.style.placeItems = "center";
    ceremony.style.padding = "16px";
    ceremony.style.pointerEvents = "none";
    ceremony.style.background = "rgba(7, 12, 22, 0.42)";

    card.style.width = "min(560px, 90vw)";
    card.style.borderRadius = "22px";
    card.style.border = "4px solid #1c2038";
    card.style.background = "linear-gradient(180deg, #fff3b5 0%, #ffd469 55%, #ffb42f 100%)";
    card.style.color = "#1e1236";
    card.style.padding = "22px 22px 20px";
    card.style.textAlign = "center";
    card.style.boxShadow = "0 14px 38px rgba(0, 0, 0, 0.35)";

    ui.evolutionCeremony = ceremony;
    ui.evolutionCard = card;
    ui.evolutionTitle = title;
    ui.evolutionText = text;
  }

  function clearEvolutionCeremony() {
    if (!ui.evolutionCeremony) return;
    if (evolutionTimer) {
      clearTimeout(evolutionTimer);
      evolutionTimer = 0;
    }
    ui.evolutionCeremony.classList.add("hidden");
    ui.evolutionCeremony.classList.remove("legend");
  }

  function playEvolutionSound(stageId, isLegend) {
    if (!state.soundOn) return;
    const base = 420 + stageId * 36;
    const volume = isLegend ? 0.022 : 0.018;
    playTone(base, 120, volume);
    setTimeout(() => playTone(base + 140, 130, volume), 140);
    setTimeout(() => playTone(base + 260, 145, volume + 0.002), 300);
    if (isLegend) {
      setTimeout(() => playTone(base + 370, 190, volume + 0.003), 480);
    }
  }

  function showEvolutionCeremony(beforePersonality, afterPersonality) {
    if (!ui.evolutionCeremony || !ui.evolutionTitle || !ui.evolutionText) return;
    clearEvolutionCeremony();

    const levelText = `Path ${getDisplayLevel()}/${PATH_LEVEL_COUNT} • Section ${getDisplaySection()}/${LEVELS_PER_STAGE}`;
    const title = afterPersonality.isLegend
      ? "Legend Personality Unlocked!"
      : `Stage ${afterPersonality.stageId} Evolution!`;
    const text = afterPersonality.isLegend
      ? `${afterPersonality.name} ahora es leyenda. / ${afterPersonality.name} is now legend. (${levelText})`
      : `${beforePersonality.name} -> ${afterPersonality.name}. (${levelText})`;

    ui.evolutionTitle.textContent = title;
    ui.evolutionText.textContent = text;
    ui.evolutionCeremony.classList.toggle("legend", !!afterPersonality.isLegend);
    ui.evolutionCeremony.classList.remove("hidden");

    playEvolutionSound(afterPersonality.stageId, afterPersonality.isLegend);

    const duration = state.reduceMotion ? 1700 : 2500;
    evolutionTimer = window.setTimeout(() => {
      clearEvolutionCeremony();
    }, duration);
  }

  function ensureAudioContext() {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        audioContext = new Ctx();
      }
    }
    return audioContext;
  }

  function playTone(freq, durationMs, volume = 0.02) {
    if (!state.soundOn) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  function playSquashSound() {
    if (!state.soundOn) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    // Some browsers keep the context suspended until a user gesture.
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Low "plop" body.
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = "sine";
    bodyOsc.frequency.setValueAtTime(190, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(85, now + 0.09);

    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.11);

    // Short noisy top layer for the "squish/squash" texture.
    const noiseDuration = 0.065;
    const bufferSize = Math.floor(ctx.sampleRate * noiseDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.9;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(850, now);
    noiseFilter.Q.value = 0.7;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.022, now + 0.008);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + noiseDuration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + noiseDuration);
  }

  function playCatchSound() {
    playSquashSound();
  }

  function playWinSound() {
    playTone(620, 130, 0.016);
    setTimeout(() => playTone(780, 130, 0.016), 150);
    setTimeout(() => playTone(980, 150, 0.017), 300);
  }

  function setMove(dir, pressed) {
    state.move[dir] = pressed;
  }

  function handleKey(event, pressed) {
    const key = event.key.toLowerCase();
    const map = {
      arrowup: "up",
      w: "up",
      arrowdown: "down",
      s: "down",
      arrowleft: "left",
      a: "left",
      arrowright: "right",
      d: "right"
    };

    const dir = map[key];
    if (!dir) return;
    event.preventDefault();
    setMove(dir, pressed);
  }

  function setupInput() {
    window.addEventListener("keydown", (event) => handleKey(event, true));
    window.addEventListener("keyup", (event) => handleKey(event, false));

    ui.mobileControls.forEach((btn) => {
      const dir = btn.dataset.dir;
      const start = (event) => {
        event.preventDefault();
        btn.classList.add("active");
        setMove(dir, true);
      };
      const end = (event) => {
        event.preventDefault();
        btn.classList.remove("active");
        setMove(dir, false);
      };

      btn.addEventListener("pointerdown", start);
      btn.addEventListener("pointerup", end);
      btn.addEventListener("pointercancel", end);
      btn.addEventListener("pointerleave", end);
    });
  }

  function attachUiEvents() {
    if (ui.homeScene || ui.homeSapito || ui.startScreen) {
      const handleHomeSceneTap = (event) => {
        if (shouldIgnoreHomeTap(event)) return;
        syncNeglectAmbientSound();
        if (event.type === "touchstart") {
          event.preventDefault();
        }
        const point = getEventClientPoint(event);
        jumpHomeSapito(point?.x, point?.y);
      };

      [ui.startScreen, ui.homeScene, ui.homeSapito].forEach((el) => {
        if (!el) return;
        el.addEventListener("pointerdown", handleHomeSceneTap);
        el.addEventListener("mousedown", handleHomeSceneTap);
        el.addEventListener("click", handleHomeSceneTap);
        el.addEventListener("touchstart", handleHomeSceneTap, { passive: false });
      });

      // Capture-phase fallback so taps still work even if another layer intercepts bubbling.
      window.addEventListener("pointerdown", handleHomeSceneTap, true);
      window.addEventListener("mousedown", handleHomeSceneTap, true);
      window.addEventListener("click", handleHomeSceneTap, true);
      window.addEventListener("touchstart", handleHomeSceneTap, { passive: false, capture: true });
    }

    ui.settingsToggleBtn.addEventListener("click", () => toggleStartSettings());
    ui.closeSettingsBtn.addEventListener("click", () => toggleStartSettings(false));
    if (ui.homeShopBtn) {
      ui.homeShopBtn.addEventListener("click", () => toggleShop());
    }
    if (ui.homeCoinBtn) {
      ui.homeCoinBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        openShopForCoinTopUp();
      });
    }
    if (ui.coinTopupCloseBtn) {
      ui.coinTopupCloseBtn.addEventListener("click", () => toggleCoinTopupPopup(false));
    }
    if (ui.coinTopupPopup) {
      ui.coinTopupPopup.addEventListener("click", (event) => {
        if (event.target === ui.coinTopupPopup) {
          toggleCoinTopupPopup(false);
        }
      });
    }
    if (ui.coinTopupLegalBtn) {
      ui.coinTopupLegalBtn.addEventListener("click", () => toggleLegalPopup(true));
    }
    if (ui.coinTopupStoreLink) {
      ui.coinTopupStoreLink.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openDiscordStore();
      });
    }
    if (ui.openFoodMarketBtn) {
      ui.openFoodMarketBtn.addEventListener("click", () => {
        toggleFoodMarketPopup(true);
      });
    }
    if (ui.foodMarketCloseBtn) {
      ui.foodMarketCloseBtn.addEventListener("click", () => toggleFoodMarketPopup(false));
    }
    if (ui.foodMarketPopup) {
      ui.foodMarketPopup.addEventListener("click", (event) => {
        if (event.target === ui.foodMarketPopup) {
          toggleFoodMarketPopup(false);
        }
      });
    }
    if (ui.foodMarketBuyCoinsBtn) {
      ui.foodMarketBuyCoinsBtn.addEventListener("click", () => {
        toggleCoinTopupPopup(true);
      });
    }
    if (ui.buyFoodMix50Btn) {
      ui.buyFoodMix50Btn.addEventListener("click", () => buyFoodMarketPack("butterflies"));
    }
    if (ui.buyFoodWorm50Btn) {
      ui.buyFoodWorm50Btn.addEventListener("click", () => buyFoodMarketPack("worms"));
    }
    if (ui.buyFoodFly50Btn) {
      ui.buyFoodFly50Btn.addEventListener("click", () => buyFoodMarketPack("flies"));
    }
    if (ui.homeFoodBtn) {
      ui.homeFoodBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        releaseFoodForSapito();
      });
    }
    if (ui.foodEmptyBuyBtn) {
      ui.foodEmptyBuyBtn.addEventListener("click", () => {
        toggleFoodEmptyPopup(false);
        openShopForFoodPurchase();
        toggleFoodMarketPopup(true);
      });
    }
    if (ui.foodEmptyPlayBtn) {
      ui.foodEmptyPlayBtn.addEventListener("click", () => {
        toggleFoodEmptyPopup(false);
        startGameFromHome();
      });
    }
    if (ui.foodEmptyShopBtn) {
      ui.foodEmptyShopBtn.addEventListener("click", () => {
        toggleFoodEmptyPopup(false);
        openShopForFoodPurchase();
      });
    }
    if (ui.foodEmptyCloseBtn) {
      ui.foodEmptyCloseBtn.addEventListener("click", () => toggleFoodEmptyPopup(false));
    }
    if (ui.foodEmptyPopup) {
      ui.foodEmptyPopup.addEventListener("click", (event) => {
        if (event.target === ui.foodEmptyPopup) {
          toggleFoodEmptyPopup(false);
        }
      });
    }
    if (ui.openShopFromSettingsBtn) {
      ui.openShopFromSettingsBtn.addEventListener("click", () => toggleShop(true));
    }
    if (ui.openRulesBtn) {
      ui.openRulesBtn.addEventListener("click", () => toggleRulesPopup(true));
    }
    if (ui.openLegalBtn) {
      ui.openLegalBtn.addEventListener("click", () => toggleLegalPopup(true));
    }
    if (ui.closeRulesBtn) {
      ui.closeRulesBtn.addEventListener("click", () => toggleRulesPopup(false));
    }
    if (ui.rulesPopup) {
      ui.rulesPopup.addEventListener("click", (event) => {
        if (event.target === ui.rulesPopup) {
          toggleRulesPopup(false);
        }
      });
    }
    if (ui.closeLegalBtn) {
      ui.closeLegalBtn.addEventListener("click", () => toggleLegalPopup(false));
    }
    if (ui.legalPopup) {
      ui.legalPopup.addEventListener("click", (event) => {
        if (event.target === ui.legalPopup) {
          toggleLegalPopup(false);
        }
      });
    }
    if (ui.roadMapBtn) {
      ui.roadMapBtn.addEventListener("click", () => toggleRoadMapPopup(true));
    }
    if (ui.closeRoadMapBtn) {
      ui.closeRoadMapBtn.addEventListener("click", () => toggleRoadMapPopup(false));
    }
    if (ui.roadMapPopup) {
      ui.roadMapPopup.addEventListener("click", (event) => {
        if (event.target === ui.roadMapPopup) {
          toggleRoadMapPopup(false);
        }
      });
    }
    if (ui.closeShopBtn) {
      ui.closeShopBtn.addEventListener("click", () => toggleShop(false));
    }
    if (ui.openPuzzleCatalogBtn) {
      ui.openPuzzleCatalogBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePuzzleQuickPopup(true);
      });
    }
    if (ui.closePuzzleQuickBtn) {
      ui.closePuzzleQuickBtn.addEventListener("click", () => togglePuzzleQuickPopup(false));
    }
    if (ui.puzzleQuickPopup) {
      ui.puzzleQuickPopup.addEventListener("click", (event) => {
        if (event.target === ui.puzzleQuickPopup) {
          togglePuzzleQuickPopup(false);
        }
      });
    }
    if (ui.openHabitatViewBtn) {
      ui.openHabitatViewBtn.addEventListener("click", () => {
        toggleHabitatViewPopup(true);
      });
    }
    if (ui.openPuzzleCatalogFromQuickBtn) {
      ui.openPuzzleCatalogFromQuickBtn.addEventListener("click", () => {
        togglePuzzleCatalogPopup(true);
      });
    }
    if (ui.closeHabitatViewBtn) {
      ui.closeHabitatViewBtn.addEventListener("click", () => toggleHabitatViewPopup(false));
    }
    if (ui.habitatViewPopup) {
      ui.habitatViewPopup.addEventListener("click", (event) => {
        if (event.target === ui.habitatViewPopup) {
          toggleHabitatViewPopup(false);
        }
      });
    }
    if (ui.closePuzzleCatalogBtn) {
      ui.closePuzzleCatalogBtn.addEventListener("click", () => togglePuzzleCatalogPopup(false));
    }
    if (ui.puzzleCatalogPopup) {
      ui.puzzleCatalogPopup.addEventListener("click", (event) => {
        if (event.target === ui.puzzleCatalogPopup) {
          togglePuzzleCatalogPopup(false);
        }
      });
    }
    if (ui.closePuzzlePiecePreviewBtn) {
      ui.closePuzzlePiecePreviewBtn.addEventListener("click", () => togglePuzzlePiecePreviewPopup(false));
    }
    if (ui.puzzlePiecePreviewPopup) {
      ui.puzzlePiecePreviewPopup.addEventListener("click", (event) => {
        if (event.target === ui.puzzlePiecePreviewPopup) {
          togglePuzzlePiecePreviewPopup(false);
        }
      });
    }
    if (ui.puzzlePiecePreviewBuyBtn) {
      ui.puzzlePiecePreviewBuyBtn.addEventListener("click", () => {
        const pieceId = state.activePuzzlePieceId;
        if (!pieceId) return;
        buyDecor(pieceId);
        renderPuzzleCatalog();
        updatePuzzlePiecePreviewCard();
      });
    }
    if (ui.shopScrollDownBtn) {
      ui.shopScrollDownBtn.addEventListener("click", scrollShopByButton);
    }
    if (ui.shopSheet) {
      ui.shopSheet.addEventListener("scroll", updateShopScrollButton, { passive: true });
    }

    ui.startBtn.addEventListener("click", startGameFromHome);

    ui.pauseBtn.addEventListener("click", () => {
      if (state.running && !state.paused) pauseGame();
    });

    ui.resumeBtn.addEventListener("click", resumeGame);
    ui.restartFromPauseBtn.addEventListener("click", startGame);
    if (ui.pauseQuitBtn) {
      ui.pauseQuitBtn.addEventListener("click", quitToStart);
    }
    ui.restartBtn.addEventListener("click", startGame);
    ui.quitBtn.addEventListener("click", quitToStart);
    ui.nextLevelBtn.addEventListener("click", startGame);
    if (ui.resultMapBtn) {
      ui.resultMapBtn.addEventListener("click", () => toggleRoadMapPopup(true));
    }

    ui.skinSelectStart.addEventListener("change", (event) => applySkin(event.target.value));
    ui.skinSelectPause.addEventListener("change", (event) => applySkin(event.target.value));
    if (ui.languageSelect) {
      ui.languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));
    }
    ui.modeSelect.addEventListener("change", (event) => setGameMode(event.target.value));
    ui.playTypeSelect.addEventListener("change", (event) => setPlayType(event.target.value));
    if (ui.buyFoodBtn) {
      ui.buyFoodBtn.addEventListener("click", buyFoodPack);
    }
    if (ui.buyCoinPack1Btn) {
      ui.buyCoinPack1Btn.addEventListener("click", () => buyCoinPack("pack1"));
    }
    if (ui.buyCoinPack2Btn) {
      ui.buyCoinPack2Btn.addEventListener("click", () => buyCoinPack("pack2"));
    }
    if (ui.buyCoinPack5Btn) {
      ui.buyCoinPack5Btn.addEventListener("click", () => buyCoinPack("pack5"));
    }
    if (ui.coinTopupPack1Btn) {
      ui.coinTopupPack1Btn.addEventListener("click", () => buyCoinPack("pack1"));
    }
    if (ui.coinTopupPack2Btn) {
      ui.coinTopupPack2Btn.addEventListener("click", () => buyCoinPack("pack2"));
    }
    if (ui.coinTopupPack5Btn) {
      ui.coinTopupPack5Btn.addEventListener("click", () => buyCoinPack("pack5"));
    }
    ui.buySkinBtn.addEventListener("click", buyNextSkin);
    if (ui.catalogBuyFoodBtn) {
      ui.catalogBuyFoodBtn.addEventListener("click", buyFoodPack);
    }
    if (ui.catalogBuyThemeBtn) {
      ui.catalogBuyThemeBtn.addEventListener("click", buyNextSkin);
    }
    if (ui.sapitoColorSelect) {
      ui.sapitoColorSelect.addEventListener("change", (event) => setSapitoColor(event.target.value));
    }
    if (ui.sapitoTattooSelect) {
      ui.sapitoTattooSelect.addEventListener("change", (event) => setSapitoTattoo(event.target.value));
    }
    if (ui.buyColorSkinBtn) {
      ui.buyColorSkinBtn.addEventListener("click", buyNextColorSkin);
    }
    if (ui.buyTattooBtn) {
      ui.buyTattooBtn.addEventListener("click", buyNextTattoo);
    }
    if (ui.catalogBuyColorBtn) {
      ui.catalogBuyColorBtn.addEventListener("click", buyNextColorSkin);
    }
    if (ui.catalogBuyTattooBtn) {
      ui.catalogBuyTattooBtn.addEventListener("click", buyNextTattoo);
    }
    DECOR_ORDER.forEach((id) => {
      const item = DECOR_ITEMS[id];
      if (!item) return;
      [item.legacyBuyButtonId, item.catalogButtonId].forEach((buttonId) => {
        if (!buttonId) return;
        const button = document.getElementById(buttonId);
        if (!button) return;
        button.addEventListener("click", () => buyDecor(id));
      });
    });

    ui.soundToggle.addEventListener("change", (event) => setSound(event.target.checked));
    ui.soundTogglePause.addEventListener("change", (event) => setSound(event.target.checked));

    ui.motionToggle.addEventListener("change", (event) => setReduceMotion(event.target.checked));
    ui.motionTogglePause.addEventListener("change", (event) => setReduceMotion(event.target.checked));

    window.addEventListener("resize", clampPlayerToArea);
    window.addEventListener("resize", positionHomeSapitoAtCenter);
    window.addEventListener("resize", renderHomeDecor);
    window.addEventListener("resize", () => {
      ensureHomeLayerLayout();
      scatterHomeItemsAcrossScene(true);
      updateShopScrollButton();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (state.roadMapOpen) {
          toggleRoadMapPopup(false);
        } else if (state.legalOpen) {
          toggleLegalPopup(false);
        } else if (state.foodMarketOpen) {
          toggleFoodMarketPopup(false);
        } else if (state.foodEmptyOpen) {
          toggleFoodEmptyPopup(false);
        } else if (state.coinTopupOpen) {
          toggleCoinTopupPopup(false);
        } else if (state.rulesOpen) {
          toggleRulesPopup(false);
        } else if (state.habitatViewOpen) {
          toggleHabitatViewPopup(false);
        } else if (state.puzzleQuickOpen) {
          togglePuzzleQuickPopup(false);
        } else if (state.puzzlePiecePreviewOpen) {
          togglePuzzlePiecePreviewPopup(false);
        } else if (state.puzzleCatalogOpen) {
          togglePuzzleCatalogPopup(false);
        } else if (state.shopOpen) {
          toggleShop(false);
        } else if (state.settingsOpen) {
          toggleStartSettings(false);
        }
      }
      if (!QA_MODE || !event.shiftKey) return;
      if (event.key === "F9") {
        event.preventDefault();
        forceQaResult(false);
      } else if (event.key === "F10") {
        event.preventDefault();
        forceQaResult(true);
      }
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function randBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function resetProgressIfRequested() {
    if (!URL_QUERY.has("reset")) return false;
    Object.values(STORAGE).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        // Ignore storage issues and continue reset best-effort.
      }
    });
    if (window.history && typeof window.history.replaceState === "function") {
      const cleanUrl = `${window.location.pathname}${URL_QUERY.has("qa") ? "?qa=1" : ""}`;
      window.history.replaceState({}, "", cleanUrl);
    }
    return true;
  }

  async function boot() {
    const resetApplied = resetProgressIfRequested();
    document.body.classList.add("discord-activity");
    ensureQaPanel();
    ensureScrollNudgeControls();
    ensureEvolutionUi();
    loadSettings();
    await loadCoinPaymentConfig();
    processCoinPaymentReturn();
    applyDailyFeedingDecay();
    applyNeglectStage(true);
    refreshUnlockedSkins();
    populateSkinSelects();

    setGameMode(state.mode);
    setPlayType(state.playType);
    setLanguage(state.language);
    setSound(state.soundOn);
    setReduceMotion(state.reduceMotion);

    applySkin(state.selectedSkin);

    updateHud();
    updateHabitatPanel();
    toggleStartSettings(false);
    toggleShop(false);
    if (state.dailyFeedMessage) {
      showToast(state.dailyFeedMessage);
    } else if (resetApplied) {
      showToast(state.language === "es" ? "Juego reiniciado desde cero." : "Game reset from scratch.");
    }

    setupInput();
    attachUiEvents();

    if (!neglectTickerId) {
      neglectTickerId = window.setInterval(() => {
        applyNeglectStage();
      }, 60000);
    }

    showOnlyScreen("start");
    requestAnimationFrame(centerPlayer);
  }

  boot();
})();
