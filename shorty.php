<?php
/**
 * Plugin Name: Shorty
 * Plugin URI: https://wilcosky.com/shorty
 * Description: A plugin to handle keyboard shortcuts for quick URL redirection.
 * Version: 1.1.2
 * Requires at least: 5.0
 * Tested up to: 6.9
 * Requires PHP: 7.4
 * Author: Billy Wilcosky
 * Author URI: https://wilcosky.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: shorty
 * Domain Path: /languages
 * Network: false
 *
 * @package Shorty
 * @version 1.1.2
 * @author Billy Wilcosky
 * @license GPL v2 or later
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load text domain for translations
function wilcosky_shorty_load_textdomain() {
    load_plugin_textdomain( 'shorty', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'wilcosky_shorty_load_textdomain' );

// Include necessary files (shortcuts helpers before admin/enqueue)
require_once plugin_dir_path( __FILE__ ) . 'includes/shortcuts.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/admin.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/enqueue.php';