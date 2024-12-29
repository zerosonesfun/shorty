<?php
/**
 * Plugin Name: Shorty
 * Plugin URI: https://wilcosky.com
 * Description: A plugin to handle keyboard shortcuts for quick URL redirection.
 * Version: 1.0
 * Author: Billy Wilcosky
 * Author URI: https://wilcosky.com
 * Text Domain: shorty
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Include necessary files
require_once plugin_dir_path( __FILE__ ) . 'includes/admin.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/enqueue.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/shortcuts.php';

// Register uninstall hook
register_uninstall_hook( __FILE__, 'wilcosky_shorty_uninstall' );

// Uninstall function to clean up database entries
function wilcosky_shorty_uninstall() {
    delete_option( 'wilcosky_shorty_shortcuts' );
}