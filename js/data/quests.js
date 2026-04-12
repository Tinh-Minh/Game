/* ==========================================
   DATA/QUESTS.JS - Quest Database
   ========================================== */

const QuestDB = {
    'first_steps': {
        id: 'first_steps',
        name: 'Những Bước Đầu Tiên',
        icon: '⭐',
        giver: 'krillin_npc',
        desc: 'Krillin muốn bạn thử sức với những con quái vật nhỏ trong khu vực Thị Trấn Phương Đông.',
        objectives: [
            { type: 'kill', target: 'small_frog', count: 3, current: 0, desc: 'Tiêu diệt 3 con Ếch Xanh' },
            { type: 'kill', target: 'wild_rabbit', count: 2, current: 0, desc: 'Tiêu diệt 2 con Thỏ Hoang' }
        ],
        rewards: {
            exp: 100,
            zeni: 200,
            items: [
                { id: 'small_hp_pot', qty: 5 },
                { id: 'wooden_sword', qty: 1 }
            ]
        },
        followUp: 'forest_exploration',
        area: 'east_city',
        minLevel: 1, maxLevel: 5
    },

    'forest_exploration': {
        id: 'forest_exploration',
        name: 'Khám Phá Khu Rừng',
        icon: '🌳',
        giver: 'krillin_npc',
        desc: 'Sau khi làm quen với chiến đấu, Krillin muốn bạn khám phá khu rừng phía đông và tiêu diệt các con quái mạnh hơn.',
        objectives: [
            { type: 'kill', target: 'forest_wolf', count: 5, current: 0, desc: 'Tiêu diệt 5 con Sói Rừng' },
            { type: 'kill', target: 'forest_bear', count: 2, current: 0, desc: 'Tiêu diệt 2 con Gấu Rừng' },
            { type: 'visit', target: 'forest', count: 1, current: 0, desc: 'Đến Khu Rừng Phía Đông' }
        ],
        rewards: {
            exp: 500,
            zeni: 800,
            items: [
                { id: 'medium_hp_pot', qty: 10 },
                { id: 'leather_armor', qty: 1 }
            ]
        },
        area: 'forest',
        minLevel: 4, maxLevel: 10
    },

    'find_dragon_balls': {
        id: 'find_dragon_balls',
        name: 'Tìm Kiếm Ngọc Rồng',
        icon: '🔮',
        giver: 'quest_girl',
        desc: 'Bulma nhờ bạn tìm một viên Ngọc Rồng. Nghe đồn có một viên tại khu vực Sa Mạc Đỏ.',
        objectives: [
            { type: 'collect', target: 'dragon_ball_1', count: 1, current: 0, desc: 'Thu thập 1 viên Ngọc Rồng' },
            { type: 'kill', target: 'desert_bandit', count: 5, current: 0, desc: 'Tiêu diệt 5 Cướp Sa Mạc' }
        ],
        rewards: {
            exp: 1500,
            zeni: 3000,
            items: [
                { id: 'dragon_ball_pendant', qty: 1 }
            ]
        },
        area: 'desert',
        minLevel: 12
    },

    'hermit_training': {
        id: 'hermit_training',
        name: 'Tu Luyện Cùng Ẩn Sĩ',
        icon: '🧙',
        giver: 'forest_hermit',
        desc: 'Ẩn sĩ rừng muốn kiểm tra bạn trước khi truyền thụ bí quyết. Hãy tiêu diệt Yêu Ma Gỗ.',
        objectives: [
            { type: 'kill', target: 'wood_imp', count: 8, current: 0, desc: 'Tiêu diệt 8 Yêu Ma Gỗ' },
            { type: 'reach_level', target: 10, count: 1, current: 0, desc: 'Đạt cấp độ 10' }
        ],
        rewards: {
            exp: 800,
            zeni: 1200,
            skillPoints: 3,
            items: [
                { id: 'large_hp_pot', qty: 5 }
            ]
        },
        area: 'forest',
        minLevel: 8
    },

    'desert_bandits': {
        id: 'desert_bandits',
        name: 'Dẹp Loạn Cướp Sa Mạc',
        icon: '⚔️',
        giver: 'desert_trader',
        desc: 'Thương nhân bị bọn cướp sa mạc quấy nhiễu. Hãy giúp ông tiêu diệt chúng!',
        objectives: [
            { type: 'kill', target: 'desert_bandit', count: 10, current: 0, desc: 'Tiêu diệt 10 Cướp Sa Mạc' },
            { type: 'kill', target: 'scorpion', count: 3, current: 0, desc: 'Diệt 3 Bọ Cạp Khổng Lồ' }
        ],
        rewards: {
            exp: 1200,
            zeni: 2500,
            items: [
                { id: 'steel_blade', qty: 1 },
                { id: 'large_hp_pot', qty: 8 }
            ]
        },
        area: 'desert',
        minLevel: 12
    },

    'save_namek': {
        id: 'save_namek',
        name: 'Giải Cứu Hành Tinh Namek',
        icon: '🌍',
        giver: 'guru_npc',
        desc: 'Frieza đang tấn công Namek! Đại Guru nhờ bạn tiêu diệt Zarbon và những chiến binh của Frieza để bảo vệ dân tộc Namek.',
        objectives: [
            { type: 'kill', target: 'frieza_soldier', count: 10, current: 0, desc: 'Tiêu diệt 10 lính Frieza' },
            { type: 'kill', target: 'zarbon', count: 1, current: 0, desc: 'Đánh bại Zarbon' }
        ],
        rewards: {
            exp: 5000,
            zeni: 8000,
            statPoints: 5,
            items: [
                { id: 'namek_robe', qty: 1 },
                { id: 'elixir', qty: 3 }
            ]
        },
        followUp: 'stop_ginyu',
        area: 'namek',
        minLevel: 20
    },

    'stop_ginyu': {
        id: 'stop_ginyu',
        name: 'Chặn Đứng Đội Ginyu',
        icon: '🤺',
        giver: 'guru_npc',
        desc: 'Đội Ginyu đang đến! Hãy tiêu diệt tất cả các thành viên của Đội Đặc Nhiệm Ginyu.',
        objectives: [
            { type: 'kill', target: 'ginyu_force', count: 3, current: 0, desc: 'Đánh bại 3 thành viên Đội Ginyu' }
        ],
        rewards: {
            exp: 10000,
            zeni: 15000,
            items: [
                { id: 'saiyan_armor', qty: 1 },
                { id: 'senzu_bean', qty: 5 }
            ]
        },
        area: 'namek',
        minLevel: 28
    },

    'rainbow_crystal_quest': {
        id: 'rainbow_crystal_quest',
        name: 'Vật Liệu Quý Hiếm',
        icon: '💎',
        giver: 'blacksmith_npc',
        desc: 'Thợ rèn cần Pha Lê Cầu Vồng để rèn vũ khí tốt nhất. Hãy tìm chúng trong khi chiến đấu!',
        objectives: [
            { type: 'collect', target: 'rainbow_crystal', count: 3, current: 0, desc: 'Thu thập 3 Pha Lê Cầu Vồng' }
        ],
        rewards: {
            exp: 3000,
            zeni: 5000,
            items: [
                { id: 'katchin_club', qty: 1 }
            ]
        },
        area: 'west_city',
        minLevel: 35
    },

    'collect_herbs': {
        id: 'collect_herbs',
        name: 'Thu Thập Thảo Dược',
        icon: '🌿',
        giver: 'west_city_girl',
        desc: 'Chi-Chi cần thảo dược từ rừng. Đánh bại quái vật trong rừng để thu lượm chúng.',
        objectives: [
            { type: 'kill', target: 'forest_wolf', count: 5, current: 0, desc: 'Thu lượm thảo dược từ 5 Sói Rừng' },
            { type: 'kill', target: 'wood_imp', count: 3, current: 0, desc: 'Thu lượm thảo dược từ 3 Yêu Ma Gỗ' }
        ],
        rewards: {
            exp: 700,
            zeni: 1000,
            items: [
                { id: 'large_hp_pot', qty: 5 },
                { id: 'small_mp_pot', qty: 5 }
            ]
        },
        area: 'forest',
        minLevel: 5
    },

    'defeat_buu': {
        id: 'defeat_buu',
        name: 'Chinh Phục Majin Buu',
        icon: '👿',
        giver: 'babidi_npc',
        desc: 'Babidi thách bạn đánh bại cả Fat Buu lẫn Super Buu để chứng minh sức mạnh của bạn.',
        objectives: [
            { type: 'kill', target: 'fat_buu', count: 1, current: 0, desc: 'Đánh bại Béo Buu' },
            { type: 'kill', target: 'super_buu', count: 1, current: 0, desc: 'Đánh bại Super Buu' }
        ],
        rewards: {
            exp: 50000,
            zeni: 80000,
            items: [
                { id: 'legendary_sword', qty: 1 },
                { id: 'dragon_crown', qty: 1 },
                { id: 'senzu_bean', qty: 10 }
            ]
        },
        area: 'majin_realm',
        minLevel: 50
    }
};
