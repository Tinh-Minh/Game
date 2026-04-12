/* ==========================================
   NPC.JS - NPC Interaction System
   ========================================== */

const NPCSystem = {
    currentNPC: null,
    currentDialog: null,

    interact(npcId) {
        const npc = NPCDB[npcId];
        if (!npc) return;

        this.currentNPC = npc;
        this.showDialog('default');
    },

    showDialog(dialogKey) {
        const npc = this.currentNPC;
        if (!npc) return;

        const dialog = npc.dialogs[dialogKey];
        if (!dialog) {
            this.close();
            return;
        }

        this.currentDialog = dialogKey;

        const panel = document.getElementById('npc-dialog');
        const portrait = document.getElementById('npc-portrait');
        const name = document.getElementById('npc-dialog-name');
        const text = document.getElementById('npc-dialog-text');
        const choices = document.getElementById('npc-dialog-choices');

        portrait.textContent = npc.emoji || npc.icon || '🧙';
        portrait.style.borderColor = npc.color || 'var(--nro-orange)';
        name.textContent = npc.name;
        name.style.color = npc.color || 'var(--nro-yellow)';

        // Typing effect
        text.textContent = '';
        panel.classList.remove('hidden');
        choices.innerHTML = '';

        let idx = 0;
        const typing = setInterval(() => {
            text.textContent += dialog.text[idx];
            idx++;
            if (idx >= dialog.text.length) {
                clearInterval(typing);
                this.showChoices(dialog.choices);
            }
        }, 25);

        // Click to skip typing
        text.onclick = () => {
            clearInterval(typing);
            text.textContent = dialog.text;
            text.onclick = null;
            this.showChoices(dialog.choices);
        };
    },

    showChoices(choices) {
        if (!choices) return;
        const choicesEl = document.getElementById('npc-dialog-choices');
        choicesEl.innerHTML = '';

        for (const choice of choices) {
            const btn = document.createElement('button');
            btn.className = 'dialog-choice';
            btn.textContent = choice.text;
            btn.onclick = () => this.handleChoice(choice);
            choicesEl.appendChild(btn);
        }
    },

    handleChoice(choice) {
        const player = window.GameSystem?.player;
        if (!player) return;

        if (choice.next === null) {
            // Close dialog
            this.close();
            return;
        }

        if (choice.next) {
            // Go to next dialog node
            this.showDialog(choice.next);
            return;
        }

        if (choice.action) {
            this.handleAction(choice.action, choice, player);
        }
    },

    handleAction(action, choice, player) {
        switch (action) {
            case 'give_quest':
                if (choice.questId) {
                    const accepted = player.acceptQuest(choice.questId);
                    if (accepted) {
                        this.showQuickDialog(`Nhiệm vụ đã được giao! Chúc may mắn, chiến binh!`);
                    } else {
                        this.showQuickDialog(`Bạn chưa thể nhận nhiệm vụ này.`);
                    }
                }
                break;

            case 'open_shop':
                const npc = this.currentNPC;
                this.close();
                ShopSystem.open(npc, choice.shopId || npc?.shop?.id);
                break;

            case 'sell_items':
                this.close();
                ShopSystem.openSell(player);
                break;

            case 'heal_full':
                player.fullRestore();
                Utils.notify('💚 HP và MP đã được hồi phục đầy!', 'success');
                Utils.chat('💚 Dende đã chữa lành vết thương cho bạn!', 'system');
                this.showQuickDialog('Chúc bạn mạnh khỏe! HP và MP đã phục hồi hoàn toàn!');
                break;

            case 'unlock_power':
                if (player.statPoints < 3) {
                    player.statPoints += 3;
                    Utils.notify('✨ Đại Guru đã mở khóa sức mạnh! +3 điểm chỉ số!', 'success');
                    Utils.chat('✨ Đại Guru đã mở khóa tiềm năng ẩn trong bạn!', 'system');
                } else {
                    Utils.notify('Sức mạnh của bạn đã được mở khóa trước đó.', 'info');
                }
                this.showQuickDialog('Hãy sử dụng sức mạnh tốt! Tiềm năng của ngươi thật vĩ đại!');
                break;

            case 'hatch_egg':
                const eggItem = player.inventory?.find(i => i.id === 'egg_disciple');
                if (!eggItem) {
                    this.showQuickDialog('Hành trang của bạn trống trơn! Làm gì có Trứng Đệ Tử nào mà ấp! Đi thách đấu Super Cell Đấu Trường để giành cơ hội đi nào.');
                } else {
                    if (player.disciple) {
                        this.showQuickDialog('Bạn đã có đệ tử rồi mà. Một người không quản lý 2 đứa trẻ được đâu!');
                    } else {
                        player.removeItem(eggItem.instanceId, 1);
                        player.disciple = {
                            name: 'Đệ tử của ' + player.name,
                            level: 1, baseHp: 500, maxHp: 500, currentHp: 500, baseAtk: 25, atk: 25, def: 10,
                            exp: 0,
                            // Spawn offset để đi đằng sau lưng
                            x: player.x, y: player.y,
                            renderX: player.renderX, renderY: player.renderY
                        };
                        Utils.notify('Ấp trứng thành công! Đệ Tử đã xuất hiện!', 'success');
                        Utils.chat('✨ Trứng kỳ bí đã bao bọc luồng khí vỡ vụn và Ấp Nở thành Đệ Tử! Nó sẽ theo sát bạn tự động tấn công.', 'loot');
                        this.showQuickDialog('Kỳ diệu quá! Đệ tử đã nở ra! Xoay lại đằng sau xem cậu bé kìa!');
                        GameUI.updateHUD();
                        GameSystem.saveGame();
                    }
                }
                break;

            case 'tutorial':
                this.showQuickDialog('🎮 Điều khiển: WASD hoặc mũi tên để di chuyển. Nhấn Enter để chat. I=Kho đồ, C=Nhân vật, K=Kỹ năng, Q=Nhiệm vụ, M=Bản đồ. Click vào quái để chiến đấu!');
                break;

            case 'start_battle':
                this.close();
                const monster = MonsterDB.create(choice.monsterId || 'fat_buu');
                if (monster) {
                    BattleSystem.start(player, monster, (won) => {
                        if (won) Utils.chat('Chiến thắng oanh liệt!', 'system');
                    });
                }
                break;

            default:
                this.close();
        }
    },

    showQuickDialog(msg) {
        const text = document.getElementById('npc-dialog-text');
        const choices = document.getElementById('npc-dialog-choices');
        if (text) text.textContent = msg;
        if (choices) {
            choices.innerHTML = '';
            const btn = document.createElement('button');
            btn.className = 'dialog-choice';
            btn.textContent = '👋 Hiểu rồi, cảm ơn!';
            btn.onclick = () => this.close();
            choices.appendChild(btn);
        }
    },

    close() {
        const panel = document.getElementById('npc-dialog');
        if (panel) panel.classList.add('hidden');
        this.currentNPC = null;
        this.currentDialog = null;
    }
};

