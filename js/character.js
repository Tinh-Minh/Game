/* ==========================================
   CHARACTER.JS - Character System
   ========================================== */

class Character {
    constructor(data = {}) {
        this.id = data.id || Utils.genId();
        this.name = data.name || 'Chiến Binh';
        this.race = data.race || 'human';
        this.gender = data.gender || 'male';
        this.hairColor = data.hairColor || '#1a1a1a';
        this.slotIndex = data.slotIndex || 0;

        // Level & EXP
        this.level = data.level || 1;
        this.exp = data.exp || 0;
        this.expToNext = this.calcExpToNext(this.level);

        // Base stats (allocated by player)
        this.baseStats = data.baseStats || {
            str: 10, agi: 10, vit: 10, int: 10, luk: 5
        };
        this.statPoints = data.statPoints !== undefined ? data.statPoints : 0;
        this.skillPoints = data.skillPoints !== undefined ? data.skillPoints : 3;

        // Computed stats (recalculated)
        this.stats = {
            maxHp: 0, hp: 0, maxMp: 0, mp: 0,
            atk: 0, def: 0, spd: 0, crit: 0, critDmg: 150,
            dodge: 0
        };

        // Previous HP/MP for restore
        this._prevHp = data._prevHp;
        this._prevMp = data._prevMp;

        // Equipment slots
        this.equipment = data.equipment || {
            helmet: null, weapon: null, armor: null,
            offhand: null, boots: null, accessory: null
        };

        // Inventory (array of item instances)
        this.inventory = data.inventory || [];

        // Skills: { skillId: level }
        this.skills = data.skills || this.getStarterSkills();

        // Hotbar: array of skill IDs or item IDs
        this.hotbar = data.hotbar || ['basic_attack', null, null, null, null, null, null, null];

        // Zeni & Diamonds
        this.zeni = data.zeni !== undefined ? data.zeni : 500;
        this.diamonds = data.diamonds !== undefined ? data.diamonds : 10000;

        // Map position
        this.mapId = data.mapId || 'east_city';
        this.x = data.x !== undefined ? data.x : 14;
        this.y = data.y !== undefined ? data.y : 11;

        // PVP & Social
        this.flag = data.flag || 'none'; // 'none', 'black', 'red', 'blue', 'yellow', 'purple', 'white'
        this.enemies = data.enemies || [];
        this.partyId = data.partyId || null; 
        this.friends = data.friends || [];

        // Combat state
        this.buffs = [];
        this.debuffs = [];
        this.isDefending = false;

        // Quests
        this.activeQuests = data.activeQuests || [];
        this.completedQuests = data.completedQuests || [];

        // Tracked quest objectives
        this.questProgress = data.questProgress || {};

        // Stats tracking
        this.playTime = data.playTime || 0;
        this.monstersKilled = data.monstersKilled || 0;
        this.questsDone = data.questsDone || 0;

        // Starter items
        if (!data.inventory) {
            this.giveStarterItems();
        }

        this.recalcStats();
        // Restore HP/MP if loading saved data
        if (this._prevHp !== undefined) {
            this.stats.hp = Math.min(this._prevHp, this.stats.maxHp);
        }
        if (this._prevMp !== undefined) {
            this.stats.mp = Math.min(this._prevMp, this.stats.maxMp);
        }
    }

    getStarterSkills() {
        const base = { 'basic_attack': 1, 'ki_charge': 1, 'guard': 1 };
        if (this.race === 'human') {
            base['kamehameha'] = 1;
            base['solar_flare'] = 1;
        } else if (this.race === 'namek') {
            base['mystic_attack'] = 1;
            base['healing'] = 1;
        } else if (this.race === 'majin') {
            base['dark_energy'] = 1;
            base['buu_absorb'] = 1;
        }
        return base;
    }

