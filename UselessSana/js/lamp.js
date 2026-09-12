/* ==========================================================================
   Aladdin's Magic Lamp - Lamp Rubbing Interaction & Physics Engine
   Tracks mouse & touch friction across the lamp to charge progress meter.
   ========================================================================== */

class LampInteractionEngine {
    constructor() {
        this.rubTarget = document.getElementById('rub-target');
        this.lampWrapper = document.getElementById('lamp-wrapper');
        this.magicGlow = document.getElementById('magic-glow');
        this.meterInner = document.getElementById('meter-bar-inner');
        this.meterText = document.getElementById('meter-text');
        
        this.progress = 0;
        this.isRubbing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.totalRubDistance = 0;
        this.overRubCount = 0;
        this.magicSequenceTriggered = false;

        this.onMagicTriggerCallback = null;
        this.bindEvents();
    }

    bindEvents() {
        // Mouse Events
        this.rubTarget.addEventListener('mousedown', (e) => this.startRub(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => {
            if (this.isRubbing) this.processRub(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => this.stopRub());

        // Touch Events (Mobile Support)
        this.rubTarget.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.startRub(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (this.isRubbing && e.touches.length > 0) {
                this.processRub(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => this.stopRub());
    }

    startRub(x, y) {
        this.isRubbing = true;
        this.lastX = x;
        this.lastY = y;
        if (window.soundEngine) window.soundEngine.ensureContext();
    }

    stopRub() {
        this.isRubbing = false;
    }

    processRub(x, y) {
        const dx = x - this.lastX;
        const dy = y - this.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Filter out tiny micro movements
        if (distance < 4) return;

        this.lastX = x;
        this.lastY = y;
        this.totalRubDistance += distance;

        // Increase rub progress
        const deltaProgress = (distance / 12);
        this.progress = Math.min(100, this.progress + deltaProgress);

        // Update Meter UI
        this.updateMeterUI();

        // Visual Reactions: Lamp glow & subtle tilt shake
        const glowRadius = 320 + (this.progress * 2.5);
        const glowOpacity = 0.3 + (this.progress / 120);
        this.magicGlow.style.background = `radial-gradient(circle, rgba(255,215,0,${glowOpacity}) 0%, rgba(138,43,226,0.5) 50%, rgba(0,0,0,0) 70%)`;
        this.magicGlow.style.width = `${glowRadius}px`;
        this.magicGlow.style.height = `${glowRadius}px`;

        const tilt = (Math.random() - 0.5) * (4 + (this.progress / 10));
        this.lampWrapper.style.transform = `scale(${1 + this.progress * 0.0015}) rotate(${tilt}deg)`;

        // Emit Sparkles & Smoke
        if (window.particleEngine) {
            window.particleEngine.emitRubSparkles(x, y, Math.ceil(distance / 10));
            if (Math.random() < 0.3) {
                const lampRect = this.lampWrapper.getBoundingClientRect();
                window.particleEngine.emitSpoutSmoke(lampRect.left + 30, lampRect.top + 50);
            }
        }

        // Play Rub Sound
        if (window.soundEngine) {
            window.soundEngine.playRub(Math.min(2.5, distance / 15));
        }

        // Over-rub easter egg counter
        if (this.magicSequenceTriggered) {
            this.overRubCount++;
            if (this.overRubCount === 40 && window.genieController) {
                window.genieController.setExpression('annoyed');
                window.genieController.speak("BRO STOP RUBBING IT. I SAID THREE WISHES, NOT THREE THOUSAND RUBS.");
            }
        }

        // Trigger Magic Sequence when reaching 100%
        if (this.progress >= 100 && !this.magicSequenceTriggered) {
            this.magicSequenceTriggered = true;
            if (this.onMagicTriggerCallback) {
                this.onMagicTriggerCallback();
            }
        }
    }

    updateMeterUI() {
        const percent = Math.floor(this.progress);
        this.meterInner.style.width = `${percent}%`;

        // ASCII Bar: ███████░░░
        const totalBlocks = 10;
        const filledBlocks = Math.floor((percent / 100) * totalBlocks);
        const emptyBlocks = totalBlocks - filledBlocks;
        const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

        this.meterText.innerText = `${asciiBar} ${percent}%`;
    }

    onMagicTrigger(callback) {
        this.onMagicTriggerCallback = callback;
    }
}

window.lampEngine = new LampInteractionEngine();
