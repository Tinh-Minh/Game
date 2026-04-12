/* ==========================================
   APP.JS - Application Controller
   ========================================== */

const AppController = {
    currentUser: null,
    selectedCharSlot: null,
    selectedChar: null,
    charCreateData: {
        race: 'human',
        gender: 'male',
        hairColor: '#1a1a1a',
        name: ''
    },
    previewChar: null,
    previewAnimFrame: null,
    sessionToken: null,
    heartbeatId: null,

    // ===== SCREEN MANAGEMENT =====
    showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        const screen = document.getElementById(`${name}-screen`);
        if (screen) {
            screen.style.display = 'flex';
            setTimeout(() => screen.classList.add('active'), 10);
        }
    },

    // ===== LOGIN =====
    login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username) {
            Utils.notify('Vui lòng nhập tên tài khoản!', 'error');
            document.getElementById('username').style.animation = 'shake 0.3s ease';
            setTimeout(() => document.getElementById('username').style.animation = '', 300);
            return;
        }
        if (!password) {
            Utils.notify('Vui lòng nhập mật khẩu!', 'error');
            return;
        }

        // Load or create account
        let accounts = Utils.load('accounts') || {};
        let saves = Utils.load('saves') || {};

        if (username === 'ADMIN_NRO') {
            const adminPass = this.hashPassword('123456');
            const adminCharId = 'admin_super_hero';
            
            // Luôn đảm bảo nhân vật admin hiện diện trong kho lưu trữ saves
            if (!saves[adminCharId]) {
                saves[adminCharId] = {
                    id: adminCharId, name: 'Siêu Cấp Admin', race: 'majin', gender: 'male',
                    level: 200, exp: 0, zeni: 999999999, diamonds: 999999,
                    baseStats: { str: 999999999, agi: 999999999, vit: 999999999, int: 999999999, luk: 999999999 },
                    statPoints: 0, skillPoints: 999, mapId: 'east_city', x: 14, y: 11,
                    skills: { dark_energy: 10, buu_absorb: 10, majin_power: 10, candy_beam: 10 },
                    inventory: [], equipment: { helmet: null, weapon: null, armor: null, offhand: null, boots: null, accessory: null },
                    hotbar: ['dark_energy', 'buu_absorb', 'majin_power', 'candy_beam', null, null, null, null]
                };
                Utils.save('saves', saves);
            }

            // Nếu tài khoản chưa có hoặc chưa gán nhân vật này, thì ép buộc gán vào slot 0
            if (!accounts[username] || accounts[username].charSlots[0] !== adminCharId) {
                accounts[username] = { 
                    username, 
                    password: adminPass, 
                    charSlots: [adminCharId, null, null], 
                    created: accounts[username]?.created || Date.now() 
                };
                Utils.save('accounts', accounts);
            }
        }

        if (accounts[username]) {
            if (accounts[username].password !== this.hashPassword(password)) {
                Utils.notify('Mật khẩu không đúng!', 'error');
                document.getElementById('password').style.animation = 'shake 0.3s ease';
                setTimeout(() => document.getElementById('password').style.animation = '', 300);
                return;
            }
        } else {
            // Auto-create account
            accounts[username] = {
                username,
                password: this.hashPassword(password),
                charSlots: [null, null, null],
                created: Date.now()
            };
            Utils.save('accounts', accounts);
            Utils.notify('Tài khoản mới được tạo tự động!', 'success');
        }

        this.currentUser = accounts[username];
        
        // Đăng ký Session lên Server
        this.sessionToken = Utils.genId();
        fetch(`/api/session?action=login&username=${username}&token=${this.sessionToken}`)
            .then(res => res.json())
            .then(data => {
                console.log('[Auth] Session registered:', data);
                this.startHeartbeat();
            })
            .catch(err => console.error('[Auth] Server offline, skipping session sync:', err));

        GameAudio.ensureContext();
        this.showCharSelect();
    },

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatId = setInterval(() => {
            if (!this.currentUser) {
                this.stopHeartbeat();
                return;
            }
            fetch(`/api/session?action=check&username=${this.currentUser.username}&token=${this.sessionToken}`)
                .then(res => res.json())
                .then(data => {
                    if (data.valid === false) {
                        this.stopHeartbeat();
                        alert('⚠️ Tài khoản này vừa đăng nhập ở máy khác! Bạn sẽ bị đăng xuất.');
                        this.logout();
                    }
                })
                .catch(err => {
                    // Nếu server sập, tạm thời bỏ qua để không làm gián đoạn người chơi local
                    console.warn('[Heartbeat] Server sync failed');
                });
        }, 3000);
    },

    stopHeartbeat() {
        if (this.heartbeatId) clearInterval(this.heartbeatId);
        this.heartbeatId = null;
    },

    hashPassword(password) {
        // Simple hash for local storage (not for production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(16);
    },

    showRegister() {
        this.showScreen('register');
    },

    register() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-password-confirm').value;

        if (username.length < 4) {
            Utils.notify('Tên tài khoản phải từ 4 ký tự trở lên!', 'error');
            return;
        }
        if (!password || password.length < 4) {
            Utils.notify('Mật khẩu quá ngắn!', 'error');
            return;
        }
        if (password !== confirm) {
            Utils.notify('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        let accounts = Utils.load('accounts') || {};
        if (accounts[username]) {
            Utils.notify('Tên tài khoản này đã tồn tại!', 'error');
            return;
        }

        // Create account
        accounts[username] = {
            username,
            password: this.hashPassword(password),
            charSlots: [null, null, null],
            created: Date.now()
        };
        Utils.save('accounts', accounts);
        Utils.notify('Đăng ký thành công! Hãy đăng nhập.', 'success');
        
        // Chuyển sang login
        document.getElementById('username').value = username;
        this.showScreen('login');
    },

    logout() {
        WorldSystem.stopLoop();
        this.currentUser = null;
        this.selectedChar = null;
        this.selectedCharSlot = null;
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        this.stopHeartbeat();
        this.showScreen('login');
    },

    // ===== CHARACTER SELECT =====
    showCharSelect() {
        if (this.previewAnimFrame) {
            cancelAnimationFrame(this.previewAnimFrame);
            this.previewAnimFrame = null;
        }
        this.showScreen('char-select');
        // Re-read current user from localStorage to get fresh slot data
        const accounts = Utils.load('accounts') || {};
        if (this.currentUser?.username) {
            this.currentUser = accounts[this.currentUser.username] || this.currentUser;
        }
        this.renderCharSlots();
        this.selectedCharSlot = null;
        this.selectedChar = null;
        document.getElementById('btn-enter-game').disabled = true;
        document.getElementById('btn-delete-char').disabled = true;
    },

    renderCharSlots() {
        const container = document.getElementById('char-slots');
        if (!container) return;
        container.innerHTML = '';

        let saves, slots;
        try {
            saves = Utils.load('saves') || {};
            slots = this.currentUser?.charSlots || [null, null, null];
        } catch(e) {
            console.error('[renderCharSlots] Error loading data:', e);
            saves = {};
            slots = [null, null, null];
        }

        console.log('[renderCharSlots] slots =', JSON.stringify(slots), '| saves keys =', Object.keys(saves));

        for (let i = 0; i < 3; i++) {
            const charId = slots[i];
            const charData = charId ? saves[charId] : null;

            const slot = document.createElement('div');
            slot.className = `char-slot ${charData ? 'has-char' : ''}`;
            slot.dataset.slot = i;
            slot.style.cssText = 'min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;';

            const slotNum = document.createElement('div');
            slotNum.className = 'slot-number';
            slotNum.textContent = `Slot ${i + 1}`;
            slot.appendChild(slotNum);

            if (charData) {
                try {
                    // Hiển thị icon chủng tộc thay canvas (an toàn hơn)
                    const raceIcons = { human: '🧍', namek: '👾', majin: '🫃' };
                    const raceNames = { human: 'Con Người', namek: 'Namek', majin: 'Majin' };

                    const avatar = document.createElement('div');
                    avatar.style.cssText = 'font-size:5rem;margin-bottom:8px;';
                    avatar.textContent = raceIcons[charData.race] || '🧍';
                    slot.appendChild(avatar);

                    const nameEl = document.createElement('div');
                    nameEl.className = 'char-slot-name';
                    nameEl.textContent = charData.name || 'Unknown';
                    slot.appendChild(nameEl);

                    const info = document.createElement('div');
                    info.className = 'char-slot-info';
                    info.innerHTML = `
                        <div class="char-slot-race">${raceNames[charData.race] || charData.race}</div>
                        <div>Lv.${charData.level || 1} | ${Utils.formatNum(charData.zeni || 0)} Zeni</div>
                        <div>${charData.mapId ? (MapDB[charData.mapId]?.name || charData.mapId) : 'Thị Trấn'}</div>
                    `;
                    slot.appendChild(info);

                    // Vẽ canvas nhân vật sau (không critical)
                    try {
                        const char = new Character(charData);
                        const canvas = document.createElement('canvas');
                        canvas.className = 'char-slot-char-canvas';
                        canvas.width = 120;
                        canvas.height = 150;
                        canvas.style.cssText = 'position:absolute;top:50px;left:50%;transform:translateX(-50%);opacity:0.8;';
                        CharRenderer.drawCharSlot(canvas, char);
                        slot.style.position = 'relative';
                        // Insert canvas behind text
                        slot.insertBefore(canvas, nameEl);
                    } catch(canvasErr) {
                        console.warn('[renderCharSlots] Canvas draw error:', canvasErr);
                    }

                    slot.onclick = () => this.selectCharSlot(i, charData);
                    console.log(`[renderCharSlots] Slot ${i}: ${charData.name} (${charData.race}) rendered OK`);
                } catch(renderErr) {
                    console.error(`[renderCharSlots] Error rendering slot ${i}:`, renderErr);
                    slot.innerHTML += `<div style="color:#f88;font-size:0.7rem">⚠️ Lỗi tải nhân vật</div>`;
                }
            } else {
                const emptyText = document.createElement('div');
                emptyText.className = 'slot-empty-text';
                emptyText.innerHTML = '＋ Tạo nhân vật mới';
                slot.appendChild(emptyText);
                slot.onclick = () => this.showCharCreate();
            }

            container.appendChild(slot);
        }

        console.log('[renderCharSlots] Done. container children:', container.children.length);
    },

    selectCharSlot(slotIndex, char) {
        this.selectedCharSlot = slotIndex;
        this.selectedChar = char;

        document.querySelectorAll('.char-slot').forEach((s, i) => {
            s.classList.toggle('selected', i === slotIndex);
        });

        document.getElementById('btn-enter-game').disabled = !char;
        document.getElementById('btn-delete-char').disabled = !char;
    },

    // ===== CHARACTER CREATE =====
    showCharCreate() {
        // Check slot limit
        const slots = this.currentUser?.charSlots || [];
        const usedSlots = slots.filter(s => s !== null).length;
        if (usedSlots >= 3) {
            Utils.notify('Đã có 3 nhân vật! Hãy xóa một nhân vật trước.', 'warning');
            return;
        }

        this.charCreateData = { race: 'human', gender: 'male', hairColor: '#1a1a1a', name: '' };
        this.showScreen('char-create');
        this.updateCharPreview();
    },

    selectRace(race) {
        this.charCreateData.race = race;
        document.querySelectorAll('.race-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.race === race);
        });
        this.updateCharPreview();
    },

    selectGender(gender) {
        this.charCreateData.gender = gender;
        document.querySelectorAll('.gender-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.gender === gender);
        });
        this.updateCharPreview();
    },

    selectHairColor(color) {
        this.charCreateData.hairColor = color;
        document.querySelectorAll('.color-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.color === color);
        });
        this.updateCharPreview();
    },

    updateCharPreview() {
        if (this.previewAnimFrame) cancelAnimationFrame(this.previewAnimFrame);

        const canvas = document.getElementById('char-preview-canvas');
        if (!canvas) return;

        this.previewChar = {
            race: this.charCreateData.race,
            gender: this.charCreateData.gender,
            hairColor: this.charCreateData.hairColor,
            level: 1,
            equipment: {},
            skills: {},
            name: 'Preview'
        };

        const animate = () => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            CharRenderer.draw(ctx, this.previewChar, 0, 0, canvas.width, canvas.height, true, Date.now() * 0.05);
            this.previewAnimFrame = requestAnimationFrame(animate);
        };
        animate();
    },

    async createCharacter() {
        const name = document.getElementById('char-name').value.trim();
        if (!name) {
            Utils.notify('Vui lòng nhập tên nhân vật!', 'error');
            return;
        }
        if (name.length < 2) {
            Utils.notify('Tên nhân vật phải có ít nhất 2 ký tự!', 'error');
            return;
        }

        // Reload currentUser từ localStorage để đảm bảo data mới nhất
        const accs = Utils.load('accounts') || {};
        if (this.currentUser && this.currentUser.username && accs[this.currentUser.username]) {
            this.currentUser = accs[this.currentUser.username];
        }

        // Đảm bảo charSlots là mảng hợp lệ
        if (!this.currentUser.charSlots || !Array.isArray(this.currentUser.charSlots)) {
            this.currentUser.charSlots = [null, null, null];
        }

        const char = new Character({
            name,
            race: this.charCreateData.race,
            gender: this.charCreateData.gender,
            hairColor: this.charCreateData.hairColor,
            mapId: 'east_city',
            x: 14, y: 11
        });

        // Find empty slot
        const emptySlot = this.currentUser.charSlots.indexOf(null);
        if (emptySlot === -1) {
            Utils.notify('Không còn slot trống! Đã có 3 nhân vật.', 'error');
            return;
        }

        // Save character data
        const saves = Utils.load('saves') || {};
        saves[char.id] = char.toJSON();
        Utils.save('saves', saves);

        // Gán id vào slot và save accounts
        this.currentUser.charSlots[emptySlot] = char.id;
        accs[this.currentUser.username] = this.currentUser;
        Utils.save('accounts', accs);

        console.log('[NRO] Char created:', char.id, '| slots:', JSON.stringify(this.currentUser.charSlots));

        if (this.previewAnimFrame) {
            cancelAnimationFrame(this.previewAnimFrame);
            this.previewAnimFrame = null;
        }

        Utils.notify(`✅ Tạo nhân vật "${name}" thành công!`, 'success');
        this.showCharSelect();
    },

    deleteChar() {
        if (this.selectedCharSlot === null || !this.selectedChar) return;
        const name = this.selectedChar.name;
        if (!confirm(`Bạn có chắc muốn xóa nhân vật "${name}"?\nDữ liệu sẽ bị mất vĩnh viễn!`)) return;

        // Remove from saves
        const saves = Utils.load('saves') || {};
        delete saves[this.selectedChar.id];
        Utils.save('saves', saves);

        // Remove from user slots
        this.currentUser.charSlots[this.selectedCharSlot] = null;
        const accounts = Utils.load('accounts') || {};
        accounts[this.currentUser.username] = this.currentUser;
        Utils.save('accounts', accounts);

        Utils.notify(`Đã xóa nhân vật ${name}`, 'info');
        this.showCharSelect();
    },

    // ===== ENTER GAME =====
    enterGame() {
        if (!this.selectedChar) return;

        const btn = document.getElementById('btn-enter-game');
        btn.textContent = 'Đang tải...';
        btn.disabled = true;

        setTimeout(() => {
            this.startGame(this.selectedChar);
        }, 500);
    },

    startGame(charData) {
        const char = charData instanceof Character ? charData : new Character(charData);
        GameSystem.player = char;
        window.GameSystem = GameSystem;

        this.showScreen('game');

        // Initialize systems
        GameUI.updateHUD();
        GameUI.updateSkills();
        GameUI.updateQuests();

        // Start world
        WorldSystem.init(char);

        // Start BGM
        setTimeout(() => {
            const map = MapDB[char.mapId];
            if (map?.bgm) GameAudio.playBGM(map.bgm);
        }, 500);

        // Welcome message
        setTimeout(() => {
            Utils.chat(`🎮 Chào mừng ${char.name} vào Ngọc Rồng Online!`, 'system');
            Utils.chat(`📍 Bạn đang ở: ${MapDB[char.mapId]?.name || 'Thị Trấn'}`, 'system');
            Utils.chat(`💡 Dùng W/A/S/D để di chuyển. Click quái để chiến đấu.`, 'system');
            if (char.level === 1) {
                setTimeout(() => {
                    Utils.chat('📜 Hãy nói chuyện với Krillin để bắt đầu nhiệm vụ đầu tiên!', 'system');
                }, 2000);
            }
        }, 1000);
    },

    backToCharSelect() {
        WorldSystem.stopLoop();
        GameSystem.saveGame();
        GameAudio.stopBGM();
        this.showCharSelect();
    }
};

