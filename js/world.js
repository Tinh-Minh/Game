/* ==========================================
   WORLD.JS - World & Movement System
   ========================================== */

const WorldSystem = {
    currentMap: null,
    entities: [],    // All entities on map (monsters, NPCs)
    spawnedMonsters: [],
    frame: 0,
    animFrameId: null,
    keys: {},
    moveTimer: null,
    lastMoveTime: 0,
    MOVE_DELAY: 100, // ms between moves
    currentTarget: null,
    remotePlayers: [],
    lastSyncTime: 0,
    SYNC_DELAY: 500,
    damageQueue: [], // Danh sách sát thương gửi cho người chơi khác { targetUsername, dmg }
    socialQueue: [], // Danh sách lời mời { type, targetUsername, from }
    lastAttackTime: 0,
    ATTACK_DELAY: 600, // ms cooldown đánh cơ bản

    init(player) {
        this.player = player;
        this.loadMap(player.mapId || 'east_city');
        this.setupInput();
        this.startLoop();
    },

    loadMap(mapId) {
        const map = MapDB[mapId];
        if (!map) {
            console.error('Map not found:', mapId);
            return;
        }
        this.currentMap = map;

        if (this.player.mapId !== mapId) {
            // Moving to new map - use spawn point
            const spawn = map.playerSpawn;
            this.player.x = spawn.x;
            this.player.y = spawn.y;
        }
        this.player.mapId = mapId;

        // Spawn entities
        this.spawnEntities();

        // Update minimap label
        const mapNameEl = document.getElementById('map-name');
        if (mapNameEl) mapNameEl.textContent = map.name;

        Utils.chat(`🗺️ Đến ${map.name}`, 'system');
        Utils.notify(map.name, 'info', 2000);

        GameSystem.saveGame();
    },

    spawnEntities() {
        this.entities = [];

        // Spawn NPCs
        for (const npcId of (this.currentMap.npcs || [])) {
            const npc = NPCDB[npcId];
            if (!npc) continue;
            this.entities.push({
                ...npc,
                isNPC: true,
                instanceId: npcId
            });
        }

        // Spawn monsters
        this.spawnedMonsters = [];
        for (const spawnData of (this.currentMap.monsters || [])) {
            const monster = MonsterDB.create(spawnData.id);
            if (!monster) continue;
            monster.x = spawnData.spawnX;
            monster.y = spawnData.spawnY;
            monster.spawnX = spawnData.spawnX;
            monster.spawnY = spawnData.spawnY;
            monster.respawnTime = spawnData.respawnTime || 30000;
            monster.dead = false;
            monster.isNPC = false;
            this.entities.push(monster);
            this.spawnedMonsters.push(monster);
        }
    },

    respawnMonster(monster) {
        monster.currentHp = monster.maxHp;
        monster.dead = false;
        monster.x = monster.spawnX;
        monster.y = monster.spawnY;
        if (!this.entities.includes(monster)) {
            this.entities.push(monster);
        }
    },

    setupInput() {
        // Remove old listeners
        document.removeEventListener('keydown', this._keydown);
        document.removeEventListener('keyup', this._keyup);

        this._keydown = (e) => {
            if (BattleSystem.active) return;
            if (document.getElementById('chat-input') === document.activeElement) {
                if (e.key === 'Enter') {
                    GameUI.sendChat();
                    document.getElementById('chat-input').blur();
                }
                return;
            }
            this.keys[e.key] = true;

            // Shortcut keys
            if (e.key === 'i' || e.key === 'I') GameUI.toggleInventory();
            if (e.key === 'c' || e.key === 'C') GameUI.toggleCharInfo();
            if (e.key === 'k' || e.key === 'K') GameUI.toggleSkills();
            if (e.key === 'q' || e.key === 'Q') GameUI.toggleQuests();
            if (e.key === 'm' || e.key === 'M') GameUI.toggleWorldMap();
            if (e.key === 'Escape') GameUI.closeAllPanels();
            if (e.key === 'Enter') {
                document.getElementById('chat-input').focus();
            }
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                this.handlePlayerAttack('basic_attack');
            }
            // Hotbar keys
            const keyNum = parseInt(e.key);
            if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 8) {
                e.preventDefault();
                this.handleSkillUsage(keyNum - 1);
            }
        };

        this._keyup = (e) => {
            this.keys[e.key] = false;
        };

        document.addEventListener('keydown', this._keydown);
        document.addEventListener('keyup', this._keyup);

        // Canvas click handler
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.onclick = (e) => this.handleCanvasClick(e);
        }

        // Handle tab visibility (prevent ghosting)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.syncOnlineState();
            }
        });
    },

    handleCanvasClick(e) {
        if (BattleSystem.active) return;
        const canvas = document.getElementById('game-canvas');
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const TS = WorldRenderer.TILE_SIZE;
        const tileX = Math.floor((mx - WorldRenderer.offsetX) / TS);
        const tileY = Math.floor((my - WorldRenderer.offsetY) / TS);

        // Check if clicked on entity
        for (const entity of this.entities) {
            if (entity.dead) continue;
            const dist = Utils.dist(tileX, tileY, entity.x, entity.y);
            if (dist <= 1.5) {
                if (entity.isNPC) {
                    NPCSystem.interact(entity.instanceId || entity.id);
                } else {
                    this.currentTarget = entity;
                    this.handlePlayerAttack('basic_attack'); // Tấn công cơ bản khi click chuột hoặc chạm quái
                }
                return;
            }
        }

        // Check if clicked on remote players
        for (const rPlayer of this.remotePlayers) {
            const dist = Utils.dist(tileX, tileY, rPlayer.x, rPlayer.y);
            if (dist <= 1.5) {
                this.currentTarget = { ...rPlayer, isOtherPlayer: true, id: 'player_' + rPlayer.username };
                GameUI.showPlayerInteraction(rPlayer);
                return;
            }
        }

        // Move to clicked tile
        this.moveToward(tileX, tileY);
    },

    moveToward(tx, ty) {
        const dx = tx - this.player.x;
        const dy = ty - this.player.y;
        let mx = 0, my = 0;
        if (Math.abs(dx) > Math.abs(dy)) mx = dx > 0 ? 1 : -1;
        else if (dy !== 0) my = dy > 0 ? 1 : -1;
        this.tryMove(mx, my);
    },

    tryMove(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        const map = this.currentMap;
        if (!map || !map.grid) return false;

        if (newY < 0 || newY >= map.grid.length) return false;
        if (newX < 0 || newX >= (map.grid[0]?.length || 0)) return false;

        const tileType = map.grid[newY][newX];
        const T = MapDB.TILES;

        // Check passability
        if (!MapDB.PASSABLE.includes(tileType)) return false;

        // Check portal
        const portal = map.portals?.find(p => p.x === newX && p.y === newY);
        if (portal) {
            // Check private home restricted access
            if (portal.targetMap.startsWith('home_') && portal.targetMap !== `home_${this.player.race}`) {
                Utils.chat('Ngôi nhà này không thuộc hành tinh của bạn! Người ngoài cấm vào.', 'warning');
                return false;
            }

            this.player.x = newX;
            this.player.y = newY;
            Utils.notify(`Đang tải ${portal.name}...`, 'info');
            
            // Bắt đầu fade out
            if (typeof WorldRenderer !== 'undefined') WorldRenderer.fadeAmount = 1;
            
            setTimeout(() => {
                this.player.mapId = portal.targetMap;
                this.player.x = portal.targetX;
                this.player.y = portal.targetY;
                
                // Tránh lỗi bay ngang map (Snap point ngay lập tức)
                if (typeof WorldRenderer !== 'undefined') {
                    this.player.renderX = portal.targetX * WorldRenderer.TILE_SIZE;
                    this.player.renderY = portal.targetY * WorldRenderer.TILE_SIZE;
                }
                
                this.loadMap(portal.targetMap);
                
                // Fade in sau khi loadMap
                if (typeof WorldRenderer !== 'undefined') WorldRenderer.fadeAmount = 1;
            }, 500);
            return true;
        }

        // Check NPC collision
        const npcAtPos = this.entities.find(e => e.isNPC && e.x === newX && e.y === newY);
        if (npcAtPos) {
            NPCSystem.interact(npcAtPos.instanceId || npcAtPos.id);
            return false;
        }

        // Check monster collision
        const monsterAtPos = this.entities.find(e => !e.isNPC && !e.dead && e.x === newX && e.y === newY);
        if (monsterAtPos) {
            this.currentTarget = monsterAtPos;
            this.handlePlayerAttack('basic_attack');
            return false; // Ko cho đi xuyên qua quái
        }

        this.player.x = newX;
        this.player.y = newY;

        // Auto-attack if aggressive mobs are nearby and player hasn't moved away from them 
        for (const monster of this.entities) {
            if (monster.isNPC || monster.dead) continue;
            const dist = Utils.dist(this.player.x, this.player.y, monster.x, monster.y);
            if (dist <= 1 && monster.aggressive) {
                this.currentTarget = monster;
            }
        }

        // Check visit quest objectives
        this.player.checkQuestObjectives('visit', this.currentMap.id);

        // Player regen while moving
        this.player.regenTick();
        GameUI.updateHUD();

        return true;
    },

    handleSkillUsage(slotIdx) {
        if (!this.player || !this.player.hotbar) return;
        const skillId = this.player.hotbar[slotIdx];
        if (!skillId) return;
        this.handlePlayerAttack(skillId);
    },

    handlePlayerAttack(skillId = 'basic_attack') {
        if (!this.currentTarget || this.currentTarget.dead) {
            // Find closest monster if no target
            let closest = null;
            let minDist = 2; // Tầm đánh 2 ô grid
            for (const m of this.entities) {
                if (m.isNPC || m.dead) continue;
                const dist = Utils.dist(this.player.x, this.player.y, m.x, m.y);
                if (dist <= minDist) {
                    minDist = dist;
                    closest = m;
                }
            }
            if (closest) this.currentTarget = closest;
            else return;
        }

        const target = this.currentTarget;
        const dist = Utils.dist(this.player.x, this.player.y, target.x, target.y);
        
        // Skill lookup
        const skill = SkillDB[skillId];
        const level = this.player.skills[skillId] || 1;
        
        // Check buff/heal skill (no target needed)
        if (skill && (skill.effect(this.player, null, level).heal || skill.effect(this.player, null, level).buff)) {
            // Apply immediately without a target requirement if it's purely a buff/heal
            this.executePlayerSkill(null, skill, level);
            return;
        }

        // Out of range (tạm thời cho skill xa bán kính rộng hơn)
        const attackRange = skill && skill.effect(this.player, target, level).range === 'far' ? 5 : 2;
        if (dist > attackRange) return;

        // Cooldown check
        const now = Date.now();
        if (now - this.lastAttackTime < this.ATTACK_DELAY) return;
        this.lastAttackTime = now;

        // Animation cờ cho renderer
        this.player.attackAnim = 10;
        this.player.attackSkill = skillId; // Gửi icon cho renderer

        // ANIMATION: Nhảy vào mục tiêu nếu đánh gần
        if (attackRange <= 2) {
            this.player.renderX += (target.x * WorldRenderer.TILE_SIZE - this.player.renderX) * 0.4;
            this.player.renderY += (target.y * WorldRenderer.TILE_SIZE - this.player.renderY) * 0.4;
        }

        this.executePlayerSkill(target, skill, level);
    },

    executePlayerSkill(monster, skill, level) {
        if (!skill) return;

        // Mana check
        if (this.player.stats.mp < (skill.mpCost || 0)) {
            Utils.notify('Không đủ MP!', 'warning');
            return;
        }
        this.player.stats.mp -= (skill.mpCost || 0);
        GameUI.updateHUD();

        // PVP Check (Nếu mục tiêu là người chơi khác)
        if (monster && monster.isOtherPlayer) {
            // Kiểm tra điều kiện PK/Flag
            let canAttack = false;
            const myFlag = this.player.flag || 'none';
            const targetFlag = monster.flag || 'none';

            if (myFlag === 'black' || targetFlag === 'black') {
                canAttack = true; // Cờ đen đồ sát mọi nơi
            } else if (myFlag !== 'none' && targetFlag !== 'none') {
                if (myFlag !== targetFlag) {
                    canAttack = true; // Khác màu đánh nhau
                }
            }

            // Nếu đang trạng thái thách đấu PK (tạm thời giả lập bằng cách nhấn nút PK)
            if (this.player.pkTarget === monster.username) canAttack = true;

            if (!canAttack) {
                Utils.notify('Bạn không thể tấn công người chơi này (Cùng phe hoặc hòa bình)!', 'warning');
                return;
            }

            const effect = skill.effect(this.player, monster, level);
            const dmg = effect.damage || 10;
            
            // Đưa vào queue để sync lên server
            this.damageQueue.push({
                targetUsername: monster.username,
                dmg: dmg,
                from: this.player.name
            });

            Utils.chat(`Bạn đang tấn công ${monster.name}!`, 'system');
            
            // Hiệu ứng giả lập tại máy người đánh
            this.spawnFloatingText(dmg.toString(), monster.renderX + WorldRenderer.offsetX + 16, monster.renderY + WorldRenderer.offsetY - 10, '#FF4444', false);
            return;
        }

        const effect = skill.effect(this.player, monster, level);
        
        // Hồi máu / Buff
        if (effect.heal) {
            const actualHeal = Math.min(effect.heal, this.player.stats.maxHp - this.player.stats.hp);
            this.player.stats.hp += actualHeal;
            this.spawnFloatingText(`+${actualHeal}`, this.player.renderX + WorldRenderer.offsetX + 16, this.player.renderY + WorldRenderer.offsetY - 10, '#2ECC71', false);
        }
        
        if (effect.buff) {
            this.spawnFloatingText(skill.name, this.player.renderX + WorldRenderer.offsetX + 16, this.player.renderY + WorldRenderer.offsetY - 20, '#FFD700', false);
        }

        // Nếu ko có mục tiêu thì thôi
        if (!monster) return;

        if (effect.damage) {
            let maxDmg = effect.damage;
            let finalDmg = Math.max(1, maxDmg - Math.floor(monster.def * 0.3));

            const isCrit = effect.crit || Math.random() * 100 < this.player.stats.crit;
            if (isCrit) finalDmg = Math.floor(finalDmg * this.player.stats.critDmg / 100);
            
            if (effect.ignoreDefense) {
                finalDmg = Math.max(1, maxDmg - Math.floor(monster.def * (1 - effect.ignoreDefense) * 0.3));
            }

            // Trừ máu quái
            monster.currentHp = Math.max(0, monster.currentHp - finalDmg);

            // Rung hình quái
            monster.renderX += Utils.randInt(-5, 5);
            monster.renderY += Utils.randInt(-5, 5);

            // Float text
            const x = monster.renderX + WorldRenderer.offsetX + 16;
            const y = monster.renderY + WorldRenderer.offsetY - 10;
            this.spawnFloatingText(finalDmg.toString(), x, y, isCrit ? '#FF8C00' : '#FF4444', isCrit);
        }
        
        // MultiHit
        if (effect.multiHit) {
             let burstCount = effect.multiHit.count - 1; // đã đính 1 ở phần damage base nếu có
             if (effect.multiHit.damage) {
                 const tInterval = setInterval(() => {
                     if (!monster || monster.dead || burstCount <= 0) { clearInterval(tInterval); return; }
                     burstCount--;
                     let hitDmg = Math.max(1, effect.multiHit.damage - Math.floor(monster.def * 0.3));
                     monster.currentHp = Math.max(0, monster.currentHp - hitDmg);
                     monster.renderX += Utils.randInt(-3, 3);
                     monster.renderY += Utils.randInt(-3, 3);
                     this.spawnFloatingText(hitDmg.toString(), monster.renderX + WorldRenderer.offsetX + 16, monster.renderY + WorldRenderer.offsetY - Math.random()*20, '#FF4444', false);
                     if (monster.currentHp <= 0) { clearInterval(tInterval); this.handleMonsterDeath(monster); }
                 }, 200);
             }
        }

        if (monster.currentHp <= 0) {
            this.handleMonsterDeath(monster);
        }
    },

    handleMonsterDeath(monster) {
        monster.dead = true;
        this.currentTarget = null;
        
        // Xóa khỏi world tạm
        const idx = this.entities.indexOf(monster);
        if (idx !== -1) this.entities.splice(idx, 1);

        // Kinh nghiệm & Zeni
        const expGained = Math.floor(monster.exp * Math.max(0.5, 1 - (this.player.level - monster.level)*0.1));
        this.player.gainExp(expGained);
        
        const zeniGained = Utils.randInt(monster.zeni[0], monster.zeni[1]);
        this.player.zeni += zeniGained;
        
        // Rớt đồ
        const drops = [];
        for (const drop of (monster.drops || [])) {
            if (Math.random() <= drop.chance) {
                const itemDbId = ItemDB[drop.id];
                if (itemDbId) {
                    this.player.addItem(drop.id, drop.qty || 1);
                    drops.push(`${itemDbId.name} x${drop.qty||1}`);
                }
            }
        }
        
        let dropMsg = drops.length > 0 ? ` (Rơi đồ: ${drops.join(', ')})` : '';
        Utils.chat(`Bạn vừa tiêu diệt ${monster.name}! Nhận ${expGained} EXP, ${zeniGained} Zeni${dropMsg}`, 'loot');
        
        // Quest
        this.player.monstersKilled++;
        this.player.checkQuestObjectives('kill', monster.id);
        GameUI.updateHUD();

        // Sự kiện Vượt ải / Boss Đấu Trường
        if (monster.id === 'perfect_cell') {
            Utils.chat(`Perfect Cell đã bị tiêu diệt! Một luồng Ki khổng lồ đang tích tụ... (Trọng sinh sau 30s)`, 'warning');
            setTimeout(() => {
                // Kiểm tra người chơi vẫn ở trong map cũ
                if (this.currentMap && this.currentMap.id === 'cell_arena') {
                    Utils.chat(`Super Perfect Cell đã giáng lâm! Mọi người cẩn thận!`, 'system');
                    const superCell = MonsterDB.create('super_cell');
                    if (superCell) {
                        superCell.x = monster.spawnX || monster.x;
                        superCell.y = monster.spawnY || monster.y;
                        superCell.respawnTime = -1; // Boss này không tự hồi sinh, phải đánh lại Perfect Cell
                        this.entities.push(superCell);
                    }
                }
            }, 30000);
        }

        // Respawn
        setTimeout(() => {
            this.respawnMonster(monster);
        }, monster.respawnTime || 30000);
    },

    spawnFloatingText(text, x, y, color, isCrit) {
        if (!this.floatingTexts) this.floatingTexts = [];
        this.floatingTexts.push({
            text, x, y, color, isCrit, 
            life: 60, maxLife: 60,
            vy: -1
        });
    },

    startLoop() {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        const loop = () => {
            this.frame++;
            this.update();
            this.render();
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    },

    stopLoop() {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
    },

    syncOnlineState() {
        if (!this.player || !AppController.sessionToken) return;

        const syncData = {
            username: AppController.currentUser.username,
            name: this.player.name,
            race: this.player.race,
            mapId: this.currentMap.id,
            x: this.player.x,
            y: this.player.y,
            renderX: this.player.renderX,
            renderY: this.player.renderY,
            hp: this.player.stats.hp,
            maxHp: this.player.stats.maxHp,
            level: this.player.level,
            flag: this.player.flag,
            targetId: this.currentTarget?.id || null,
            pkTarget: this.player.pkTarget || null, // Đồng bộ mục tiêu PK
            party: this.player.partyId ? { id: this.player.partyId, members: this.player.partyMembers || [] } : null,
            outgoingDamage: [...this.damageQueue],
            outgoingSocial: [...this.socialQueue]
        };

        this.damageQueue = []; // Clear sau khi gửi
        this.socialQueue = []; // Clear sau khi gửi

        fetch(`/api/sync?username=${syncData.username}&token=${AppController.sessionToken}`, {
            method: 'POST',
            body: JSON.stringify(syncData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                this.remotePlayers = data.players;
                
                // Nhận sát thương từ người chơi khác (Inbound Damage)
                if (data.inboundDamage && data.inboundDamage.length > 0) {
                    for (const hit of data.inboundDamage) {
                        this.player.stats.hp -= hit.dmg;
                        Utils.chat(`Bạn bị ${hit.from} tấn công! ( -${hit.dmg} HP )`, 'warning');
                        if (this.player.stats.hp <= 0) {
                            // Ghi nhớ kẻ thù
                            if (!this.player.enemies.includes(hit.from)) {
                                this.player.enemies.push(hit.from);
                                Utils.chat(`[Cảnh báo] Kẻ thù ${hit.from} đã hạ gục bạn!`, 'error');
                            }
                            
                            // Kết thúc PK nếu đang PK với người này
                            if (this.player.pkTarget === hit.from) {
                                Utils.chat(`💀 Bạn đã thất bại trong trận PK với ${hit.from}!`, 'error');
                                this.player.pkTarget = null;
                            }
                            
                            this.handlePlayerDeath();
                        }
                    }
                    GameUI.updateHUD();
                }

                // Cập nhật tất cả các thanh máu UI
                GameUI.updateHUD(); // Máu của chính mình
                GameUI.updatePartyHUD(); // Máu của đồng đội
                
                // Cập nhật máu đối tượng đang tương tác nếu có
                if (GameUI.selectedRemotePlayer) {
                    const upToDate = this.remotePlayers.find(p => p.username === GameUI.selectedRemotePlayer.username);
                    if (upToDate) GameUI.showPlayerInteraction(upToDate, true);
                }

                // Nhận lời mời tương tác (Inbound Social)
                if (data.inboundSocial && data.inboundSocial.length > 0) {
                    for (const req of data.inboundSocial) {
                        this.handleInboundSocial(req);
                    }
                }
            }
        })
        .catch(err => console.warn('[Sync] Multiplayer sync failed'));
    },

    handleInboundSocial(req) {
        this.currentSocialRequest = req;
        const typeMap = {
            trade: 'Giao dịch',
            pk: 'Thách đấu PK',
            friend: 'Kết bạn',
            party: 'Mời vào nhóm'
        };
        const typeName = typeMap[req.type] || 'Tương tác';
        
        const panel = document.getElementById('panel-social-request');
        const title = document.getElementById('social-request-title');
        const msg = document.getElementById('social-request-msg');
        
        if (panel && title && msg) {
            title.textContent = `LỜI MỜI ${typeName.toUpperCase()}`;
            msg.textContent = `Người chơi ${req.from} muốn ${typeName.toLowerCase()} với bạn. Bạn có đồng ý không?`;
            panel.classList.remove('hidden');
        }
    },

    acceptSocial() {
        if (!this.currentSocialRequest) return;
        const req = this.currentSocialRequest;
        const typeName = req.type === 'pk' ? 'Thách đấu PK' : 'Tương tác';
        
        Utils.chat(`Bạn đã chấp nhận lời mời từ ${req.from}`, 'success');
        document.getElementById('panel-social-request').classList.add('hidden');

        if (req.type === 'pk') {
            this.player.pkTarget = req.from;
        } else if (req.type === 'trade') {
            GameUI.openTrade(req.from);
        } else if (req.type === 'party') {
            this.player.partyId = 'party_' + req.from;
            Utils.chat(`Bạn đã gia nhập nhóm của ${req.from}`, 'info');
            GameUI.updatePartyHUD();
        } else if (req.type === 'friend') {
            if (!this.player.friends.includes(req.from)) {
                this.player.friends.push(req.from);
                Utils.chat(`Đã kết bạn với ${req.from}`, 'success');
            }
        }
        this.currentSocialRequest = null;
    },

    rejectSocial() {
        document.getElementById('panel-social-request').classList.add('hidden');
        this.currentSocialRequest = null;
    },

    update() {
        if (BattleSystem.active) return;

        // PK Map Exit Check
        if (this.player && this.player.pkTarget) {
            const opponent = this.remotePlayers.find(p => p.username === this.player.pkTarget);
            // Nếu đối thủ không còn ở map này hoặc thoát game
            if (!opponent || opponent.mapId !== this.currentMap.id) {
                Utils.chat(`🏳️ Trận PK kết thúc! Đối thủ ${this.player.pkTarget} đã bỏ chạy hoặc rời map. Bạn thắng!`, 'success');
                this.player.pkTarget = null;
            }
        }

        const now = Date.now();
        if (now - this.lastMoveTime >= this.MOVE_DELAY) {
            let moved = false;
            if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
                moved = this.tryMove(0, -1);
            } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
                moved = this.tryMove(0, 1);
            } else if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
                moved = this.tryMove(-1, 0);
            } else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
                moved = this.tryMove(1, 0);
            }
            if (moved) this.lastMoveTime = now;
        }

        // Multiplayer Sync
        if (now - this.lastSyncTime >= this.SYNC_DELAY) {
            this.lastSyncTime = now;
            this.syncOnlineState();
        }

        // Enemy AI & Realtime combat
        const nowMs = Date.now();
        for (const monster of this.entities) {
            if (monster.isNPC || monster.dead) continue;
            
            // Tấn công Player nếu ở gần
            const d = Utils.dist(this.player.x, this.player.y, monster.x, monster.y);
            if (d <= 1.5) {
                monster.lastAttackTime = monster.lastAttackTime || 0;
                // Monster attack cooldown (khoảng 1.5 - 2 giây)
                if (nowMs - monster.lastAttackTime > 2000) {
                    monster.lastAttackTime = nowMs;
                    this.executeMonsterHit(monster);
                }
            }

            // Lang thang
            if (this.frame % 60 === 0) {
                if (Math.random() < 0.3 && d > 2) {
                    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                    const dir = dirs[Utils.randInt(0, 3)];
                    const nx = monster.x + dir[0];
                    const ny = monster.y + dir[1];
                    const map = this.currentMap;
                    if (!map?.grid) continue;
                    if (ny >= 0 && ny < map.grid.length &&
                        nx >= 0 && nx < (map.grid[0]?.length || 0)) {
                        const tile = map.grid[ny][nx];
                        if (MapDB.PASSABLE.includes(tile)) {
                            // Keep monsters near spawn
                            const distToSpawn = Utils.dist(nx, ny, monster.spawnX, monster.spawnY);
                            if (distToSpawn <= 5) {
                                monster.x = nx;
                                monster.y = ny;
                            }
                        }
                    }
                }
            }
        }

        // Xử lý AI Đệ Tử (Di chuyển và đánh quái)
        if (this.player.disciple) {
            const disciple = this.player.disciple;
            // Nội suy render mượt
            if (disciple.renderX === undefined) disciple.renderX = disciple.x * 32;
            if (disciple.renderY === undefined) disciple.renderY = disciple.y * 32;
            disciple.renderX += (disciple.x * 32 - disciple.renderX) * 0.2;
            disciple.renderY += (disciple.y * 32 - disciple.renderY) * 0.2;
            
            // Di chuyển theo chân Player (trễ 15 khung hình)
            if (this.frame % 15 === 0) { 
                const dx = this.player.x - disciple.x;
                const dy = this.player.y - disciple.y;
                const distToPlayer = Math.abs(dx) + Math.abs(dy); 
                
                if (distToPlayer > 1) { 
                    const moveX = Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : 0;
                    const moveY = moveX === 0 ? Math.sign(dy) : 0;
                    const nx = disciple.x + moveX;
                    const ny = disciple.y + moveY;
                    
                    const map = this.currentMap;
                    if (map && map.grid && ny >= 0 && ny < map.grid.length && nx >= 0 && nx < (map.grid[0]?.length || 0)) {
                        if (MapDB.PASSABLE.includes(map.grid[ny][nx])) {
                            disciple.x = nx;
                            disciple.y = ny;
                        }
                    }
                }
            }

            // Hỗ trợ đánh quái
            if (this.currentTarget && !this.currentTarget.dead) {
                const target = this.currentTarget;
                const distToTarget = Utils.dist(disciple.x, disciple.y, target.x, target.y);
                if (distToTarget <= 2.5) { // Tầm đánh đệ tử
                    disciple.lastAttackTime = disciple.lastAttackTime || 0;
                    if (nowMs - disciple.lastAttackTime > 2000) { // Đánh mỗi 2 giây
                        disciple.lastAttackTime = nowMs;
                        // Phóng damage lên quái
                        const discipleDmg = Math.max(1, disciple.atk - Math.floor(target.def * 0.2) + Utils.randInt(-5, 5));
                        target.currentHp -= discipleDmg;
                        target.renderX += Utils.randInt(-4, 4); // Hiệu ứng đẩy
                        
                        const py = target.renderY + WorldRenderer.offsetY;
                        this.spawnFloatingText(discipleDmg.toString(), target.renderX + WorldRenderer.offsetX, py - 30, '#FFFF00', false); // Màu Vàng rực
                        GameAudio.playSFX('attack');
                        
                        if (target.currentHp <= 0) {
                            this.handleMonsterDeath(target);
                        }
                    }
                }
            }
        }

        // Auto-save every 60 seconds
        if (this.frame % 3600 === 0) {
            GameSystem.saveGame();
        }
    },

    executeMonsterHit(monster) {
        if (this.player.stats.hp <= 0) return;
        const base = monster.atk;
        const variance = Utils.randFloat(0.9, 1.1);
        let dmg = Math.floor(base * variance);
        let finalDmg = Math.max(1, dmg - Math.floor(this.player.stats.def * 0.3));

        // Player né
        if (Math.random() * 100 < this.player.stats.dodge) {
            finalDmg = 0; // Miss
        }

        if (finalDmg > 0) {
            this.player.stats.hp = Math.max(0, this.player.stats.hp - finalDmg);
            // Lùi player
            this.player.renderX += Utils.randInt(-4, 4);
            GameUI.updateHUD();
            
            const px = this.player.renderX + WorldRenderer.offsetX + 16;
            const py = this.player.renderY + WorldRenderer.offsetY - 10;
            this.spawnFloatingText(finalDmg.toString(), px, py, '#FFFFFF', false);

            if (this.player.stats.hp <= 0) {
                this.handlePlayerDeath();
            }
        }
    },

    handlePlayerDeath() {
        Utils.chat('💀 Bạn vừa tử trận! Hãy chọn cách hồi sinh.', 'damage');
        const deathPanel = document.getElementById('panel-death');
        if (deathPanel) deathPanel.classList.remove('hidden');
    },

    reviveAtSpot() {
        if (this.player.diamonds < 1) {
            Utils.notify('Không đủ Kim cương để hồi sinh tại chỗ!', 'error');
            return;
        }
        this.player.diamonds -= 1;
        this.player.stats.hp = this.player.stats.maxHp;
        this.player.stats.mp = this.player.stats.maxMp;
        
        const deathPanel = document.getElementById('panel-death');
        if (deathPanel) deathPanel.classList.add('hidden');
        
        Utils.chat('✨ Bạn đã dùng 1 Kim cương để hồi sinh tại chỗ!', 'system');
        Utils.notify('Hồi sinh thành công!', 'success');
        GameUI.updateHUD();
        GameSystem.saveGame();
    },

    reviveAtHome() {
        const penalty = Math.floor(this.player.zeni * 0.05);
        this.player.zeni = Math.max(0, this.player.zeni - penalty);
        this.player.stats.hp = Math.floor(this.player.stats.maxHp * 0.5);
        
        const deathPanel = document.getElementById('panel-death');
        if (deathPanel) deathPanel.classList.add('hidden');

        // Teleport về làng (Thị Trấn Đông)
        this.loadMap('east_city');
        Utils.chat(`🏠 Bạn đã trở về làng. Bị trừ ${penalty} Zeni phí vận chuyển.`, 'info');
        GameUI.updateHUD();
        GameSystem.saveGame();
    },

    render() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;

        // Resize canvas to window
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        if (!BattleSystem.active) {
            const renderEntities = [...this.entities];
            
            // Thêm đệ tử
            if (this.player.disciple) {
                renderEntities.push({
                    id: 'disciple_render',
                    name: this.player.disciple.name,
                    icon: '👼',
                    hp: this.player.disciple.maxHp,
                    currentHp: this.player.disciple.currentHp,
                    x: this.player.disciple.x,
                    y: this.player.disciple.y,
                    renderX: this.player.disciple.renderX,
                    renderY: this.player.disciple.renderY,
                    isDisciple: true
                });
            }

            // Thêm người chơi khác
            for (const other of this.remotePlayers) {
                const icon = other.race === 'human' ? '🧍' : other.race === 'namek' ? '👾' : '🫃';
                renderEntities.push({
                    ...other,
                    id: 'player_' + other.username,
                    icon: icon,
                    isOtherPlayer: true
                });
            }

            WorldRenderer.render(canvas, this.currentMap, this.player, renderEntities, this.frame);
        }

        // Minimap
        const minimap = document.getElementById('minimap-canvas');
        if (minimap) {
            const mapEntities = [...this.entities];
            if (this.player.disciple) mapEntities.push(this.player.disciple);
            WorldRenderer.renderMinimap(minimap, this.currentMap, this.player, mapEntities);
        }
    }
};
