(function () {
    'use strict';

    /** @type {Function|null} */
    let escapeKeyHandler = null;

    /**
     * Resolve the configured modifier string (guards against bad localized data).
     *
     * @returns {string} Modifier combination key, e.g. 'ctrl_shift'.
     */
    function getShortyModifier() {
        const raw = (window.shortyData && window.shortyData.modifier) || window.shortyModifier;
        return (typeof raw === 'string' && raw) ? raw : 'ctrl_shift';
    }

    /**
     * Resolve the shortcuts map from localized data.
     *
     * @returns {Object} Key → URL map.
     */
    function getShortyShortcuts() {
        const raw = (window.shortyData && window.shortyData.shortcuts) || window.shortyShortcuts;
        return (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
    }

    /**
     * Resolve modal custom text from localized data.
     *
     * @returns {string}
     */
    function getShortyModalText() {
        const raw = (window.shortyData && window.shortyData.modalText) || window.shortyModalText;
        return (typeof raw === 'string') ? raw : '';
    }

    /**
     * Resolve localized UI strings.
     *
     * @returns {Object}
     */
    function getShortyStrings() {
        const raw = (window.shortyData && window.shortyData.strings) || window.shortyStrings;
        return (raw && typeof raw === 'object') ? raw : {};
    }

    /**
     * Check if the current modifier combination matches the selected one.
     *
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {boolean} True if the modifier combination matches.
     */
    function checkModifierCombination(event) {
        const modifier = getShortyModifier();

        switch (modifier) {
            case 'ctrl_shift':
                return event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey;
            case 'alt_shift':
                return event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey;
            case 'ctrl_alt':
                return event.ctrlKey && event.altKey && !event.shiftKey && !event.metaKey;
            case 'ctrl_meta':
                return event.ctrlKey && event.metaKey && !event.shiftKey && !event.altKey;
            case 'alt_meta':
                return event.altKey && event.metaKey && !event.ctrlKey && !event.shiftKey;
            case 'shift_meta':
                return event.shiftKey && event.metaKey && !event.ctrlKey && !event.altKey;
            case 'ctrl_shift_alt':
                return event.ctrlKey && event.shiftKey && event.altKey && !event.metaKey;
            default:
                return event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey;
        }
    }

    /**
     * Get the display text for the current modifier combination.
     *
     * @returns {string} The display text for the modifier combination.
     */
    function getModifierDisplayText() {
        const modifier = getShortyModifier();
        const isMac = navigator.platform.indexOf('Mac') !== -1;
        const strings = getShortyStrings();

        switch (modifier) {
            case 'ctrl_shift':
                return strings.ctrlShift || 'Ctrl + Shift';
            case 'alt_shift':
                return isMac ?
                    (strings.optionShift || 'Option + Shift') :
                    (strings.altShift || 'Alt + Shift');
            case 'ctrl_alt':
                return isMac ?
                    (strings.ctrlOption || 'Ctrl + Option') :
                    (strings.ctrlAlt || 'Ctrl + Alt');
            case 'ctrl_meta':
                return isMac ?
                    (strings.ctrlCmd || 'Ctrl + Cmd') :
                    (strings.ctrlMeta || 'Ctrl + Meta');
            case 'alt_meta':
                return isMac ?
                    (strings.optionCmd || 'Option + Cmd') :
                    (strings.altMeta || 'Alt + Meta');
            case 'shift_meta':
                return isMac ?
                    (strings.shiftCmd || 'Shift + Cmd') :
                    (strings.shiftMeta || 'Shift + Meta');
            case 'ctrl_shift_alt':
                return isMac ?
                    (strings.ctrlShiftOption || 'Ctrl + Shift + Option') :
                    (strings.ctrlShiftAlt || 'Ctrl + Shift + Alt');
            default:
                return strings.ctrlShift || 'Ctrl + Shift';
        }
    }

    /**
     * Whether a CSS color value is fully transparent.
     *
     * @param {string} value
     * @returns {boolean}
     */
    function isTransparentColor(value) {
        if (!value || value === 'transparent') {
            return true;
        }

        // Comma syntax: rgba(0, 0, 0, 0)
        const comma = value.match(/rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?(?:\s*,\s*([\d.]+%?))?\s*\)/i);
        if (comma) {
            return comma[1] !== undefined && parseFloat(comma[1]) === 0;
        }

        // Space syntax: rgb(0 0 0 / 0)
        const slash = value.match(/rgba?\([^)]*?\/\s*([\d.]+%?)\s*\)/i);
        if (slash) {
            return parseFloat(slash[1]) === 0;
        }

        return false;
    }

    /**
     * Sample the page's current surface and text colors (respects light/dark themes).
     *
     * @returns {{bg: string, fg: string, font: string}}
     */
    function resolveThemeColors() {
        const body = document.body;
        const root = document.documentElement;
        const bodyStyles = body ? getComputedStyle(body) : null;
        const rootStyles = getComputedStyle(root);

        let fg = (bodyStyles && bodyStyles.color) || rootStyles.color || '';
        let font = (bodyStyles && bodyStyles.fontFamily) || rootStyles.fontFamily || 'inherit';
        let bg = '';

        let node = body;
        while (node && node !== root.parentElement) {
            const styles = getComputedStyle(node);
            if (!isTransparentColor(styles.backgroundColor)) {
                bg = styles.backgroundColor;
                break;
            }
            node = node.parentElement;
        }

        if (!bg || isTransparentColor(bg) || !fg) {
            const probe = document.createElement('div');
            probe.style.cssText = 'position:absolute;left:-9999px;color:CanvasText;background-color:Canvas;';
            (body || root).appendChild(probe);
            const probeStyles = getComputedStyle(probe);
            if (!bg || isTransparentColor(bg)) {
                bg = probeStyles.backgroundColor;
            }
            if (!fg) {
                fg = probeStyles.color;
            }
            probe.remove();
        }

        if (!bg || isTransparentColor(bg)) {
            bg = '#fff';
        }
        if (!fg) {
            fg = '#111';
        }

        return { bg: bg, fg: fg, font: font };
    }

    /**
     * Ensure modal CSS is present once.
     */
    function ensureModalStyles() {
        if (document.getElementById('shorty-modal-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'shorty-modal-styles';
        style.textContent = `
            .shorty-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: color-mix(in srgb, var(--shorty-fg, #111) 45%, transparent);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
            }

            .shorty-modal-content {
                background: var(--shorty-bg, #fff);
                color: var(--shorty-fg, #111);
                font-family: var(--shorty-font, inherit);
                border-radius: 0;
                box-shadow: 0 4px 20px color-mix(in srgb, var(--shorty-fg, #111) 30%, transparent);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
            }

            .shorty-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid color-mix(in srgb, var(--shorty-fg, #111) 18%, transparent);
            }

            .shorty-modal-header h2 {
                margin: 0;
                font-size: 1.5em;
                color: inherit;
            }

            .shorty-modal-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .shorty-modal-close:hover {
                background: color-mix(in srgb, var(--shorty-fg, #111) 10%, transparent);
            }

            .shorty-modal-body {
                padding: 20px;
                max-height: 400px;
                overflow-y: auto;
            }

            .shorty-custom-text {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid color-mix(in srgb, var(--shorty-fg, #111) 18%, transparent);
            }

            .shorty-custom-text p:last-child {
                margin-bottom: 0;
            }

            .shorty-shortcuts-list {
                margin-top: 15px;
            }

            .shorty-shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid color-mix(in srgb, var(--shorty-fg, #111) 18%, transparent);
            }

            .shorty-shortcut-item:last-child {
                border-bottom: none;
            }

            .shorty-shortcut-key {
                font-family: monospace;
                background: color-mix(in srgb, var(--shorty-fg, #111) 8%, var(--shorty-bg, #fff));
                color: var(--shorty-fg, #111);
                padding: 4px 8px;
                border-radius: 0;
                font-weight: bold;
                min-width: 120px;
            }

            .shorty-shortcut-url {
                color: color-mix(in srgb, var(--shorty-fg, #111) 65%, var(--shorty-bg, #fff));
                word-break: break-all;
                margin-left: 15px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Close the shortcuts modal and detach its Escape listener.
     */
    function closeShortcutsModal() {
        const modal = document.getElementById('shorty-shortcuts-modal');
        if (modal) {
            modal.remove();
        }
        if (escapeKeyHandler) {
            document.removeEventListener('keydown', escapeKeyHandler);
            escapeKeyHandler = null;
        }
    }

    /**
     * Create and show the shortcuts modal.
     */
    function showShortcutsModal() {
        closeShortcutsModal();

        const shortcuts = getShortyShortcuts();
        const modifierText = getModifierDisplayText();
        const customText = getShortyModalText();
        const strings = getShortyStrings();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'shorty-shortcuts-modal';
        modalOverlay.className = 'shorty-modal-overlay';
        modalOverlay.setAttribute('role', 'dialog');
        modalOverlay.setAttribute('aria-modal', 'true');
        modalOverlay.setAttribute('aria-labelledby', 'shorty-modal-title');

        const theme = resolveThemeColors();
        modalOverlay.style.setProperty('--shorty-bg', theme.bg);
        modalOverlay.style.setProperty('--shorty-fg', theme.fg);
        modalOverlay.style.setProperty('--shorty-font', theme.font);

        const modalContent = document.createElement('div');
        modalContent.className = 'shorty-modal-content';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'shorty-modal-header';

        const modalTitle = document.createElement('h2');
        modalTitle.id = 'shorty-modal-title';
        modalTitle.textContent = strings.keyboardShortcuts || 'Keyboard Shortcuts';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'shorty-modal-close';
        closeButton.setAttribute('aria-label', strings.close || 'Close');
        closeButton.textContent = '\u00D7';
        closeButton.addEventListener('click', closeShortcutsModal);

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        const modalBody = document.createElement('div');
        modalBody.className = 'shorty-modal-body';

        if (customText) {
            const customTextDiv = document.createElement('div');
            customTextDiv.className = 'shorty-custom-text';
            customTextDiv.innerHTML = customText; // Admin-controlled, saved via wp_kses_post
            modalBody.appendChild(customTextDiv);
        }

        if (Object.keys(shortcuts).length > 0) {
            const instructionP = document.createElement('p');
            const instructionText = document.createTextNode(strings.pressToNavigate || 'Press');
            const modifierSpan = document.createElement('strong');
            modifierSpan.textContent = modifierText + ' + [Key]';
            const navigateText = document.createTextNode(' ' + (strings.toNavigateToUrls || 'to navigate to the following URLs:'));

            instructionP.appendChild(instructionText);
            instructionP.appendChild(document.createTextNode(' '));
            instructionP.appendChild(modifierSpan);
            instructionP.appendChild(navigateText);
            modalBody.appendChild(instructionP);

            const shortcutsList = document.createElement('div');
            shortcutsList.className = 'shorty-shortcuts-list';

            Object.entries(shortcuts).forEach(function ([key, url]) {
                const shortcutItem = document.createElement('div');
                shortcutItem.className = 'shorty-shortcut-item';

                const keySpan = document.createElement('span');
                keySpan.className = 'shorty-shortcut-key';
                keySpan.textContent = modifierText + ' + ' + String(key).toUpperCase();

                const urlSpan = document.createElement('span');
                urlSpan.className = 'shorty-shortcut-url';
                urlSpan.textContent = url;

                shortcutItem.appendChild(keySpan);
                shortcutItem.appendChild(urlSpan);
                shortcutsList.appendChild(shortcutItem);
            });

            modalBody.appendChild(shortcutsList);
        } else {
            const noShortcutsP = document.createElement('p');
            noShortcutsP.textContent = strings.noShortcutsConfigured || 'No keyboard shortcuts have been configured yet.';
            modalBody.appendChild(noShortcutsP);
        }

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalOverlay.appendChild(modalContent);

        ensureModalStyles();
        document.body.appendChild(modalOverlay);

        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeShortcutsModal();
            }
        });

        escapeKeyHandler = function (e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeShortcutsModal();
            }
        };
        document.addEventListener('keydown', escapeKeyHandler);

        closeButton.focus();
    }

    /**
     * Map event.code to a stable shortcut key (ignores Shift/Option character remapping).
     *
     * @param {string|undefined} keyCode
     * @param {string} fallback
     * @returns {string}
     */
    function mapCodeToShortcutKey(keyCode, fallback) {
        if (!keyCode || typeof keyCode !== 'string') {
            return fallback;
        }

        if (keyCode.indexOf('Key') === 0) {
            return keyCode.replace('Key', '').toLowerCase();
        }
        if (keyCode.indexOf('Digit') === 0) {
            return keyCode.replace('Digit', '');
        }

        const symbolMap = {
            Minus: '-',
            Equal: '=',
            BracketLeft: '[',
            BracketRight: ']',
            Backslash: '\\',
            Semicolon: ';',
            Quote: "'",
            Comma: ',',
            Period: '.',
            Slash: '/',
            Backquote: '`',
            IntlBackslash: '\\'
        };

        return Object.prototype.hasOwnProperty.call(symbolMap, keyCode)
            ? symbolMap[keyCode]
            : fallback;
    }

    // Listen for keyboard shortcuts with configurable modifier combinations
    document.addEventListener('keydown', function (event) {
        const target = event.target;
        if (!target || !target.tagName) {
            return;
        }

        const isInputField = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.contentEditable === 'true' ||
            target.isContentEditable;

        // Ctrl+/ or Cmd+/ — show shortcuts modal (allowed even in inputs)
        const isSlash = event.key === '/' || event.code === 'Slash';
        if ((event.ctrlKey || event.metaKey) && isSlash && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            showShortcutsModal();
            return;
        }

        if (isInputField) {
            return;
        }

        // Don't navigate while the help modal is open
        if (document.getElementById('shorty-shortcuts-modal')) {
            return;
        }

        if (!checkModifierCombination(event) || !event.key) {
            return;
        }

        const code = event.code || '';

        // Ignore modifier-only keydowns ("Control", "Shift", "Meta", "Alt", …)
        if (event.key.length > 1 && code.indexOf('Key') !== 0 && code.indexOf('Digit') !== 0) {
            return;
        }

        // Prefer event.code so Shift/Option don't change the matched key (e.g. Shift+1 → "!" but code is Digit1)
        const keyPressed = event.key.toLowerCase();
        const shortcutKey = mapCodeToShortcutKey(code, keyPressed);
        const shortcuts = getShortyShortcuts();

        const destination = shortcuts[shortcutKey] || shortcuts[keyPressed];
        if (destination) {
            event.preventDefault();
            window.location.href = destination;
        }
    });

    /**
     * Admin settings: add/remove shortcut rows.
     */
    function initAdminUI() {
        const addMoreButton = document.getElementById('add-more');
        const container = document.getElementById('shortcuts-container');

        if (addMoreButton && container) {
            addMoreButton.addEventListener('click', function () {
                const rowCount = container.querySelectorAll('.shortcut-row').length;
                const newRow = document.createElement('div');
                newRow.classList.add('shortcut-row');
                newRow.setAttribute('data-index', String(rowCount));

                const strings = getShortyStrings();

                const keyInput = document.createElement('input');
                keyInput.type = 'text';
                keyInput.name = 'wilcosky_shorty_shortcuts[key][]';
                keyInput.maxLength = 1;
                keyInput.placeholder = strings.key || 'Key';

                const urlInput = document.createElement('input');
                urlInput.type = 'text';
                urlInput.name = 'wilcosky_shorty_shortcuts[url][]';
                urlInput.className = 'regular-text';
                urlInput.placeholder = strings.url || 'URL';

                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'remove-row button';
                removeButton.textContent = strings.remove || 'Remove';

                newRow.appendChild(keyInput);
                newRow.appendChild(urlInput);
                newRow.appendChild(removeButton);
                container.appendChild(newRow);
            });
        }

        document.addEventListener('click', function (event) {
            if (event.target && event.target.classList.contains('remove-row')) {
                const row = event.target.closest('.shortcut-row');
                if (row) {
                    row.remove();
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminUI);
    } else {
        initAdminUI();
    }
})();