    giveStarterItems() {
        const starterItems = [
            { id: 'wooden_sword', qty: 1 },
            { id: 'cloth_armor', qty: 1 },
            { id: 'bandana', qty: 1 },
            { id: 'cloth_boots', qty: 1 },
            { id: 'small_hp_pot', qty: 10 },
            { id: 'small_mp_pot', qty: 5 }
        ];
        for (const item of starterItems) {
            this.addItem(item.id, item.qty);
        }
        // Auto-equip starter gear
        this.equipItem('wooden_sword');
        this.equipItem('cloth_armor');
        this.equipItem('bandana');
        this.equipItem('cloth_boots');
    }

    recalcStats() {
        const { str, agi, vit, int: INT, luk } = this.baseStats;
        const race = this.race;

        // Base HP/MP by race
        let hpBase = 80 + vit * 12 + this.level * 10;
        let mpBase = 30 + INT * 5 + this.level * 5;
        if (race === 'namek') { hpBase *= 1.2; mpBase *= 1.1; }
        if (race === 'majin') { hpBase *= 1.3; mpBase *= 0.8; }
        if (race === 'human') { mpBase *= 1.15; }

        let atk = str * 3 + agi * 0.5 + this.level * 2;
        let def = vit * 2 + str * 0.5 + this.level * 1.5;
        let spd = agi * 2 + this.level * 0.5;
        let crit = luk * 0.3 + agi * 0.1;
        let dodge = agi * 0.2 + luk * 0.1;

        // Add equipment bonuses
        for (const slot of Object.values(this.equipment)) {
            if (!slot) continue;
            const item = ItemDB[slot.id];
            if (!item || !item.stats) continue;
            atk += item.stats.atk || 0;
            def += item.stats.def || 0;
            spd += item.stats.spd || 0;
            crit += item.stats.crit || 0;
            dodge += item.stats.dodge || 0;
            hpBase += item.stats.hp || 0;
            mpBase += item.stats.mp || 0;
        }

        // PASSIVE & EQUIPMENT BONUSES...
        // Passives
        for (const [skillId, level] of Object.entries(this.skills)) {
            const skill = SkillDB[skillId];
            if (skill && skill.type === 'passive' && skill.passiveEffect) {
                const eff = skill.passiveEffect(this, level);
                if (eff.regenHp) this.regenHp = eff.regenHp;
            }
        }

        // PARTY SYNERGY BUFFS
        let hasHuman = (this.race === 'human');
        let hasXayda = (this.race === 'xayda');
        
        if (typeof WorldSystem !== 'undefined' && this.partyId) {
            WorldSystem.remotePlayers.forEach(p => {
                if (p.party && p.party.id === this.partyId) {
                    if (p.race === 'human') hasHuman = true;
                    if (p.race === 'xayda') hasXayda = true;
                }
            });
        }

        // Xayda Buffs & Penalties
        if (this.race === 'xayda') {
            if (hasHuman) {
                atk *= 0.8; // Giảm 20% sức đánh nếu có Trái Đất
            } else {
                hpBase *= 1.3; // +30% HP
                atk *= 1.2;    // +20% ATK
            }
        }
        // Human Buffs
        if (this.race === 'human' && hasXayda) {
            atk *= 1.5;    // +50% ATK
            hpBase *= 1.1; // +10% HP
        }

        const oldMaxHp = this.stats.maxHp;
        const oldHp = this.stats.hp;

        this.stats.maxHp = Math.floor(hpBase);
        this.stats.maxMp = Math.floor(mpBase);
        this.stats.atk = Math.floor(atk);
        this.stats.def = Math.floor(def);
        this.stats.spd = Math.floor(spd);

        // Scale HP if max changed
        if (oldMaxHp > 0) {
            this.stats.hp = Math.floor((oldHp / oldMaxHp) * this.stats.maxHp);
        } else {
            this.stats.hp = this.stats.maxHp;
        }

        this.stats.hp = Utils.clamp(this.stats.hp, 0, this.stats.maxHp);
    }

