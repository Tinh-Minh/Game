/* ==========================================
   UTILS.JS - Helper Functions
   ========================================== */

const Utils = {
    // Random integer between min and max (inclusive)
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Random float
    randFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Clamp value
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    // Lerp
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    // Distance between two points
    dist(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    // Format number with dots
    formatNum(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    // Pad number
    pad(n, len = 2) {
        return String(n).padStart(len, '0');
    },

    // Deep clone
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Generate unique ID
    genId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Color blend
    blendColors(c1, c2, t) {
        const r1 = parseInt(c1.slice(1, 3), 16);
        const g1 = parseInt(c1.slice(3, 5), 16);
        const b1 = parseInt(c1.slice(5, 7), 16);
        const r2 = parseInt(c2.slice(1, 3), 16);
        const g2 = parseInt(c2.slice(3, 5), 16);
        const b2 = parseInt(c2.slice(5, 7), 16);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        return `rgb(${r},${g},${b})`;
    },

    // Ease functions
    easeOutElastic(x) {
        const c4 = (2 * Math.PI) / 3;
        return x === 0 ? 0 : x === 1 ? 1 :
            Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    },

    easeOutBounce(x) {
        const n1 = 7.5625, d1 = 2.75;
        if (x < 1 / d1) return n1 * x * x;
        else if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
        else if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
        else return n1 * (x -= 2.625 / d1) * x + 0.984375;
    },

    // Save/Load from localStorage
    save(key, data) {
        try {
            localStorage.setItem(`nro_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save error:', e);
            return false;
        }
    },

    load(key) {
        try {
            const data = localStorage.getItem(`nro_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Load error:', e);
            return null;
        }
    },

    delete(key) {
        localStorage.removeItem(`nro_${key}`);
    },

    // Show notification
    notify(msg, type = 'info', duration = 3000) {
        const container = document.getElementById('notifications');
        if (!container) return;
        const el = document.createElement('div');
        el.className = `notification ${type}`;
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(30px)';
            el.style.transition = 'all 0.3s ease';
            setTimeout(() => el.remove(), 300);
        }, duration);
    },

    // Add to chat
    chat(msg, type = 'system') {
        const log = document.getElementById('chat-messages');
        if (!log) return;
        const el = document.createElement('div');
        el.className = `chat-message ${type}`;
        el.textContent = msg;
        log.appendChild(el);
        log.scrollTop = log.scrollHeight;
        // Keep max 50 messages
        while (log.children.length > 50) log.removeChild(log.firstChild);
    },

    // Show damage number on screen
    showDamage(x, y, amount, type = 'damage') {
        const container = document.getElementById('damage-numbers');
        if (!container) return;
        const el = document.createElement('div');
        el.className = `damage-number ${type}`;
        const texts = { damage: `-${amount}`, heal: `+${amount}`, miss: 'MISS', crit: `💥${amount}!` };
        el.textContent = texts[type] || amount;
        el.style.left = (x + Utils.randInt(-20, 20)) + 'px';
        el.style.top = (y + Utils.randInt(-10, 10)) + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1300);
    },

    // Timer
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Hex to rgb
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // Draw rounded rect
    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
};

// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
    }

    spawn(opts = {}) {
        this.particles.push({
            x: opts.x || this.canvas.width / 2,
            y: opts.y || this.canvas.height / 2,
            vx: opts.vx || (Math.random() - 0.5) * 4,
            vy: opts.vy || (Math.random() - 0.5) * 4 - 2,
            size: opts.size || Math.random() * 6 + 2,
            color: opts.color || '#FF6B00',
            life: 1,
            decay: opts.decay || 0.02,
            gravity: opts.gravity || 0.1,
            alpha: 1
        });
    }

    spawnBurst(x, y, count = 10, color = '#FF6B00') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 2;
            this.spawn({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: Math.random() * 8 + 3,
                color,
                decay: 0.025
            });
        }
    }

    spawnPower(x, y, color = '#9B59B6') {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            this.spawn({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 10 + 4,
                color,
                decay: 0.03,
                gravity: -0.05
            });
        }
    }

    update() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= p.decay;
            p.alpha = p.life;
            p.size *= 0.97;
            return p.life > 0;
        });
    }

    draw() {
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    clear() {
        this.particles = [];
    }
}

// Animation Manager
class AnimManager {
    constructor() {
        this.anims = [];
    }

    add(anim) {
        this.anims.push({
            ...anim,
            frame: 0,
            done: false
        });
    }

    update() {
        this.anims = this.anims.filter(a => {
            a.frame++;
            if (a.onUpdate) a.onUpdate(a.frame / a.duration);
            if (a.frame >= a.duration) {
                if (a.onDone) a.onDone();
                return false;
            }
            return true;
        });
    }

    clear() {
        this.anims = [];
    }
}
