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

    // 辅助函数：创建一个带Q弹感的基础合成器
    createJellySource(filterFreq = 1500) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // 使用正弦波（最像果冻）
        osc.type = 'sine';
        
        // 低通滤波：切掉高频杂音，让声音变温润
        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;
        filter.Q.value = 5; // 稍微调高 Q 值，增加一点共鸣感（像敲击中空的糖壳）

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        return { osc, gain, filter };
    },

    // 1. 按钮点击：应要求静音
    playClick() {
        // 静音处理
    },

    // 2. 吃到糖果：像泡泡破裂的“啾叮！”
    playCollect() {
        const n = this.ctx.currentTime;
        const { osc, gain, filter } = this.createJellySource(2500);

        // 核心 Q 弹逻辑：频率像阶梯一样快速上升
        osc.frequency.setValueAtTime(600, n);
        osc.frequency.exponentialRampToValueAtTime(1600, n + 0.1);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.15, n + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.3);

        osc.start(n);
        osc.stop(n + 0.3);
    },

    // 3. 失败/撞墙：闷声闷气的“呜噗~”
    playGameOver() {
        const n = this.ctx.currentTime;
        const { osc, gain, filter } = this.createJellySource(600);

        osc.type = 'triangle'; // 三角波稍微厚实一点
        osc.frequency.setValueAtTime(300, n);
        // 频率像软泥一样滑落
        osc.frequency.exponentialRampToValueAtTime(80, n + 0.5);

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.2, n + 0.05);
        gain.gain.linearRampToValueAtTime(0, n + 0.5);

        osc.start(n);
        osc.stop(n + 0.5);
    },

    // 4. 跳跃/移动：经典的“Boing”弹簧音
    // 这种声音模拟了物体受压后猛然弹起的效果
    playJump() {
        const n = this.ctx.currentTime;
        const { osc, gain, filter } = this.createJellySource(1200);

        // Boing音效的精髓：频率先下压一点点，然后极速上升
        osc.frequency.setValueAtTime(300, n);
        osc.frequency.linearRampToValueAtTime(200, n + 0.03); // 下压蓄力
        osc.frequency.exponentialRampToValueAtTime(900, n + 0.15); // 猛然弹出

        gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(0.15, n + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, n + 0.25);

        osc.start(n);
        osc.stop(n + 0.25);
    }
};

// 全自动音频解锁
(function() {
    const unlock = () => {
        CandyAudio.init();
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('mousedown', unlock);
    };
    window.addEventListener('touchstart', unlock, {passive: true});
    window.addEventListener('mousedown', unlock);
})();