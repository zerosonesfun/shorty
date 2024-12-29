// Prevent direct access
if ( typeof window === 'undefined' ) {
    exit;
}

window.onload = function() {
    // Add new row for shortcut
    var addMoreButton = document.getElementById('add-more');
    if (addMoreButton) {
        addMoreButton.addEventListener('click', function () {
            var container = document.getElementById('shortcuts-container');
            var rowCount = container.querySelectorAll('.shortcut-row').length;
            var newRow = document.createElement('div');
            newRow.classList.add('shortcut-row');
            newRow.setAttribute('data-index', rowCount);

            newRow.innerHTML = `
                <input type="text" name="wilcosky_shorty_shortcuts[key][]" placeholder="Key">
                <input type="text" name="wilcosky_shorty_shortcuts[url][]" placeholder="URL">
                <button type="button" class="remove-row button">Remove</button>
            `;

            container.appendChild(newRow);
        });
    }

    // Remove row for shortcut
    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('remove-row')) {
            event.target.closest('.shortcut-row').remove();
        }
    });

    // Listen for keyboard shortcuts (Ctrl + Shift + [key])
    document.addEventListener('keydown', function (event) {
        // Check if both Ctrl and Shift are pressed along with the key
        if (event.ctrlKey && event.shiftKey && event.key) {
            const keyPressed = event.key.toLowerCase(); // Normalize to lowercase
            const shortcuts = window.shortyShortcuts || {}; // Get the shortcuts from localized data

            // Check if the pressed key matches any saved shortcut
            if (shortcuts[keyPressed]) {
                window.location.href = shortcuts[keyPressed]; // Redirect to the URL
            }
        }
    });
};