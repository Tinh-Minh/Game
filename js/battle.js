/* ==========================================
   BATTLE.JS - Battle System
   ========================================== */

const BattleSystem = {
    active: false,
    player: null,
    enemy: null,
    playerTurn: true,
    round: 0,
    defending: false,
    onComplete: null,
    enemyPS: null,
    playerPS: null,

    // Start a battle
    start(player, monsterData, onComplete) {
        this.active = true;
        this.player = player;
        this.enemy = MonsterDB.create(monsterData.id);
        this.playerTurn = player.stats.spd >= (this.enemy.spd || 80);
        this.round = 0;
        this.defending = false;
        this.onComplete = onComplete;

        // Show battle UI
        document.getElementById('battle-ui').classList.remove('hidden');
        document.getElementById('game-canvas').style.filter = 'blur(3px) brightness(0.6)';

        // Update UI
        this.updateBattleUI();
        this.setActionsEnabled(this.playerTurn);

        // Draw battle characters
        this.drawBattlePlayer();
        this.drawBattleEnemy();

        // Log
        this.log(`⚔️ Bắt đầu chiến đấu! ${player.name} vs ${this.enemy.name}`, '#FF8C00');

        if (!this.playerTurn) {
            this.log(`${this.enemy.name} hành động trước!`, '#FF6B6B');
            setTimeout(() => this.enemyTurn(), 1500);
        }
    },

    log(msg, color = '#E8E8F0') {
        const log = document.getElementById('battle-log');
        if (!log) return;
        const el = document.createElement('div');
        el.className = 'battle-log-entry';
        el.style.color = color;
        el.textContent = msg;
        log.appendChild(el);
        while (log.children.length > 20) log.removeChild(log.firstChild);
        log.scrollTop = log.scrollHeight;
    },

    updateBattleUI() {
        if (!this.player || !this.enemy) return;
        const p = this.player.stats;
        const e = this.enemy;

        document.getElementById('battle-player-name').textContent = this.player.name;
        document.getElementById('battle-enemy-name').textContent = e.name;

        const php = (p.hp / p.maxHp * 100).toFixed(1);
        const pmp = (p.mp / p.maxMp * 100).toFixed(1);
        document.getElementById('battle-player-hp').style.width = php + '%';
        document.getElementById('battle-player-mp').style.width = pmp + '%';
        document.getElementById('battle-player-hp-text').textContent = `${p.hp}/${p.maxHp}`;

        const ehp = (e.currentHp / e.maxHp * 100).toFixed(1);
        document.getElementById('battle-enemy-hp').style.width = ehp + '%';
        document.getElementById('battle-enemy-hp-text').textContent = `${e.currentHp}/${e.maxHp}`;
    },

    setActionsEnabled(enabled) {
        const btns = document.querySelectorAll('.battle-btn');
        btns.forEach(b => b.disabled = !enabled);
    },

    // ===== PLAYER ACTIONS =====
    doAttack() {
        if (!this.playerTurn || !this.active) return;
        this.setActionsEnabled(false);
        this.hideMenus();

        const dmg = this.calcPlayerDamage();
        const isCrit = Math.random() * 100 < this.player.stats.crit;
        const finalDmg = isCrit ? Math.floor(dmg * this.player.stats.critDmg / 100) : dmg;
        const isDodge = Math.random() * 100 < (this.enemy.dodge || 0);

        if (isDodge) {
            this.log(`${this.enemy.name} né tránh đòn tấn công!`, '#888');
            this.showBattleDamage('enemy', 0, 'miss');
        } else {
            this.enemy.currentHp = Math.max(0, this.enemy.currentHp - finalDmg);
            if (isCrit) {
                this.log(`💥 Chí Mạng! ${this.player.name} gây ${finalDmg} sát thương lên ${this.enemy.name}!`, '#FF8800');
                this.showBattleDamage('enemy', finalDmg, 'crit');
            } else {
                this.log(`${this.player.name} gây ${finalDmg} sát thương lên ${this.enemy.name}.`, '#FF6B6B');
                this.showBattleDamage('enemy', finalDmg, 'damage');
            }
        }

        this.updateBattleUI();
        this.drawBattleEnemy();

        if (this.enemy.currentHp <= 0) {
            setTimeout(() => this.victory(), 800);
            return;
        }

        this.round++;
        this.playerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    },

    showSkillMenu() {
        if (!this.playerTurn) return;
        const menu = document.getElementById('battle-skill-menu');
        const itemMenu = document.getElementById('battle-item-menu');
        itemMenu.classList.add('hidden');

        if (!menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            return;
        }
        menu.innerHTML = '';
        for (const [skillId, level] of Object.entries(this.player.skills)) {
            const skill = SkillDB[skillId];
            if (!skill || skill.type === 'passive') continue;
            const canAfford = this.player.stats.mp >= skill.mpCost;
            const btn = document.createElement('button');
            btn.className = 'battle-skill-btn';
            btn.disabled = !canAfford;
            btn.innerHTML = `${skill.icon} ${skill.name} (Lv ${level})<br><small>MP: ${skill.mpCost} | CD: ${skill.cooldown}t</small>`;
            btn.onclick = () => {
                menu.classList.add('hidden');
                this.useSkill(skillId, level);
            };
            menu.appendChild(btn);
        }
        menu.classList.remove('hidden');
    },

    async useSkill(skillId, level) {
        if (!this.playerTurn || !this.active) return;
        const skill = SkillDB[skillId];
        if (!skill) return;

        if (this.player.stats.mp < skill.mpCost) {
            this.log('Không đủ MP!', '#4466FF');
            this.setActionsEnabled(true);
            return;
        }

        this.setActionsEnabled(false);
        this.player.stats.mp -= skill.mpCost;
        this.log(`${this.player.name} sử dụng ${skill.icon} ${skill.name}!`, '#DA77FF');

        this.hideMenus();

        const effect = skill.effect(this.player, this.enemy, level);

        if (effect.damage) {
            const isCrit = effect.crit || Math.random() * 100 < this.player.stats.crit;
            let dmg = Math.floor(effect.damage * (1 + (isCrit ? this.player.stats.critDmg / 100 - 1 : 0)));

            // Apply defense
            if (!effect.ignoreDefense) {
                dmg = Math.max(1, dmg - Math.floor(this.enemy.def * 0.3));
            } else {
                dmg = Math.max(1, dmg - Math.floor(this.enemy.def * (1 - effect.ignoreDefense) * 0.3));
            }

            this.enemy.currentHp = Math.max(0, this.enemy.currentHp - dmg);
            this.showBattleDamage('enemy', dmg, isCrit ? 'crit' : 'damage');
            this.log(`💥 ${skill.name} gây ${dmg} sát thương!`, isCrit ? '#FF8800' : '#FF6B6B');

            if (effect.drain) {
                const healAmt = Math.min(effect.drain, this.player.stats.maxHp - this.player.stats.hp);
                this.player.stats.hp += healAmt;
                this.log(`🩸 Hút ${healAmt} HP từ kẻ thù!`, '#44FF88');
                this.showBattleDamage('player', healAmt, 'heal');
            }

            if (effect.selfDamage) {
                this.player.stats.hp = Math.max(1, this.player.stats.hp - effect.selfDamage);
                this.log(`💢 Mất ${effect.selfDamage} HP bản thân!`, '#FF4444');
            }
        }

        if (effect.multiHit) {
            let totalDmg = 0;
            for (let i = 0; i < effect.multiHit.count; i++) {
                const hit = Math.max(1, effect.multiHit.damage - Math.floor(this.enemy.def * 0.2));
                this.enemy.currentHp = Math.max(0, this.enemy.currentHp - hit);
                totalDmg += hit;
                await Utils.wait(200);
                this.showBattleDamage('enemy', hit, 'damage');
            }
            this.log(`⚡ ${effect.multiHit.count} cú đánh! Tổng ${totalDmg} sát thương!`, '#FF6B6B');
        }

        if (effect.heal) {
            const actual = Math.min(effect.heal, this.player.stats.maxHp - this.player.stats.hp);
            this.player.stats.hp += actual;
            this.log(`💚 Hồi phục ${actual} HP!`, '#2ECC71');
            this.showBattleDamage('player', actual, 'heal');
        }

        if (effect.buff) {
            const buffs = Array.isArray(effect.buff) ? effect.buff : [effect.buff];
            for (const b of buffs) {
                this.log(`✨ ${b.stat.toUpperCase()} tăng ${Math.floor(b.pct * 100)}% trong ${b.turns} lượt!`, '#FFD700');
            }
        }

        if (effect.debuff) {
            const debuffs = Array.isArray(effect.debuff) ? effect.debuff : [effect.debuff];
            for (const d of debuffs) {
                if (d.type) this.log(`💫 ${this.enemy.name} bị ${d.type}!`, '#9B59B6');
                else this.log(`💫 ${d.stat.toUpperCase()} giảm!`, '#9B59B6');
            }
        }

        this.updateBattleUI();
        this.drawBattleEnemy();

        if (this.enemy.currentHp <= 0) {
            setTimeout(() => this.victory(), 800);
            return;
        }

        this.round++;
        this.playerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    },

    showItemMenu() {
        if (!this.playerTurn) return;
        const menu = document.getElementById('battle-item-menu');
        const skillMenu = document.getElementById('battle-skill-menu');
        skillMenu.classList.add('hidden');

        if (!menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            return;
        }

        menu.innerHTML = '';
        const potions = this.player.inventory.filter(i => {
            const b = ItemDB[i.id];
            return b && b.type === 'potion';
        });

        if (potions.length === 0) {
            menu.innerHTML = '<div style="padding:8px;color:#888;font-size:0.8rem;">Không có vật phẩm nào!</div>';
        } else {
            for (const item of potions) {
                const btn = document.createElement('button');
                btn.className = 'battle-skill-btn';
                btn.innerHTML = `${item.icon} ${item.name} x${item.qty}`;
                btn.onclick = () => {
                    menu.classList.add('hidden');
                    this.useBattleItem(item.instanceId);
                };
                menu.appendChild(btn);
            }
        }
        menu.classList.remove('hidden');
    },

    useBattleItem(instanceId) {
        if (!this.playerTurn) return;
        this.setActionsEnabled(false);
        this.hideMenus();
        this.player.useItem(instanceId);
        this.updateBattleUI();
        this.round++;
        this.playerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    },

    doDefend() {
        if (!this.playerTurn || !this.active) return;
        this.setActionsEnabled(false);
        this.hideMenus();
        this.defending = true;
        this.log(`🛡️ ${this.player.name} phòng thủ! Sát thương nhận vào giảm 50%.`, '#3498DB');
        this.round++;
        this.playerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    },

    tryRun() {
        if (!this.playerTurn || !this.active) return;
        this.setActionsEnabled(false);
        this.hideMenus();
        const runChance = 50 + (this.player.stats.spd - (this.enemy.spd || 80)) * 0.5;
        if (Math.random() * 100 < Utils.clamp(runChance, 20, 90)) {
            this.log(`🏃 ${this.player.name} đã chạy thoát!`, '#888');
            setTimeout(() => this.end(false), 800);
        } else {
            this.log(`❌ Chạy không thoát! Kẻ thù cản lại!`, '#FF4444');
            this.round++;
            this.playerTurn = false;
            setTimeout(() => this.enemyTurn(), 1000);
        }
    },

    // ===== ENEMY TURN =====
    async enemyTurn() {
        if (!this.active) return;
        this.setActionsEnabled(false);

        await Utils.wait(500);

        // Enemy AI
        const useSkill = Math.random() < 0.3 && this.enemy.abilities;
        if (useSkill && this.enemy.abilities.length > 0) {
            const abilityName = this.enemy.abilities[Utils.randInt(0, this.enemy.abilities.length - 1)];
            if (abilityName === 'regeneration') {
                const heal = Math.floor(this.enemy.maxHp * 0.1);
                this.enemy.currentHp = Math.min(this.enemy.maxHp, this.enemy.currentHp + heal);
                this.log(`${this.enemy.icon} ${this.enemy.name} tái sinh ${heal} HP!`, '#2ECC71');
                this.updateBattleUI();
                this.playerTurn = true;
                this.defending = false;
                this.setActionsEnabled(true);
                return;
            }
        }

        // Basic attack
        const baseDmg = this.calcEnemyDamage();
        const isCrit = Math.random() < 0.1;
        let finalDmg = isCrit ? Math.floor(baseDmg * 1.5) : baseDmg;

        if (this.defending) finalDmg = Math.floor(finalDmg * 0.5);

        // Player dodge
        const isDodge = Math.random() * 100 < this.player.stats.dodge;
        if (isDodge) {
            this.log(`${this.player.name} né thoát đòn tấn công!`, '#888');
            this.showBattleDamage('player', 0, 'miss');
        } else {
            this.player.stats.hp = Math.max(0, this.player.stats.hp - finalDmg);
            if (isCrit) {
                this.log(`💥 Chí Mạng! ${this.enemy.name} gây ${finalDmg} sát thương lên ${this.player.name}!`, '#FF4444');
            } else {
                this.log(`${this.enemy.icon} ${this.enemy.name} gây ${finalDmg} sát thương.`, '#FF8888');
            }
            this.showBattleDamage('player', finalDmg, isCrit ? 'crit' : 'damage');

            // Status effects
            if (this.enemy.statusEffect && Math.random() < this.enemy.statusEffect.chance) {
                this.log(`☠️ ${this.player.name} bị ${this.enemy.statusEffect.type}!`, '#9B59B6');
                // Apply poison - reduce HP each turn
                if (this.enemy.statusEffect.type === 'poison') {
                    const poisonDmg = Math.floor(this.player.stats.maxHp * 0.05);
                    this.player.stats.hp = Math.max(0, this.player.stats.hp - poisonDmg);
                    this.log(`☠️ Độc! Mất thêm ${poisonDmg} HP!`, '#9B59B6');
                }
            }
        }

        this.updateBattleUI();
        this.drawBattlePlayer();

        if (this.player.stats.hp <= 0) {
            setTimeout(() => this.defeat(), 800);
            return;
        }

        this.playerTurn = true;
        this.defending = false;
        this.setActionsEnabled(true);

        // Player MP regen
        const mpRegen = Math.floor(this.player.stats.maxMp * 0.05);
        this.player.stats.mp = Math.min(this.player.stats.maxMp, this.player.stats.mp + mpRegen);
        this.updateBattleUI();
    },

    calcPlayerDamage() {
        const base = this.player.stats.atk;
        const variance = Utils.randFloat(0.85, 1.15);
        const dmg = Math.floor(base * variance);
        const mitigation = Math.floor(this.enemy.def * 0.3);
        return Math.max(1, dmg - mitigation);
    },

    calcEnemyDamage() {
        const base = this.enemy.atk;
        const variance = Utils.randFloat(0.85, 1.15);
        const dmg = Math.floor(base * variance);
        const mitigation = Math.floor(this.player.stats.def * 0.3);
        return Math.max(1, dmg - mitigation);
    },

    showBattleDamage(target, amount, type) {
        const canvas = document.getElementById(target === 'enemy' ? 'battle-enemy-canvas' : 'battle-player-canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = rect.left + canvas.width / 2;
        const y = rect.top + canvas.height / 2;
        Utils.showDamage(x, y, amount, type);
    },

    // ===== VICTORY/DEFEAT =====
    victory() {
        const enemy = this.enemy;
        this.log(`✅ ${this.player.name} chiến thắng! ${enemy.name} đã bị đánh bại!`, '#FFD700');

        // EXP
        const baseExp = enemy.exp;
        const levelBonus = Math.max(0.5, 1 - (this.player.level - enemy.level) * 0.1);
        const expGained = Math.floor(baseExp * levelBonus);
        this.player.gainExp(expGained);

        // Zeni
        const zeniGained = Utils.randInt(enemy.zeni[0], enemy.zeni[1]);
        this.player.zeni += zeniGained;
        Utils.chat(`💰 Nhận ${zeniGained} Zeni`, 'loot');

        // Drops
        const drops = [];
        for (const drop of (enemy.drops || [])) {
            if (Math.random() <= drop.chance) {
                const item = ItemDB[drop.id];
                if (item) {
                    this.player.addItem(drop.id, drop.qty || 1);
                    drops.push(`${item.icon} ${item.name} x${drop.qty || 1}`);
                }
            }
        }
        if (drops.length > 0) {
            Utils.chat(`🎁 Rơi đồ: ${drops.join(', ')}`, 'loot');
        }

        this.player.monstersKilled++;
        this.player.checkQuestObjectives('kill', enemy.id);

        GameUI.updateHUD();

        setTimeout(() => this.end(true), 1500);
    },

    defeat() {
        this.log(`💀 ${this.player.name} đã bị đánh bại...`, '#FF4444');
        Utils.chat('💀 Bạn đã bị đánh bại! Hồi phục 30% HP/MP.', 'damage');

        // Penalty: -10% Zeni, restore 30% HP/MP
        const penalty = Math.floor(this.player.zeni * 0.1);
        this.player.zeni = Math.max(0, this.player.zeni - penalty);
        this.player.stats.hp = Math.floor(this.player.stats.maxHp * 0.3);
        this.player.stats.mp = Math.floor(this.player.stats.maxMp * 0.3);

        Utils.notify(`Thua trận! Mất ${penalty} Zeni.`, 'error', 5000);

        setTimeout(() => this.end(false), 1500);
    },

    end(won) {
        this.active = false;
        document.getElementById('battle-ui').classList.add('hidden');
        document.getElementById('game-canvas').style.filter = '';
        document.getElementById('battle-log').innerHTML = '';
        this.hideMenus();
        GameSystem.saveGame();
        if (this.onComplete) this.onComplete(won);
    },

    hideMenus() {
        document.getElementById('battle-skill-menu').classList.add('hidden');
        document.getElementById('battle-item-menu').classList.add('hidden');
    },

    // Draw character on canvas
    drawBattlePlayer() {
        const canvas = document.getElementById('battle-player-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        CharRenderer.drawBattleChar(ctx, this.player, 0, 0, canvas.width, canvas.height, false);
    },

    drawBattleEnemy() {
        const canvas = document.getElementById('battle-enemy-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (this.enemy) CharRenderer.drawMonster(ctx, this.enemy, 0, 0, canvas.width, canvas.height);
    }
};
