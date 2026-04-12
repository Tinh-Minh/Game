/* ==========================================
   DATA/ITEMS.JS - Item Database
   ========================================== */

const ItemDB = {
    // ===== WEAPONS =====
    'wooden_sword': {
        id: 'wooden_sword', name: 'Kiếm Gỗ', icon: '🗡️', type: 'weapon',
        rarity: 'common', slot: 'weapon',
        stats: { atk: 8, spd: 2 },
        desc: 'Một thanh kiếm đơn giản làm từ gỗ. Phù hợp cho người mới bắt đầu.',
        price: 100, sellPrice: 20,
        levelReq: 1
    },
    'iron_sword': {
        id: 'iron_sword', name: 'Kiếm Sắt', icon: '⚔️', type: 'weapon',
        rarity: 'common', slot: 'weapon',
        stats: { atk: 20, spd: 5 },
        desc: 'Thanh kiếm sắt vững chắc. Đủ mạnh để chiến đấu với quái vật tầm trung.',
        price: 500, sellPrice: 100,
        levelReq: 5
    },
    'steel_blade': {
        id: 'steel_blade', name: 'Lưỡi Thép Xanh', icon: '🔱', type: 'weapon',
        rarity: 'uncommon', slot: 'weapon',
        stats: { atk: 45, spd: 10, crit: 5 },
        desc: 'Thanh kiếm thép xanh sắc bén, có thể chém xuyên giáp nhẹ.',
        price: 2000, sellPrice: 400,
        levelReq: 15
    },
    'power_pole': {
        id: 'power_pole', name: 'Như Ý Gậy', icon: '🥢', type: 'weapon',
        rarity: 'rare', slot: 'weapon',
        stats: { atk: 60, spd: 20, int: 15 },
        desc: 'Chiếc gậy thần kỳ có thể giãn dài vô tận. Trang bị đặc trưng của Son Goku.',
        price: 8000, sellPrice: 1600,
        levelReq: 25
    },
    'katchin_club': {
        id: 'katchin_club', name: 'Gậy Kim Cương', icon: '⚒️', type: 'weapon',
        rarity: 'epic', slot: 'weapon',
        stats: { atk: 120, vit: 20, def: 30 },
        desc: 'Làm từ hợp kim katchin cứng nhất vũ trụ. Sức mạnh đập nát mọi thứ.',
        price: 25000, sellPrice: 5000,
        levelReq: 40
    },
    'namekian_staff': {
        id: 'namekian_staff', name: 'Gậy Namek', icon: '🌿', type: 'weapon',
        rarity: 'uncommon', slot: 'weapon',
        stats: { atk: 30, int: 25, mp: 30 },
        desc: 'Gậy làm từ cây đặc biệt ở hành tinh Namek. Tăng tốc hồi phục.',
        price: 1800, sellPrice: 360,
        levelReq: 12
    },
    'majin_staff': {
        id: 'majin_staff', name: 'Gậy Phép Thuật Majin', icon: '🔮', type: 'weapon',
        rarity: 'rare', slot: 'weapon',
        stats: { atk: 55, int: 40, mp: 50 },
        desc: 'Gậy phép thuật của Majin. Giải phóng năng lượng ma thuật hủy diệt.',
        price: 9000, sellPrice: 1800,
        levelReq: 28
    },
    'legendary_sword': {
        id: 'legendary_sword', name: 'Thánh Kiếm Rồng', icon: '🌟', type: 'weapon',
        rarity: 'legendary', slot: 'weapon',
        stats: { atk: 200, spd: 40, crit: 15, critDmg: 50 },
        desc: 'Thanh kiếm được rèn từ vảy rồng thần. Sức mạnh vượt qua mọi giới hạn.',
        price: 100000, sellPrice: 20000,
        levelReq: 60
    },

    // ===== ARMOR =====
    'cloth_armor': {
        id: 'cloth_armor', name: 'Áo Vải', icon: '👕', type: 'armor',
        rarity: 'common', slot: 'armor',
        stats: { def: 5, hp: 20 },
        desc: 'Áo vải thông thường. Không có gì đặc biệt nhưng có phòng thủ cơ bản.',
        price: 80, sellPrice: 16,
        levelReq: 1
    },
    'leather_armor': {
        id: 'leather_armor', name: 'Giáp Da', icon: '🧥', type: 'armor',
        rarity: 'common', slot: 'armor',
        stats: { def: 15, hp: 50, agi: 3 },
        desc: 'Giáp làm từ da thuộc thú. Linh hoạt và có thể chống đỡ các đòn nhẹ.',
        price: 400, sellPrice: 80,
        levelReq: 5
    },
    'iron_chest': {
        id: 'iron_chest', name: 'Giáp Ngực Sắt', icon: '🛡️', type: 'armor',
        rarity: 'uncommon', slot: 'armor',
        stats: { def: 35, hp: 100, vit: 8 },
        desc: 'Giáp ngực làm từ sắt. Giảm đáng kể sát thương vật lý.',
        price: 1500, sellPrice: 300,
        levelReq: 12
    },
    'namek_robe': {
        id: 'namek_robe', name: 'Áo Choàng Namek', icon: '🌿', type: 'armor',
        rarity: 'rare', slot: 'armor',
        stats: { def: 25, hp: 80, mp: 60, int: 20 },
        desc: 'Áo choàng truyền thống của người Namek. Tăng cường khả năng hồi phục.',
        price: 5000, sellPrice: 1000,
        levelReq: 20
    },
    'saiyan_armor': {
        id: 'saiyan_armor', name: 'Giáp Chiến Binh Saiyan', icon: '⚡', type: 'armor',
        rarity: 'epic', slot: 'armor',
        stats: { def: 70, hp: 200, atk: 30, str: 15 },
        desc: 'Giáp của chiến binh Saiyan. Càng bị tổn thương, sức mạnh càng tăng.',
        price: 20000, sellPrice: 4000,
        levelReq: 35
    },

    // ===== HELMETS =====
    'bandana': {
        id: 'bandana', name: 'Khăn Đầu', icon: '🎗️', type: 'helmet',
        rarity: 'common', slot: 'helmet',
        stats: { spd: 3, agi: 2 },
        desc: 'Chiếc khăn đơn giản buộc quanh đầu.',
        price: 50, sellPrice: 10,
        levelReq: 1
    },
    'iron_helm': {
        id: 'iron_helm', name: 'Mũ Sắt', icon: '⛑️', type: 'helmet',
        rarity: 'common', slot: 'helmet',
        stats: { def: 12, hp: 30 },
        desc: 'Mũ giáp sắt bảo vệ đầu.',
        price: 350, sellPrice: 70,
        levelReq: 5
    },
    'dragon_crown': {
        id: 'dragon_crown', name: 'Vương Miện Rồng', icon: '👑', type: 'helmet',
        rarity: 'legendary', slot: 'helmet',
        stats: { def: 60, hp: 150, int: 30, mp: 80 },
        desc: 'Vương miện được điêu khắc từ sừng rồng. Tăng mạnh mọi chỉ số.',
        price: 80000, sellPrice: 16000,
        levelReq: 55
    },

    // ===== BOOTS =====
    'cloth_boots': {
        id: 'cloth_boots', name: 'Dép Vải', icon: '👟', type: 'boots',
        rarity: 'common', slot: 'boots',
        stats: { spd: 5 },
        desc: 'Đôi dép vải đơn giản.',
        price: 60, sellPrice: 12,
        levelReq: 1
    },
    'swift_boots': {
        id: 'swift_boots', name: 'Giày Thần Tốc', icon: '👢', type: 'boots',
        rarity: 'uncommon', slot: 'boots',
        stats: { spd: 25, agi: 15, dodge: 5 },
        desc: 'Đôi giày được phù phép để di chuyển nhanh như gió.',
        price: 3000, sellPrice: 600,
        levelReq: 18
    },

    // ===== ACCESSORIES =====
    'power_ring': {
        id: 'power_ring', name: 'Nhẫn Sức Mạnh', icon: '💍', type: 'accessory',
        rarity: 'uncommon', slot: 'accessory',
        stats: { atk: 15, str: 10 },
        desc: 'Chiếc nhẫn tập trung năng lượng vào cú đấm.',
        price: 2500, sellPrice: 500,
        levelReq: 10
    },
    'dragon_ball_pendant': {
        id: 'dragon_ball_pendant', name: 'Mặt Dây Ngọc Rồng', icon: '🔮', type: 'accessory',
        rarity: 'epic', slot: 'accessory',
        stats: { hp: 100, mp: 80, atk: 20, def: 20 },
        desc: 'Mặt dây chứa năng lượng của ngọc rồng. Tăng mạnh mọi chỉ số.',
        price: 30000, sellPrice: 6000,
        levelReq: 40
    },

    // ===== POTIONS =====
    'small_hp_pot': {
        id: 'small_hp_pot', name: 'Bình Hồi Máu Nhỏ', icon: '🧪', type: 'potion',
        rarity: 'common',
        effect: { type: 'heal', value: 50 },
        desc: 'Hồi phục 50 HP. Vị ngọt như trái cây.',
        price: 50, sellPrice: 10,
        levelReq: 1, stackable: true
    },
    'medium_hp_pot': {
        id: 'medium_hp_pot', name: 'Bình Hồi Máu Vừa', icon: '🍶', type: 'potion',
        rarity: 'common',
        effect: { type: 'heal', value: 150 },
        desc: 'Hồi phục 150 HP. Có mùi thảo dược thơm.',
        price: 150, sellPrice: 30,
        levelReq: 1, stackable: true
    },
    'large_hp_pot': {
        id: 'large_hp_pot', name: 'Bình Hồi Máu Lớn', icon: '🫙', type: 'potion',
        rarity: 'uncommon',
        effect: { type: 'heal', value: 400 },
        desc: 'Hồi phục 400 HP. Phục hồi nhanh chóng ngay cả vết thương nặng.',
        price: 400, sellPrice: 80,
        levelReq: 10, stackable: true
    },
    'elixir': {
        id: 'elixir', name: 'Tiên Dược Máu', icon: '✨', type: 'potion',
        rarity: 'rare',
        effect: { type: 'heal', value: 9999 },
        desc: 'Hồi phục toàn bộ HP. Tiên dược quý giá.',
        price: 5000, sellPrice: 1000,
        levelReq: 1, stackable: true
    },
    'small_mp_pot': {
        id: 'small_mp_pot', name: 'Bình Hồi Năng Lượng Nhỏ', icon: '💧', type: 'potion',
        rarity: 'common',
        effect: { type: 'mana', value: 30 },
        desc: 'Hồi phục 30 MP. Giúp dùng thêm kỹ năng.',
        price: 60, sellPrice: 12,
        levelReq: 1, stackable: true
    },
    'large_mp_pot': {
        id: 'large_mp_pot', name: 'Bình Hồi Năng Lượng Lớn', icon: '💠', type: 'potion',
        rarity: 'uncommon',
        effect: { type: 'mana', value: 100 },
        desc: 'Hồi phục 100 MP. Năng lượng dào dạt.',
        price: 250, sellPrice: 50,
        levelReq: 5, stackable: true
    },
    'senzu_bean': {
        id: 'senzu_bean', name: 'Đậu Thần', icon: '🌱', type: 'potion',
        rarity: 'epic',
        effect: { type: 'full_restore', value: 0 },
        desc: 'Hồi phục toàn bộ HP và MP. Đậu thần huyền thoại của Korin.',
        price: 10000, sellPrice: 2000,
        levelReq: 1, stackable: true
    },

    // ===== MISC =====
    'dragon_ball_1': {
        id: 'dragon_ball_1', name: 'Ngọc Rồng 1 Sao', icon: '🔴', type: 'misc',
        rarity: 'legendary',
        desc: 'Ngọc Rồng 1 sao. Thu thập đủ 7 viên để triệu hồi Thần Rồng Shenron.',
        price: 99999, sellPrice: 0,
        levelReq: 1
    },
    'zeni_bag': {
        id: 'zeni_bag', name: 'Túi Tiền', icon: '💰', type: 'misc',
        rarity: 'common',
        effect: { type: 'zeni', value: 500 },
        desc: 'Túi tiền chứa 500 Zeni. Thu lượm được từ kẻ thù.',
        price: 500, sellPrice: 500,
        levelReq: 1, stackable: true
    },
    'rainbow_crystal': {
        id: 'rainbow_crystal', name: 'Pha Lê Cầu Vồng', icon: '💎', type: 'misc',
        rarity: 'epic',
        desc: 'Vật liệu rèn đồ đặc biệt. Cực kỳ hiếm và quý giá.',
        price: 50000, sellPrice: 10000,
        levelReq: 1
    },
    'egg_disciple': {
        id: 'egg_disciple', name: 'Trứng Đệ Tử', icon: '🥚', type: 'hatchable',
        rarity: 'legendary',
        desc: 'Một quả trứng kỳ bí rơi ra từ Super Cell. Chỉ có thể đem về Nhà riêng (Nhà của hành tinh bạn) để ấp thành Đệ Tử.',
        price: 999999, sellPrice: 50000,
        levelReq: 1, stackable: false
    },

    // Create item instance from DB
    create(id, qty = 1) {
        const base = ItemDB[id];
        if (!base) return null;
        return { ...Utils.deepClone(base), qty, instanceId: Utils.genId() };
    },

    // Get rarity color
    rarityColor(rarity) {
        const colors = {
            common: '#AAAAAA',
            uncommon: '#2ECC71',
            rare: '#3498DB',
            epic: '#9B59B6',
            legendary: '#FF8C00'
        };
        return colors[rarity] || '#AAAAAA';
    },

    // Get rarity name in Vietnamese
    rarityName(rarity) {
        const names = {
            common: 'Thường', uncommon: 'Không Phổ Biến',
            rare: 'Hiếm', epic: 'Sử Thi', legendary: 'Huyền Thoại'
        };
        return names[rarity] || 'Thường';
    }
};
