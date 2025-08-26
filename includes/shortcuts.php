<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Save keyboard shortcuts to the database.
 *
 * Validates and sanitizes the shortcuts before saving them
 * to the WordPress options table.
 *
 * @since 1.0.0
 * @param array $shortcuts Array of shortcut data with 'key' and 'url' pairs.
 * @return void
 */
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

/**
 * Retrieve saved shortcuts from the database.
 *
 * @since 1.0.0
 * @return array Array of saved shortcuts or empty array if none found.
 */
function wilcosky_shorty_get_shortcuts() {
    return get_option( 'wilcosky_shorty_shortcuts', [] );
}