    gainExp(amount) {
        // Namekian Team Buff (x2 EXP)
        let expMult = 1;
        let hasNamekInTeam = (this.race === 'namek');
        
        if (typeof WorldSystem !== 'undefined' && this.partyId) {
            WorldSystem.remotePlayers.forEach(p => {
                if (p.party && p.party.id === this.partyId && p.race === 'namek') {
                    hasNamekInTeam = true;
                }
            });
        }
        if (hasNamekInTeam) expMult = 2;
        
        const finalExp = amount * expMult;
        this.exp += finalExp;
        Utils.chat(`✨ Nhận được ${Utils.formatNum(finalExp)} EXP ${expMult > 1 ? '(x2 Namek)' : ''}`, 'exp');
        
        let leveledUp = false;
        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.level++;
            this.expToNext = this.calcExpToNext(this.level);
            this.statPoints += 5;
            this.skillPoints += 2;
            leveledUp = true;
            this.recalcStats();
            this.stats.hp = this.stats.maxHp;
            this.showLevelUp();
        }
        if (leveledUp) this.checkQuestObjectives('reach_level', this.level);
        GameUI.updateHUD();
        return leveledUp;
    }

    calcExpToNext(level) {
        return Math.floor(100 * Math.pow(level, 1.8));
    }

    showLevelUp() {
        const el = document.getElementById('levelup-notification');
        const lv = document.getElementById('levelup-level');
        if (!el || !lv) return;
        lv.textContent = `Cấp ${this.level}`;
        el.classList.remove('hidden');
        Utils.chat(`🌟 THĂNG CẤP! Bạn đã đạt cấp ${this.level}!`, 'system');
        Utils.notify(`🌟 Thăng cấp ${this.level}! +5 điểm chỉ số, +2 điểm kỹ năng`, 'success');
        setTimeout(() => el.classList.add('hidden'), 3000);
    }

    addItem(itemId, qty = 1) {
        const base = ItemDB[itemId];
        if (!base) return false;
        if (base.stackable) {
            const existing = this.inventory.find(i => i.id === itemId);
            if (existing) { existing.qty += qty; return true; }
        }
        this.inventory.push(ItemDB.create(itemId, qty));
        return true;
    }

    removeItem(instanceId, qty = 1) {
        const idx = this.inventory.findIndex(i => i.instanceId === instanceId);
        if (idx === -1) return false;
        if (this.inventory[idx].qty > qty) {
            this.inventory[idx].qty -= qty;
        } else {
            this.inventory.splice(idx, 1);
        }
        return true;
    }

    removeItemById(itemId, qty = 1) {
        const idx = this.inventory.findIndex(i => i.id === itemId);
        if (idx === -1) return false;
        this.inventory[idx].qty -= qty;
        if (this.inventory[idx].qty <= 0) this.inventory.splice(idx, 1);
        return true;
    }

    hasItem(itemId, qty = 1) {
        const item = this.inventory.find(i => i.id === itemId);
        return item && item.qty >= qty;
    }

    equipItem(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return false;
        const base = ItemDB[itemId];
        if (!base || !base.slot) return false;
        // Check level req
        if (base.levelReq && this.level < base.levelReq) {
            Utils.notify(`Cần cấp ${base.levelReq} để trang bị!`, 'warning');
            return false;
        }
        // Unequip current
        if (this.equipment[base.slot]) {
            this.inventory.push(Utils.deepClone(this.equipment[base.slot]));
        }
        this.equipment[base.slot] = item;
        this.removeItemById(itemId, 1);
        this.recalcStats();
        GameUI.updateHUD();
        Utils.notify(`Trang bị ${base.name}`, 'success');
        return true;
    }

    unequipItem(slot) {
        if (!this.equipment[slot]) return false;
        this.inventory.push(Utils.deepClone(this.equipment[slot]));
        this.equipment[slot] = null;
        this.recalcStats();
        GameUI.updateHUD();
        return true;
    }

    useItem(instanceId) {
        const item = this.inventory.find(i => i.instanceId === instanceId);
        if (!item) return false;
        const base = ItemDB[item.id];
        if (!base) return false;

        if (base.type === 'potion' && base.effect) {
            const eff = base.effect;
            if (eff.type === 'heal') {
                const heal = Math.min(eff.value, this.stats.maxHp - this.stats.hp);
                this.stats.hp += heal;
                Utils.chat(`💚 Hồi phục ${heal} HP`, 'loot');
                Utils.notify(`Hồi phục ${heal} HP`, 'success');
            } else if (eff.type === 'mana') {
                const restore = Math.min(eff.value, this.stats.maxMp - this.stats.mp);
                this.stats.mp += restore;
                Utils.chat(`💙 Hồi phục ${restore} MP`, 'loot');
                Utils.notify(`Hồi phục ${restore} MP`, 'info');
            } else if (eff.type === 'full_restore') {
                this.stats.hp = this.stats.maxHp;
                this.stats.mp = this.stats.maxMp;
                Utils.chat('✨ Đậu Thần! HP và MP đã hồi phục đầy!', 'system');
                Utils.notify('HP & MP đã hồi phục đầy!', 'success');
            } else if (eff.type === 'zeni') {
                this.zeni += eff.value;
                Utils.chat(`💰 Nhận được ${eff.value} Zeni`, 'loot');
            }
            this.removeItem(instanceId, 1);
            GameUI.updateHUD();
            return true;
        }
        return false;
    }

    addStat(statName) {
        if (this.statPoints <= 0) {
            Utils.notify('Không đủ điểm chỉ số!', 'warning');
            return false;
        }
        if (!this.baseStats.hasOwnProperty(statName)) return false;
        this.baseStats[statName]++;
        this.statPoints--;
        this.recalcStats();
        GameUI.updateCharInfo();
        GameUI.updateHUD();
        return true;
    }

    upgradeSkill(skillId) {
        const skill = SkillDB[skillId];
        if (!skill) return false;
        if (!skill.races.includes(this.race) && skillId !== 'basic_attack' && skillId !== 'ki_charge' && skillId !== 'guard') return false;
        const currentLevel = this.skills[skillId] || 0;
        if (currentLevel >= skill.maxLevel) {
            Utils.notify('Kỹ năng đã đạt tối đa!', 'warning');
            return false;
        }
        if (this.skillPoints <= 0) {
            Utils.notify('Không đủ điểm kỹ năng!', 'warning');
            return false;
        }
        this.skills[skillId] = currentLevel + 1;
        this.skillPoints--;
        Utils.notify(`Nâng cấp ${skill.name} lên cấp ${this.skills[skillId]}!`, 'success');
        GameUI.updateSkills();
        return true;
    }

    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        GameUI.updateHUD();
    }

    restoreMP(amount) {
        this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + amount);
        GameUI.updateHUD();
    }

    takeDamage(amount) {
        const actual = Math.max(1, amount);
        this.stats.hp = Math.max(0, this.stats.hp - actual);
        GameUI.updateHUD();
        return actual;
    }

    isAlive() { return this.stats.hp > 0; }

    fullRestore() {
        this.stats.hp = this.stats.maxHp;
        this.stats.mp = this.stats.maxMp;
        this.buffs = [];
        this.debuffs = [];
        this.isDefending = false;
        GameUI.updateHUD();
    }

    // Quest system
    acceptQuest(questId) {
        const quest = QuestDB[questId];
        if (!quest) return false;
        if (this.activeQuests.includes(questId)) {
            Utils.notify('Bạn đã nhận nhiệm vụ này rồi!', 'warning');
            return false;
        }
        if (this.completedQuests.includes(questId)) {
            Utils.notify('Bạn đã hoàn thành nhiệm vụ này rồi!', 'info');
            return false;
        }
        if (quest.minLevel && this.level < quest.minLevel) {
            Utils.notify(`Cần cấp ${quest.minLevel} để nhận nhiệm vụ này!`, 'warning');
            return false;
        }
        this.activeQuests.push(questId);
        this.questProgress[questId] = quest.objectives.map(obj => ({ ...obj, current: 0 }));
        Utils.chat(`📜 Nhận nhiệm vụ: ${quest.name}`, 'system');
        Utils.notify(`Nhận nhiệm vụ: ${quest.name}`, 'success');
        GameUI.updateQuests();
        return true;
    }

    checkQuestObjectives(type, target, count = 1) {
        for (const questId of [...this.activeQuests]) {
            const progress = this.questProgress[questId];
            if (!progress) continue;
            let changed = false;
            for (const obj of progress) {
                if (obj.type !== type) continue;
                let matches = false;
                if (type === 'kill' && obj.target === target) matches = true;
                if (type === 'collect' && obj.target === target) matches = true;
                if (type === 'visit' && obj.target === target) matches = true;
                if (type === 'reach_level' && this.level >= obj.target) {
                    obj.current = 1;
                    changed = true;
                    continue;
                }
                if (matches && obj.current < obj.count) {
                    obj.current = Math.min(obj.count, obj.current + count);
                    changed = true;
                }
            }
            if (changed) {
                // Check if quest complete
                if (progress.every(o => o.current >= o.count)) {
                    this.completeQuest(questId);
                }
                GameUI.updateQuests();
            }
        }
    }

    completeQuest(questId) {
        const quest = QuestDB[questId];
        if (!quest) return;
        const idx = this.activeQuests.indexOf(questId);
        if (idx !== -1) this.activeQuests.splice(idx, 1);
        this.completedQuests.push(questId);
        this.questsDone++;

        // Give rewards
        if (quest.rewards.exp) this.gainExp(quest.rewards.exp);
        if (quest.rewards.zeni) {
            this.zeni += quest.rewards.zeni;
            Utils.chat(`💰 Nhận ${Utils.formatNum(quest.rewards.zeni)} Zeni`, 'loot');
        }
        if (quest.rewards.statPoints) {
            this.statPoints += quest.rewards.statPoints;
            Utils.notify(`+${quest.rewards.statPoints} điểm chỉ số!`, 'success');
        }
        if (quest.rewards.skillPoints) {
            this.skillPoints += quest.rewards.skillPoints;
            Utils.notify(`+${quest.rewards.skillPoints} điểm kỹ năng!`, 'success');
        }
        if (quest.rewards.items) {
            for (const item of quest.rewards.items) {
                this.addItem(item.id, item.qty);
                Utils.chat(`🎁 Nhận vật phẩm: ${ItemDB[item.id]?.name || item.id} x${item.qty}`, 'loot');
            }
        }

        Utils.chat(`✅ Hoàn thành nhiệm vụ: ${quest.name}!`, 'system');
        Utils.notify(`Hoàn thành: ${quest.name}!`, 'success', 5000);

        delete this.questProgress[questId];
        GameUI.updateQuests();
        GameUI.updateHUD();
    }

    // Auto-regen per turn/tick
    regenTick() {
        const hpRegen = Math.floor(this.stats.maxHp * 0.005) + 1;
        const mpRegen = Math.floor(this.stats.maxMp * 0.01) + 1;
        if (this.stats.hp < this.stats.maxHp) {
            this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + hpRegen);
        }
        if (this.stats.mp < this.stats.maxMp) {
            this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + mpRegen);
        }
        // Namek extra regen
        if (this.race === 'namek') {
            this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + Math.floor(this.stats.maxHp * 0.01));
        }
    }

    // Serialize for save
    toJSON() {
        return {
            id: this.id, name: this.name, race: this.race,
            gender: this.gender, hairColor: this.hairColor,
            slotIndex: this.slotIndex,
            level: this.level, exp: this.exp,
            baseStats: { ...this.baseStats },
            statPoints: this.statPoints, skillPoints: this.skillPoints,
            equipment: this.equipment, inventory: this.inventory,
            skills: this.skills, hotbar: this.hotbar,
            zeni: this.zeni, mapId: this.mapId, x: this.x, y: this.y,
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests,
            questProgress: this.questProgress,
            playTime: this.playTime, monstersKilled: this.monstersKilled,
            questsDone: this.questsDone,
            _prevHp: this.stats.hp, _prevMp: this.stats.mp
        };
    }
}
