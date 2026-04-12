/* ==========================================
   RENDERER.JS - Canvas Rendering Engine
   ========================================== */

const CharRenderer = {
    // Draw character on canvas
    draw(ctx, char, x, y, w, h, animate = false, frame = 0) {
        ctx.save();
        ctx.clearRect(x, y, w, h);

        const cx = x + w / 2;
        const cy = y + h / 2;
        const scale = Math.min(w / 80, h / 120);
        const bounce = animate ? Math.sin(frame * 0.1) * 3 : 0;

        ctx.translate(cx, cy + bounce);
        ctx.scale(scale, scale);

        // Draw based on race
        if (char.race === 'human') {
            this.drawHuman(ctx, char);
        } else if (char.race === 'namek') {
            this.drawNamekian(ctx, char);
        } else if (char.race === 'majin') {
            this.drawMajin(ctx, char);
        } else {
            this.drawHuman(ctx, char);
        }

        ctx.restore();
    },

    drawHuman(ctx, char) {
        const hairColor = char.hairColor || '#1a1a1a';
        const skinColor = char.gender === 'female' ? '#FFDBB4' : '#FFCC99';
        const eq = char.equipment || {};
        const armorColor = eq.armor ? '#6688AA' : '#3366AA';
        const weaponItem = eq.weapon ? ItemDB[eq.weapon.id] : null;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 55, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = '#1a1a40';
        this.roundRect(ctx, -12, 25, 10, 28, 3);
        ctx.fill();
        this.roundRect(ctx, 2, 25, 10, 28, 3);
        ctx.fill();

        // Boots
        ctx.fillStyle = eq.boots ? '#4A3728' : '#2C1A0E';
        this.roundRect(ctx, -14, 45, 12, 12, 3);
        ctx.fill();
        this.roundRect(ctx, 2, 45, 12, 12, 3);
        ctx.fill();

        // Body (armor)
        ctx.fillStyle = armorColor;
        this.roundRect(ctx, -16, -5, 32, 32, 5);
        ctx.fill();

        // Armor detail
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-10, 0, 20, 2);

        // Arms
        ctx.fillStyle = armorColor;
        // Left arm
        this.roundRect(ctx, -22, -5, 8, 28, 3);
        ctx.fill();
        // Right arm
        this.roundRect(ctx, 14, -5, 8, 28, 3);
        ctx.fill();

        // Hands
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(-18, 24, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(18, 24, 5, 0, Math.PI * 2);
        ctx.fill();

        // Weapon
        if (weaponItem) {
            ctx.save();
            ctx.font = '18px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(weaponItem.icon, 26, 20);
            ctx.restore();
        }

        // Neck
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -5, -18, 10, 14, 3);
        ctx.fill();

        // Head
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -18, -45, 36, 32, 10);
        ctx.fill();

        // Helmet
        if (eq.helmet && ItemDB[eq.helmet.id]) {
            ctx.fillStyle = '#7A9ABB';
            this.roundRect(ctx, -20, -50, 40, 20, 8);
            ctx.fill();
        } else {
            // Hair
            ctx.fillStyle = hairColor;
            this.roundRect(ctx, -18, -48, 36, 18, 8);
            ctx.fill();
            // Spiky hair
            ctx.beginPath();
            ctx.moveTo(-15, -45);
            ctx.lineTo(-10, -58);
            ctx.lineTo(-5, -48);
            ctx.lineTo(0, -62);
            ctx.lineTo(5, -48);
            ctx.lineTo(10, -58);
            ctx.lineTo(15, -45);
            ctx.closePath();
            ctx.fill();
        }

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(-10, -36, 8, 8);
        ctx.fillRect(2, -36, 8, 8);
        ctx.fillStyle = '#2244AA';
        ctx.beginPath();
        ctx.arc(-6, -32, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -32, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -32, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(7, -32, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#663322';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -22, 5, 0, Math.PI);
        ctx.stroke();

        // Ki aura (if high level)
        if (char.level >= 15) {
            const auraColors = { human: '#4488FF', namek: '#22CC44', majin: '#AA44FF' };
            ctx.strokeStyle = auraColors[char.race] || '#4488FF';
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(0, 10, 30, 55, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    },

    drawNamekian(ctx, char) {
        const skinColor = '#44AA44';
        const darkGreen = '#228822';
        const eq = char.equipment || {};

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 55, 22, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = darkGreen;
        this.roundRect(ctx, -13, 25, 11, 28, 3);
        ctx.fill();
        this.roundRect(ctx, 2, 25, 11, 28, 3);
        ctx.fill();

        // Feet (bigger)
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -16, 47, 14, 10, 4);
        ctx.fill();
        this.roundRect(ctx, 2, 47, 14, 10, 4);
        ctx.fill();

        // Body
        const bodyColor = eq.armor ? '#6688AA' : '#2D6B2D';
        ctx.fillStyle = bodyColor;
        this.roundRect(ctx, -18, -8, 36, 35, 6);
        ctx.fill();

        // Arms (long, stretchable)
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -25, -8, 9, 34, 4);
        ctx.fill();
        this.roundRect(ctx, 16, -8, 9, 34, 4);
        ctx.fill();

        // Hands (big)
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(-20, 28, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(20, 28, 7, 0, Math.PI * 2);
        ctx.fill();

        // Neck (long)
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -6, -22, 12, 16, 3);
        ctx.fill();

        // Head (elongated)
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -16, -52, 32, 32, 8);
        ctx.fill();

        // Antennae
        ctx.fillStyle = darkGreen;
        ctx.lineWidth = 4;
        ctx.strokeStyle = darkGreen;
        ctx.beginPath();
        ctx.moveTo(-8, -52);
        ctx.quadraticCurveTo(-18, -68, -12, -78);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, -52);
        ctx.quadraticCurveTo(18, -68, 12, -78);
        ctx.stroke();

        // Antenna tips
        ctx.fillStyle = '#33FF66';
        ctx.beginPath();
        ctx.arc(-12, -78, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, -78, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (big, wide)
        ctx.fillStyle = '#fff';
        ctx.fillRect(-11, -44, 10, 10);
        ctx.fillRect(1, -44, 10, 10);
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(-6, -39, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -39, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -39, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(7, -39, 2, 0, Math.PI * 2);
        ctx.fill();

        // Healing aura
        if (char.level >= 10) {
            ctx.strokeStyle = '#44FF88';
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(0, 5, 28, 60, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    },

    drawMajin(ctx, char) {
        const skinColor = '#FFCCEE';
        const pinkDark = '#DD88AA';
        const eq = char.equipment || {};

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 55, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Chubby legs
        ctx.fillStyle = '#AA2255';
        this.roundRect(ctx, -15, 22, 13, 32, 6);
        ctx.fill();
        this.roundRect(ctx, 2, 22, 13, 32, 6);
        ctx.fill();

        // Chubby body
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -22, -12, 44, 36, 12);
        ctx.fill();

        // Belly button / mark
        ctx.fillStyle = pinkDark;
        ctx.beginPath();
        ctx.arc(0, 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Arms (chubby)
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -28, -10, 10, 28, 5);
        ctx.fill();
        this.roundRect(ctx, 18, -10, 10, 28, 5);
        ctx.fill();

        // Hands
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(-23, 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(23, 20, 8, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillStyle = skinColor;
        this.roundRect(ctx, -7, -22, 14, 12, 4);
        ctx.fill();

        // Big round head
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(0, -38, 22, 0, Math.PI * 2);
        ctx.fill();

        // M symbol on forehead
        ctx.fillStyle = '#AA2255';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', 0, -46);

        // Head tentacle
        ctx.strokeStyle = skinColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(12, -52);
        ctx.quadraticCurveTo(28, -68, 20, -80);
        ctx.stroke();

        // Eyes (big yellow)
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(-9, -38, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(9, -38, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -38, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, -38, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Wide grin
        ctx.strokeStyle = '#AA2255';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -26, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Dark energy aura
        if (char.level >= 10) {
            ctx.strokeStyle = '#CC44FF';
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.ellipse(0, 5, 32, 62, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    },

    drawMonster(ctx, monster, x, y, w, h) {
        ctx.save();
        ctx.clearRect(x, y, w, h);
        ctx.translate(x + w / 2, y + h / 2);

        // Draw a stylized monster based on its icon
        const icon = monster.icon || '👾';
        const scale = Math.min(w, h) / 100;
        ctx.scale(scale, scale);

        // Background aura for bosses
        if (monster.isBoss) {
            const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 60);
            grad.addColorStop(0, 'rgba(220,20,60,0.3)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(-60, -60, 120, 120);
        }

        // Monster body - draw emoji large
        ctx.font = `${monster.isBoss ? 70 : 55}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillText(icon, 4, 8);
        ctx.fillText(icon, 0, 0);

        // HP bar above
        if (monster.currentHp !== undefined) {
            const barW = 70;
            const barH = 8;
            const bx = -barW / 2;
            const by = -55;
            const pct = monster.currentHp / monster.maxHp;

            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            Utils.roundRect(ctx, bx - 1, by - 1, barW + 2, barH + 2, 4);
            ctx.fill();

            const hpColor = pct > 0.6 ? '#2ECC71' : pct > 0.3 ? '#F39C12' : '#E74C3C';
            ctx.fillStyle = hpColor;
            if (pct > 0) {
                Utils.roundRect(ctx, bx, by, barW * pct, barH, 4);
                ctx.fill();
            }

            // Name
            ctx.fillStyle = monster.isBoss ? '#FFD700' : '#FFFFFF';
            ctx.font = `bold ${monster.isBoss ? 12 : 10}px Exo 2, sans-serif`;
            ctx.fillText(`${monster.name} Lv.${monster.level}`, 0, by - 14);
        }

        ctx.restore();
    },

    drawBattleChar(ctx, char, x, y, w, h, animate = true) {
        ctx.save();
        ctx.clearRect(x, y, w, h);

        // Battle background
        const grad = ctx.createRadialGradient(w/2, h, 10, w/2, h/2, w/2);
        const auraColor = char.race === 'namek' ? 'rgba(34,204,68,0.15)' :
                          char.race === 'majin' ? 'rgba(170,68,255,0.15)' : 'rgba(68,136,255,0.15)';
        grad.addColorStop(0, auraColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        this.draw(ctx, char, x, y, w, h, animate, Date.now() * 0.05);
        ctx.restore();
    },

    drawPreview(canvas, char) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw(ctx, char, 0, 0, canvas.width, canvas.height, true, Date.now() * 0.05);
        requestAnimationFrame(() => this.drawPreview(canvas, char));
    },

    drawCharSlot(canvas, char) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw(ctx, char, 0, 0, canvas.width, canvas.height, false);
    },

    drawPaperDoll(canvas, char) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw(ctx, char, 0, 0, canvas.width, canvas.height, false);
    },

    // Helper
    roundRect(ctx, x, y, w, h, r) {
        Utils.roundRect(ctx, x, y, w, h, r);
    }
};

// ===== WORLD RENDERER =====
const WorldRenderer = {
    TILE_SIZE: 32,
    offsetX: 0,
    offsetY: 0,
    fadeAmount: 0,

    render(canvas, mapData, player, entities = [], frame = 0) {
        if (!canvas || !mapData) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Update player smooth movement BEFORE camera bounds
        const TS = this.TILE_SIZE;
        const targetX = player.x * TS;
        const targetY = player.y * TS;
        if (player.renderX === undefined) player.renderX = targetX;
        if (player.renderY === undefined) player.renderY = targetY;
        
        // Snap directly for portals or big distance
        if (Utils.dist(player.renderX, player.renderY, targetX, targetY) > TS * 3) {
            player.renderX = targetX;
            player.renderY = targetY;
        } else {
            // Lerp interpolation cho mượt
            player.renderX = Utils.lerp(player.renderX, targetX, 0.3);
            player.renderY = Utils.lerp(player.renderY, targetY, 0.3);
        }

        // Calculate camera offset based on smooth coordinates, not rigid grid
        this.offsetX = Math.floor(W / 2 - player.renderX - TS / 2);
        this.offsetY = Math.floor(H / 2 - player.renderY - TS / 2);

        const grid = mapData.grid;
        if (!grid) return;

        // Draw tiles
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const tileType = grid[row][col];
                const tx = col * TS + this.offsetX;
                const ty = row * TS + this.offsetY;

                // Skip if off screen
                if (tx > W + TS || tx < -TS || ty > H + TS || ty < -TS) continue;

                const color = MapDB.TILE_COLORS[tileType] || '#4A7C3F';
                ctx.fillStyle = color;
                ctx.fillRect(tx, ty, TS, TS);

                // Tile details
                this.drawTileDetail(ctx, tileType, tx, ty, TS, frame);

                // Grid lines (subtle)
                ctx.strokeStyle = 'rgba(0,0,0,0.08)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(tx, ty, TS, TS);
            }
        }

        // Draw portals (highlight)
        for (const portal of (mapData.portals || [])) {
            const px = portal.x * TS + this.offsetX;
            const py = portal.y * TS + this.offsetY;
            const pulse = (Math.sin(frame * 0.1) + 1) / 2;
            ctx.fillStyle = `rgba(220, 20, 60, ${0.4 + pulse * 0.4})`;
            ctx.fillRect(px, py, TS, TS);
            ctx.strokeStyle = '#FF4444';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, TS, TS);

            // Portal label
            ctx.fillStyle = '#FFF';
            ctx.font = '8px Exo 2, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(portal.name.substring(0, 10), px + TS / 2, py + TS + 10);
        }

        // Draw entities (monsters, NPCs)
        for (const entity of entities) {
            // Smooth movement (lerp)
            const targetX = entity.x * TS;
            const targetY = entity.y * TS;
            if (entity.renderX === undefined) entity.renderX = targetX;
            if (entity.renderY === undefined) entity.renderY = targetY;
            entity.renderX = Utils.lerp(entity.renderX, targetX, 0.2);
            entity.renderY = Utils.lerp(entity.renderY, targetY, 0.2);

            const ex = entity.renderX + this.offsetX;
            const ey = entity.renderY + this.offsetY;
            if (ex > W + TS * 2 || ex < -TS * 2 || ey > H + TS * 2 || ey < -TS * 2) continue;

            // Float animation for NPCs
            const float = entity.isNPC ? Math.sin(frame * 0.08 + entity.x) * 2 : 0;

            ctx.save();
            ctx.translate(ex + TS / 2, ey + TS / 2 + float);

            // HP bar for monsters
            if (!entity.isNPC && entity.currentHp !== undefined) {
                const barW = TS - 4;
                const pct = entity.currentHp / entity.maxHp;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(-barW / 2, -TS / 2 - 8, barW, 5);
                ctx.fillStyle = pct > 0.6 ? '#2ECC71' : pct > 0.3 ? '#F39C12' : '#E74C3C';
                ctx.fillRect(-barW / 2, -TS / 2 - 8, barW * pct, 5);
            }

            // Graphic for Monster vs NPC
            if (!entity.isNPC) {
                // Improve Monster graphic
                CharRenderer.drawMonster(ctx, entity, -TS/2, -TS/2, TS, TS);
            } else {
                ctx.font = `24px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Shadow
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillText(entity.icon || entity.emoji || '👤', 2, 3);
                ctx.fillStyle = '#FFF';
                ctx.fillText(entity.icon || entity.emoji || '👤', 0, 0);

                // NPC name label
                ctx.fillStyle = entity.color || '#FFD700';
                ctx.font = 'bold 10px Exo 2, sans-serif';
                ctx.fillText(entity.name || '?', 0, -TS / 2 - 8);

                // Interaction bubble (animated)
                const bBounce = Math.sin(frame * 0.1) * 2;
                ctx.fillStyle = '#FFD700';
                ctx.font = '14px serif';
                ctx.fillText('💬', 14, -TS / 2 - 6 + bBounce);
            }

            // Other Player Info
            if (entity.isOtherPlayer) {
                // PK Name Color (Tên đỏ nếu đang PK)
                const isPkWithMe = (WorldSystem.player.pkTarget === entity.username) || (entity.pkTarget === WorldSystem.player.username);
                const isPkWithOthers = entity.pkStatus === 'pk' || (entity.pkTarget && entity.pkTarget !== null);
                const isPartyMember = WorldSystem.player.partyId && entity.party && entity.party.id === WorldSystem.player.partyId;

                if (isPartyMember) {
                    ctx.fillStyle = '#2ECC71'; // Màu xanh lá cho đồng đội
                } else if (isPkWithMe || isPkWithOthers) {
                    ctx.fillStyle = '#FF3333'; // Màu đỏ cảnh báo PK
                } else {
                    ctx.fillStyle = '#FFF';
                }

                ctx.font = 'bold 10px Rajdhani, sans-serif';
                ctx.fillText(`${entity.name} (Lv.${entity.level || 1})`, 0, -TS / 2 - 12);
                
                if (entity.flag && entity.flag !== 'none') {
                    const flags = { black: '🏴‍☠️', red: '🚩', blue: '🟦', yellow: '🟨', purple: '🟪', white: '🏳️' };
                    ctx.font = '14px serif';
                    ctx.fillText(flags[entity.flag] || '', 0, -TS / 2 - 26);
                }

                // Show HP for spectators
                if (isPkWithMe || isPkWithOthers) {
                    const bW = TS - 4;
                    const pct = (entity.hp || 0) / (entity.maxHp || 100);
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(-bW / 2, -TS / 2 - 8, bW, 4);
                    ctx.fillStyle = '#E74C3C';
                    ctx.fillRect(-bW / 2, -TS / 2 - 8, bW * pct, 4);
                }
            }

            // Boss indicator
            if (entity.isBoss) {
                ctx.fillStyle = `rgba(220, 20, 60, ${0.3 + Math.sin(frame * 0.1) * 0.2})`;
                ctx.beginPath();
                ctx.arc(0, 0, TS / 2 + 4, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // Draw player
        const px = player.renderX + this.offsetX;
        const py = player.renderY + this.offsetY;
        this.drawPlayerOnWorld(ctx, player, px, py, TS, frame);

        // Player name
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 10px Exo 2, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, px + TS / 2, py - 6);

        // Floating damage texts
        if (typeof WorldSystem !== 'undefined' && WorldSystem.floatingTexts) {
            for (let i = WorldSystem.floatingTexts.length - 1; i >= 0; i--) {
                const ft = WorldSystem.floatingTexts[i];
                ft.y += ft.vy;
                ft.life--;
                
                ctx.save();
                ctx.globalAlpha = Math.max(0, ft.life / (ft.maxLife || 60));
                ctx.fillStyle = ft.color || '#FFF';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.font = ft.isCrit ? 'bold 16px Exo 2' : 'bold 13px Exo 2';
                ctx.textAlign = 'center';
                ctx.strokeText(ft.text, ft.x, ft.y);
                ctx.fillText(ft.text, ft.x, ft.y);
                ctx.restore();

                if (ft.life <= 0) {
                    WorldSystem.floatingTexts.splice(i, 1);
                }
            }
        }

        // Transition Overlay (Fade out/in)
        if (WorldRenderer.fadeAmount > 0) {
            ctx.fillStyle = `rgba(0,0,0,${WorldRenderer.fadeAmount})`;
            ctx.fillRect(0, 0, W, H);
            WorldRenderer.fadeAmount -= 0.05;
        }
    },

    drawPlayerOnWorld(ctx, player, px, py, TS, frame) {
        const bob = Math.sin(frame * 0.15) * 2;
        ctx.save();
        ctx.translate(px + TS / 2, py + TS / 2 + bob);

        // Player aura
        const auras = { human: 'rgba(68,136,255,0.3)', namek: 'rgba(34,204,68,0.3)', xayda: 'rgba(170,68,255,0.3)' };
        ctx.fillStyle = auras[player.race] || 'rgba(68,136,255,0.3)';
        ctx.beginPath();
        ctx.arc(0, 4, TS / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Player icon
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = { human: '🧍', namek: '👾', xayda: '🫃' };
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillText(icons[player.race] || '🧍', 2, 3);
        ctx.fillStyle = '#FFF';
        ctx.fillText(icons[player.race] || '🧍', 0, 0);

        // My Flag Icon
        if (player.flag && player.flag !== 'none') {
            const flags = { black: '🏴‍☠️', red: '🚩', blue: '🟦', yellow: '🟨', purple: '🟪', white: '🏳️' };
            ctx.font = '14px serif';
            ctx.fillText(flags[player.flag] || '', 0, -32);
        }

        // Attack Animation
        if (player.attackAnim > 0) {
            ctx.translate(15, -5); // Đưa hiệu ứng ra một tí phía trước (giả lập quay mặt phải)
            ctx.globalAlpha = player.attackAnim / 10;
            
            if (player.attackSkill === 'kamehameha' || player.attackSkill === 'special_beam') {
                ctx.font = '30px serif';
                ctx.fillText('🌊', 10 + (10 - player.attackAnim)*5, 0); 
            } else if (player.attackSkill === 'dark_energy') {
                ctx.font = '26px serif';
                ctx.fillText('🖤', 10 + (10 - player.attackAnim)*4, 0);
            } else if (player.attackSkill === 'mystic_attack') {
                ctx.font = '26px serif';
                ctx.fillText('🤜', 5 + (10 - player.attackAnim)*3, 0);
            } else if (SkillDB[player.attackSkill] && SkillDB[player.attackSkill].icon) {
                ctx.font = '24px serif';
                ctx.fillText(SkillDB[player.attackSkill].icon, 10 + (10 - player.attackAnim)*2, 0);
            } else {
                ctx.font = '24px serif';
                ctx.fillText('💥', 10, 0);
            }
            player.attackAnim--;
        }

        ctx.restore();
    },

    drawTileDetail(ctx, tileType, tx, ty, TS, frame) {
        const T = MapDB.TILES;
        ctx.save();

        if (tileType === T.WATER || tileType === 1) {
            // Animated water
            const wave = Math.sin(frame * 0.1 + tx * 0.05) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(100, 200, 255, ${0.2 + wave * 0.2})`;
            ctx.fillRect(tx, ty, TS, TS / 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(tx + 2, ty + TS / 3);
            ctx.lineTo(tx + TS - 2, ty + TS / 3);
            ctx.stroke();
        }

        if (tileType === T.TREE || tileType === 4) {
            // Tree top
            ctx.fillStyle = '#1A5218';
            ctx.beginPath();
            ctx.arc(tx + TS / 2, ty + TS / 3, TS / 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Trunk
            ctx.fillStyle = '#5C3D11';
            ctx.fillRect(tx + TS / 2 - 4, ty + TS * 0.55, 8, TS * 0.45);
        }

        if (tileType === T.BUILDING || tileType === 5) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(tx + 4, ty + 4, 10, 8); // window
            ctx.fillRect(tx + TS - 14, ty + 4, 10, 8); // window
        }

        if (tileType === T.FLOWER || tileType === 13) {
            ctx.font = '10px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🌸', tx + TS / 2, ty + TS - 4);
        }

        if (tileType === T.BUSH || tileType === 14) {
            ctx.fillStyle = '#1A6B1A';
            ctx.beginPath();
            ctx.arc(tx + TS / 2, ty + TS / 2, TS / 3, 0, Math.PI * 2);
            ctx.fill();
        }

        if (tileType === T.PORTAL || tileType === 8) {
            // Spiral animation
            const pulse = (Math.sin(frame * 0.15) + 1) / 2;
            ctx.strokeStyle = `rgba(255, 50, 50, ${0.6 + pulse * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(tx + TS / 2, ty + TS / 2, TS / 3 + pulse * 4, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🌀', tx + TS / 2, ty + TS / 2);
        }

        ctx.restore();
    },

    // Minimap rendering
    renderMinimap(canvas, mapData, player, entities = []) {
        if (!canvas || !mapData || !mapData.grid) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const grid = mapData.grid;
        const rows = grid.length;
        const cols = grid[0]?.length || 0;
        const tileW = W / cols;
        const tileH = H / rows;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const t = grid[row][col];
                ctx.fillStyle = MapDB.TILE_COLORS[t] || '#4A7C3F';
                ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
            }
        }

        // Portals
        for (const portal of (mapData.portals || [])) {
            ctx.fillStyle = '#FF4444';
            ctx.fillRect(portal.x * tileW, portal.y * tileH, tileW * 2, tileH * 2);
        }

        // Entities
        for (const e of entities) {
            ctx.fillStyle = e.isNPC ? '#FFD700' : '#FF6666';
            ctx.fillRect(e.x * tileW - 1, e.y * tileH - 1, tileW + 2, tileH + 2);
        }

        // Player (bright white dot)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            player.x * tileW + tileW / 2,
            player.y * tileH + tileH / 2,
            Math.max(3, tileW), 0, Math.PI * 2
        );
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, W, H);
    },

    renderWorldMap(canvas, currentMapId) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Background
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#080818');
        bg.addColorStop(1, '#0F0F2A');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Map locations
        const locations = [
            { id: 'east_city', name: 'Thị Trấn Phương Đông', x: 300, y: 250, color: '#FF8C00', icon: '🏘️' },
            { id: 'west_city', name: 'Thành Phố Tây', x: 100, y: 250, color: '#3498DB', icon: '🏙️' },
            { id: 'forest', name: 'Khu Rừng', x: 480, y: 200, color: '#27AE60', icon: '🌲' },
            { id: 'desert', name: 'Sa Mạc Đỏ', x: 550, y: 320, color: '#E67E22', icon: '🏜️' },
            { id: 'namek', name: 'Hành Tinh Namek', x: 600, y: 150, color: '#2ECC71', icon: '🪐' },
            { id: 'rr_base', name: 'Căn Cứ Quân Đoàn Đỏ', x: 350, y: 100, color: '#E74C3C', icon: '🏰' },
            { id: 'cell_arena', name: 'Đấu Trường Cell', x: 550, y: 420, color: '#9B59B6', icon: '⚔️' },
            { id: 'majin_realm', name: 'Cõi Majin', x: 620, y: 390, color: '#CC44FF', icon: '👿' }
        ];

        // Draw connections
        const connections = [
            ['east_city', 'west_city'],
            ['east_city', 'forest'],
            ['east_city', 'rr_base'],
            ['forest', 'desert'],
            ['desert', 'namek'],
            ['namek', 'cell_arena'],
            ['cell_arena', 'majin_realm']
        ];

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        for (const [a, b] of connections) {
            const la = locations.find(l => l.id === a);
            const lb = locations.find(l => l.id === b);
            if (!la || !lb) continue;
            ctx.beginPath();
            ctx.moveTo(la.x, la.y);
            ctx.lineTo(lb.x, lb.y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw locations
        for (const loc of locations) {
            const isCurrent = loc.id === currentMapId;

            // Glow
            const grd = ctx.createRadialGradient(loc.x, loc.y, 0, loc.x, loc.y, 40);
            grd.addColorStop(0, `${loc.color}44`);
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(loc.x, loc.y, 40, 0, Math.PI * 2);
            ctx.fill();

            // Circle
            ctx.beginPath();
            ctx.arc(loc.x, loc.y, isCurrent ? 20 : 16, 0, Math.PI * 2);
            ctx.fillStyle = isCurrent ? loc.color : `${loc.color}88`;
            ctx.fill();
            ctx.strokeStyle = isCurrent ? '#FFD700' : loc.color;
            ctx.lineWidth = isCurrent ? 3 : 1.5;
            ctx.stroke();

            // Icon
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(loc.icon, loc.x, loc.y);

            // Name
            ctx.fillStyle = isCurrent ? '#FFD700' : '#CCCCCC';
            ctx.font = `${isCurrent ? 'bold ' : ''}11px Exo 2, sans-serif`;
            ctx.fillText(loc.name, loc.x, loc.y + (isCurrent ? 28 : 24));

            if (isCurrent) {
                ctx.fillStyle = '#FF4444';
                ctx.font = '12px serif';
                ctx.fillText('📍', loc.x, loc.y - 28);
            }
        }

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Exo 2, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🗺️ BẢN ĐỒ THẾ GIỚI NGỌC RỒNG', 20, 30);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '11px Exo 2, sans-serif';
        ctx.fillText('Nhấn vào địa điểm để xem thông tin', 20, 50);
    }
};
