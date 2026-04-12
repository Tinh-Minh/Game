/* ==========================================
   DATA/SKILLS.JS - Skill Database
   ========================================== */

const SkillDB = {
    // ===== COMMON SKILLS (All races) =====
    'basic_attack': {
        id: 'basic_attack', name: 'Đòn Cơ Bản', icon: '👊', type: 'active',
        mpCost: 0, cooldown: 0, maxLevel: 1,
        desc: 'Tấn công cơ bản. Gây sát thương thể lực.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (0.8 + level * 0.1));
            return { damage: dmg, type: 'physical' };
        },
        races: ['human', 'namek', 'majin']
    },
    'ki_charge': {
        id: 'ki_charge', name: 'Nạp Năng Lượng Ki', icon: '💫', type: 'active',
        mpCost: 0, cooldown: 3, maxLevel: 5,
        desc: 'Nạp năng lượng Ki, tăng ATK 20% trong 3 lượt.',
        effect(char, target, level) {
            return { buff: { stat: 'atk', pct: 0.2 + level * 0.05, turns: 3 }, type: 'buff' };
        },
        races: ['human', 'namek', 'majin']
    },
    'guard': {
        id: 'guard', name: 'Phòng Thủ', icon: '🛡️', type: 'active',
        mpCost: 5, cooldown: 0, maxLevel: 5,
        desc: 'Tăng phòng thủ 30% trong lượt này.',
        effect(char, target, level) {
            return { buff: { stat: 'def', pct: 0.3 + level * 0.1, turns: 1 }, type: 'buff' };
        },
        races: ['human', 'namek', 'majin']
    },

    // ===== HUMAN SKILLS =====
    'kamehameha': {
        id: 'kamehameha', name: 'Kamehameha', icon: '🌊', type: 'active',
        mpCost: 25, cooldown: 3, maxLevel: 10,
        desc: 'Phát ra làn sóng năng lượng Ki khổng lồ. Gây sát thương lớn.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (2 + level * 0.3));
            return { damage: dmg, type: 'ki', element: 'blue',
                     animation: 'kamehameha' };
        },
        races: ['human']
    },
    'solar_flare': {
        id: 'solar_flare', name: 'Taiyoken - Hào Quang Mặt Trời', icon: '☀️', type: 'active',
        mpCost: 15, cooldown: 4, maxLevel: 5,
        desc: 'Tạo ánh sáng chói mắt, làm mù kẻ thù trong 2 lượt.',
        effect(char, target, level) {
            return { debuff: { type: 'blind', turns: 1 + level }, type: 'debuff' };
        },
        races: ['human']
    },
    'afterimage': {
        id: 'afterimage', name: 'Zanzoken - Ảnh Tốc Độ', icon: '⚡', type: 'active',
        mpCost: 20, cooldown: 5, maxLevel: 5,
        desc: 'Di chuyển cực nhanh tạo ảnh phân thân, tăng né tránh 50%.',
        effect(char, target, level) {
            return { buff: { stat: 'dodge', pct: 0.5 + level * 0.1, turns: 2 }, type: 'buff' };
        },
        races: ['human']
    },
    'spirit_bomb': {
        id: 'spirit_bomb', name: 'Genkidama - Bom Tinh Thần', icon: '🌐', type: 'active',
        mpCost: 60, cooldown: 8, maxLevel: 5,
        desc: 'Hấp thụ năng lượng vạn vật tạo quả bom khổng lồ. Phá đảo mọi kẻ ác.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (5 + level * 0.8));
            return { damage: dmg, type: 'ki', element: 'rainbow', animation: 'spirit_bomb' };
        },
        races: ['human']
    },
    'instant_transmission': {
        id: 'instant_transmission', name: 'Shunkan Idou - Tức Thời Di Chuyển', icon: '🌀', type: 'active',
        mpCost: 30, cooldown: 6, maxLevel: 3,
        desc: 'Dịch chuyển tức thời đến vị trí kẻ thù, tấn công trước khi bị phát hiện.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (1.5 + level * 0.5));
            return { damage: dmg, type: 'physical', crit: true, animation: 'teleport' };
        },
        races: ['human']
    },
    'power_up': {
        id: 'power_up', name: 'Siêu Saiyan - Bùng Phát Sức Mạnh', icon: '💥', type: 'active',
        mpCost: 50, cooldown: 10, maxLevel: 3,
        desc: 'Bùng phát sức mạnh tiềm ẩn, tăng ATK và SPD 50% trong 5 lượt.',
        effect(char, target, level) {
            return {
                buff: [
                    { stat: 'atk', pct: 0.5 + level * 0.1, turns: 5 },
                    { stat: 'spd', pct: 0.5 + level * 0.1, turns: 5 }
                ],
                type: 'buff', animation: 'super_saiyan'
            };
        },
        races: ['human']
    },

    // ===== NAMEK SKILLS =====
    'mystic_attack': {
        id: 'mystic_attack', name: 'Cánh Tay Giãn Dài', icon: '🤜', type: 'active',
        mpCost: 15, cooldown: 2, maxLevel: 8,
        desc: 'Vươn cánh tay ra xa tấn công kẻ thù từ khoảng cách an toàn.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (1.2 + level * 0.15));
            return { damage: dmg, type: 'physical', range: 'far' };
        },
        races: ['namek']
    },
    'healing': {
        id: 'healing', name: 'Chữa Lành', icon: '💚', type: 'active',
        mpCost: 20, cooldown: 3, maxLevel: 10,
        desc: 'Dùng năng lượng Namek để hồi phục HP.',
        effect(char, target, level) {
            const heal = Math.floor(char.getStat('int') * (2 + level * 0.5) + 30);
            return { heal, type: 'heal', animation: 'heal' };
        },
        races: ['namek']
    },
    'regeneration': {
        id: 'regeneration', name: 'Tái Sinh', icon: '♻️', type: 'passive',
        mpCost: 0, cooldown: 0, maxLevel: 5,
        desc: 'Tự động hồi HP mỗi lượt.',
        passiveEffect(char, level) {
            return { regenHp: Math.floor(char.stats.maxHp * (0.02 + level * 0.01)) };
        },
        races: ['namek']
    },
    'scatter_shot': {
        id: 'scatter_shot', name: 'Bắn Tán Xạ', icon: '🎯', type: 'active',
        mpCost: 30, cooldown: 4, maxLevel: 7,
        desc: 'Bắn nhiều viên năng lượng nhỏ, mỗi viên gây sát thương riêng.',
        effect(char, target, level) {
            const count = 2 + level;
            const dmgEach = Math.floor(char.getAtk() * (0.4 + level * 0.05));
            return { multiHit: { count, damage: dmgEach }, type: 'ki' };
        },
        races: ['namek']
    },
    'special_beam': {
        id: 'special_beam', name: 'Makankosappo - Tia Xuyên Phá', icon: '🌀', type: 'active',
        mpCost: 40, cooldown: 5, maxLevel: 8,
        desc: 'Tia năng lượng xoáy cực mạnh, xuyên thủng mọi phòng thủ.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (3 + level * 0.4));
            return { damage: dmg, type: 'ki', ignoreDefense: 0.5, animation: 'beam' };
        },
        races: ['namek']
    },
    'limb_fusion': {
        id: 'limb_fusion', name: 'Tách Ra', icon: '✨', type: 'active',
        mpCost: 25, cooldown: 7, maxLevel: 3,
        desc: 'Tách một phần cơ thể để tấn công độc lập.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (1.8 + level * 0.3));
            return { damage: dmg, type: 'physical', multiHit: { count: 2, damage: Math.floor(dmg * 0.5) } };
        },
        races: ['namek']
    },

    // ===== MAJIN SKILLS =====
    'dark_energy': {
        id: 'dark_energy', name: 'Năng Lượng Bóng Tối', icon: '🖤', type: 'active',
        mpCost: 20, cooldown: 2, maxLevel: 10,
        desc: 'Phóng ra quả cầu năng lượng bóng tối hủy diệt.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (1.8 + level * 0.2));
            return { damage: dmg, type: 'dark', animation: 'dark_ball' };
        },
        races: ['majin']
    },
    'buu_absorb': {
        id: 'buu_absorb', name: 'Hấp Thụ', icon: '😈', type: 'active',
        mpCost: 35, cooldown: 5, maxLevel: 5,
        desc: 'Hấp thụ năng lượng của kẻ thù, đánh cướp HP.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (1.5 + level * 0.2));
            const drain = Math.floor(dmg * (0.3 + level * 0.05));
            return { damage: dmg, drain, type: 'dark', animation: 'absorb' };
        },
        races: ['majin']
    },
    'candy_beam': {
        id: 'candy_beam', name: 'Tia Biến Kẹo', icon: '🍬', type: 'active',
        mpCost: 40, cooldown: 6, maxLevel: 5,
        desc: 'Biến kẻ thù thành kẹo trong vài lượt. Không thể tấn công khi bị biến.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * 0.8);
            return { damage: dmg, debuff: { type: 'candy', turns: 1 + level }, type: 'special' };
        },
        races: ['majin']
    },
    'explosion': {
        id: 'explosion', name: 'Nổ Tự Sát', icon: '💣', type: 'active',
        mpCost: 50, cooldown: 8, maxLevel: 5,
        desc: 'Gây sát thương cực lớn bằng cách nổ tung cơ thể. Mất 20% HP bản thân.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (4 + level * 0.6));
            const selfDmg = Math.floor(char.stats.hp * 0.2);
            return { damage: dmg, selfDamage: selfDmg, type: 'physical', animation: 'explosion' };
        },
        races: ['majin']
    },
    'vanilla_beam': {
        id: 'vanilla_beam', name: 'Tia Sôcôla', icon: '🍫', type: 'active',
        mpCost: 30, cooldown: 4, maxLevel: 6,
        desc: 'Tia năng lượng làm yếu kẻ thù, giảm ATK và DEF.',
        effect(char, target, level) {
            const dmg = Math.floor(char.getAtk() * (1.2 + level * 0.15));
            return {
                damage: dmg,
                debuff: [
                    { stat: 'atk', pct: -0.2 - level * 0.05, turns: 3 },
                    { stat: 'def', pct: -0.2 - level * 0.05, turns: 3 }
                ],
                type: 'dark'
            };
        },
        races: ['majin']
    },
    'majin_power': {
        id: 'majin_power', name: 'Majin Sức Mạnh Bùng Nổ', icon: '🔥', type: 'active',
        mpCost: 55, cooldown: 10, maxLevel: 3,
        desc: 'Kích hoạt toàn bộ năng lượng Majin, tăng ATK 80% trong 4 lượt.',
        effect(char, target, level) {
            return {
                buff: { stat: 'atk', pct: 0.8 + level * 0.1, turns: 4 },
                type: 'buff', animation: 'majin_power'
            };
        },
        races: ['majin']
    },

    // Get skills for race
    getForRace(race) {
        return Object.values(SkillDB).filter(s =>
            typeof s === 'object' && s.races && s.races.includes(race)
        );
    }
};