// ===== SHOP SYSTEM =====
const ShopSystem = {
    currentShop: null,
    mode: 'buy',

    open(npc, shopId) {
        let shopData;
        if (shopId && npc.shop?.id === shopId) {
            shopData = npc.shop;
        } else {
            shopData = npc.shop;
        }

        if (!shopData) return;
        this.currentShop = shopData;
        this.mode = 'buy';

        const panel = document.getElementById('panel-shop');
        const title = document.getElementById('shop-title');
        const zeni = document.getElementById('shop-player-zeni');

        if (title) title.textContent = `🏪 ${shopData.name}`;
        if (zeni) zeni.textContent = Utils.formatNum(window.GameSystem?.player?.zeni || 0);

        this.renderShopItems();
        this.renderSellItems();

        panel.classList.remove('hidden');
    },

    openSell(player) {
        this.open({ shop: { id: 'sell_only', name: 'Bán Đồ', items: [] } }, 'sell_only');
    },

    renderShopItems() {
        const container = document.getElementById('shop-items');
        if (!container || !this.currentShop) return;

        const player = window.GameSystem?.player;
        container.innerHTML = '';

        for (const shopItem of (this.currentShop.items || [])) {
            const item = ItemDB[shopItem.id];
            if (!item) continue;

            const price = shopItem.price || item.price || 0;
            const stock = shopItem.stock === -1 ? '∞' : shopItem.stock;
            const canAfford = player && player.zeni >= price;

            const el = document.createElement('div');
            el.className = 'shop-item';
            el.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                    <div class="item-name" style="color:${ItemDB.rarityColor(item.rarity)}">${item.name}</div>
                    <div class="item-price">💰 ${Utils.formatNum(price)} Zeni | Kho: ${stock}</div>
                    ${item.stats ? `<div style="font-size:0.68rem;color:#9090B0">${Object.entries(item.stats).map(([k,v]) => `+${v} ${k.toUpperCase()}`).join(', ')}</div>` : ''}
                </div>
                <button class="btn-buy" onclick="ShopSystem.buyItem('${shopItem.id}', ${price})" ${!canAfford ? 'disabled style="opacity:0.4"' : ''}>Mua</button>
            `;

            el.onmouseenter = (e) => GameUI.showItemTooltip(item, e.clientX, e.clientY);
            el.onmouseleave = () => GameUI.hideItemTooltip();

            container.appendChild(el);
        }

        if (!this.currentShop.items?.length) {
            container.innerHTML = '<div style="padding:12px;color:#666;text-align:center">Hết hàng!</div>';
        }
    },

    renderSellItems() {
        const container = document.getElementById('shop-sell-items');
        if (!container) return;

        const player = window.GameSystem?.player;
        if (!player) return;

        container.innerHTML = '';

        const sellableItems = player.inventory.filter(i => {
            const b = ItemDB[i.id];
            return b && b.sellPrice > 0;
        });

        if (sellableItems.length === 0) {
            container.innerHTML = '<div style="padding:12px;color:#666;text-align:center;font-size:0.8rem">Không có đồ vật để bán</div>';
            return;
        }

        for (const item of sellableItems) {
            const base = ItemDB[item.id];
            if (!base) continue;
            const sellPrice = base.sellPrice || Math.floor((base.price || 0) * 0.2);

            const el = document.createElement('div');
            el.className = 'shop-item';
            el.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                    <div class="item-name">${item.name} ${item.qty > 1 ? `x${item.qty}` : ''}</div>
                    <div class="item-price">💰 ${Utils.formatNum(sellPrice)} Zeni / cái</div>
                </div>
                <button class="btn-buy" onclick="ShopSystem.sellItem('${item.instanceId}', ${sellPrice})" style="background:#27AE60">Bán</button>
            `;
            container.appendChild(el);
        }
    },

    buyItem(itemId, price) {
        const player = window.GameSystem?.player;
        if (!player) return;

        if (player.zeni < price) {
            Utils.notify('Không đủ Zeni!', 'error');
            return;
        }

        player.zeni -= price;
        player.addItem(itemId, 1);

        const item = ItemDB[itemId];
        Utils.notify(`Mua ${item?.name || itemId}!`, 'success');
        Utils.chat(`🛍️ Mua ${item?.name || itemId} - ${Utils.formatNum(price)} Zeni`, 'system');

        // Update UI
        document.getElementById('shop-player-zeni').textContent = Utils.formatNum(player.zeni);
        document.getElementById('zeni-amount').textContent = Utils.formatNum(player.zeni);
        this.renderSellItems();
        GameUI.updateHUD();
        GameSystem.saveGame();
    },

    sellItem(instanceId, price) {
        const player = window.GameSystem?.player;
        if (!player) return;

        const item = player.inventory.find(i => i.instanceId === instanceId);
        if (!item) return;

        player.zeni += price;
        player.removeItem(instanceId, 1);

        Utils.notify(`Bán ${item.name}! +${price} Zeni`, 'success');
        Utils.chat(`💰 Bán ${item.name} - +${Utils.formatNum(price)} Zeni`, 'loot');

        document.getElementById('shop-player-zeni').textContent = Utils.formatNum(player.zeni);
        document.getElementById('zeni-amount').textContent = Utils.formatNum(player.zeni);
        this.renderSellItems();
        GameUI.updateHUD();
        GameSystem.saveGame();
    },

    close() {
        document.getElementById('panel-shop')?.classList.add('hidden');
        this.currentShop = null;
    }
};