// ===== GLOBAL GAMEAPP REFERENCE =====
const GameApp = AppController;

// ===== INIT ON DOM READY =====
window.addEventListener('DOMContentLoaded', () => {
    // Show loading screen
    document.getElementById('loading-screen').style.display = 'flex';
    document.getElementById('loading-screen').classList.add('active');

    // Create loading particles
    const particles = document.getElementById('loading-particles');
    if (particles) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                border-radius: 50%;
                background: rgba(255, ${Math.floor(Math.random() * 100 + 107)}, 0, ${Math.random() * 0.6 + 0.2});
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
                box-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
            `;
            particles.appendChild(p);
        }
    }

    // Start game
    Game.init();

    // Handle window resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('game-canvas');
        if (canvas && document.getElementById('game-screen').classList.contains('active')) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });

    // Handle visibility change (save game when tab hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && GameSystem.player) {
            GameSystem.saveGame();
        }
    });

    // Click anywhere on loading screen to skip (after 2s)
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.addEventListener('click', () => {
                const bar = document.getElementById('loading-bar');
                const text = document.getElementById('loading-text');
                if (bar) bar.style.width = '100%';
                if (text) text.textContent = 'Sẵn sàng!';
                setTimeout(() => AppController.showScreen('login'), 300);
            });
        }
    }, 2000);
});

// Expose to global for HTML onclick handlers
window.GameApp = AppController;
window.GameUI = GameUI;
window.GameSystem = GameSystem;
window.BattleSystem = BattleSystem;
window.ShopSystem = ShopSystem;
window.NPCSystem = NPCSystem;
window.GameAudio = GameAudio;
window.GameSettings = GameSettings;
window.WorldSystem = WorldSystem;
window.CharRenderer = CharRenderer;
