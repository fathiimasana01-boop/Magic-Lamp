/* ==========================================================================
   Aladdin's Magic Lamp - Chat UI Interface Controller
   Manages glassmorphism chat rendering, user message input, & suggestion chips.
   (Typing sound effects removed per user request)
   ========================================================================== */

class ChatUIController {
    constructor() {
        this.chatSection = document.getElementById('chat-section');
        this.chatMessages = document.getElementById('chat-messages');
        this.wishForm = document.getElementById('wish-form');
        this.wishInput = document.getElementById('wish-input');
        this.wishCounterBadge = document.getElementById('wish-counter-badge');
        this.quickChips = document.getElementById('quick-chips');

        this.wishCount = 0;
        this.onWishSubmitCallback = null;

        this.bindEvents();
    }

    // Bind form submit & suggestion chips click
    bindEvents() {
        this.wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWishSubmit(this.wishInput.value);
        });

        // Quick suggestion chips listener
        this.quickChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.chip-btn');
            if (chip) {
                const wishText = chip.getAttribute('data-wish');
                if (wishText) {
                    this.wishInput.value = wishText;
                    this.handleWishSubmit(wishText);
                }
            }
        });
    }

    // Show Chat Reply Section & Focus Input
    showChat() {
        this.chatSection.classList.remove('hidden');
        setTimeout(() => {
            this.wishInput.focus();
            this.chatSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // Register callback when user makes a wish
    onWishSubmit(callback) {
        this.onWishSubmitCallback = callback;
    }

    handleWishSubmit(wishText) {
        if (!wishText || !wishText.trim()) return;

        const cleanWish = wishText.trim();
        this.wishInput.value = '';

        // Add User Bubble
        this.addMessageBubble(cleanWish, 'user');

        // Increment counter
        this.wishCount++;
        this.wishCounterBadge.innerText = `Wishes Granted: ${this.wishCount}`;

        // Trigger AI callback
        if (this.onWishSubmitCallback) {
            this.onWishSubmitCallback(cleanWish);
        }
    }

    // Add speech bubble to chat window (No typing sound pop per user request)
    addMessageBubble(text, sender) {
        const row = document.createElement('div');
        row.className = `chat-bubble-row ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;

        if (sender === 'genie') {
            bubble.innerHTML = `<strong>Aladdin:</strong> ${text}`;
        } else {
            bubble.innerText = text;
        }

        row.appendChild(bubble);
        this.chatMessages.appendChild(row);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

window.chatUI = new ChatUIController();
