/* ==========================================================================
   Aladdin's Magic Lamp - Web Audio & Speech Synthesizer
   Features WAY TOO LOUD SPEECH SYNTHESIS & ICONIC GENIE LAUGH.
   (Typing sound pops removed per user request)
   ========================================================================= */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.rubbingNoiseNode = null;
        this.rubbingGain = null;
        this.rubbingFilter = null;
        this.initialized = false;
        this.synth = window.speechSynthesis || null;
        this.voices = [];

        this.initVoices();
    }

    initVoices() {
        if (this.synth) {
            const loadVoices = () => {
                this.voices = this.synth.getVoices();
            };
            loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = loadVoices;
            }
        }
    }

    // Initialize Audio Context on first user action
    init() {
        if (this.initialized) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.setupAmbientPad();
            this.setupRubbingSynth();
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported on this browser", e);
        }
    }

    ensureContext() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Toggle mute state
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.ambientGain && this.ctx) {
            this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
        }
        if (this.isMuted && this.synth) {
            this.synth.cancel();
        }
        return this.isMuted;
    }

    // WAY TOO LOUD SPEECH SYNTHESIS (Max Volume 1.0, High Pitch 1.45, Slow Pacing 0.85)
    speakDramatic(text, includeLaugh = true) {
        if (this.isMuted || !this.synth) return;

        // Cancel any previous speech
        this.synth.cancel();

        // Clean text for speech
        let speechText = text.replace(/<[^>]*>/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, '');
        
        // Append iconic vocal laugh text at the end!
        if (includeLaugh && !speechText.includes("HAHA")) {
            speechText += "... HAHAHAHA! HA-HA-HA! AHAHAHA!";
        }

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.volume = 1.0;  // MAXIMUM WAY TOO LOUD VOLUME
        utterance.pitch = 1.45;  // EXTREMELY DRAMATIC LOUD GENIE PITCH
        utterance.rate = 0.85;   // SLOW DELIBERATE HIGH IMPACT PACING

        // Select loudest expressive male voice available
        if (this.voices.length > 0) {
            const dramaticVoice = this.voices.find(v => 
                v.name.includes('Male') || 
                v.name.includes('David') || 
                v.name.includes('Google UK English Male') || 
                v.lang.startsWith('en')
            );
            if (dramaticVoice) {
                utterance.voice = dramaticVoice;
            }
        }

        // Play Synthesized Laugh Sound Effect when speech ends
        utterance.onend = () => {
            if (includeLaugh) {
                this.playGenieLaugh();
            }
        };

        this.synth.speak(utterance);
    }

    // SYNTHESIZED ICONIC GENIE LAUGH (Web Audio Oscillator Laugh Cascade)
    playGenieLaugh() {
        this.ensureContext();
        if (this.isMuted || !this.ctx) return;

        const now = this.ctx.currentTime;
        const laughPitches = [380, 520, 460, 600, 420, 500, 360];

        laughPitches.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.14);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + idx * 0.14 + 0.12);

            const startTime = now + idx * 0.14;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.14);
        });

        this.playSparkle();
    }

    // Mystical Ambient Pad
    setupAmbientPad() {
        if (!this.ctx) return;
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);

        const freqs = [110, 164.81, 220, 293.66, 329.63];
        freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.2 + Math.random() * 0.3;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 3;

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.connect(this.ambientGain);
            osc.start();
            lfo.start();
        });

        this.ambientGain.connect(this.ctx.destination);
    }

    // Rubbing Noise Synth
    setupRubbingSynth() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.rubbingNoiseNode = this.ctx.createBufferSource();
        this.rubbingNoiseNode.buffer = noiseBuffer;
        this.rubbingNoiseNode.loop = true;

        this.rubbingFilter = this.ctx.createBiquadFilter();
        this.rubbingFilter.type = 'bandpass';
        this.rubbingFilter.frequency.value = 800;
        this.rubbingFilter.Q.value = 3;

        this.rubbingGain = this.ctx.createGain();
        this.rubbingGain.gain.value = 0;

        this.rubbingNoiseNode.connect(this.rubbingFilter);
        this.rubbingFilter.connect(this.rubbingGain);
        this.rubbingGain.connect(this.ctx.destination);

        this.rubbingNoiseNode.start();
    }

    playRub(intensity = 1.0) {
        this.ensureContext();
        if (this.isMuted || !this.rubbingGain) return;

        const now = this.ctx.currentTime;
        const targetGain = Math.min(0.25, 0.08 + intensity * 0.16);
        const targetFreq = 450 + intensity * 1300;

        this.rubbingFilter.frequency.cancelScheduledValues(now);
        this.rubbingFilter.frequency.linearRampToValueAtTime(targetFreq, now + 0.05);

        this.rubbingGain.gain.cancelScheduledValues(now);
        this.rubbingGain.gain.linearRampToValueAtTime(targetGain, now + 0.04);
        this.rubbingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }

    playSparkle() {
        this.ensureContext();
        if (this.isMuted || !this.ctx) return;

        const notes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + idx * 0.06;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    playSummonExplosion() {
        this.ensureContext();
        if (this.isMuted || !this.ctx) return;

        const now = this.ctx.currentTime;

        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(200, now);
        subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

        subGain.gain.setValueAtTime(0.6, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.3);

        const bufferSize = this.ctx.sampleRate * 1.5;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(200, now + 1.4);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now);
        noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.5);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);

        this.playSparkle();
        setTimeout(() => this.playSparkle(), 300);
        setTimeout(() => this.playSparkle(), 600);
    }
}

window.soundEngine = new SoundEngine();
