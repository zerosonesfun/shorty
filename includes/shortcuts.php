<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Function to handle the saving and retrieving of keyboard shortcuts
function wilcosky_shorty_save_shortcuts( $shortcuts ) {
    // Validate and sanitize the shortcuts before saving
    $sanitized_shortcuts = [];
    foreach ( $shortcuts as $shortcut ) {
        $key = sanitize_text_field( $shortcut['key'] );
        $url = sanitize_text_field( $shortcut['url'] );
        if ( ! empty( $key ) && ! empty( $url ) ) {
            $sanitized_shortcuts[] = [ 'key' => $key, 'url' => $url ];
        }
    }

    update_option( 'wilcosky_shorty_shortcuts', $sanitized_shortcuts );
}

// Retrieve saved shortcuts
function wilcosky_shorty_get_shortcuts() {
    return get_option( 'wilcosky_shorty_shortcuts', [] );
}