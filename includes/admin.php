<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Add settings page
function wilcosky_shorty_settings_page() {
    add_options_page(
        'Shorty Settings', // Page title
        'Shorty', // Menu title
        'manage_options', // Capability
        'wilcosky-shorty', // Menu slug
        'wilcosky_shorty_settings_page_html' // Callback function
    );
}
add_action( 'admin_menu', 'wilcosky_shorty_settings_page' );

// Settings page HTML
function wilcosky_shorty_settings_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // Check if form is submitted and save the shortcuts
    if ( isset( $_POST['wilcosky_shorty_save'] ) ) {
        // Save the shortcuts
        $shortcuts = [];
        $count = count( $_POST['wilcosky_shorty_shortcuts']['key'] );
        for ( $i = 0; $i < $count; $i++ ) {
            $key = sanitize_text_field( $_POST['wilcosky_shorty_shortcuts']['key'][$i] );
            $url = sanitize_text_field( $_POST['wilcosky_shorty_shortcuts']['url'][$i] );
            if ( ! empty( $key ) && ! empty( $url ) ) {
                $shortcuts[] = [ 'key' => $key, 'url' => $url ];
            }
        }
        update_option( 'wilcosky_shorty_shortcuts', $shortcuts );

        // Set a transient to show the success message
        set_transient( 'wilcosky_shorty_success_message', 'Shortcuts saved successfully!', 5 );
    }

    // Check for the success message transient and display it
    if ( $message = get_transient( 'wilcosky_shorty_success_message' ) ) {
        echo '<div class="updated notice is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
    }

    $shortcuts = get_option( 'wilcosky_shorty_shortcuts', [] );
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Shorty Settings', 'shorty' ); ?></h1>
        <p>Add a keyboard key and associated URL below. To use a shortcut you MUST use CTRL + SHIFT + KEY.</p>
        <form method="POST">
            <table class="form-table">
                <tr>
                    <th><?php esc_html_e( 'Shortcuts', 'shorty' ); ?></th>
                    <td>
                        <div id="shortcuts-container">
                            <?php foreach ( $shortcuts as $index => $shortcut ) : ?>
                                <div class="shortcut-row" data-index="<?php echo esc_attr( $index ); ?>">
                                    <input type="text" name="wilcosky_shorty_shortcuts[key][]" value="<?php echo esc_attr( $shortcut['key'] ); ?>" placeholder="Key">
                                    <input type="text" name="wilcosky_shorty_shortcuts[url][]" value="<?php echo esc_attr( $shortcut['url'] ); ?>" placeholder="URL">
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