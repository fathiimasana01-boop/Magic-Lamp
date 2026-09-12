/* ==========================================================================
   Aladdin's Magic Lamp - Aladdin Character Controller
   Manages character stage, expressions, WAY TOO LOUD VOICE SPEECH & speech bubble.
   ========================================================================== */

class GenieController {
    constructor() {
        this.aladdinStage = document.getElementById('aladdin-stage');
        this.avatarWrapper = document.getElementById('aladdin-avatar-wrapper');
        this.svgContainer = document.getElementById('aladdin-svg-container');
        this.speechBubble = document.getElementById('speech-bubble');
        this.speechText = document.getElementById('speech-text');
        
        this.currentExpression = 'neutral';
        this.isTyping = false;
        this.typeTimeout = null;

        this.setExpression('neutral');
    }

    setExpression(expression) {
        this.currentExpression = expression;
        if (window.AladdinAvatarRenderer && this.svgContainer) {
            this.svgContainer.innerHTML = window.AladdinAvatarRenderer.getSVG(expression);
        }
    }

    playDramaticEntrance(onComplete) {
        if (!this.aladdinStage || !this.speechBubble) return;

        this.aladdinStage.classList.remove('hidden');
        this.speechBubble.classList.remove('hidden');

        this.setExpression('shocked');
        this.speak("WHO DARES DISTURB MY 3000-YEAR NAP?!?", () => {
            setTimeout(() => {
                this.setExpression('laughing');
                this.speak("CONGRATULATIONS! You have successfully rubbed a lamp instead of doing something productive!", () => {
                    setTimeout(() => {
                        this.setExpression('neutral');
                        if (window.chatUI) window.chatUI.showChat();
                        this.speak("SO... MORTAL! What is your wish?!?", () => {
                            if (onComplete) onComplete();
                        });
                    }, 3500);
                });
            }, 3600);
        });
    }

    speak(text, callback) {
        if (!this.speechText || !this.speechBubble) return;

        if (this.typeTimeout) clearTimeout(this.typeTimeout);
        this.speechText.innerHTML = '';
        this.speechBubble.classList.remove('hidden');

        if (window.soundEngine) {
            window.soundEngine.speakDramatic(text, true);
        }

        if (this.avatarWrapper) {
            this.avatarWrapper.classList.remove('genie-speak-bounce');
            void this.avatarWrapper.offsetWidth;
            this.avatarWrapper.classList.add('genie-speak-bounce');
        }

        this.speechBubble.classList.remove('dramatic-pop');
        void this.speechBubble.offsetWidth;
        this.speechBubble.classList.add('dramatic-pop');

        let charIndex = 0;
        this.isTyping = true;

        const typeChar = () => {
            if (charIndex < text.length) {
                this.speechText.innerHTML += text.charAt(charIndex);
                charIndex++;
                this.typeTimeout = setTimeout(typeChar, 35);
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };

        typeChar();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.genieController = new GenieController();
});
