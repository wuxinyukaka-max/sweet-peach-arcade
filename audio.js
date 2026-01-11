// 糖果音效引擎 - 有机/静音按键版
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

    // 内部通用有机合成器 (模拟木质/果冻碰撞)
    createOrganicSource(type = 'sine', filterFreq = 1200) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;
        filter.Q.value = 1;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        return { osc, gain, filter };
    },

    // 1. 按钮点击声：应要求已改为静音
    playClick() {
        // 为了不改动 HTML 的调用逻辑，保留此函数名
        // 但内部不发出任何声音
        console.log("按键音已静音");
    },

    // 2. 吃到糖果/收集声：高级木琴“叮~”
    // 听起来像一颗硬糖掉进木盒子，非常解压
    playCollect() {
        const n = this.ctx.currentTime;
        // 两个谐音层叠加：基音 + 高八度
        [880, 1760].forEach((freq, i) => {
            const { osc, gain, filter } = this.createOrganicSource('sine', 2000);
            
            // 极短的起音，模拟敲击感
            gain.gain.setValueAtTime(0, n);
            gain.gain.linearRampToValueAtTime(0.12, n + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, n + 0.4);

            osc.frequency.setValueAtTime(freq, n);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.98, n + 0.4); // 轻微失调，模拟真实物理

            osc.start(n);
            osc.stop(n + 0.4);
        });
    },

    // 3. 失败/撞墙声：闷声闷气的“咚”
    // 模拟大块棉花糖落地的声音，不刺激耳朵
    playGameOver() {
        const n = this.ctx.currentTime;
        const { osc, gain, filter } = this.createOrganicSource('triangle', 500);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.25, n + 0.02);
        gain.gain.linearRampToValueAtTime(0, n + 0.5);

        osc.frequency.setValueAtTime(150, n);
        osc.frequency.exponentialRampToValueAtTime(40, n + 0.5);

        osc.start(n);
        osc.stop(n + 0.5);
    },

    // 4. 跳跃声：柔和的空气“呼”
    // 像是一个肥皂泡向上飘动的感觉
    playJump() {
        const n = this.ctx.currentTime;
        const { osc, gain, filter } = this.createOrganicSource('sine', 1000);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.15, n + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, n + 0.3);

        // 柔和的抛物线滑音
        osc.frequency.setValueAtTime(200, n);
        osc.frequency.quadraticCurveToAtTime(100, n + 0.05, 700, n + 0.25);

        osc.start(n);
        osc.stop(n + 0.3);
    },

    // 5. 额外：迷宫狗叫声 (如果你保留了狗的逻辑)
    // 模拟低沉的闷哼，不吓人
    playBark() {
        const n = this.ctx.currentTime;
        const { osc, gain, filter } = this.createOrganicSource('triangle', 300);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.1, n + 0.01);
        gain.gain.linearRampToValueAtTime(0, n + 0.15);

        osc.frequency.setValueAtTime(100, n);
        osc.frequency.linearRampToValueAtTime(150, n + 0.05);
        osc.frequency.linearRampToValueAtTime(80, n + 0.15);

        osc.start(n);
        osc.stop(n + 0.15);
    }
};

// 全自动解锁
(function() {
    const unlock = () => {
        CandyAudio.init();
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('mousedown', unlock);
    };
    window.addEventListener('touchstart', unlock, {passive: true});
    window.addEventListener('mousedown', unlock);
})();