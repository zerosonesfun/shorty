<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue the JavaScript for frontend and backend shortcut handling with file's last modified timestamp
function wilcosky_shorty_enqueue_script() {
    $script_path = plugin_dir_path( __FILE__ ) . 'js/shorty.js';
    $file_version = filemtime( $script_path ); // Get the last modified timestamp of the JS file

    // Enqueue script for frontend
    wp_enqueue_script( 'wilcosky-shorty-js', plugin_dir_url( __FILE__ ) . 'js/shorty.js', array(), $file_version, true );

    // Enqueue script for backend (admin area)
    if ( is_admin() ) {
        wp_enqueue_script( 'wilcosky-shorty-admin-js', plugin_dir_url( __FILE__ ) . 'js/shorty.js', array(), $file_version, true );
    }

    // Localize the script to pass the shortcuts to JS
    $shortcuts = get_option( 'wilcosky_shorty_shortcuts', [] ); // Retrieve saved shortcuts from the database
    $formatted_shortcuts = [];
    
    foreach ($shortcuts as $index => $shortcut) {
        $formatted_shortcuts[$shortcut['key']] = esc_url( $shortcut['url'] ); // Format key-value pairs
    }

    wp_localize_script( 'wilcosky-shorty-js', 'shortyShortcuts', $formatted_shortcuts );
}
add_action( 'wp_enqueue_scripts', 'wilcosky_shorty_enqueue_script' );
add_action( 'admin_enqueue_scripts', 'wilcosky_shorty_enqueue_script' );