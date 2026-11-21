<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Plugin constants (paths relative to main plugin file)
if ( ! defined( 'WILCOSKY_SHORTY_VERSION' ) ) {
    define( 'WILCOSKY_SHORTY_VERSION', '1.1.3' );
}
if ( ! defined( 'WILCOSKY_SHORTY_PLUGIN_FILE' ) ) {
    define( 'WILCOSKY_SHORTY_PLUGIN_FILE', dirname( __DIR__ ) . '/shorty.php' );
}
if ( ! defined( 'WILCOSKY_SHORTY_PLUGIN_URL' ) ) {
    define( 'WILCOSKY_SHORTY_PLUGIN_URL', plugin_dir_url( WILCOSKY_SHORTY_PLUGIN_FILE ) );
}
if ( ! defined( 'WILCOSKY_SHORTY_PLUGIN_PATH' ) ) {
    define( 'WILCOSKY_SHORTY_PLUGIN_PATH', plugin_dir_path( WILCOSKY_SHORTY_PLUGIN_FILE ) );
}

/**
 * Add settings page to WordPress admin menu.
 *
 * @since 1.0.0
 * @return void
 */
function wilcosky_shorty_settings_page() {
    add_options_page(
        __( 'Shorty Settings', 'shorty' ), // Page title
        __( 'Shorty', 'shorty' ), // Menu title
        'manage_options', // Capability
        'wilcosky-shorty', // Menu slug
        'wilcosky_shorty_settings_page_html' // Callback function
    );
}
add_action( 'admin_menu', 'wilcosky_shorty_settings_page' );

/**
 * Render the settings page HTML.
 *
 * @since 1.0.0
 * @return void
 */
