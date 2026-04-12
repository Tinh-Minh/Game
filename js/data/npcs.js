/* ==========================================
   DATA/NPCS.JS - NPC Database
   ========================================== */

const NPCDB = {
    'krillin_npc': {
        id: 'krillin_npc', name: 'Krillin', icon: '👩‍🦲', emoji: '👩‍🦲',
        x: 14, y: 8, mapId: 'east_city',
        color: '#FF8C00',
        dialogs: {
            default: {
                text: 'Ồ xin chào! Tôi là Krillin, bạn thân của Goku! Bạn mới đến thị trấn à? Hãy xem mình có thể giúp gì nào!',
                choices: [
                    { text: '🗺️ Cho tôi biết về khu vực này', next: 'area_info' },
                    { text: '⚔️ Bắt đầu nhiệm vụ', action: 'give_quest', questId: 'first_steps' },
                    { text: '💪 Dạy tôi chiến đấu', action: 'tutorial' },
                    { text: '👋 Tạm biệt', next: null }
                ]
            },
            area_info: {
                text: 'Thị Trấn Phương Đông là nơi bắt đầu của nhiều chiến binh vĩ đại! Phía đông có rừng rậm, phía bắc là căn cứ Quân Đoàn Đỏ. Hãy cẩn thận nhé!',
                choices: [
                    { text: '📜 Còn nhiệm vụ không?', action: 'give_quest', questId: 'first_steps' },
                    { text: '👋 Cảm ơn!', next: null }
                ]
            }
        },
        quests: ['first_steps', 'forest_exploration'],
        type: 'quest'
    },

    'item_shop_npc': {
        id: 'item_shop_npc', name: 'Nhà Thuốc ông Popo', icon: '🏪', emoji: '🧙',
        x: 18, y: 14, mapId: 'east_city',
        color: '#9B59B6',
        dialogs: {
            default: {
                text: 'Chào mừng đến cửa hàng của ông Popo! Đây là nơi bán các vật phẩm hồi phục tốt nhất vùng này. Hãy mua trước khi lên đường nhé!',
                choices: [
                    { text: '🛍️ Xem hàng hóa', action: 'open_shop', shopId: 'item_shop' },
                    { text: '💰 Bán đồ', action: 'sell_items' },
                    { text: '👋 Không cần', next: null }
                ]
            }
        },
        shop: {
            id: 'item_shop',
            name: 'Nhà Thuốc ông Popo',
            items: [
                { id: 'small_hp_pot', stock: -1, price: 50 },
                { id: 'medium_hp_pot', stock: -1, price: 150 },
                { id: 'small_mp_pot', stock: -1, price: 60 },
                { id: 'large_hp_pot', stock: 20, price: 400 },
                { id: 'large_mp_pot', stock: 15, price: 250 },
                { id: 'senzu_bean', stock: 3, price: 10000 }
            ]
        },
        type: 'shop'
    },

    'quest_girl': {
        id: 'quest_girl', name: 'Bulma Trẻ', icon: '💙', emoji: '👧',
        x: 7, y: 11, mapId: 'east_city',
        color: '#3498DB',
        dialogs: {
            default: {
                text: 'Hiii! Em là Bulma! Em đang nghiên cứu các Ngọc Rồng. Anh có muốn giúp em tìm kiếm chúng không? Nếu tìm đủ 7 viên, có thể ước được một điều ước đấy!',
                choices: [
                    { text: '🔮 Ngọc Rồng là gì?', next: 'dragon_ball_info' },
                    { text: '📜 Nhận nhiệm vụ tìm Ngọc Rồng', action: 'give_quest', questId: 'find_dragon_balls' },
                    { text: '👋 Thú vị đó, cảm ơn!', next: null }
                ]
            },
            dragon_ball_info: {
                text: 'Ngọc Rồng là những viên ngọc kỳ diệu có thể ban một điều ước! Có tất cả 7 viên, mỗi viên có số sao từ 1 đến 7 sao. Thu thập đủ là triệu hồi được Shenron!',
                choices: [
                    { text: '📜 Nhận nhiệm vụ tìm kiếm', action: 'give_quest', questId: 'find_dragon_balls' },
                    { text: '👋 Hay quá!', next: null }
                ]
            }
        },
        quests: ['find_dragon_balls'],
        type: 'quest'
    },

    'forest_hermit': {
        id: 'forest_hermit', name: 'Ẩn Sĩ Rừng', icon: '🧙', emoji: '🧙',
        x: 20, y: 18, mapId: 'forest',
        color: '#27AE60',
        dialogs: {
            default: {
                text: 'Hahaha! Người trẻ! Ta đã tu luyện trong rừng này 50 năm rồi. Sức mạnh thật sự không đến từ cơ bắp, mà từ tâm trí! Ta có thể dạy người kỹ thuật bổ trợ đặc biệt.',
                choices: [
                    { text: '⚡ Học kỹ năng đặc biệt', action: 'give_quest', questId: 'hermit_training' },
                    { text: '🛍️ Mua vật phẩm hiếm', action: 'open_shop', shopId: 'hermit_shop' },
                    { text: '👋 Cảm ơn lão tiên sinh', next: null }
                ]
            }
        },
        shop: {
            id: 'hermit_shop',
            name: 'Cửa Hàng Ẩn Sĩ',
            items: [
                { id: 'large_hp_pot', stock: -1, price: 350 },
                { id: 'large_mp_pot', stock: -1, price: 220 },
                { id: 'power_ring', stock: 2, price: 2000 }
            ]
        },
        quests: ['hermit_training'],
        type: 'quest_shop'
    },

    'desert_trader': {
        id: 'desert_trader', name: 'Thương Nhân Sa Mạc', icon: '🐪', emoji: '🕌',
        x: 15, y: 6, mapId: 'desert',
        color: '#E67E22',
        dialogs: {
            default: {
                text: 'Xin chào, chiến binh! Đường xa mệt mỏi, mua vài món đồ trước khi tiếp tục nhé? Tôi có hàng hiếm đấy!',
                choices: [
                    { text: '🛍️ Xem hàng', action: 'open_shop', shopId: 'desert_shop' },
                    { text: '📜 Có nhiệm vụ không?', action: 'give_quest', questId: 'desert_bandits' },
                    { text: '👋 Tạm biệt', next: null }
                ]
            }
        },
        shop: {
            id: 'desert_shop',
            name: 'Cửa Hàng Sa Mạc',
            items: [
                { id: 'medium_hp_pot', stock: -1, price: 140 },
                { id: 'large_hp_pot', stock: -1, price: 380 },
                { id: 'steel_blade', stock: 1, price: 1800 },
                { id: 'swift_boots', stock: 1, price: 2700 }
            ]
        },
        quests: ['desert_bandits'],
        type: 'quest_shop'
    },

    'guru_npc': {
        id: 'guru_npc', name: 'Đại Guru', icon: '👴', emoji: '👴',
        x: 14, y: 8, mapId: 'namek',
        color: '#2ECC71',
        dialogs: {
            default: {
                text: 'Con người... ta cảm nhận được tiềm năng vĩ đại bên trong ngươi. Ta là Đại Guru, thủ lĩnh của tộc Namek. Ta có thể mở khóa sức mạnh ẩn sâu trong ngươi.',
                choices: [
                    { text: '✨ Mở khóa sức mạnh tiềm ẩn', action: 'unlock_power' },
                    { text: '📜 Nhận nhiệm vụ', action: 'give_quest', questId: 'save_namek' },
                    { text: '👋 Đội ơn Đại Guru', next: null }
                ]
            }
        },
        quests: ['save_namek'],
        type: 'quest',
        specialAction: 'unlock_power'
    },

    'dende_npc': {
        id: 'dende_npc', name: 'Dende', icon: '💚', emoji: '👾',
        x: 20, y: 12, mapId: 'namek',
        color: '#2ECC71',
        dialogs: {
            default: {
                text: 'Xin chào! Tôi là Dende. Tôi có thể chữa lành vết thương cho anh. Anh có muốn được hồi phục không?',
                choices: [
                    { text: '💚 Chữa lành (miễn phí)', action: 'heal_full' },
                    { text: '🔮 Ngọc Rồng Namek', next: 'namek_dragon' },
                    { text: '👋 Cảm ơn Dende!', next: null }
                ]
            },
            namek_dragon: {
                text: 'Ngọc Rồng Namek có thể ban nhiều điều ước hơn ngọc rồng Trái Đất. Nhưng hiện tại Namek đang bị Frieza tấn công... Hãy giúp chúng tôi!',
                choices: [
                    { text: '📜 Tôi sẽ bảo vệ Namek!', action: 'give_quest', questId: 'save_namek' },
                    { text: '👋 Tôi sẽ cố gắng', next: null }
                ]
            }
        },
        quests: ['save_namek'],
        type: 'healer'
    },

    'capsule_corp_npc': {
        id: 'capsule_corp_npc', name: 'Cửa Hàng Capsule Corp', icon: '🏭', emoji: '🔬',
        x: 10, y: 9, mapId: 'west_city',
        color: '#3498DB',
        dialogs: {
            default: {
                text: 'Chào mừng đến Capsule Corporation! Chúng tôi bán hàng hóa cao cấp nhất thế giới. Tiền của anh xứng đáng được đầu tư vào đây!',
                choices: [
                    { text: '🛍️ Mua vũ khí & giáp', action: 'open_shop', shopId: 'capsule_shop' },
                    { text: '👋 Cảm ơn', next: null }
                ]
            }
        },
        shop: {
            id: 'capsule_shop',
            name: 'Capsule Corporation',
            items: [
                { id: 'iron_sword', stock: -1, price: 480 },
                { id: 'iron_chest', stock: -1, price: 1400 },
                { id: 'steel_blade', stock: 5, price: 1900 },
                { id: 'namek_robe', stock: 3, price: 4800 },
                { id: 'saiyan_armor', stock: 1, price: 19000 },
                { id: 'swift_boots', stock: 5, price: 2800 },
                { id: 'power_ring', stock: 5, price: 2400 },
                { id: 'elixir', stock: 5, price: 4800 }
            ]
        },
        type: 'shop'
    },

    'blacksmith_npc': {
        id: 'blacksmith_npc', name: 'Thợ Rèn Kold', icon: '⚒️', emoji: '🔨',
        x: 20, y: 12, mapId: 'west_city',
        color: '#E74C3C',
        dialogs: {
            default: {
                text: 'Grrrr... Ta là Kold, thợ rèn giỏi nhất vùng! Mang nguyên liệu đến, ta sẽ rèn cho ngươi những vũ khí đặc biệt. Hoặc mua đồ sẵn cũng được!',
                choices: [
                    { text: '🛍️ Mua đồ rèn sẵn', action: 'open_shop', shopId: 'blacksmith_shop' },
                    { text: '📜 Nhiệm vụ rèn đồ', action: 'give_quest', questId: 'rainbow_crystal_quest' },
                    { text: '👋 Lần sau vậy', next: null }
                ]
            }
        },
        shop: {
            id: 'blacksmith_shop',
            name: 'Lò Rèn Kold',
            items: [
                { id: 'wooden_sword', stock: -1, price: 90 },
                { id: 'iron_sword', stock: -1, price: 500 },
                { id: 'steel_blade', stock: 10, price: 2000 },
                { id: 'katchin_club', stock: 1, price: 24000 },
                { id: 'iron_helm', stock: -1, price: 340 },
                { id: 'iron_chest', stock: -1, price: 1500 }
            ]
        },
        quests: ['rainbow_crystal_quest'],
        type: 'quest_shop'
    },

    'babidi_npc': {
        id: 'babidi_npc', name: 'Babidi', icon: '🧙‍♂️', emoji: '🧙‍♂️',
        x: 14, y: 5, mapId: 'majin_realm',
        color: '#8B0000',
        dialogs: {
            default: {
                text: 'Héhéhé! Ngươi dám đến Cõi Majin của ta? Dũng cảm lắm! Hay ngươi muốn trở thành Majin và phục vụ ta?',
                choices: [
                    { text: '👿 Chiến đấu với Babidi!', action: 'start_battle', monsterId: 'babidi_boss' },
                    { text: '📜 Thách đấu Buu', action: 'give_quest', questId: 'defeat_buu' },
                    { text: '👋 Tôi không sợ ngươi!', next: null }
                ]
            }
        },
        quests: ['defeat_buu'],
        type: 'quest_enemy'
    },

    'west_city_girl': {
        id: 'west_city_girl', name: 'Chi-Chi Trẻ', icon: '👸', emoji: '👸',
        x: 15, y: 8, mapId: 'west_city',
        color: '#FF69B4',
        dialogs: {
            default: {
                text: 'Oi! Anh là chiến binh mới phải không? Hãy cẩn thận với bọn quái vật bên ngoài thành phố nhé! À, anh có muốn nhận một nhiệm vụ không?',
                choices: [
                    { text: '📜 Nhận nhiệm vụ', action: 'give_quest', questId: 'collect_herbs' },
                    { text: '👋 Nhìn trông có vẻ vui đó!', next: null }
                ]
            }
        },
        quests: ['collect_herbs'],
        type: 'quest'
    },

    'incubator_npc': {
        id: 'incubator_npc', name: 'Lồng Ấp Trứng', icon: '⚗️', emoji: '⚗️',
        x: 8, y: 5, mapId: 'home_human',
        color: '#2ECC71',
        dialogs: {
            default: {
                text: 'Đây là cỗ máy ấp trứng thần bí. Nếu lượm được Trứng Đệ Tử đằng sau Super Cell, hãy bỏ vào đây để ấp.',
                choices: [
                    { text: '🥚 Mở lồng ấp & Ấp Trứng', action: 'hatch_egg' },
                    { text: '👋 Đóng lại', next: null }
                ]
            }
        },
        type: 'quest'
    }
};
