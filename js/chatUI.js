/* ==========================================================================
   Aladdin's Magic Lamp - Chat UI Interface Controller
   Manages glassmorphism chat rendering, user message input, & suggestion chips.
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

        if (this.wishForm) {
            this.bindEvents();
        }
    }

    bindEvents() {
        if (this.wishForm) {
            this.wishForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleWishSubmit(this.wishInput.value);
            });
        }

        if (this.quickChips) {
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
    }

    showChat() {
        if (!this.chatSection) return;
        this.chatSection.classList.remove('hidden');
        setTimeout(() => {
            if (this.wishInput) this.wishInput.focus();
            this.chatSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    onWishSubmit(callback) {
        this.onWishSubmitCallback = callback;
    }

    handleWishSubmit(wishText) {
        if (!wishText || !wishText.trim()) return;

        const cleanWish = wishText.trim();
        if (this.wishInput) this.wishInput.value = '';

        this.addMessageBubble(cleanWish, 'user');

        this.wishCount++;
        if (this.wishCounterBadge) {
            this.wishCounterBadge.innerText = `Wishes Granted: ${this.wishCount}`;
        }

        if (this.onWishSubmitCallback) {
            this.onWishSubmitCallback(cleanWish);
        }
    }

    addMessageBubble(text, sender) {
        if (!this.chatMessages) return;

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
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chatUI = new ChatUIController();
});
