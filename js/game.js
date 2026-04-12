/* ==========================================
   GAME.JS - Main Game Controller
   ========================================== */

const Game = {
    initialized: false,
    frame: 0,
    loadingProgress: 0,

    // Initialize game systems
    async init() {
        // Wait for DOM
        await Utils.wait(100);

        // Init audio
        GameAudio.init();

        // Load settings
        GameSettings.load();

        // Start loading animation
        this.fakeLoad();
    },

    fakeLoad() {
        const bar = document.getElementById('loading-bar');
        const barTrack = bar?.parentElement;
        const text = document.getElementById('loading-text');
        const tips = document.getElementById('loading-tips');

        const loadingSteps = [
            { progress: 10, text: 'Đang tải dữ liệu vật phẩm...' },
            { progress: 25, text: 'Đang tạo bản đồ thế giới...' },
            { progress: 40, text: 'Đang tải nhân vật và quái vật...' },
            { progress: 55, text: 'Đang khởi tạo hệ thống chiến đấu...' },
            { progress: 70, text: 'Đang tải hệ thống nhiệm vụ...' },
            { progress: 85, text: 'Đang chuẩn bị âm nhạc...' },
            { progress: 95, text: 'Đang tải giao diện...' },
            { progress: 100, text: 'Sẵn sàng chiến đấu!', done: true }
        ];

        const tipsArray = [
            '💡 Mẹo: Nhấn W A S D hoặc phím mũi tên để di chuyển.',
            '💡 Mẹo: Nhấn I để mở kho đồ.',
            '💡 Mẹo: Nhấn C để xem chỉ số nhân vật.',
            '💡 Mẹo: Click vào quái vật để chiến đấu.',
            '💡 Mẹo: Đậu Thần hồi phục toàn bộ HP và MP.',
            '💡 Mẹo: Thu thập 7 viên Ngọc Rồng để triệu hồi Shenron!',
            '💡 Mẹo: Nâng cấp kỹ năng trong màn hình K.',
            '💡 Mẹo: Đến Thị Trấn Tây để mua đồ cao cấp hơn.',
            '💡 Mẹo: Người Namek hồi phục HP tự động theo thời gian.',
            '💡 Mẹo: Chiến binh Majin có ATK cao nhất trong 3 chủng tộc.',
        ];

        let step = 0;
        let tipIdx = 0;
        if (tips) tips.textContent = tipsArray[0];

        const timerTips = setInterval(() => {
            tipIdx = (tipIdx + 1) % tipsArray.length;
            if (tips) tips.textContent = tipsArray[tipIdx];
        }, 2500);

        const timerLoad = setInterval(() => {
            if (step >= loadingSteps.length) {
                clearInterval(timerLoad);
                clearInterval(timerTips);
                return;
            }
            const s = loadingSteps[step];
            if (bar) bar.style.width = s.progress + '%';
            if (text) text.textContent = s.text;
            step++;

            if (s.done) {
                setTimeout(() => {
                    clearInterval(timerLoad);
                    clearInterval(timerTips);
                    this.finishLoading();
                }, 800);
            }
        }, 400);
    },

    finishLoading() {
        this.initialized = true;
        AppController.showScreen('login');
    }
};
