=== Shorty - WordPress Keyboard Shortcuts Plugin ===
Contributors: wilcosky
Tags: keyboard, shortcuts, navigation, productivity, accessibility
Requires at least: 5.0
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.1.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Create custom keyboard shortcuts for quick navigation to any URL on your WordPress website. Perfect for improving user experience and productivity.

== Description ==

Shorty is a powerful WordPress plugin that allows site administrators to create custom keyboard shortcuts for quick navigation to any URL on their website. With configurable modifier keys and a user-friendly shortcuts modal, Shorty makes website navigation faster and more efficient.

= Key Features =

* **Custom Keyboard Shortcuts**: Create unlimited keyboard shortcuts for any URL
* **Configurable Modifier Keys**: Choose from 7 different modifier key combinations
* **Shortcuts Modal**: Press Ctrl+/ (or Cmd+/ on Mac) to see all available shortcuts
* **Custom Modal Text**: Add your own instructions, branding, or helpful information
* **Frontend & Backend**: Works on both admin and public-facing pages
* **Multi-language Support**: Fully translated into Spanish, French, Chinese, and Japanese
* **WordPress Standards**: Follows WordPress coding standards and best practices

= Modifier Key Options =

* Ctrl + Shift (default)
* Alt + Shift
* Ctrl + Alt
* Ctrl + Meta (Cmd on Mac)
* Alt + Meta (Cmd on Mac)
* Shift + Meta (Cmd on Mac)
* Ctrl + Shift + Alt

= How It Works =

1. **Configure**: Go to Settings > Shorty and set up your shortcuts
2. **Choose Modifiers**: Select your preferred modifier key combination
3. **Add Shortcuts**: Define keyboard keys and their corresponding URLs
4. **Use**: Press your modifier combination + key to navigate instantly
5. **Help**: Press Ctrl+/ to see all available shortcuts in a modal

= Perfect For =

* **Content Creators**: Quick navigation between pages while writing
* **Site Administrators**: Fast access to frequently used admin pages
* **E-commerce Sites**: Quick product category navigation
* **Educational Sites**: Fast access to course materials
* **Any Website**: Improve user experience with keyboard shortcuts

= Accessibility =

Shorty improves website accessibility by providing keyboard-based navigation options, making your site more usable for users who prefer or require keyboard navigation.

= Internationalization =

The plugin is fully translated and ready for international use:
* Spanish (es_ES)
* French (fr_FR)
* Chinese Simplified (zh_CN)
* Japanese (ja)

= Developer Friendly =

* Clean, well-documented code
* WordPress coding standards compliance
* Proper sanitization and escaping
* Clean uninstall functionality
* Translation ready

== Installation ==

= Automatic Installation (Recommended) =

1. Go to Plugins > Add New in your WordPress admin
2. Search for "Shorty"
3. Click "Install Now" and then "Activate"

= Manual Installation =

1. Download the plugin files
2. Upload the `shorty` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Go to Settings > Shorty to configure your shortcuts

== Frequently Asked Questions ==

= What modifier key combinations are available? =

The plugin supports 7 different modifier key combinations:
* Ctrl + Shift (default)
* Alt + Shift
* Ctrl + Alt
* Ctrl + Meta (Cmd on Mac)
* Alt + Meta (Cmd on Mac)
* Shift + Meta (Cmd on Mac)
* Ctrl + Shift + Alt

= How do users see what shortcuts are available? =

Users can press Ctrl+/ (or Cmd+/ on Mac) to open a modal window that shows all available shortcuts with their corresponding URLs.

= Can I add custom text to the shortcuts modal? =

Yes! In the plugin settings, you can add custom text that will appear at the top of the shortcuts modal. This is perfect for adding instructions, branding, or helpful information.

= Does this work on mobile devices? =

The plugin is designed for desktop use with keyboard shortcuts. Mobile devices don't have physical keyboards, so the shortcuts won't work on mobile browsers.

= Can I use this in the WordPress admin area? =

Yes! The shortcuts work on both the frontend (public-facing pages) and backend (admin area) of your WordPress site.

= Is this plugin accessible? =

Yes! The plugin improves accessibility by providing keyboard-based navigation options, making your site more usable for users who prefer or require keyboard navigation.

= Can I translate this plugin into my language? =

Absolutely! The plugin is translation-ready and includes translation files for Spanish, French, Chinese, and Japanese. You can easily add more languages using standard WordPress translation tools.

= Will this conflict with other plugins? =

The plugin is designed to avoid conflicts with other plugins and themes. It uses WordPress standard hooks and follows best practices for compatibility.

= How do I uninstall the plugin? =

Simply deactivate and delete the plugin through the WordPress admin. The plugin will automatically clean up all its data from the database.

== Screenshots ==

1. Plugin settings page showing modifier key selection and shortcuts configuration
2. Shortcuts modal displayed when pressing Ctrl+/ showing available shortcuts
3. Example of custom modal text being displayed
4. Admin interface with multiple shortcuts configured

== Changelog ==

= 1.1.3 =
* Shortcuts modal now adapts to the site's current background and text colors (including light/dark modes)

= 1.1.2 =
* Fix shortcuts not navigating on Mac — modifier/modal text were passed incorrectly via wp_localize_script, which crashed shortcut handling after the help modal path
* Fix inability to clear all shortcuts on save
* Fix Escape key listener leak when reopening the help modal
* Harden URL validation (http/https and relative paths only); shared sanitize helpers
* Match shortcuts via event.code so Shift/Option don't break digit/symbol keys
* Fix plugin path constants, per-user save notices, and admin key input constraints

= 1.1.1 =
* Compatibility checks with WordPress 6.9

= 1.0 =
* Initial release
* Custom keyboard shortcuts functionality
* Configurable modifier keys (7 options)
* Shortcuts modal with Ctrl+/ trigger
* Custom modal text support
* Multi-language support (Spanish, French, Chinese, Japanese)
* WordPress standards compliance
* Clean uninstall functionality
* Frontend and backend support
* Accessibility improvements

== Upgrade Notice ==

= 1.0 =
Initial release of Shorty - WordPress Keyboard Shortcuts Plugin. Create custom keyboard shortcuts for quick navigation to any URL on your website.

== Developer Information ==

= File Structure =
```
shorty/
├── includes/
│   ├── admin.php          # Admin settings page
│   ├── enqueue.php        # Script and style enqueuing
│   ├── shortcuts.php      # Shortcut handling functions
│   └── js/
│       └── shorty.js      # Frontend JavaScript
├── languages/             # Translation files
├── shorty.php            # Main plugin file
├── uninstall.php         # Cleanup on uninstall
└── readme.txt            # This file
```

= Requirements =
* WordPress 5.0 or higher
* PHP 7.4 or higher
* Modern browser with JavaScript enabled

= Security =
* All user inputs are properly sanitized
* Output is properly escaped
* Follows WordPress security best practices
* No direct file access allowed

= Contributing =
The plugin follows WordPress coding standards and best practices. Contributions are welcome through GitHub pull requests.

== Credits ==

Developed by Billy Wilcosky (https://wilcosky.com)

Made with ❤️ for the WordPress community.
