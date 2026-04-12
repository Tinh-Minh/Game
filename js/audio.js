/* ==========================================
   AUDIO.JS - Custom Soft Piano Engine (Sơn Tùng M-TP Melodies)
   ========================================== */

const GameAudio = {
    ctx: null,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    currentBgm: null,
    bgmGain: null,
    sfxGain: null,
    oscillators: [],

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = this.musicVolume;
            
            // Lofi / Lullaby Filter (Lọc tần số cao tạo tiếng trầm ấm)
            this.bgmFilter = this.ctx.createBiquadFilter();
            this.bgmFilter.type = 'lowpass';
            this.bgmFilter.frequency.value = 600; // Cắt bỏ mọi âm chói

            this.bgmGain.connect(this.bgmFilter);
            this.bgmFilter.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.ctx.destination);
            
            // Xóa rác YT Player API cũ nếu có
            const ytEl = document.getElementById('yt-bgm-player');
            if (ytEl) ytEl.remove();
        } catch (e) {
            console.warn('Web Audio API not available');
        }
    },

    ensureContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playBGM(theme) {
        if (!this.ctx || this.currentBgm === theme) return;
        this.stopBGM();
        this.currentBgm = theme;
        this.ensureContext();

        // Sơn Tùng Melodies Piano Version
        const patterns = {
            east_city_theme: this.noiNayCoAnh.bind(this),
            forest_theme: this.chungTaCuaHienTai.bind(this),
            desert_theme: this.coChacYeuLaDay.bind(this),
            battle_theme: this.chayNgayDi.bind(this),
            boss_theme: this.amThamBenEm.bind(this),
            namek_theme: this.chungTaCuaHienTai.bind(this),
            majin_theme: this.amThamBenEm.bind(this),
            city_theme: this.conMuaNgangQua.bind(this),
            cell_arena_theme: this.chayNgayDi.bind(this)
        };

        const create = patterns[theme] || patterns.east_city_theme;
        create();
    },

    stopBGM() {
        this.oscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.oscillators = [];
        this.currentBgm = null;
    },

    // Piano Soft Oscillator Engine
    createPianoNote(freq, startTime, duration, gain = 0.5) {
        if (!this.ctx) return null;
        
        // Dùng sóng SINE tạo âm thanh êm dịu Piano (không chói gắt như square hay sawtooth)
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(freq, startTime);
        
        // ADSR Envelope êm như phím cảm ứng nhẹ
        gainNode.gain.setValueAtTime(0, startTime);
        // Attack mềm (chậm) giảm tiếng "khức" của búa gõ
        gainNode.gain.linearRampToValueAtTime((gain * this.musicVolume) * 0.5, startTime + 0.1);
        // Soft Decay (âm lượng tắt dần chậm rãi rất chill, box music lofi)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.bgmGain);
        
        osc.start(startTime);
        osc.stop(startTime + duration + 0.5); 
        
        this.oscillators.push(osc);
    },

    // ===================================
    // BỘ SƯU TẬP MELODY SƠN TÙNG M-TP
    // ===================================

    noiNayCoAnh() {
        // "Nơi Này Có Anh" - Tình yêu bé nhỏ xin tặng riêng em...
        const tempo = 0.40;
        const notes = [
            [523, 0], [523, 1], [523, 2], [392, 3], // C5 C5 C5 G4
            [440, 4.5], [329, 6], [293, 7], [293, 8], // A4 E4 D4 D4 => Tặng riêng em
            [587, 10], [587, 11], [587, 12], [440, 13], // D5 D5 D5 A4 => Một nụ hôn
            [493, 14.5], [392, 16], // B4 G4 => Cho em
            [659, 18], [659, 19], [659, 20], [587, 21], // E5 E5 E5 D5 => Và đôi tay
            [523, 22.5], [440, 24], [523, 25], [587, 26] // C5 A4 C5 D5 => Ấm áp đan tay
        ];
        this.playMelodyLoop(notes, tempo, 0.4);
    },

    chungTaCuaHienTai() {
        // "Chúng Ta Của Hiện Tại" - Điều anh luôn giữ kín trong tim
        const tempo = 0.45;
        const notes = [
            [392, 0], [659, 1.5], [587, 2.5], [523, 4], // G4 E5 D5 C5
            [440, 5], [523, 6], [587, 7], // A4 C5 D5
            [392, 9], [659, 10.5], [587, 11.5], [523, 13], 
            [440, 14], [523, 15], [659, 16] // A4 C5 E5
        ];
        this.playMelodyLoop(notes, tempo, 0.35);
    },

    coChacYeuLaDay() {
        // "Có Chắc Yêu Là Đây"
        const tempo = 0.35;
        const notes = [
            [329, 0], [392, 1], [440, 2], [523, 3], // E4 G4 A4 C5
            [440, 4], [392, 5], [329, 6], [293, 7], // A4 G4 E4 D4
            [261, 8], [329, 9], [392, 10], [523, 11]
        ];
        this.playMelodyLoop(notes, tempo, 0.4);
    },

    conMuaNgangQua() {
        // Cơn Mưa Ngang Qua
        const tempo = 0.32;
        const notes = [
            [523, 0], [587, 1], [587, 2], [659, 3.5], 
            [784, 5], [659, 7], [587, 8], [523, 9], [587, 10],
            [523, 12], [587, 13], [587, 14], [659, 15.5], 
            [784, 17], [880, 19], [784, 20], [659, 21.5]
        ];
        this.playMelodyLoop(notes, tempo, 0.35);
    },
    
    chayNgayDi() {
        // Chạy Ngay Đi (Dồn dập hơn)
        const tempo = 0.25;
        const notes = [
            [329, 0], [329, 1.5], [392, 2.5], [329, 4],
            [293, 5], [329, 6.5], [261, 7.5], [220, 9]
        ];
        this.playMelodyLoop(notes, tempo, 0.4);
    },
    
    amThamBenEm() {
        const tempo = 0.4;
        const notes = [
            [440, 0], [493, 1], [523, 2.5], [493, 4],
            [523, 5], [587, 6.5], [659, 8], [523, 9.5], [440, 11]
        ];
        this.playMelodyLoop(notes, tempo, 0.35);
    },

    playMelodyLoop(notes, tempo, gain) {
        if (!this.ctx) return;
        const loopDuration = notes[notes.length - 1][1] + 2; 

        const playLoop = (offset) => {
            if (this.oscillators.length > 200) this.oscillators = []; // Clean memory
            
            for (const [freq, beat] of notes) {
                // Hạ một quãng 8 (chia 2 tần số freq) để nghe trầm và cực kỳ êm ái
                this.createPianoNote(freq / 2, offset + beat * tempo, 2.5, gain);
            }
            
            // Lặp lại đoạn nhạc
            setTimeout(() => {
                if (this.currentBgm) playLoop(this.ctx.currentTime);
            }, (loopDuration * tempo) * 1000);
        };
        
        playLoop(this.ctx.currentTime);
    },

    // ===================================
    // SOUND EFFECTS (Giữ nguyên)
    // ===================================
    playSFX(name) {
        if (!this.ctx || this.sfxVolume === 0) return;
        this.ensureContext();
        switch(name) {
            case 'attack': this.sfxHit(); break;
            case 'hurt': this.sfxHurt(); break;
            case 'level_up': this.sfxLevelUp(); break;
            case 'pickup': this.sfxPickup(); break;
            case 'menu': this.sfxMenu(); break;
            case 'victory': this.sfxVictory(); break;
            case 'defeat': this.sfxDefeat(); break;
            case 'skill': this.sfxSkill(); break;
            case 'shop': this.sfxShop(); break;
        }
    },

    makeSFX(freqs, type, gainV, duration) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(gainV * this.sfxVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        gainNode.connect(this.sfxGain);

        for (let i = 0; i < freqs.length; i++) {
            const osc = this.ctx.createOscillator();
            osc.type = type;
            osc.frequency.setValueAtTime(freqs[i], now + i * (duration / freqs.length));
            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + duration);
        }
    },

    sfxHit() { this.makeSFX([440, 220, 110], 'square', 0.2, 0.15); },
    sfxHurt() { this.makeSFX([330, 165, 110], 'sawtooth', 0.2, 0.2); },
    sfxLevelUp() { this.makeSFX([523, 659, 784, 1047, 1319], 'sine', 0.2, 0.8); },
    sfxPickup() { this.makeSFX([880, 1047, 1319], 'triangle', 0.1, 0.3); },
    sfxMenu() { this.makeSFX([440, 554], 'sine', 0.1, 0.1); },
    sfxVictory() { this.makeSFX([523, 659, 784, 1047, 784, 880, 1047], 'triangle', 0.2, 1.5); },
    sfxDefeat() { this.makeSFX([392, 349, 311, 262], 'sawtooth', 0.2, 1.2); },
    sfxSkill() { this.makeSFX([880, 1047, 880, 1319], 'triangle', 0.15, 0.5); },
    sfxShop() { this.makeSFX([523, 659], 'sine', 0.1, 0.2); },

    setMusicVolume(val) {
        this.musicVolume = val / 100;
        if (this.bgmGain) this.bgmGain.gain.value = this.musicVolume;
        const el = document.getElementById('music-vol-text');
        if (el) el.textContent = val + '%';
    },

    setSfxVolume(val) {
        this.sfxVolume = val / 100;
        if (this.sfxGain) this.sfxGain.gain.value = this.sfxVolume;
        const el = document.getElementById('sfx-vol-text');
        if (el) el.textContent = val + '%';
    }
};
