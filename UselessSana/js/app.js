/* ==========================================================================
   Aladdin's Magic Lamp - Main Application Entrypoint
   Orchestrates phases: Landing -> Lamp Rubbing -> Magic Burst -> Side-by-Side Chat.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const headerText = document.getElementById('header-text');
    const lampStage = document.getElementById('lamp-stage');
    const muteBtn = document.getElementById('mute-btn');
    const audioIcon = document.getElementById('audio-icon');
    const audioText = document.getElementById('audio-text');

    // 1. Setup Audio Mute Button
    muteBtn.addEventListener('click', () => {
        if (window.soundEngine) {
            const isMuted = window.soundEngine.toggleMute();
            audioIcon.innerText = isMuted ? '🔇' : '🔊';
            audioText.innerText = isMuted ? 'Sound OFF' : 'Sound ON';
        }
    });

    // 2. Register Lamp Rub 100% Completion Handler
    window.lampEngine.onMagicTrigger(() => {
        triggerMagicSequence();
    });

    // 3. Register Wish Submission Handler
    window.chatUI.onWishSubmit((userWish) => {
        processUserWish(userWish);
    });

    // Magic Sequence Trigger (Screen shake, blinding particle burst, side-by-side Aladdin layout)
    function triggerMagicSequence() {
        // Switch Container to Active 2-Column Split Phase
        appContainer.classList.remove('phase-landing');
        appContainer.classList.add('phase-active');

        // Phase 1: Screen Shake & Audio Burst
        appContainer.classList.add('shake-screen');
        if (window.soundEngine) {
            window.soundEngine.playSummonExplosion();
        }

        // Particle Burst at Lamp center
        const lampRect = document.getElementById('lamp-wrapper').getBoundingClientRect();
        const centerX = lampRect.left + lampRect.width / 2;
        const centerY = lampRect.top + lampRect.height / 2;

        if (window.particleEngine) {
            window.particleEngine.triggerGoldenExplosion(centerX, centerY);
        }

        // Fade header subtitle slightly
        headerText.style.opacity = '0.5';

        // Phase 2: Dramatic Aladdin Appearance & Intro Dialogue
        setTimeout(() => {
            appContainer.classList.remove('shake-screen');

            if (window.genieController) {
                window.genieController.playDramaticEntrance(() => {
                    // Show Wish Reply Chat Interface after Aladdin finishes intro
                    window.chatUI.showChat();
                });
            }
        }, 600);
    }

    // Process Wish with AI Engine
    function processUserWish(wishText) {
        if (!window.aiEngine || !window.genieController) return;

        // Genie thinks briefly (sets neutral expression)
        window.genieController.setExpression('neutral');

        setTimeout(() => {
            // Get response & expression from AI engine
            const responseObj = window.aiEngine.processWish(wishText);

            // Update Genie expression
            window.genieController.setExpression(responseObj.expression);

            // Render speech text bubble on Aladdin & Chat UI
            window.genieController.speak(responseObj.text);
            window.chatUI.addMessageBubble(responseObj.text, 'genie');

            // Play sparkle chime
            if (window.soundEngine) {
                window.soundEngine.playSparkle();
            }
        }, 400);
    }
});
