/* ==========================================
   DATA/MAPS.JS - Map Data
   ========================================== */

const MapDB = {
    // ===== TILE TYPES =====
    TILES: {
        GRASS: 0, WATER: 1, SAND: 2, STONE: 3, TREE: 4,
        BUILDING: 5, ROAD: 6, CLIFF: 7, PORTAL: 8,
        SPAWN: 9, NPC_ZONE: 10, BATTLE_ZONE: 11, CHEST: 12,
        FLOWER: 13, BUSH: 14, MOUNTAIN: 15
    },

    // Tile colors for rendering
    TILE_COLORS: {
        0: '#4A7C3F',  // Grass
        1: '#2980B9',  // Water
        2: '#C8A84B',  // Sand
        3: '#7F8C8D',  // Stone
        4: '#2C5E1A',  // Tree (dark green)
        5: '#95A5A6',  // Building
        6: '#BDC3C7',  // Road
        7: '#6D4C41',  // Cliff
        8: '#E74C3C',  // Portal (red glow)
        9: '#F1C40F',  // Spawn (yellow)
        10: '#E67E22', // NPC Zone (orange)
        11: '#E74C3C', // Battle Zone (red)
        12: '#FFD700', // Chest
        13: '#FF69B4', // Flower
        14: '#228B22', // Bush
        15: '#808080'  // Mountain
    },

    // Tile passability
    PASSABLE: [0, 2, 6, 9, 8, 10, 11, 13],

    // ===== MAPS =====
    'east_city': {
        id: 'east_city',
        name: 'Thị Trấn Phương Đông',
        bgm: 'east_city_theme',
        width: 30, height: 22,
        playerSpawn: { x: 14, y: 11 },
        portals: [
            { x: 0, y: 10, targetMap: 'west_city', targetX: 28, targetY: 10, name: 'Thành Phố Tây' },
            { x: 29, y: 10, targetMap: 'forest', targetX: 1, targetY: 8, name: 'Vào Rừng' },
            { x: 14, y: 0, targetMap: 'rr_base', targetX: 14, targetY: 20, name: 'Căn Cứ Quân Đoàn Đỏ' },
            { x: 14, y: 21, targetMap: 'kame_house', targetX: 14, targetY: 1, name: 'Đảo Rùa Kame' },
            { x: 25, y: 5, targetMap: 'home_human', targetX: 8, targetY: 10, name: 'Về Nhà' }
        ],
        monsters: [
            { id: 'small_frog', spawnX: 25, spawnY: 15, respawnTime: 30000 },
            { id: 'wild_rabbit', spawnX: 22, spawnY: 5, respawnTime: 25000 },
            { id: 'small_dino', spawnX: 8, spawnY: 3, respawnTime: 35000 }
        ],
        npcs: ['krillin_npc', 'item_shop_npc', 'quest_girl'],
        // Grid map (30x22)
        grid: (() => {
            const G = 0, W = 1, S = 3, TR = 4, B = 5, R = 6, P = 8, SP = 9, FL = 13;
            return [
                [TR,TR,TR,TR,TR,TR,TR,TR,P ,TR,TR,TR,TR,TR,P ,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR],
                [TR,G ,G ,G ,G ,TR,TR,G ,G ,G ,G ,TR,TR,TR,G ,G ,G ,G ,G ,TR,TR,TR,TR,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,B ,B ,G ,TR,G ,G ,B ,B ,G ,G ,TR,TR,G ,B ,B ,G ,G ,G ,TR,TR,G ,G ,B ,B ,G ,G ,G ,TR],
                [TR,G ,B ,B ,G ,G ,G ,G ,B ,B ,G ,G ,G ,G ,G ,B ,B ,G ,G ,G ,G ,G ,G ,G ,B ,B ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,P ,G ,G ,G ,TR],
                [P ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,P ],
                [TR,G ,G ,G ,G ,FL,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,FL,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,FL,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,FL,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [P ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,SP,SP,SP,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,P ],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,W ,W ,G ,SP,G ,SP,G ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,W ,W ,W ,W ,G ,G ,G ,W ,W ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,W ,W ,W ,W ,W ,W ,W ,W ,W ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,W ,W ,W ,W ,W ,W ,W ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [P ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,R ,P ],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,B ,B ,G ,G ,G ,G ,B ,B ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,B ,B ,G ,G ,G ,TR],
                [TR,G ,B ,B ,G ,TR,G ,G ,B ,B ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,B ,B ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,TR,TR,G ,G ,G ,G ,TR,TR,TR,G ,G ,G ,G ,TR,TR,TR,TR,TR,TR,G ,G ,G ,G ,G ,TR],
                [TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,P ,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR]
            ];
        })()
    },

    'forest': {
        id: 'forest',
        name: 'Khu Rừng Phía Đông',
        bgm: 'forest_theme',
        width: 30, height: 22,
        playerSpawn: { x: 1, y: 8 },
        portals: [
            { x: 0, y: 8, targetMap: 'east_city', targetX: 28, targetY: 10, name: 'Quay Về Thị Trấn' },
            { x: 29, y: 10, targetMap: 'desert', targetX: 1, targetY: 10, name: 'Sa Mạc' },
            { x: 14, y: 0, targetMap: 'rr_base', targetX: 14, targetY: 19, name: 'Căn Cứ Quân Đoàn Đỏ' }
        ],
        monsters: [
            { id: 'forest_wolf', spawnX: 8, spawnY: 5, respawnTime: 25000 },
            { id: 'forest_wolf', spawnX: 20, spawnY: 8, respawnTime: 25000 },
            { id: 'forest_bear', spawnX: 15, spawnY: 15, respawnTime: 40000 },
            { id: 'wood_imp', spawnX: 25, spawnY: 12, respawnTime: 30000 }
        ],
        npcs: ['forest_hermit'],
        grid: (() => {
            const G = 0, W = 1, B = 5, TR = 4, R = 6, P = 8, BU = 14, FL = 13;
            const row = (arr) => arr;
            return [
                [TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,P ,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR],
                [TR,G ,G ,G ,TR,TR,TR,G ,G ,G ,G ,TR,TR,TR,G ,G ,G ,G ,TR,TR,TR,TR,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,BU,G ,TR,G ,G ,G ,BU,G ,G ,G ,TR,G ,G ,BU,G ,G ,G ,TR,TR,G ,G ,BU,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,TR,TR,G ,G ,G ,G ,TR,TR,TR,G ,G ,G ,G ,TR,TR,TR,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,TR,TR,TR,TR,G ,G ,TR,TR,TR,TR,TR,G ,G ,G ,TR,TR,TR,TR,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,TR,TR,TR,TR,G ,G ,TR,TR,TR,TR,TR,G ,G ,G ,TR,TR,TR,TR,G ,G ,G ,G ,G ,G ,TR],
                [P ,R ,R ,R ,R ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,R ,P ],
                [TR,G ,G ,G ,G ,G ,G ,G ,W ,W ,G ,G ,G ,G ,G ,G ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,W ,W ,W ,W ,G ,G ,G ,G ,W ,W ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,P ],
                [TR,G ,G ,G ,G ,G ,G ,G ,W ,W ,G ,G ,G ,G ,G ,G ,W ,W ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,FL,G ,G ,G ,G ,G ,G ,G ,FL,G ,G ,G ,G ,G ,FL,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,TR,TR,G ,G ,G ,G ,G ,TR,TR,G ,G ,G ,G ,TR,TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,TR,TR,TR,TR,G ,G ,G ,TR,TR,TR,TR,G ,G ,TR,TR,TR,TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,BU,G ,G ,G ,G ,G ,BU,G ,G ,G ,G ,G ,BU,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,G ,TR],
                [TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR,TR]
            ];
        })()
    },

    'desert': {
        id: 'desert',
        name: 'Sa Mạc Đỏ',
        bgm: 'desert_theme',
        width: 30, height: 22,
        playerSpawn: { x: 1, y: 10 },
        portals: [
            { x: 0, y: 10, targetMap: 'forest', targetX: 28, targetY: 10, name: 'Quay Lại Rừng' },
            { x: 29, y: 10, targetMap: 'namek', targetX: 1, targetY: 10, name: 'Hành Tinh Namek' }
        ],
        monsters: [
            { id: 'sand_snake', spawnX: 10, spawnY: 5, respawnTime: 25000 },
            { id: 'scorpion', spawnX: 20, spawnY: 15, respawnTime: 30000 },
            { id: 'desert_bandit', spawnX: 25, spawnY: 8, respawnTime: 28000 },
            { id: 'desert_bandit', spawnX: 15, spawnY: 18, respawnTime: 28000 }
        ],
        npcs: ['desert_trader'],
        grid: (() => {
            const S = 2, ST = 3, R = 6, P = 8, BM = 15, W = 1;
            return Array.from({ length: 22 }, (_, y) =>
                Array.from({ length: 30 }, (_, x) => {
                    if (x === 0 && y === 10) return P;
                    if (x === 29 && y === 10) return P;
                    if (y === 0 || y === 21 || x === 0 || x === 29) return BM;
                    if (y === 10) return R;
                    if ((x === 8 && y > 5 && y < 16) || (x === 22 && y > 5 && y < 16)) return ST;
                    if (x === 14 && (y === 5 || y === 17)) return W;
                    return S;
                })
            );
        })()
    },

    'namek': {
        id: 'namek',
        name: 'Hành Tinh Namek',
        bgm: 'namek_theme',
        width: 30, height: 22,
        playerSpawn: { x: 1, y: 10 },
        portals: [
            { x: 0, y: 10, targetMap: 'desert', targetX: 28, targetY: 10, name: 'Quay Lại Sa Mạc' },
            { x: 29, y: 10, targetMap: 'cell_arena', targetX: 1, targetY: 10, name: 'Đấu Trường Cell' },
            { x: 10, y: 2, targetMap: 'home_namek', targetX: 8, targetY: 10, name: 'Về Nhà' }
        ],
        monsters: [
            { id: 'namek_tree', spawnX: 10, spawnY: 8, respawnTime: 35000 },
            { id: 'frieza_soldier', spawnX: 20, spawnY: 5, respawnTime: 25000 },
            { id: 'frieza_soldier', spawnX: 25, spawnY: 15, respawnTime: 25000 },
            { id: 'zarbon', spawnX: 15, spawnY: 12, respawnTime: 120000 }
        ],
        npcs: ['guru_npc', 'dende_npc'],
        grid: (() => {
            const G = 0, W = 1, TR = 4, R = 6, P = 8;
            return Array.from({ length: 22 }, (_, y) =>
                Array.from({ length: 30 }, (_, x) => {
                    if (y === 0 || y === 21) return TR;
                    if (x === 0 && y === 10) return P;
                    if (x === 29 && y === 10) return P;
                    if (x === 10 && y === 2) return P;
                    if (y === 10) return R;
                    if ((x === 5 || x === 25) && y > 2 && y < 20) return TR;
                    if ((x === 12 || x === 18) && (y === 5 || y === 16)) return W;
                    return G;
                })
            );
        })()
    },

    'rr_base': {
        id: 'rr_base',
        name: 'Căn Cứ Quân Đoàn Đỏ',
        bgm: 'battle_theme',
        width: 30, height: 22,
        playerSpawn: { x: 14, y: 20 },
        portals: [
            { x: 14, y: 21, targetMap: 'east_city', targetX: 14, targetY: 1, name: 'Quay Lại Thị Trấn' }
        ],
        monsters: [
            { id: 'rr_soldier', spawnX: 8, spawnY: 8, respawnTime: 30000 },
            { id: 'rr_soldier', spawnX: 20, spawnY: 8, respawnTime: 30000 },
            { id: 'rr_soldier', spawnX: 5, spawnY: 15, respawnTime: 30000 },
            { id: 'rr_general', spawnX: 14, spawnY: 5, respawnTime: 180000 }
        ],
        npcs: [],
        grid: (() => {
            const G = 0, B = 5, R = 6, P = 8, ST = 3;
            return Array.from({ length: 22 }, (_, y) =>
                Array.from({ length: 30 }, (_, x) => {
                    if (x === 14 && y === 21) return P;
                    if (y === 0 || y === 21 || x === 0 || x === 29) return ST;
                    if (y === 14) return R;
                    if ((x === 6 || x === 14 || x === 22) && y < 12 && y > 3) return B;
                    return G;
                })
            );
        })()
    },

    'cell_arena': {
        id: 'cell_arena',
        name: 'Đấu Trường Cell',
        bgm: 'boss_theme',
        width: 24, height: 18,
        playerSpawn: { x: 1, y: 9 },
        portals: [
            { x: 0, y: 9, targetMap: 'namek', targetX: 28, targetY: 10, name: 'Quay Lại Namek' },
            { x: 23, y: 9, targetMap: 'majin_realm', targetX: 1, targetY: 9, name: 'Cõi Majin' }
        ],
        monsters: [
            { id: 'cell_jr', spawnX: 7, spawnY: 5, respawnTime: 20000 },
            { id: 'cell_jr', spawnX: 16, spawnY: 5, respawnTime: 20000 },
            { id: 'cell_jr', spawnX: 7, spawnY: 12, respawnTime: 20000 },
            { id: 'cell_jr', spawnX: 16, spawnY: 12, respawnTime: 20000 },
            { id: 'perfect_cell', spawnX: 12, spawnY: 8, respawnTime: 60000 }
        ],
        npcs: [],
        grid: (() => {
            const G = 0, ST = 3, R = 6, P = 8, W = 1;
            return Array.from({ length: 18 }, (_, y) =>
                Array.from({ length: 24 }, (_, x) => {
                    if (x === 0 && y === 9) return P;
                    if (x === 23 && y === 9) return P;
                    if (y === 0 || y === 17 || x === 0 || x === 23) return ST;
                    if (y === 9) return R;
                    if (x > 5 && x < 18 && y > 3 && y < 14) return R; // Sử dụng Road (6) để có thể đi lại trên võ đài
                    return G; // Toàn bộ còn lại là đất đi lại được
                })
            );
        })()
    },

    'majin_realm': {
        id: 'majin_realm',
        name: 'Cõi Majin',
        bgm: 'majin_theme',
        width: 28, height: 20,
        playerSpawn: { x: 1, y: 10 },
        portals: [
            { x: 0, y: 10, targetMap: 'cell_arena', targetX: 22, targetY: 9, name: 'Quay Lại Đấu Trường' },
            { x: 5, y: 5, targetMap: 'home_majin', targetX: 8, targetY: 10, name: 'Về Nhà' }
        ],
        monsters: [
            { id: 'fat_buu', spawnX: 14, spawnY: 5, respawnTime: 300000 },
            { id: 'super_buu', spawnX: 14, spawnY: 15, respawnTime: 600000 }
        ],
        npcs: ['babidi_npc'],
        grid: (() => {
            const G = 0, ST = 3, R = 6, P = 8, BM = 15;
            return Array.from({ length: 20 }, (_, y) =>
                Array.from({ length: 28 }, (_, x) => {
                    if (x === 0 && y === 10) return P;
                    if (y === 0 || y === 19 || x === 0 || x === 27) return BM;
                    if (x === 5 && y === 5) return P;
                    if (y === 10) return R;
                    return G;
                })
            );
        })()
    },

    'west_city': {
        id: 'west_city',
        name: 'Thành Phố Phía Tây',
        bgm: 'city_theme',
        width: 30, height: 22,
        playerSpawn: { x: 28, y: 10 },
        portals: [
            { x: 29, y: 10, targetMap: 'east_city', targetX: 1, targetY: 10, name: 'Thị Trấn Phương Đông' }
        ],
        monsters: [],
        npcs: ['capsule_corp_npc', 'blacksmith_npc', 'west_city_girl'],
        grid: (() => {
            const G = 0, B = 5, R = 6, P = 8, W = 1, TR = 4;
            return Array.from({ length: 22 }, (_, y) =>
                Array.from({ length: 30 }, (_, x) => {
                    if (y === 0 || y === 21 || x === 0) return TR;
                    if (x === 29 && y === 10) return P;
                    if (y === 6 || y === 15) return R;
                    if (x === 6 || x === 14 || x === 22) return R;
                    if (x > 8 && x < 12 && y > 2 && y < 5) return B;
                    if (x > 18 && x < 22 && y > 8 && y < 13) return B;
                    if (x === 14 && y > 7 && y < 14) return W;
                    return G;
                })
            );
        })()
    },

    'kame_house': {
        id: 'kame_house',
        name: 'Đảo Rùa Kame',
        bgm: 'city_theme',
        width: 30, height: 22,
        playerSpawn: { x: 14, y: 6 },
        portals: [
            { x: 14, y: 0, targetMap: 'east_city', targetX: 14, targetY: 20, name: 'Thị Trấn Phương Đông' },
            { x: 14, y: 21, targetMap: 'kami_lookout', targetX: 14, targetY: 1, name: 'Thần Điện' }
        ],
        monsters: [
            { id: 'small_frog', spawnX: 5, spawnY: 15, respawnTime: 20000 },
            { id: 'small_frog', spawnX: 25, spawnY: 15, respawnTime: 20000 }
        ],
        npcs: [],
        grid: (() => {
            const W = 1, S = 2, G = 0, B = 5, P = 8;
            return Array.from({ length: 22 }, (_, y) =>
                Array.from({ length: 30 }, (_, x) => {
                    // Cổng đi
                    if (x === 14 && y === 0) return P;
                    if (x === 14 && y === 21) return P;
                    
                    // Đại dương
                    if (y < 4 || y > 18 || x < 6 || x > 24) return W;
                    // Bãi cát
                    if (y >= 4 && y <= 18 && x >= 6 && x <= 24) {
                        // Nhà Kame (Chính giữa)
                        if (x >= 12 && x <= 16 && y >= 9 && y <= 12) return B;
                        // Một ít cỏ
                        if (x >= 8 && x <= 10 && y >= 10 && y <= 11) return G;
                        return S;
                    }
                    return W;
                })
            );
        })()
    },

    'kami_lookout': {
        id: 'kami_lookout',
        name: 'Thần Điện',
        bgm: 'boss_theme',
        width: 30, height: 22,
        playerSpawn: { x: 14, y: 18 },
        portals: [
            { x: 14, y: 0, targetMap: 'kame_house', targetX: 14, targetY: 20, name: 'Trở Về MặT Đất' }
        ],
        monsters: [],
        npcs: [],
        grid: (() => {
            const S = 3, W = 1, P = 8;
            return Array.from({ length: 22 }, (_, y) =>
                Array.from({ length: 30 }, (_, x) => {
                    if (x === 14 && y === 0) return P;
                    
                    // Nền trời (màu xám / mây) thay thế bằng W tạm
                    if (y < 4 || y > 18 || x < 6 || x > 24) return W;
                    
                    // Sân thần điện
                    return S;
                })
            );
        })()
    },

    // ===== HOME MAPS (Nhà Riêng) =====
    'home_human': {
        id: 'home_human', name: 'Nhà Tại Trái Đất', bgm: 'east_city_theme',
        width: 16, height: 12, playerSpawn: { x: 8, y: 9 },
        portals: [ { x: 8, y: 11, targetMap: 'east_city', targetX: 25, targetY: 5, name: 'Ra Ngoài' } ],
        monsters: [], npcs: ['incubator_npc'],
        grid: (() => {
            const F = 2, W = 5, P = 8;
            return Array.from({length:12}, (_, y) => Array.from({length:16}, (_, x) => {
                if (x === 8 && y === 11) return P;
                if (y === 0 || y === 11 || x === 0 || x === 15) return W;
                return F; // Sàn nhà
            }));
        })()
    },
    'home_namek': {
        id: 'home_namek', name: 'Nhà Tại Namek', bgm: 'namek_theme',
        width: 16, height: 12, playerSpawn: { x: 8, y: 9 },
        portals: [ { x: 8, y: 11, targetMap: 'namek', targetX: 10, targetY: 2, name: 'Ra Ngoài' } ],
        monsters: [], npcs: ['incubator_npc'],
        grid: (() => {
            const F = 0, W = 15, P = 8;
            return Array.from({length:12}, (_, y) => Array.from({length:16}, (_, x) => {
                if (x === 8 && y === 11) return P;
                if (y === 0 || y === 11 || x === 0 || x === 15) return W;
                return F;
            }));
        })()
    },
    'home_majin': {
        id: 'home_majin', name: 'Nhà Tại Xayda / Majin', bgm: 'majin_theme',
        width: 16, height: 12, playerSpawn: { x: 8, y: 9 },
        portals: [ { x: 8, y: 11, targetMap: 'majin_realm', targetX: 5, targetY: 5, name: 'Ra Ngoài' } ],
        monsters: [], npcs: ['incubator_npc'],
        grid: (() => {
            const F = 6, W = 3, P = 8; // Sàn gạch đỏ, tường đá
            return Array.from({length:12}, (_, y) => Array.from({length:16}, (_, x) => {
                if (x === 8 && y === 11) return P;
                if (y === 0 || y === 11 || x === 0 || x === 15) return W;
                return F;
            }));
        })()
    }
};
