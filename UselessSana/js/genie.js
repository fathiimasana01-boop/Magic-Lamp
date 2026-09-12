/* ==========================================================================
   Aladdin's Magic Lamp - Aladdin Character Controller
   Manages character stage, expressions, WAY TOO LOUD VOICE SPEECH & speech bubble.
   (Typing sound effects removed per user request)
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

    // Set Aladdin's facial expression state
    setExpression(expression) {
        this.currentExpression = expression;
        if (window.AladdinAvatarRenderer && this.svgContainer) {
            this.svgContainer.innerHTML = window.AladdinAvatarRenderer.getSVG(expression);
        }
    }

    // Play Dramatic Entrance Dialogue Sequence
    playDramaticEntrance(onComplete) {
        this.aladdinStage.classList.remove('hidden');
        this.speechBubble.classList.remove('hidden');

        // Step 1: Shocked entrance yell
        this.setExpression('shocked');
        this.speak("WHO DARES DISTURB MY 3000-YEAR NAP?!?", () => {
            
            // Step 2: Sarcastic roast with iconic laugh
            setTimeout(() => {
                this.setExpression('laughing');
                this.speak("CONGRATULATIONS! You have successfully rubbed a lamp instead of doing something productive!", () => {
                    
                    // Step 3: Ask for wish & reveal reply chat box
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

    // WAY TOO LOUD Speech (Voice Synthesis + Iconic Laugh) - No typing sound effects!
    speak(text, callback) {
        if (this.typeTimeout) clearTimeout(this.typeTimeout);
        this.speechText.innerHTML = '';
        this.speechBubble.classList.remove('hidden');

        // 1. Trigger Speech Synthesis (WAY TOO LOUD)
        if (window.soundEngine) {
            window.soundEngine.speakDramatic(text, true);
        }

        // 2. Character Laugh Bounce Animation
        if (this.avatarWrapper) {
            this.avatarWrapper.classList.remove('genie-speak-bounce');
            void this.avatarWrapper.offsetWidth; // Trigger reflow
            this.avatarWrapper.classList.add('genie-speak-bounce');
        }

        // 3. Speech Bubble Pop Animation
        this.speechBubble.classList.remove('dramatic-pop');
        void this.speechBubble.offsetWidth;
        this.speechBubble.classList.add('dramatic-pop');

        let charIndex = 0;
        this.isTyping = true;

        // Clean quiet typing (No sound pop per user request)
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

window.genieController = new GenieController();
