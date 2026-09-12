/* ==========================================================================
   Aladdin's Magic Lamp - Particle & Smoke Engine
   Canvas animation system for stars, magic smoke, sparkles & explosion bursts.
   ========================================================================== */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.stars = [];
        this.particles = [];
        this.smokeWisps = [];
        this.isSummoningVortex = false;
        this.vortexCenter = { x: this.width / 2, y: this.height / 2 };

        this.initCanvas();
        this.initStars();
        this.initSmoke();
        this.bindEvents();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initCanvas() {
        if (!this.canvas) return;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.initCanvas();
            this.initStars();
        });
    }

    initStars() {
        this.stars = [];
        const count = Math.floor((this.width * this.height) / 5000);
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005,
                color: Math.random() > 0.3 ? '#ffd700' : '#ffffff'
            });
        }
    }

    initSmoke() {
        this.smokeWisps = [];
        for (let i = 0; i < 15; i++) {
            this.smokeWisps.push({
                x: this.width * 0.3 + Math.random() * (this.width * 0.4),
                y: this.height * 0.4 + Math.random() * (this.height * 0.3),
                radius: 40 + Math.random() * 80,
                alpha: 0.05 + Math.random() * 0.1,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -0.2 - Math.random() * 0.3,
                color: Math.random() > 0.5 ? '138, 43, 226' : '0, 242, 254'
            });
        }
    }

    emitRubSparkles(x, y, amount = 3) {
        for (let i = 0; i < amount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: 2 + Math.random() * 4,
                color: Math.random() > 0.4 ? '#ffd700' : '#64ffda',
                alpha: 1,
                decay: 0.02 + Math.random() * 0.03,
                shape: Math.random() > 0.5 ? 'star' : 'circle'
            });
        }
    }

    emitSpoutSmoke(x, y) {
        this.smokeWisps.push({
            x: x,
            y: y,
            radius: 10 + Math.random() * 15,
            alpha: 0.3,
            vx: -0.5 - Math.random() * 0.8,
            vy: -1.0 - Math.random() * 1.0,
            color: '0, 242, 254'
        });
    }

    triggerGoldenExplosion(cx, cy) {
        this.isSummoningVortex = true;
        this.vortexCenter = { x: cx, y: cy };

        for (let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 12;
            this.particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 6,
                color: Math.random() > 0.3 ? '#ffd700' : '#00f2fe',
                alpha: 1,
                decay: 0.008 + Math.random() * 0.015,
                shape: 'star'
            });
        }

        for (let i = 0; i < 30; i++) {
            this.smokeWisps.push({
                x: cx + (Math.random() - 0.5) * 40,
                y: cy + (Math.random() - 0.5) * 40,
                radius: 30 + Math.random() * 60,
                alpha: 0.6,
                vx: (Math.random() - 0.5) * 3,
                vy: -1.5 - Math.random() * 3,
                color: Math.random() > 0.5 ? '255, 215, 0' : '138, 43, 226'
            });
        }

        setTimeout(() => {
            this.isSummoningVortex = false;
        }, 2000);
    }

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let star of this.stars) {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.2) {
                star.speed = -star.speed;
            }
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = Math.max(0.1, star.alpha);
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        for (let i = this.smokeWisps.length - 1; i >= 0; i--) {
            const wisp = this.smokeWisps[i];
            wisp.x += wisp.vx;
            wisp.y += wisp.vy;
            wisp.radius += 0.4;
            wisp.alpha -= 0.002;

            if (wisp.alpha <= 0 || wisp.radius > 180) {
                this.smokeWisps.splice(i, 1);
                continue;
            }

            const grad = this.ctx.createRadialGradient(
                wisp.x, wisp.y, 0,
                wisp.x, wisp.y, wisp.radius
            );
            grad.addColorStop(0, `rgba(${wisp.color}, ${wisp.alpha})`);
            grad.addColorStop(0.7, `rgba(${wisp.color}, ${wisp.alpha * 0.3})`);
            grad.addColorStop(1, `rgba(${wisp.color}, 0)`);

            this.ctx.fillStyle = grad;
            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            this.ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        if (this.smokeWisps.length < 10) {
            this.smokeWisps.push({
                x: this.width * 0.2 + Math.random() * (this.width * 0.6),
                y: this.height * 0.6 + Math.random() * (this.height * 0.3),
                radius: 40 + Math.random() * 50,
                alpha: 0.08,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.3 - Math.random() * 0.3,
                color: Math.random() > 0.5 ? '138, 43, 226' : '0, 242, 254'
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'star') {
                this.drawStar(p.x, p.y, 4, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(this.animate);
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bg-canvas')) {
        window.particleEngine = new ParticleEngine('bg-canvas');
    }
});
