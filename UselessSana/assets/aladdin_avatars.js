/* ==========================================================================
   Aladdin's Magic Lamp - Genie Avatar Renderer
   Renders the exact Genie image uploaded by the user (`assets/genie_original.png`)
   with dynamic expression classes & animation states.
   ========================================================================== */

class AladdinAvatarRenderer {
    static getSVG(expression = 'neutral') {
        return `<img src="assets/genie_original.png" alt="Aladdin Genie" class="genie-real-img expression-${expression}">`;
    }
}

window.AladdinAvatarRenderer = AladdinAvatarRenderer;
