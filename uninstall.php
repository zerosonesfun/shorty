<?php
/**
 * Uninstall file for Shorty plugin
 * 
 * This file is executed when the plugin is deleted from WordPress admin.
 * It cleans up all plugin data from the database.
 */

// If uninstall not called from WordPress, exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

// Clean up all plugin options
delete_option( 'wilcosky_shorty_shortcuts' );
delete_option( 'wilcosky_shorty_modifier' );
delete_option( 'wilcosky_shorty_modal_text' );

// Clean up legacy success transient (per-user notice keys expire within seconds)
delete_transient( 'wilcosky_shorty_success_message' );