function wilcosky_shorty_settings_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // Check if form is submitted and save the shortcuts
    if ( isset( $_POST['wilcosky_shorty_save'] ) ) {
        // Verify nonce for security
        $nonce = isset( $_POST['wilcosky_shorty_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['wilcosky_shorty_nonce'] ) ) : '';
        if ( ! wp_verify_nonce( $nonce, 'wilcosky_shorty_save' ) ) {
            wp_die( esc_html__( 'Security check failed. Please try again.', 'shorty' ) );
        }

        // Save shortcuts (missing/empty POST = clear all — e.g. user removed every row)
        $rows   = [];
        $posted = isset( $_POST['wilcosky_shorty_shortcuts'] ) && is_array( $_POST['wilcosky_shorty_shortcuts'] )
            ? wp_unslash( $_POST['wilcosky_shorty_shortcuts'] ) // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized via wilcosky_shorty_sanitize_shortcut()
            : [];

        $keys = ( isset( $posted['key'] ) && is_array( $posted['key'] ) ) ? $posted['key'] : [];
        $urls = ( isset( $posted['url'] ) && is_array( $posted['url'] ) ) ? $posted['url'] : [];
        $count = min( count( $keys ), count( $urls ) );

        for ( $i = 0; $i < $count; $i++ ) {
            $rows[] = [
                'key' => $keys[ $i ],
                'url' => $urls[ $i ],
            ];
        }
        update_option( 'wilcosky_shorty_shortcuts', wilcosky_shorty_sanitize_shortcuts_list( $rows ) );

        // Save the modifier combination
        if ( isset( $_POST['wilcosky_shorty_modifier'] ) ) {
            $modifier = sanitize_text_field( wp_unslash( $_POST['wilcosky_shorty_modifier'] ) );
            $allowed_modifiers = [ 'ctrl_shift', 'alt_shift', 'ctrl_alt', 'ctrl_meta', 'alt_meta', 'shift_meta', 'ctrl_shift_alt' ];
            if ( in_array( $modifier, $allowed_modifiers, true ) ) {
                update_option( 'wilcosky_shorty_modifier', $modifier );
            }
        }

        // Save the custom modal text
        if ( isset( $_POST['wilcosky_shorty_modal_text'] ) ) {
            $modal_text = wp_kses_post( wp_unslash( $_POST['wilcosky_shorty_modal_text'] ) );
            update_option( 'wilcosky_shorty_modal_text', $modal_text );
        }

        // Per-user transient so concurrent admins don't see each other's notices
        set_transient(
            'wilcosky_shorty_success_message_' . get_current_user_id(),
            __( 'Shortcuts saved successfully!', 'shorty' ),
            5
        );
    }

    // Check for the success message transient and display it
    $success_key = 'wilcosky_shorty_success_message_' . get_current_user_id();
    if ( $message = get_transient( $success_key ) ) {
        echo '<div class="updated notice is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
        delete_transient( $success_key );
    }

    $shortcuts = wilcosky_shorty_get_shortcuts();
    $current_modifier = get_option( 'wilcosky_shorty_modifier', 'ctrl_shift' );
    $modal_text = get_option( 'wilcosky_shorty_modal_text', '' );
    
    // Define available modifier combinations
    $modifier_options = [
        'ctrl_shift' => __( 'Ctrl + Shift', 'shorty' ),
        'alt_shift' => __( 'Alt + Shift (Option on Mac)', 'shorty' ),
        'ctrl_alt' => __( 'Ctrl + Alt (Option on Mac)', 'shorty' ),
        'ctrl_meta' => __( 'Ctrl + Meta (Cmd on Mac)', 'shorty' ),
        'alt_meta' => __( 'Alt + Meta (Option + Cmd on Mac)', 'shorty' ),
        'shift_meta' => __( 'Shift + Meta (Cmd on Mac)', 'shorty' ),
        'ctrl_shift_alt' => __( 'Ctrl + Shift + Alt (Option on Mac)', 'shorty' )
    ];
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Shorty Settings', 'shorty' ); ?></h1>
        
        <form method="POST">
            <?php wp_nonce_field( 'wilcosky_shorty_save', 'wilcosky_shorty_nonce' ); ?>
            <table class="form-table">
                <tr>
                    <th scope="row"><?php esc_html_e( 'Modifier Keys', 'shorty' ); ?></th>
                    <td>
                        <select name="wilcosky_shorty_modifier" id="wilcosky_shorty_modifier">
                            <?php foreach ( $modifier_options as $value => $label ) : ?>
                                <option value="<?php echo esc_attr( $value ); ?>" <?php selected( $current_modifier, $value ); ?>>
                                    <?php echo esc_html( $label ); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php esc_html_e( 'Choose which modifier keys must be pressed along with the shortcut key.', 'shorty' ); ?></p>
                        <p class="description"><strong><?php esc_html_e( 'Note for Mac users:', 'shorty' ); ?></strong> <?php esc_html_e( 'When using Option key combinations, the Option key may change the character input (e.g., Option+S produces "î"). The plugin will automatically map these special characters back to their base keys for shortcuts.', 'shorty' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e( 'Custom Modal Text', 'shorty' ); ?></th>
                    <td>
                        <textarea name="wilcosky_shorty_modal_text" id="wilcosky_shorty_modal_text" rows="4" cols="50" class="large-text"><?php echo esc_textarea( $modal_text ); ?></textarea>
                        <p class="description"><?php esc_html_e( 'Optional custom text to display in the shortcuts modal. You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;, etc. Leave empty to show only the shortcuts list.', 'shorty' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th><?php esc_html_e( 'Shortcuts', 'shorty' ); ?></th>
                    <td>
                        <p class="description"><?php esc_html_e( 'Add keyboard keys and associated URLs below. Use the modifier combination selected above + the key to trigger shortcuts.', 'shorty' ); ?></p>
                        <p class="description"><strong><?php esc_html_e( 'Tip:', 'shorty' ); ?></strong> <?php esc_html_e( 'Users can press Ctrl+/ (or Cmd+/ on Mac) to see all available shortcuts in a modal window.', 'shorty' ); ?></p>
                        <div id="shortcuts-container">
                            <?php foreach ( $shortcuts as $index => $shortcut ) : ?>
                                <div class="shortcut-row" data-index="<?php echo esc_attr( $index ); ?>">
                                    <input type="text" name="wilcosky_shorty_shortcuts[key][]" value="<?php echo esc_attr( $shortcut['key'] ); ?>" maxlength="1" size="3" placeholder="<?php esc_attr_e( 'Key', 'shorty' ); ?>">
                                    <input type="text" name="wilcosky_shorty_shortcuts[url][]" value="<?php echo esc_attr( $shortcut['url'] ); ?>" class="regular-text" placeholder="<?php esc_attr_e( 'URL', 'shorty' ); ?>">
                                    <button type="button" class="remove-row button"><?php esc_html_e( 'Remove', 'shorty' ); ?></button>
                                </div>
                            <?php endforeach; ?>
                        </div><br>
                        <button type="button" id="add-more" class="button"><?php esc_html_e( 'Add +', 'shorty' ); ?></button>
                    </td>
                </tr>
            </table>
            <p>
                <input type="submit" name="wilcosky_shorty_save" class="button-primary" value="<?php esc_attr_e( 'Save Changes', 'shorty' ); ?>">
            </p>
        </form>
    </div>
    <?php
}