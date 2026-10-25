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

    if ( ! file_exists( $script_path ) ) {
        return;
    }

    // WordPress appends this as ?ver=… so browsers/CDNs fetch a fresh copy after file changes
    $file_version = (string) filemtime( $script_path );

    // Enqueue once for both frontend and admin (same handle keeps localized data attached)
    wp_enqueue_script(
        'wilcosky-shorty-js',
        plugin_dir_url( __FILE__ ) . 'js/shorty.js',
        [],
        $file_version,
        true
    );

    // Localize the script to pass the shortcuts to JS
    $shortcuts = wilcosky_shorty_get_shortcuts();
    $formatted_shortcuts = [];

    foreach ( $shortcuts as $shortcut ) {
        if ( empty( $shortcut['key'] ) || empty( $shortcut['url'] ) ) {
            continue;
        }
        // Re-sanitize at output time in case older/invalid data is still stored
        $pair = wilcosky_shorty_sanitize_shortcut( $shortcut['key'], $shortcut['url'] );
        if ( null === $pair ) {
            continue;
        }
        $url = esc_url( $pair['url'] );
        if ( '' === $url ) {
            continue;
        }
        $formatted_shortcuts[ $pair['key'] ] = $url;
    }

    // Get the selected modifier combination (fall back if stored value is invalid)
    $modifier = get_option( 'wilcosky_shorty_modifier', 'ctrl_shift' );
    $allowed_modifiers = [ 'ctrl_shift', 'alt_shift', 'ctrl_alt', 'ctrl_meta', 'alt_meta', 'shift_meta', 'ctrl_shift_alt' ];
    if ( ! is_string( $modifier ) || ! in_array( $modifier, $allowed_modifiers, true ) ) {
        $modifier = 'ctrl_shift';
    }

    // Get the custom modal text
    $modal_text = get_option( 'wilcosky_shorty_modal_text', '' );
    if ( ! is_string( $modal_text ) ) {
        $modal_text = '';
    }

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

    // wp_localize_script only accepts arrays — scalars become {"0":"value"} and break JS.
    // Pass everything as one object so modifier/modalText stay real strings.
    wp_localize_script(
        'wilcosky-shorty-js',
        'shortyData',
        [
            'shortcuts' => $formatted_shortcuts,
            'modifier'  => $modifier,
            'modalText' => $modal_text,
            'strings'   => $strings,
        ]
    );

}
add_action( 'wp_enqueue_scripts', 'wilcosky_shorty_enqueue_script' );
add_action( 'admin_enqueue_scripts', 'wilcosky_shorty_enqueue_script' );