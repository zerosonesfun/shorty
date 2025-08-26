<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue scripts and styles for the plugin.
 *
 * Enqueues JavaScript files for both frontend and backend,
 * and localizes script data for translations and configuration.
 *
 * @since 1.0.0
 * @return void
 */
function wilcosky_shorty_enqueue_script() {
    $script_path = plugin_dir_path( __FILE__ ) . 'js/shorty.js';
    
    // Check if file exists before getting modification time
    if ( ! file_exists( $script_path ) ) {
        return;
    }
    
    $file_version = filemtime( $script_path ); // Get the last modified timestamp of the JS file

    // Enqueue script for frontend
    wp_enqueue_script( 'wilcosky-shorty-js', plugin_dir_url( __FILE__ ) . 'js/shorty.js', [], $file_version, true );

    // Enqueue script for backend (admin area)
    if ( is_admin() ) {
        wp_enqueue_script( 'wilcosky-shorty-admin-js', plugin_dir_url( __FILE__ ) . 'js/shorty.js', [], $file_version, true );
    }

    // Localize the script to pass the shortcuts to JS
    $shortcuts = get_option( 'wilcosky_shorty_shortcuts', [] ); // Retrieve saved shortcuts from the database
    $formatted_shortcuts = [];
    
    foreach ($shortcuts as $index => $shortcut) {
        $formatted_shortcuts[$shortcut['key']] = esc_url( $shortcut['url'] ); // Format key-value pairs
    }

    // Get the selected modifier combination
    $modifier = get_option( 'wilcosky_shorty_modifier', 'ctrl_shift' );

    // Get the custom modal text
    $modal_text = get_option( 'wilcosky_shorty_modal_text', '' );

    // Localize strings for JavaScript
    $strings = [
        'key' => __( 'Key', 'shorty' ),
        'url' => __( 'URL', 'shorty' ),
        'remove' => __( 'Remove', 'shorty' ),
        'add' => __( 'Add +', 'shorty' ),
        'keyboardShortcuts' => __( 'Keyboard Shortcuts', 'shorty' ),
        'pressToNavigate' => __( 'Press', 'shorty' ),
        'toNavigateToUrls' => __( 'to navigate to the following URLs:', 'shorty' ),
        'noShortcutsConfigured' => __( 'No keyboard shortcuts have been configured yet.', 'shorty' ),
        'close' => __( 'Close', 'shorty' ),
        'ctrlShift' => __( 'Ctrl + Shift', 'shorty' ),
        'altShift' => __( 'Alt + Shift', 'shorty' ),
        'optionShift' => __( 'Option + Shift', 'shorty' ),
        'ctrlAlt' => __( 'Ctrl + Alt', 'shorty' ),
        'ctrlOption' => __( 'Ctrl + Option', 'shorty' ),
        'ctrlMeta' => __( 'Ctrl + Meta', 'shorty' ),
        'ctrlCmd' => __( 'Ctrl + Cmd', 'shorty' ),
        'altMeta' => __( 'Alt + Meta', 'shorty' ),
        'optionCmd' => __( 'Option + Cmd', 'shorty' ),
        'altCmd' => __( 'Alt + Cmd', 'shorty' ),
        'shiftMeta' => __( 'Shift + Meta', 'shorty' ),
        'shiftCmd' => __( 'Shift + Cmd', 'shorty' ),
        'ctrlShiftAlt' => __( 'Ctrl + Shift + Alt', 'shorty' ),
        'ctrlShiftOption' => __( 'Ctrl + Shift + Option', 'shorty' ),
    ];

    wp_localize_script( 'wilcosky-shorty-js', 'shortyShortcuts', $formatted_shortcuts );
    wp_localize_script( 'wilcosky-shorty-js', 'shortyModifier', $modifier );
    wp_localize_script( 'wilcosky-shorty-js', 'shortyModalText', $modal_text );
    wp_localize_script( 'wilcosky-shorty-js', 'shortyStrings', $strings );
}
add_action( 'wp_enqueue_scripts', 'wilcosky_shorty_enqueue_script' );
add_action( 'admin_enqueue_scripts', 'wilcosky_shorty_enqueue_script' );