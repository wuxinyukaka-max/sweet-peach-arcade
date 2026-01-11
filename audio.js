const CandyAudio = {
    ctx: null,

    init() {
        try {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') this.ctx.resume();
        } catch (e) {}
    },

    // 1. 按钮点击声：清脆可爱的“小气泡” (像手指点在水灵灵的软糖上)
    playClick() {
        this.init();
        const n = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // 使用正弦波，但通过极速频率跳变模拟“啵”的一声
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, n);
        osc.frequency.exponentialRampToValueAtTime(300, n + 0.04);

        // 柔化音质的低通滤波
        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.2, n + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n);
        osc.stop(n + 0.05);
    },

    // 2. 吃到糖果声：高级“陶瓷风铃” (清透、无杂质的卡哇伊感)
    playCollect() {
        this.init();
        const n = this.ctx.currentTime;
        
        // 模拟两颗硬糖碰撞，使用两个圆润的高频音阶
        const freqs = [1567.98, 2093.00]; // G6 和 C7
        
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, n + (i * 0.02));
            osc.frequency.exponentialRampToValueAtTime(f * 0.8, n + 0.15 + (i * 0.02));

            filter.type = 'lowpass';
            filter.frequency.value = 3000;

            gain.gain.setValueAtTime(0, n + (i * 0.02));
            gain.gain.linearRampToValueAtTime(0.1, n + (i * 0.02) + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, n + 0.2 + (i * 0.02));

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(n + (i * 0.02));
            osc.stop(n + 0.2 + (i * 0.02));
        });
    },

    // 3. 失败/撞墙声：闷声闷气的“咕叽” (模拟果冻摔地，带点委屈感)
    playGameOver() {
        this.init();
        const n = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle'; // 三角波比方波软得多
        osc.frequency.setValueAtTime(250, n);
        osc.frequency.exponentialRampToValueAtTime(80, n + 0.3);

        // 强力滤波：切掉所有高频，只留下低频的“肉感”
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        filter.Q.value = 10; // 增加一点共振

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.2, n + 0.05);
        gain.gain.linearRampToValueAtTime(0, n + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n);
        osc.stop(n + 0.3);
    },

    // 4. 跳跃声：弹力十足的“噗咻” (模拟橡胶弹簧)
    playJump() {
        this.init();
        const n = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        // 经典的U型曲线频率：先低后高，模拟蓄力起跳
        osc.frequency.setValueAtTime(200, n);
        osc.frequency.quadraticCurveToAtTime(100, n + 0.05, 900, n + 0.15);

        filter.type = 'lowpass';
        filter.frequency.value = 1500;

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.15, n + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n);
        osc.stop(n + 0.2);
    }
};

// 自动激活逻辑
(function() {
    const unlock = () => {
        CandyAudio.init();
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('mousedown', unlock);
    };
    window.addEventListener('touchstart', unlock, false);
    window.addEventListener('mousedown', unlock, false);
})();