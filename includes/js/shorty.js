// Prevent direct access
if ( typeof window === 'undefined' ) {
    exit;
}

/**
 * Check if the current modifier combination matches the selected one.
 *
 * @param {KeyboardEvent} event - The keyboard event object.
 * @returns {boolean} True if the modifier combination matches.
 */
function checkModifierCombination(event) {
    const modifier = window.shortyModifier || 'ctrl_shift';
    const isMac = navigator.platform.indexOf('Mac') !== -1;
    
    switch (modifier) {
        case 'ctrl_shift':
            return event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey;
        case 'alt_shift':
            // On Mac, Alt key is the Option key
            return event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey;
        case 'ctrl_alt':
            // On Mac, Alt key is the Option key
            return event.ctrlKey && event.altKey && !event.shiftKey && !event.metaKey;
        case 'ctrl_meta':
            return event.ctrlKey && event.metaKey && !event.shiftKey && !event.altKey;
        case 'alt_meta':
            // On Mac, Alt key is the Option key
            return event.altKey && event.metaKey && !event.ctrlKey && !event.shiftKey;
        case 'shift_meta':
            return event.shiftKey && event.metaKey && !event.ctrlKey && !event.altKey;
        case 'ctrl_shift_alt':
            // On Mac, Alt key is the Option key
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
    const modifier = window.shortyModifier || 'ctrl_shift';
    const isMac = navigator.platform.indexOf('Mac') !== -1;
    
    switch (modifier) {
        case 'ctrl_shift':
            return window.shortyStrings.ctrlShift || 'Ctrl + Shift';
        case 'alt_shift':
            return isMac ? 
                (window.shortyStrings.optionShift || 'Option + Shift') : 
                (window.shortyStrings.altShift || 'Alt + Shift');
        case 'ctrl_alt':
            return isMac ? 
                (window.shortyStrings.ctrlOption || 'Ctrl + Option') : 
                (window.shortyStrings.ctrlAlt || 'Ctrl + Alt');
        case 'ctrl_meta':
            return isMac ? 
                (window.shortyStrings.ctrlCmd || 'Ctrl + Cmd') : 
                (window.shortyStrings.ctrlMeta || 'Ctrl + Meta');
        case 'alt_meta':
            return isMac ? 
                (window.shortyStrings.optionCmd || 'Option + Cmd') : 
                (window.shortyStrings.altMeta || 'Alt + Meta');
        case 'shift_meta':
            return isMac ? 
                (window.shortyStrings.shiftCmd || 'Shift + Cmd') : 
                (window.shortyStrings.shiftMeta || 'Shift + Meta');
        case 'ctrl_shift_alt':
            return isMac ? 
                (window.shortyStrings.ctrlShiftOption || 'Ctrl + Shift + Option') : 
                (window.shortyStrings.ctrlShiftAlt || 'Ctrl + Shift + Alt');
        default:
            return window.shortyStrings.ctrlShift || 'Ctrl + Shift';
    }
}

/**
 * Create and show the shortcuts modal.
 * Displays all configured shortcuts in a modal window.
 */
function showShortcutsModal() {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('shorty-shortcuts-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const shortcuts = window.shortyShortcuts || {};
    const modifierText = getModifierDisplayText();
    const customText = window.shortyModalText || '';
    const strings = window.shortyStrings || {};
    
    // Create modal elements safely
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'shorty-shortcuts-modal';
    modalOverlay.className = 'shorty-modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'shorty-modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'shorty-modal-header';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = strings.keyboardShortcuts || 'Keyboard Shortcuts';

    const closeButton = document.createElement('button');
    closeButton.className = 'shorty-modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeShortcutsModal;

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.className = 'shorty-modal-body';

    // Add custom text if provided
    if (customText) {
        const customTextDiv = document.createElement('div');
        customTextDiv.className = 'shorty-custom-text';
        customTextDiv.innerHTML = customText; // This is safe as it's admin-controlled
        modalBody.appendChild(customTextDiv);
    }

    // Add shortcuts list
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

        Object.entries(shortcuts).forEach(([key, url]) => {
            const shortcutItem = document.createElement('div');
            shortcutItem.className = 'shorty-shortcut-item';

            const keySpan = document.createElement('span');
            keySpan.className = 'shorty-shortcut-key';
            keySpan.textContent = modifierText + ' + ' + key.toUpperCase();

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

    const modalFooter = document.createElement('div');
    modalFooter.className = 'shorty-modal-footer';

    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalOverlay.appendChild(modalContent);

    // Add modal to page
    document.body.appendChild(modalOverlay);

    // Add CSS styles
    if (!document.getElementById('shorty-modal-styles')) {
        const styles = `
            <style id="shorty-modal-styles">
                .shorty-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999999;
                }
                
                .shorty-modal-content {
                    background: white;
                    border-radius: 0;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
                    border-bottom: 1px solid #ddd;
                }
                
                .shorty-modal-header h2 {
                    margin: 0;
                    font-size: 1.5em;
                }
                
                .shorty-modal-close {
                    background: none;
                    border: none;
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
                    background-color: #f0f0f0;
                }
                
                .shorty-modal-body {
                    padding: 20px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .shorty-custom-text {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
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
                    border-bottom: 1px solid #eee;
                }
                
                .shorty-shortcut-item:last-child {
                    border-bottom: none;
                }
                
                .shorty-shortcut-key {
                    font-family: monospace;
                    background-color: #f5f5f5;
                    padding: 4px 8px;
                    border-radius: 0;
                    font-weight: bold;
                    min-width: 120px;
                }
                
                .shorty-shortcut-url {
                    color: #666;
                    word-break: break-all;
                    margin-left: 15px;
                }
                
                .shorty-modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #ddd;
                    text-align: right;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Close modal when clicking outside
    const modalElement = document.getElementById('shorty-shortcuts-modal');
    if (modalElement) {
        modalElement.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShortcutsModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('shorty-shortcuts-modal')) {
            closeShortcutsModal();
        }
    });
}

/**
 * Close the shortcuts modal.
 * Removes the modal from the DOM.
 */
function closeShortcutsModal() {
    const modal = document.getElementById('shorty-shortcuts-modal');
    if (modal) {
        modal.remove();
    }
}

// Listen for keyboard shortcuts with configurable modifier combinations
document.addEventListener('keydown', function (event) {
    // Don't trigger shortcuts when typing in form fields
    const target = event.target;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.tagName === 'SELECT' ||
                        target.contentEditable === 'true' ||
                        target.isContentEditable;
    
    // Check for Ctrl+/ or Cmd+/ to show shortcuts modal (allow this even in input fields)
    if ((event.ctrlKey || event.metaKey) && event.key === '/' && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        showShortcutsModal();
        return;
    }

    // Skip shortcut processing if user is typing in a form field
    if (isInputField) {
        return;
    }

    // Check if the modifier combination matches and a key is pressed
    if (checkModifierCombination(event) && event.key) {
        const keyPressed = event.key.toLowerCase(); // Normalize to lowercase
        const shortcuts = window.shortyShortcuts || {}; // Get the shortcuts from localized data

        // For Mac Option key combinations, we need to handle special characters
        const isMac = navigator.platform.indexOf('Mac') !== -1;
        const modifier = window.shortyModifier || 'ctrl_shift';
        
        let shortcutKey = keyPressed;
        
        // If using Option key combinations on Mac, use the key code instead of the character
        if (isMac && (modifier.includes('alt') || modifier.includes('option'))) {
            // Use event.code to get the actual key pressed (e.g., "KeyS" for S key)
            const keyCode = event.code;
            
            // Extract the key from the code (e.g., "KeyS" -> "s")
            if (keyCode.startsWith('Key')) {
                shortcutKey = keyCode.replace('Key', '').toLowerCase();
            } else if (keyCode.startsWith('Digit')) {
                shortcutKey = keyCode.replace('Digit', '');
            } else {
                // For other keys, try to map common symbols
                const symbolMap = {
                    'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']',
                    'Backslash': '\\', 'Semicolon': ';', 'Quote': "'", 'Comma': ',',
                    'Period': '.', 'Slash': '/', 'Backquote': '`', 'IntlBackslash': '\\'
                };
                if (symbolMap[keyCode]) {
                    shortcutKey = symbolMap[keyCode];
                }
            }
        }

        // Check if the pressed key (or mapped key) matches any saved shortcut
        if (shortcuts[shortcutKey]) {
            event.preventDefault();
            window.location.href = shortcuts[shortcutKey]; // Redirect to the URL
        } else if (shortcuts[keyPressed]) {
            // Also check the original key in case it wasn't mapped
            event.preventDefault();
            window.location.href = shortcuts[keyPressed]; // Redirect to the URL
        }
    }
});

/**
 * Initialize the Shorty plugin functionality.
 * Sets up event listeners and modal functionality.
 */
window.onload = function() {
    // Add new row for shortcut
    const addMoreButton = document.getElementById('add-more');
    const container = document.getElementById('shortcuts-container');
    
    if (addMoreButton && container) {
        addMoreButton.addEventListener('click', function () {
            const rowCount = container.querySelectorAll('.shortcut-row').length;
            const newRow = document.createElement('div');
            newRow.classList.add('shortcut-row');
            newRow.setAttribute('data-index', rowCount);

            // Create elements safely instead of using innerHTML
            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.name = 'wilcosky_shorty_shortcuts[key][]';
            keyInput.placeholder = window.shortyStrings.key || 'Key';

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.name = 'wilcosky_shorty_shortcuts[url][]';
            urlInput.placeholder = window.shortyStrings.url || 'URL';

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'remove-row button';
            removeButton.textContent = window.shortyStrings.remove || 'Remove';

            newRow.appendChild(keyInput);
            newRow.appendChild(urlInput);
            newRow.appendChild(removeButton);

            container.appendChild(newRow);
        });
    }

    // Remove row for shortcut
    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('remove-row')) {
            event.target.closest('.shortcut-row').remove();
        }
    });
};