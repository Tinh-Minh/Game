/* ==========================================
   UI.JS - UI Controller
   ========================================== */

const GameUI = {
    inventoryTab: 'all',
    questTab: 'active',
    selectedQuestId: null,
    isTrading: false,
    tradeItems: [], // Danh sách đồ mình định giao dịch
    tradeZeni: 0,
    tradeDiamonds: 0,

    // ===== HUD =====
    updateHUD() {
        const player = window.GameSystem?.player;
        if (!player) return;

        document.getElementById('hud-name').textContent = player.name;
        document.getElementById('hud-level').textContent = `Lv.${player.level} (${player.race === 'human' ? 'Người' : player.race === 'namek' ? 'Namek' : 'Majin'})`;
        document.getElementById('zeni-amount').textContent = Utils.formatNum(player.zeni);
        document.getElementById('diamond-amount').textContent = Utils.formatNum(player.diamonds);

        const hpPct = (player.stats.hp / player.stats.maxHp * 100).toFixed(1);
        const mpPct = (player.stats.mp / player.stats.maxMp * 100).toFixed(1);
        const expPct = (player.exp / player.expToNext * 100).toFixed(1);

        document.getElementById('hp-bar').style.width = hpPct + '%';
        document.getElementById('mp-bar').style.width = mpPct + '%';
        document.getElementById('exp-bar').style.width = expPct + '%';
        document.getElementById('hp-text').textContent = `${player.stats.hp}/${player.stats.maxHp}`;
        document.getElementById('mp-text').textContent = `${player.stats.mp}/${player.stats.maxMp}`;
        document.getElementById('exp-text').textContent = `${player.exp}/${player.expToNext}`;

        // Avatar emoji by race
        const avatars = { human: '🧍', namek: '👾', majin: '🫃' };
        document.getElementById('hud-avatar').textContent = avatars[player.race] || '🧍';

        this.updateHotbar();
    },

    updateHotbar() {
        const player = window.GameSystem?.player;
        if (!player) return;

        const container = document.getElementById('hotbar-slots');
        if (!container) return;
        container.innerHTML = '';

        const hotbarItems = player.hotbar || new Array(8).fill(null);
        for (let i = 0; i < 8; i++) {
            const skillId = hotbarItems[i];
            const slot = document.createElement('div');
            slot.className = 'hotbar-slot';
            slot.dataset.index = i;

            const keyLabels = ['1','2','3','4','5','6','7','8'];
            const keyDiv = document.createElement('div');
            keyDiv.className = 'slot-key';
            keyDiv.textContent = keyLabels[i];
            slot.appendChild(keyDiv);

            if (skillId) {
                const skill = SkillDB[skillId];
                if (skill) {
                    slot.textContent = skill.icon || '?';
                    slot.appendChild(keyDiv);
                    slot.title = `${skill.name} (Lv ${player.skills[skillId] || 1})\nMP: ${skill.mpCost}\n(Chuột phải để gỡ)`;
                    slot.onclick = () => this.useHotbarSkill(i, skillId);
                    slot.oncontextmenu = (e) => {
                        e.preventDefault();
                        player.hotbar[i] = null;
                        this.updateHotbar();
                        Utils.notify(`Đã gỡ ${skill.name} khỏi phím ${i+1}`, 'info');
                    };
                }
            } else {
                slot.style.opacity = '0.4';
                slot.appendChild(keyDiv);
            }

            container.appendChild(slot);
        }

        // Bỏ Keyboard shortcut cứng ở đây vì WorldSystem (world.js) đã đảm nhận phím 1-8 
        // để hỗ trợ Attack Target trực tiếp trên màn hình game.
    },

    useHotbarSkill(slotIdx, skillId) {
        // Redirect execution to WorldSystem!
        if (typeof WorldSystem !== 'undefined') {
            WorldSystem.handleSkillUsage(slotIdx, skillId);
        }
    },

    // ===== PANELS =====
    toggleInventory() {
        const panel = document.getElementById('panel-inventory');
        if (panel.classList.contains('hidden')) {
            this.closeAllPanels();
            this.openInventory();
        } else {
            this.closePanel('inventory');
        }
        document.getElementById('btn-inventory').classList.toggle('active', !panel.classList.contains('hidden'));
    },

    openInventory() {
        document.getElementById('panel-inventory').classList.remove('hidden');
        this.renderInventory();
    },

    renderInventory() {
        const player = window.GameSystem?.player;
        if (!player) return;

        const grid = document.getElementById('inventory-grid');
        if (!grid) return;
        grid.innerHTML = '';

        let items = player.inventory;
        if (this.inventoryTab !== 'all') {
            const typeMap = {
                weapon: ['weapon'], armor: ['armor', 'helmet', 'boots', 'accessory'],
                potion: ['potion'], misc: ['misc']
            };
            const types = typeMap[this.inventoryTab] || [];
            items = items.filter(i => {
                const b = ItemDB[i.id];
                return b && types.includes(b.type);
            });
        }

        // 30 slots
        for (let i = 0; i < Math.max(30, items.length + 5); i++) {
            const slot = document.createElement('div');
            slot.className = 'inv-slot';

            if (i < items.length) {
                const item = items[i];
                const base = ItemDB[item.id];
                if (base) {
                    slot.className = `inv-slot rarity-${base.rarity || 'common'}`;
                    slot.innerHTML = `<span class="item-icon">${item.icon}</span>`;
                    if (item.qty > 1) {
                        const qty = document.createElement('span');
                        qty.className = 'item-qty';
                        qty.textContent = item.qty;
                        slot.appendChild(qty);
                    }
                    slot.title = base.name;
                    slot.onclick = () => this.onInventorySlotClick(item);
                    slot.onmouseenter = (e) => this.showItemTooltip(base, e.clientX, e.clientY);
                    slot.onmouseleave = () => this.hideItemTooltip();
                    slot.ondblclick = () => this.useOrEquipItem(item);
                }
            }

            grid.appendChild(slot);
        }
    },

    onInventorySlotClick(item) {
        const base = ItemDB[item.id];
        if (!base) return;

        if (this.isTrading) {
            this.addTradeItem(item, window.GameSystem.player.inventory.indexOf(item));
        } else {
            Utils.chat(`Bạn đã chọn: ${base.name}`, 'info');
        }
    },

    useOrEquipItem(item) {
        const player = window.GameSystem?.player;
        if (!player) return;
        const base = ItemDB[item.id];
        if (!base) return;

        if (base.slot) {
            // Equip
            player.equipItem(item.id);
            this.renderInventory();
            this.updateCharInfo();
        } else if (base.type === 'potion') {
            player.useItem(item.instanceId);
            this.renderInventory();
        }
    },

    switchInventoryTab(tab) {
        this.inventoryTab = tab;
        document.querySelectorAll('#panel-inventory .tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', ['all','weapon','armor','potion','misc'][i] === tab);
        });
        this.renderInventory();
    },

    showItemTooltip(item, mx, my) {
        const tooltip = document.getElementById('item-tooltip');
        if (!tooltip) return;

        const rarityColors = {
            common: '#AAAAAA', uncommon: '#2ECC71', rare: '#3498DB',
            epic: '#9B59B6', legendary: '#FF8C00'
        };
        const rarityNames = {
            common: 'Thường', uncommon: 'Không phổ biến',
            rare: 'Hiếm', epic: 'Sử thi', legendary: 'Huyền thoại'
        };

        let statsHtml = '';
        if (item.stats) {
            for (const [stat, val] of Object.entries(item.stats)) {
                const labels = {
                    atk: 'Tấn công', def: 'Phòng thủ', spd: 'Tốc độ',
                    hp: 'HP', mp: 'MP', str: 'STR', agi: 'AGI',
                    vit: 'VIT', int: 'INT', luk: 'LUK',
                    crit: 'Crit Rate', critDmg: 'Crit DMG', dodge: 'Né tránh'
                };
                statsHtml += `<div class="tooltip-stat">+${val} ${labels[stat] || stat.toUpperCase()}</div>`;
            }
        }

        tooltip.innerHTML = `
            <div class="tooltip-name" style="color:${rarityColors[item.rarity]}">${item.icon} ${item.name}</div>
            <div class="tooltip-type" style="color:${rarityColors[item.rarity]}">${rarityNames[item.rarity] || ''} • ${item.type || ''}</div>
            ${statsHtml}
            ${item.effect ? `<div class="tooltip-stat" style="color:#2ECC71">${
                item.effect.type === 'heal' ? `Hồi ${item.effect.value} HP` :
                item.effect.type === 'mana' ? `Hồi ${item.effect.value} MP` :
                item.effect.type === 'full_restore' ? 'Hồi đầy HP & MP' : ''
            }</div>` : ''}
            ${item.desc ? `<div class="tooltip-desc">${item.desc}</div>` : ''}
            ${item.price ? `<div class="tooltip-price">💰 Giá: ${Utils.formatNum(item.price)} Zeni</div>` : ''}
            ${item.levelReq ? `<div style="color:#888;font-size:0.72rem">Yêu cầu: Cấp ${item.levelReq}</div>` : ''}
        `;

        tooltip.style.display = 'block';
        const tx = mx + 12 > window.innerWidth - 300 ? mx - 280 : mx + 12;
        const ty = my + 12 > window.innerHeight - 200 ? my - 200 : my + 12;
        tooltip.style.left = tx + 'px';
        tooltip.style.top = ty + 'px';
    },

    hideItemTooltip() {
        const tooltip = document.getElementById('item-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    },

    toggleCharInfo() {
        const panel = document.getElementById('panel-character');
        if (panel.classList.contains('hidden')) {
            this.closeAllPanels();
            panel.classList.remove('hidden');
            this.updateCharInfo();
        } else {
            this.closePanel('character');
        }
        document.getElementById('btn-character').classList.toggle('active', !panel.classList.contains('hidden'));
    },

    updateCharInfo() {
        const player = window.GameSystem?.player;
        if (!player) return;

        // Base stats
        document.getElementById('stat-str').textContent = player.baseStats.str;
        document.getElementById('stat-agi').textContent = player.baseStats.agi;
        document.getElementById('stat-vit').textContent = player.baseStats.vit;
        document.getElementById('stat-int').textContent = player.baseStats.int;
        document.getElementById('stat-luk').textContent = player.baseStats.luk;
        document.getElementById('stat-points').textContent = player.statPoints;

        // Disable + buttons if no points
        document.querySelectorAll('.stat-plus').forEach(btn => {
            btn.disabled = player.statPoints <= 0;
        });

        // Derived stats
        document.getElementById('d-atk').textContent = player.stats.atk;
        document.getElementById('d-def').textContent = player.stats.def;
        document.getElementById('d-spd').textContent = player.stats.spd;
        document.getElementById('d-crit').textContent = player.stats.crit + '%';
        document.getElementById('d-maxhp').textContent = player.stats.maxHp;
        document.getElementById('d-maxmp').textContent = player.stats.maxMp;

        // Paper doll
        const canvas = document.getElementById('paper-doll-canvas');
        if (canvas) CharRenderer.drawPaperDoll(canvas, player);

        // Equipment slots
        document.querySelectorAll('.equip-slot').forEach(slot => {
            const slotName = slot.dataset.slot;
            const equipped = player.equipment[slotName];
            if (equipped) {
                const base = ItemDB[equipped.id];
                slot.textContent = base?.icon || '⚔️';
                slot.classList.add('filled');
                slot.title = base?.name || slotName;
                slot.onclick = () => {
                    player.unequipItem(slotName);
                    this.updateCharInfo();
                    this.renderInventory();
                };
            } else {
                const defaultIcons = { helmet: '🪖', weapon: '⚔️', armor: '🛡️', offhand: '🗡️', boots: '👢', accessory: '💍' };
                slot.textContent = defaultIcons[slotName] || '?';
                slot.classList.remove('filled');
                slot.title = slotName;
                slot.onclick = null;
            }
        });
    },

    toggleSkills() {
        const panel = document.getElementById('panel-skills');
        if (panel.classList.contains('hidden')) {
            this.closeAllPanels();
            panel.classList.remove('hidden');
            this.updateSkills();
        } else {
            this.closePanel('skills');
        }
        document.getElementById('btn-skills').classList.toggle('active', !panel.classList.contains('hidden'));
    },

    updateSkills() {
        const player = window.GameSystem?.player;
        if (!player) return;

        document.getElementById('skill-points').textContent = player.skillPoints;

        const grid = document.getElementById('skills-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const allSkills = SkillDB.getForRace(player.race);

        for (const skill of allSkills) {
            const currentLevel = player.skills[skill.id] || 0;
            const maxed = currentLevel >= skill.maxLevel;

            const item = document.createElement('div');
            item.className = `skill-item ${maxed ? 'maxed' : ''}`;
            item.innerHTML = `
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level">${currentLevel > 0 ? `Lv ${currentLevel}/${skill.maxLevel}` : 'Chưa học'}</div>
                ${skill.mpCost > 0 ? `<div class="skill-mp">MP: ${skill.mpCost}</div>` : '<div class="skill-mp">Thụ động</div>'}
                ${!maxed && player.skillPoints > 0 && currentLevel < skill.maxLevel ?
                    `<button class="skill-upgrade-btn" onclick="GameSystem.player.upgradeSkill('${skill.id}')">+</button>` : ''}
            `;

            item.title = `${skill.name} - ${skill.desc}\nMP: ${skill.mpCost}${skill.cooldown > 0 ? ` | CD: ${skill.cooldown} lượt` : ''}`;

            // Drag to hotbar on click
            item.onclick = () => {
                if (currentLevel > 0) {
                    const empty = player.hotbar.findIndex(h => h === null);
                    if (empty !== -1) {
                        player.hotbar[empty] = skill.id;
                        this.updateHotbar();
                        Utils.notify(`${skill.name} thêm vào hotbar!`, 'success');
                    }
                }
            };

            grid.appendChild(item);
        }
    },

    toggleQuests() {
        const panel = document.getElementById('panel-quests');
        if (panel.classList.contains('hidden')) {
            this.closeAllPanels();
            panel.classList.remove('hidden');
            this.updateQuests();
        } else {
            this.closePanel('quests');
        }
        document.getElementById('btn-quests').classList.toggle('active', !panel.classList.contains('hidden'));
    },

    updateQuests() {
        const player = window.GameSystem?.player;
        if (!player) return;

        const list = document.getElementById('quest-list');
        if (!list) return;
        list.innerHTML = '';

        const quests = this.questTab === 'active' ? player.activeQuests : player.completedQuests;

        for (const questId of quests) {
            const quest = QuestDB[questId];
            if (!quest) continue;

            const item = document.createElement('div');
            item.className = `quest-item ${questId === this.selectedQuestId ? 'selected' : ''} ${this.questTab === 'completed' ? 'completed' : ''}`;

            // Calculate progress
            const progress = player.questProgress[questId];
            let progressText = '';
            if (progress) {
                const done = progress.filter(o => o.current >= o.count).length;
                progressText = `${done}/${progress.length} mục tiêu`;
            }

            item.innerHTML = `
                <span class="quest-icon">${quest.icon}</span>
                <span class="quest-name">${quest.name}</span>
                <span class="quest-status">${this.questTab === 'completed' ? '✅' : progressText}</span>
            `;
            item.onclick = () => {
                this.selectedQuestId = questId;
                this.updateQuests();
                this.showQuestDetail(questId);
            };
            list.appendChild(item);
        }

        if (quests.length === 0) {
            list.innerHTML = `<div style="padding:12px;color:#666;text-align:center;font-size:0.8rem">${this.questTab === 'active' ? 'Chưa có nhiệm vụ nào' : 'Chưa hoàn thành nhiệm vụ nào'}</div>`;
        }

        if (this.selectedQuestId) this.showQuestDetail(this.selectedQuestId);
    },

    showQuestDetail(questId) {
        const player = window.GameSystem?.player;
        const quest = QuestDB[questId];
        const detail = document.getElementById('quest-detail');
        if (!quest || !detail) return;

        const progress = player.questProgress[questId];
        const isComplete = player.completedQuests.includes(questId);

        let objectivesHtml = '';
        if (progress) {
            for (const obj of progress) {
                const done = obj.current >= obj.count;
                objectivesHtml += `<div class="quest-objective-item ${done ? 'done' : ''}">
                    ${done ? '✅' : '⬜'} ${obj.desc} (${obj.current}/${obj.count})
                </div>`;
            }
        }

        let rewardsHtml = '';
        if (quest.rewards) {
            if (quest.rewards.exp) rewardsHtml += `<div class="quest-reward-item">✨ ${Utils.formatNum(quest.rewards.exp)} EXP</div>`;
            if (quest.rewards.zeni) rewardsHtml += `<div class="quest-reward-item">💰 ${Utils.formatNum(quest.rewards.zeni)} Zeni</div>`;
            if (quest.rewards.statPoints) rewardsHtml += `<div class="quest-reward-item">📈 +${quest.rewards.statPoints} điểm chỉ số</div>`;
            if (quest.rewards.skillPoints) rewardsHtml += `<div class="quest-reward-item">⚡ +${quest.rewards.skillPoints} điểm kỹ năng</div>`;
            if (quest.rewards.items) {
                for (const ri of quest.rewards.items) {
                    const b = ItemDB[ri.id];
                    rewardsHtml += `<div class="quest-reward-item">${b?.icon || '🎁'} ${b?.name || ri.id} x${ri.qty}</div>`;
                }
            }
        }

        detail.innerHTML = `
            <div class="quest-title">${quest.icon} ${quest.name} ${isComplete ? '<span style="color:#2ECC71">✅ Hoàn thành</span>' : ''}</div>
            <div class="quest-desc">${quest.desc}</div>
            ${!isComplete ? `<div class="quest-objectives"><h5>📌 Mục tiêu:</h5>${objectivesHtml}</div>` : ''}
            <div class="quest-rewards"><h5>🏆 Phần thưởng:</h5>${rewardsHtml}</div>
        `;
    },

    switchQuestTab(tab) {
        this.questTab = tab;
        this.selectedQuestId = null;
        document.querySelectorAll('#panel-quests .tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', ['active','completed'][i] === tab);
        });
        document.getElementById('quest-detail').innerHTML = '';
        this.updateQuests();
    },

    toggleWorldMap() {
        const panel = document.getElementById('panel-worldmap');
        if (panel.classList.contains('hidden')) {
            this.closeAllPanels();
            panel.classList.remove('hidden');
            const canvas = document.getElementById('world-map-canvas');
            const player = window.GameSystem?.player;
            WorldRenderer.renderWorldMap(canvas, player?.mapId || 'east_city');
        } else {
            this.closePanel('worldmap');
        }
        document.getElementById('btn-map').classList.toggle('active', !panel.classList.contains('hidden'));
    },

    toggleSettings() {
        const panel = document.getElementById('panel-settings');
        if (panel.classList.contains('hidden')) {
            this.closeAllPanels();
            panel.classList.remove('hidden');
        } else {
            this.closePanel('settings');
        }
    },

    closePanel(name) {
        const panels = {
            inventory: 'panel-inventory',
            character: 'panel-character',
            skills: 'panel-skills',
            quests: 'panel-quests',
            worldmap: 'panel-worldmap',
            settings: 'panel-settings',
            shop: 'panel-shop',
            'player-interaction': 'panel-player-interaction',
            trade: 'panel-trade'
        };
        const id = panels[name];
        if (id) document.getElementById(id)?.classList.add('hidden');

        if (name === 'trade') this.isTrading = false;

        const btnMap = { inventory: 'btn-inventory', character: 'btn-character', skills: 'btn-skills', quests: 'btn-quests', worldmap: 'btn-map' };
        const btnId = btnMap[name];
        if (btnId) document.getElementById(btnId)?.classList.remove('active');
    },

    closeAllPanels() {
        ['inventory','character','skills','quests','worldmap','settings','shop', 'player-interaction'].forEach(p => this.closePanel(p));
        NPCSystem.close();
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    },

    // Chat
    sendChat() {
        const input = document.getElementById('chat-input');
        if (!input || !input.value.trim()) return;
        const player = window.GameSystem?.player;
        const msg = input.value.trim();
        input.value = '';
        Utils.chat(`${player?.name || 'Bạn'}: ${msg}`, 'player');
    },

    // Target display
    showTarget(entity) {
        const info = document.getElementById('target-info');
        if (!info) return;
        document.getElementById('target-name').textContent = entity.name;
        document.getElementById('target-level').textContent = `Lv.${entity.level || '?'}`;
        const pct = entity.currentHp !== undefined ? entity.currentHp / entity.maxHp * 100 : 100;
        document.getElementById('target-hp-bar').style.width = pct + '%';
        info.classList.remove('hidden');
    },

    hideTarget() {
        document.getElementById('target-info')?.classList.add('hidden');
    },

    // ===== PLAYER INTERACTION & SOCIAL =====
    selectedRemotePlayer: null,

    showPlayerInteraction(target, updateOnly = false) {
        if (this.isTrading && !updateOnly) {
            Utils.notify('Bạn đang trong trạng thái giao dịch!', 'warning');
            return;
        }
        if (!updateOnly) this.closeAllPanels();
        const panel = document.getElementById('panel-player-interaction');
        panel.classList.remove('hidden');

        document.getElementById('interact-player-name').textContent = target.name;
        document.getElementById('interact-player-level').textContent = `Lv.${target.level || 1}`;
        
        const avatars = { human: '🧍', namek: '👾', xayda: '🫃' };
        document.getElementById('interact-player-avatar').textContent = avatars[target.race] || '🧍';

        const hpPct = (target.hp / target.maxHp * 100).toFixed(0);
        document.getElementById('interact-player-hp-fill').style.width = hpPct + '%';
        document.getElementById('interact-player-hp-text').textContent = `${target.hp} / ${target.maxHp}`;
        
        // Lưu ngữ cảnh người chơi đang tương tác
        this.selectedRemotePlayer = target;
    },

    requestPK() {
        if (!this.selectedRemotePlayer) return;
        const player = window.GameSystem?.player;
        if (!player) return;

        // Pushes to Social Queue for relay
        WorldSystem.socialQueue.push({
            type: 'pk',
            targetUsername: this.selectedRemotePlayer.username,
            from: player.name
        });

        Utils.chat(`⚔️ Bạn đã thách đấu PK với ${this.selectedRemotePlayer.name}! Đang chờ phản hồi...`, 'warning');
        this.closePanel('player-interaction');
    },

    requestTrade() {
        if (!this.selectedRemotePlayer) return;
        const player = window.GameSystem?.player;

        WorldSystem.socialQueue.push({
            type: 'trade',
            targetUsername: this.selectedRemotePlayer.username,
            from: player.name
        });

        Utils.notify(`Đã gửi lời mời giao dịch tới ${this.selectedRemotePlayer.name}`, 'info');
        this.closePanel('player-interaction');
    },

    addFriend() {
        if (!this.selectedRemotePlayer) return;
        const player = window.GameSystem?.player;

        WorldSystem.socialQueue.push({
            type: 'friend',
            targetUsername: this.selectedRemotePlayer.username,
            from: player.name
        });

        Utils.notify(`Đã gửi lời mời kết bạn tới ${this.selectedRemotePlayer.name}`, 'success');
        this.closePanel('player-interaction');
    },

    inviteParty() {
        if (!this.selectedRemotePlayer) return;
        const player = window.GameSystem?.player;

        // Nếu mời, mình tự tạo ID nhóm trước để chờ người kia vào
        if (!player.partyId) player.partyId = 'party_' + player.name;

        WorldSystem.socialQueue.push({
            type: 'party',
            targetUsername: this.selectedRemotePlayer.username,
            from: player.name
        });

        Utils.notify(`Đã mời ${this.selectedRemotePlayer.name} vào nhóm`, 'info');
        this.closePanel('player-interaction');
        this.updatePartyHUD();
    },

    disbandParty() {
        const player = window.GameSystem?.player;
        if (!player || !player.partyId) return;

        if (player.partyId !== 'party_' + player.name) {
            Utils.chat(`Bạn đã rời khỏi nhóm.`, 'info');
        } else {
            Utils.chat(`Bạn đã giải tán nhóm.`, 'warning');
            // Logic kick members (đơn giản hóa: member sẽ tự văng khi thấy sync khác partyId)
        }
        player.partyId = null;
        this.updatePartyHUD();
    },

    kickMember(name) {
        const player = window.GameSystem?.player;
        if (player.partyId !== 'party_' + player.name) return;

        WorldSystem.socialQueue.push({
            type: 'party_kick',
            targetUsername: name,
            from: player.name
        });
        Utils.chat(`Đã trục xuất ${name} khỏi nhóm.`, 'info');
    },

    acceptSocial() { WorldSystem.acceptSocial(); },
    rejectSocial() { WorldSystem.rejectSocial(); },

    changeFlag(value) {
        const player = window.GameSystem?.player;
        if (!player) return;
        player.flag = value;
        Utils.chat(`🚩 Bạn đã đổi sang ${value === 'none' ? 'trạng thái Hòa bình' : 'Cờ ' + value.toUpperCase()}`, 'system');
        this.updateHUD();
    },

    openTrade(partnerName) {
        this.closeAllPanels();
        const panel = document.getElementById('panel-trade');
        panel.classList.remove('hidden');
        document.getElementById('trade-partner-name').textContent = partnerName;
        document.getElementById('my-trade-status').textContent = 'Đang chọn đồ...';
        document.getElementById('partner-trade-status').textContent = 'Đang chọn đồ...';
        document.getElementById('btn-lock-trade').classList.remove('hidden');
        document.getElementById('btn-confirm-trade').classList.add('hidden');
        
        this.isTrading = true;
        this.tradeItems = [];
        this.updateTradeUI();
    },

    addTradeItem(item, index) {
        if (this.tradeItems.length >= 8) {
            Utils.notify('Giao dịch tối đa 8 vật phẩm!', 'warning');
            return;
        }
        if (this.tradeItems.find(i => i.index === index)) return;
        this.tradeItems.push({ ...item, index });
        this.updateTradeUI();
        Utils.notify(`Đã đưa ${item.name} vào giao dịch.`, 'success');
    },

    updateTradeUI() {
        const container = document.getElementById('my-trade-slots');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'inv-slot';
            if (this.tradeItems[i]) {
                slot.innerHTML = `<span class="item-icon">${this.tradeItems[i].icon}</span>`;
            }
            container.appendChild(slot);
        }
    },

    lockTrade() {
        document.getElementById('my-trade-status').textContent = 'Đã KHÓA';
        document.getElementById('my-trade-status').style.color = '#FFD700';
        document.getElementById('btn-lock-trade').classList.add('hidden');
        document.getElementById('btn-confirm-trade').classList.remove('hidden');
        Utils.chat('Bạn đã khóa giao dịch. Hãy kiểm tra kỹ trước khi xác nhận!', 'warning');
    },

    confirmTrade() {
        Utils.notify('Giao dịch hoàn tất!', 'success');
        this.closePanel('trade');
        // Ở phiên bản này chúng ta giả lập thành công ngay lập tức
    },

    switchCharTab(tab) {
        document.querySelectorAll('.char-tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`tab-${tab}`).classList.remove('hidden');
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => {
             const t = b.textContent.toLowerCase();
             if (tab === 'stats') return t.includes('chỉ số');
             if (tab === 'equip') return t.includes('trang bị');
             if (tab === 'enemies') return t.includes('kẻ thù');
             if (tab === 'friends') return t.includes('bạn bè');
             return false;
        });
        if (btn) btn.classList.add('active');

        if (tab === 'enemies') this.updateEnemyList();
        if (tab === 'friends') this.updateFriendList();
    },

    updateFriendList() {
        const player = window.GameSystem?.player;
        if (!player) return;
        const list = document.getElementById('friend-list');
        if (!list) return;
        list.innerHTML = '';
        if (player.friends.length === 0) {
            list.innerHTML = '<li style="color:#666;text-align:center;padding:20px;width:100%;">Chưa có bạn bè.</li>';
            return;
        }
        player.friends.forEach(name => {
            const li = document.createElement('li');
            li.className = 'enemy-item'; // Dùng chung style
            li.innerHTML = `
                <span class="friend-name" style="color:#00F2FF;">🔵 ${name}</span>
                <button class="btn-remove-enemy" onclick="GameUI.removeFriend('${name}')">Xóa</button>
            `;
            list.appendChild(li);
        });
    },

    removeFriend(name) {
        const player = window.GameSystem?.player;
        if (!player) return;
        player.friends = player.friends.filter(e => e !== name);
        this.updateFriendList();
    },

    updatePartyHUD() {
        const player = window.GameSystem?.player;
        const hud = document.getElementById('party-hud');
        if (!player || !player.partyId) {
            hud.classList.add('hidden');
            return;
        }
        hud.classList.remove('hidden');
        const container = document.getElementById('party-members');
        container.innerHTML = '';
        
        // Luôn có bản thân
        const members = [{ name: player.name, hp: player.stats.hp, maxHp: player.stats.maxHp }];
        // Thêm member từ sync data (giả lập)
        WorldSystem.remotePlayers.forEach(p => {
            if (p.party && p.party.id === player.partyId) {
                members.push(p);
            }
        });

        members.forEach(m => {
            const div = document.createElement('div');
            div.className = 'party-mem';
            const pct = (m.hp / m.maxHp * 100).toFixed(0);
            div.innerHTML = `
                <div>${m.name}</div>
                <div class="party-hp-bar"><div class="party-hp-fill" style="width:${pct}%"></div></div>
            `;
            container.appendChild(div);
        });
    },

    updateEnemyList() {
        const player = window.GameSystem?.player;
        if (!player) return;
        const list = document.getElementById('enemy-list');
        if (!list) return;
        list.innerHTML = '';
        if (player.enemies.length === 0) {
            list.innerHTML = '<li style="color:#666;text-align:center;padding:20px;width:100%;">Danh sách kẻ thù trống.</li>';
            return;
        }
        player.enemies.forEach(name => {
            const li = document.createElement('li');
            li.className = 'enemy-item';
            li.innerHTML = `
                <span class="enemy-name">💀 ${name}</span>
                <button class="btn-remove-enemy" onclick="GameUI.removeEnemy('${name}')">Xóa</button>
            `;
            list.appendChild(li);
        });
    },

    removeEnemy(name) {
        const player = window.GameSystem?.player;
        if (!player) return;
        player.enemies = player.enemies.filter(e => e !== name);
        this.updateEnemyList();
    }
};

// ===== GAME SETTINGS =====
const GameSettings = {
    settings: {
        showNpcNames: true,
        showMonsterHp: true,
        combatEffects: true
    },

    toggle(key, val) {
        this.settings[key] = val;
        Utils.save('settings', this.settings);
    },

    load() {
        const saved = Utils.load('settings');
        if (saved) Object.assign(this.settings, saved);
    }
};

// ===== GAME SYSTEM =====
const GameSystem = {
    player: null,

    addStat(stat) {
        if (this.player) {
            this.player.addStat(stat);
            this.saveGame();
        }
    },

    saveGame() {
        if (!this.player) return;
        const saves = Utils.load('saves') || {};
        saves[this.player.id] = this.player.toJSON();
        Utils.save('saves', saves);
    },

    loadGame(charId) {
        const saves = Utils.load('saves') || {};
        const data = saves[charId];
        if (!data) return null;
        return new Character(data);
    }
};
