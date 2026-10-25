<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Sanitize a single shortcut key/URL pair.
 *
 * @since 1.1.2
 * @param string $key Raw key.
 * @param string $url Raw URL.
 * @return array|null {
 *     @type string $key
 *     @type string $url
 * } or null if invalid.
 */
function wilcosky_shorty_sanitize_shortcut( $key, $url ) {
    $raw_key = sanitize_text_field( (string) $key );
    $key     = function_exists( 'mb_strtolower' ) ? mb_strtolower( $raw_key, 'UTF-8' ) : strtolower( $raw_key );
    // Do not run sanitize_text_field on URLs — it can alter valid characters.
    $url = esc_url_raw( trim( (string) $url ) );

    $key_len = function_exists( 'mb_strlen' ) ? mb_strlen( $key, 'UTF-8' ) : strlen( $key );
    if ( '' === $key || 1 !== $key_len || '' === $url ) {
        return null;
    }

    $parsed_url = wp_parse_url( $url );
    if ( false === $parsed_url ) {
        return null;
    }

    // Allow relative paths and http(s) only (reject javascript:, data:, protocol-relative, etc.)
    $scheme = isset( $parsed_url['scheme'] ) ? strtolower( $parsed_url['scheme'] ) : '';
    if ( '' !== $scheme && ! in_array( $scheme, [ 'http', 'https' ], true ) ) {
        return null;
    }
    if ( isset( $parsed_url['host'] ) && '' === $scheme ) {
        return null;
    }
    if ( ! isset( $parsed_url['scheme'] ) && ! isset( $parsed_url['path'] ) ) {
        return null;
    }

    return [
        'key' => $key,
        'url' => $url,
    ];
}

/**
 * Sanitize a list of shortcut rows. Duplicate keys: last entry wins.
 *
 * @since 1.1.2
 * @param array $shortcuts List of [ 'key' => ..., 'url' => ... ] rows.
 * @return array
 */
function wilcosky_shorty_sanitize_shortcuts_list( $shortcuts ) {
    $by_key = [];

    if ( ! is_array( $shortcuts ) ) {
        return [];
    }

    foreach ( $shortcuts as $shortcut ) {
        if ( ! is_array( $shortcut ) ) {
            continue;
        }
        $key = isset( $shortcut['key'] ) ? $shortcut['key'] : '';
        $url = isset( $shortcut['url'] ) ? $shortcut['url'] : '';
        $pair = wilcosky_shorty_sanitize_shortcut( $key, $url );
        if ( null !== $pair ) {
            $by_key[ $pair['key'] ] = $pair;
        }
    }

    return array_values( $by_key );
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
    update_option( 'wilcosky_shorty_shortcuts', wilcosky_shorty_sanitize_shortcuts_list( $shortcuts ) );
}

/**
 * Retrieve saved shortcuts from the database.
 *
 * @since 1.0.0
 * @return array Array of saved shortcuts or empty array if none found.
 */
function wilcosky_shorty_get_shortcuts() {
    $shortcuts = get_option( 'wilcosky_shorty_shortcuts', [] );
    return is_array( $shortcuts ) ? $shortcuts : [];
}
