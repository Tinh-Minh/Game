/* ==========================================
   DATA/MONSTERS.JS - Monster Database
   ========================================== */

const MonsterDB = {
    // ===== TUTORIAL AREA =====
    'small_frog': {
        id: 'small_frog', name: 'Ếch Xanh', icon: '🐸', sprite: null,
        level: 1, hp: 30, atk: 5, def: 2, spd: 60,
        drops: [
            { id: 'small_hp_pot', chance: 0.3, qty: 1 },
            { id: 'zeni_bag', chance: 0.15, qty: 1 }
        ],
        zeni: [5, 15],
        exp: 8,
        desc: 'Con ếch nhỏ bé vô hại. Mục tiêu luyện tập cho người mới.',
        aggressive: false, mapArea: 'east_city'
    },
    'wild_rabbit': {
        id: 'wild_rabbit', name: 'Thỏ Hoang', icon: '🐰', sprite: null,
        level: 2, hp: 45, atk: 8, def: 3, spd: 90,
        drops: [
            { id: 'small_hp_pot', chance: 0.4, qty: 1 }
        ],
        zeni: [10, 25],
        exp: 12,
        desc: 'Thỏ nhanh nhẹn trong rừng.',
        aggressive: false, mapArea: 'east_city'
    },
    'small_dino': {
        id: 'small_dino', name: 'Khủng Long Tí Hon', icon: '🦎', sprite: null,
        level: 3, hp: 70, atk: 15, def: 5, spd: 70,
        drops: [
            { id: 'small_hp_pot', chance: 0.35, qty: 1 },
            { id: 'cloth_armor', chance: 0.05, qty: 1 }
        ],
        zeni: [20, 40],
        exp: 20,
        desc: 'Loài khủng long nhỏ bé hung dữ.',
        aggressive: true, mapArea: 'east_city'
    },

    // ===== FOREST AREA =====
    'forest_wolf': {
        id: 'forest_wolf', name: 'Sói Rừng', icon: '🐺', sprite: null,
        level: 5, hp: 120, atk: 22, def: 8, spd: 95,
        drops: [
            { id: 'medium_hp_pot', chance: 0.3, qty: 1 },
            { id: 'leather_armor', chance: 0.08, qty: 1 }
        ],
        zeni: [35, 65],
        exp: 40,
        desc: 'Sói rừng hung hãn, đi theo đàn.',
        aggressive: true, mapArea: 'forest'
    },
    'forest_bear': {
        id: 'forest_bear', name: 'Gấu Rừng', icon: '🐻', sprite: null,
        level: 7, hp: 200, atk: 30, def: 15, spd: 60,
        drops: [
            { id: 'medium_hp_pot', chance: 0.5, qty: 2 },
            { id: 'iron_helm', chance: 0.1, qty: 1 }
        ],
        zeni: [60, 100],
        exp: 65,
        desc: 'Gấu to khổng lồ, phòng thủ rất cao.',
        aggressive: true, mapArea: 'forest'
    },
    'wood_imp': {
        id: 'wood_imp', name: 'Yêu Ma Gỗ', icon: '👹', sprite: null,
        level: 8, hp: 160, atk: 35, def: 10, spd: 80,
        drops: [
            { id: 'small_mp_pot', chance: 0.4, qty: 1 },
            { id: 'namekian_staff', chance: 0.05, qty: 1 }
        ],
        zeni: [70, 120],
        exp: 80,
        desc: 'Yêu ma xuất phát từ cây cổ thụ.',
        aggressive: true, mapArea: 'forest'
    },

    // ===== RED RIBBON ARMY =====
    'rr_soldier': {
        id: 'rr_soldier', name: 'Lính Quân Đoàn Đỏ', icon: '💂', sprite: null,
        level: 10, hp: 250, atk: 40, def: 20, spd: 75,
        drops: [
            { id: 'iron_sword', chance: 0.1, qty: 1 },
            { id: 'iron_chest', chance: 0.08, qty: 1 },
            { id: 'medium_hp_pot', chance: 0.4, qty: 2 }
        ],
        zeni: [100, 180],
        exp: 100,
        desc: 'Lính chính quy của Quân Đoàn Đỏ. Được huấn luyện bài bản.',
        aggressive: true, mapArea: 'rr_base'
    },
    'rr_general': {
        id: 'rr_general', name: 'Tướng Quân Đoàn Đỏ', icon: '🎖️', sprite: null,
        level: 15, hp: 500, atk: 70, def: 35, spd: 65,
        drops: [
            { id: 'steel_blade', chance: 0.15, qty: 1 },
            { id: 'iron_chest', chance: 0.2, qty: 1 },
            { id: 'large_hp_pot', chance: 0.5, qty: 2 }
        ],
        zeni: [200, 400],
        exp: 250,
        desc: 'Tướng lĩnh tàn nhẫn của Quân Đoàn Đỏ.',
        aggressive: true, mapArea: 'rr_base',
        isBoss: true
    },

    // ===== DESERT AREA =====
    'sand_snake': {
        id: 'sand_snake', name: 'Rắn Sa Mạc', icon: '🐍', sprite: null,
        level: 12, hp: 280, atk: 45, def: 18, spd: 100,
        drops: [
            { id: 'small_hp_pot', chance: 0.4, qty: 2 },
            { id: 'power_ring', chance: 0.06, qty: 1 }
        ],
        zeni: [90, 160],
        exp: 120,
        desc: 'Rắn sa mạc cực độc, có thể tấn công bất ngờ.',
        aggressive: true, mapArea: 'desert',
        statusEffect: { type: 'poison', chance: 0.25 }
    },
    'scorpion': {
        id: 'scorpion', name: 'Bọ Cạp Khổng Lồ', icon: '🦂', sprite: null,
        level: 14, hp: 350, atk: 55, def: 25, spd: 80,
        drops: [
            { id: 'medium_hp_pot', chance: 0.5, qty: 2 },
            { id: 'iron_chest', chance: 0.08, qty: 1 }
        ],
        zeni: [130, 220],
        exp: 160,
        desc: 'Bọ cạp khổng lồ với nọc cực độc.',
        aggressive: true, mapArea: 'desert',
        statusEffect: { type: 'poison', chance: 0.35 }
    },
    'desert_bandit': {
        id: 'desert_bandit', name: 'Cướp Sa Mạc', icon: '🗡️', sprite: null,
        level: 13, hp: 300, atk: 50, def: 22, spd: 85,
        drops: [
            { id: 'zeni_bag', chance: 0.6, qty: 2 },
            { id: 'steel_blade', chance: 0.08, qty: 1 }
        ],
        zeni: [120, 200],
        exp: 140,
        desc: 'Băng cướp hoạt động trong sa mạc.',
        aggressive: true, mapArea: 'desert'
    },

    // ===== NAMEK AREA =====
    'namek_tree': {
        id: 'namek_tree', name: 'Cây Namek Sống Động', icon: '🌳', sprite: null,
        level: 20, hp: 600, atk: 65, def: 40, spd: 40,
        drops: [
            { id: 'namek_robe', chance: 0.1, qty: 1 },
            { id: 'large_hp_pot', chance: 0.5, qty: 2 }
        ],
        zeni: [200, 350],
        exp: 300,
        desc: 'Cây trên hành tinh Namek đã được linh hồn.',
        aggressive: false, mapArea: 'namek'
    },
    'frieza_soldier': {
        id: 'frieza_soldier', name: 'Lính Của Frieza', icon: '👽', sprite: null,
        level: 22, hp: 700, atk: 80, def: 45, spd: 90,
        drops: [
            { id: 'saiyan_armor', chance: 0.08, qty: 1 },
            { id: 'large_hp_pot', chance: 0.6, qty: 2 }
        ],
        zeni: [250, 450],
        exp: 380,
        desc: 'Chiến binh hung ác trong đội quân Frieza.',
        aggressive: true, mapArea: 'namek'
    },
    'zarbon': {
        id: 'zarbon', name: 'Zarbon', icon: '💜', sprite: null,
        level: 28, hp: 1500, atk: 120, def: 70, spd: 95,
        drops: [
            { id: 'dragon_ball_1', chance: 0.5, qty: 1 },
            { id: 'saiyan_armor', chance: 0.3, qty: 1 }
        ],
        zeni: [800, 1200],
        exp: 1200,
        desc: 'Tướng đẹp trai nhưng nguy hiểm của Frieza. Có thể biến hình.',
        aggressive: true, mapArea: 'namek',
        isBoss: true
    },
    'ginyu_force': {
        id: 'ginyu_force', name: 'Đội Ginyu', icon: '🤺', sprite: null,
        level: 32, hp: 2000, atk: 150, def: 85, spd: 110,
        drops: [
            { id: 'large_hp_pot', chance: 1.0, qty: 5 },
            { id: 'dragon_ball_1', chance: 0.3, qty: 1 }
        ],
        zeni: [1200, 2000],
        exp: 2000,
        desc: 'Thành viên tinh nhuệ của Đội Đặc Nhiệm Ginyu.',
        aggressive: true, mapArea: 'namek',
        isBoss: true
    },

    // ===== CELL AREA =====
    'cell_jr': {
        id: 'cell_jr', name: 'Cell Jr.', icon: '🦟', sprite: null,
        level: 40, hp: 2500, atk: 200, def: 100, spd: 130,
        drops: [
            { id: 'elixir', chance: 0.2, qty: 1 },
            { id: 'rainbow_crystal', chance: 0.15, qty: 1 }
        ],
        zeni: [1500, 2500],
        exp: 3500,
        desc: 'Con của Cell. Nhỏ bé nhưng cực kỳ nguy hiểm.',
        aggressive: true, mapArea: 'cell_arena',
        abilities: ['drain', 'regeneration']
    },
    'perfect_cell': {
        id: 'perfect_cell', name: 'Perfect Cell', icon: '🪲', sprite: null,
        level: 45, hp: 6000, atk: 250, def: 120, spd: 120,
        drops: [
            { id: 'elixir', chance: 0.5, qty: 1 }
        ],
        zeni: [2500, 4500],
        exp: 6500,
        desc: 'Hình thái hoàn hảo của Cell.',
        aggressive: true, mapArea: 'cell_arena',
        isBoss: true
    },
    'super_cell': {
        id: 'super_cell', name: 'Super Perfect Cell', icon: '⚡', sprite: null,
        level: 55, hp: 15000, atk: 350, def: 180, spd: 150,
        drops: [
            { id: 'egg_disciple', chance: 0.3, qty: 1 },
            { id: 'senzu_bean', chance: 1.0, qty: 2 }
        ],
        zeni: [5000, 10000],
        exp: 25000,
        desc: 'Hình thái tột cùng, sức mạnh vượt qua ranh giới sinh mạng.',
        aggressive: true, mapArea: 'cell_arena',
        isBoss: true,
        abilities: ['regeneration', 'kamehameha']
    },

    // ===== MAJIN AREA =====
    'fat_buu': {
        id: 'fat_buu', name: 'Béo Buu', icon: '🫃', sprite: null,
        level: 50, hp: 5000, atk: 280, def: 150, spd: 80,
        drops: [
            { id: 'senzu_bean', chance: 0.3, qty: 2 },
            { id: 'dragon_ball_1', chance: 0.4, qty: 1 },
            { id: 'legendary_sword', chance: 0.05, qty: 1 }
        ],
        zeni: [3000, 5000],
        exp: 8000,
        desc: 'Dạng béo của Majin Buu. Hài hước nhưng cực kỳ mạnh.',
        aggressive: false, mapArea: 'majin_realm',
        isBoss: true,
        abilities: ['regeneration', 'candy_beam']
    },
    'super_buu': {
        id: 'super_buu', name: 'Super Buu', icon: '👿', sprite: null,
        level: 60, hp: 10000, atk: 400, def: 200, spd: 100,
        drops: [
            { id: 'legendary_sword', chance: 0.2, qty: 1 },
            { id: 'dragon_crown', chance: 0.15, qty: 1 },
            { id: 'senzu_bean', chance: 1.0, qty: 3 }
        ],
        zeni: [8000, 15000],
        exp: 20000,
        desc: 'Dạng thuần túy của Majin Buu. Sức mạnh thuộc tầng hoàng đế.',
        aggressive: true, mapArea: 'majin_realm',
        isBoss: true,
        abilities: ['regeneration', 'explosion', 'absorb']
    },

    // Create monster instance
    create(id) {
        const base = MonsterDB[id];
        if (!base || typeof base !== 'object' || !base.id) return null;
        const m = Utils.deepClone(base);
        m.currentHp = m.hp;
        m.maxHp = m.hp;
        m.buffs = [];
        m.debuffs = [];
        m.instanceId = Utils.genId();
        return m;
    },

    // Get monsters for area
    getForArea(mapArea) {
        return Object.values(MonsterDB).filter(m =>
            typeof m === 'object' && m.mapArea === mapArea && !m.isBoss
        );
    },

    // Get bosses for area
    getBossesForArea(mapArea) {
        return Object.values(MonsterDB).filter(m =>
            typeof m === 'object' && m.mapArea === mapArea && m.isBoss
        );
    }
};
