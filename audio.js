// 糖果音效引擎 - 莫兰迪小清新版
const CandyAudio = {
    ctx: null,

    // 初始化音频上下文
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // 自动恢复上下文（解决浏览器静音策略）
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    // 1. 按钮点击声：Q弹的“啵”
    // 模拟气泡破裂，适合莫兰迪色的轻盈感
    playClick() {
        this.init();
        const n = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // 快速下行的频率，产生“啵”的打击感
        osc.frequency.setValueAtTime(1200, n);
        osc.frequency.exponentialRampToValueAtTime(400, n + 0.05);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.2, n + 0.01); // 极速启动
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.1); // 快速消失

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n);
        osc.stop(n + 0.1);
    },

    // 2. 吃到糖果声：清脆的“叮灵”
    // 模拟木琴或硬糖碰撞，带有透亮的高音
    playCollect() {
        this.init();
        const n = this.ctx.currentTime;
        
        // 使用两个振荡器叠加，产生丰富谐音
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(600, n);
        osc1.frequency.exponentialRampToValueAtTime(1800, n + 0.15);

        osc2.type = 'sine'; // 高频谐音，增加剔透感
        osc2.frequency.setValueAtTime(1200, n);
        osc2.frequency.exponentialRampToValueAtTime(3600, n + 0.1);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.15, n + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(n);
        osc2.start(n);
        osc1.stop(n + 0.2);
        osc2.stop(n + 0.2);
    },

    // 3. 撞墙/失败声：闷声的“唔~”
    // 模拟果冻掉在地上的软糯感，不再刺耳
    playGameOver() {
        this.init();
        const n = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, n);
        // 缓慢下行，带有一点点频率波动（颤音）
        osc.frequency.linearRampToValueAtTime(100, n + 0.4);

        gain.gain.setValueAtTime(0.2, n);
        gain.gain.linearRampToValueAtTime(0.1, n + 0.2);
        gain.gain.linearRampToValueAtTime(0, n + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n);
        osc.stop(n + 0.4);
    },

    // 4. 跳跃声：轻盈的“呜呼”
    // 带有弹性的滑音，感觉角色像弹簧一样
    playJump() {
        this.init();
        const n = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // 起始频率略低，产生蓄力感
        osc.frequency.setValueAtTime(200, n);
        // 快速滑向高音
        osc.frequency.exponentialRampToValueAtTime(800, n + 0.15);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.2, n + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n);
        osc.stop(n + 0.2);
    }
};