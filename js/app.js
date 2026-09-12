/* ==========================================================================
   Aladdin's Magic Lamp - Main Application Entrypoint
   Orchestrates phases: Landing -> Lamp Rubbing -> Magic Burst -> Side-by-Side Chat.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const headerText = document.getElementById('header-text');
    const lampWrapper = document.getElementById('lamp-wrapper');
    const muteBtn = document.getElementById('mute-btn');
    const audioIcon = document.getElementById('audio-icon');
    const audioText = document.getElementById('audio-text');

    // 1. Setup Audio Mute Button
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (window.soundEngine) {
                const isMuted = window.soundEngine.toggleMute();
                if (audioIcon) audioIcon.innerText = isMuted ? '🔇' : '🔊';
                if (audioText) audioText.innerText = isMuted ? 'Sound OFF' : 'Sound ON';
            }
        });
    }

    // 2. Register Lamp Rub 100% Completion Handler
    if (window.lampEngine) {
        window.lampEngine.onMagicTrigger(() => {
            triggerMagicSequence();
        });
    }

    // 3. Register Wish Submission Handler
    if (window.chatUI) {
        window.chatUI.onWishSubmit((userWish) => {
            processUserWish(userWish);
        });
    }

    // Magic Sequence Trigger (Screen shake, blinding particle burst, side-by-side Aladdin layout)
    function triggerMagicSequence() {
        if (appContainer) {
            appContainer.classList.remove('phase-landing');
            appContainer.classList.add('phase-active');
            appContainer.classList.add('shake-screen');
        }

        if (window.soundEngine) {
            window.soundEngine.playSummonExplosion();
        }

        if (lampWrapper && window.particleEngine) {
            const lampRect = lampWrapper.getBoundingClientRect();
            const centerX = lampRect.left + lampRect.width / 2;
            const centerY = lampRect.top + lampRect.height / 2;
            window.particleEngine.triggerGoldenExplosion(centerX, centerY);
        }

        if (headerText) {
            headerText.style.opacity = '0.5';
        }

        setTimeout(() => {
            if (appContainer) appContainer.classList.remove('shake-screen');

            if (window.genieController) {
                window.genieController.playDramaticEntrance(() => {
                    if (window.chatUI) window.chatUI.showChat();
                });
            }
        }, 600);
    }

    // Process Wish with AI Engine
    function processUserWish(wishText) {
        if (!window.aiEngine || !window.genieController) return;

        window.genieController.setExpression('neutral');

        setTimeout(() => {
            const responseObj = window.aiEngine.processWish(wishText);

            window.genieController.setExpression(responseObj.expression);

            window.genieController.speak(responseObj.text);
            if (window.chatUI) window.chatUI.addMessageBubble(responseObj.text, 'genie');

            if (window.soundEngine) {
                window.soundEngine.playSparkle();
            }
        }, 400);
    }
});
