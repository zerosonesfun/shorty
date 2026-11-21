# Shorty - WordPress Keyboard Shortcuts Plugin

A powerful WordPress plugin that allows site administrators to create custom keyboard shortcuts for quick navigation to any URL on their website.

![Shorty Plugin](https://img.shields.io/badge/WordPress-Plugin-blue.svg)
![Version](https://img.shields.io/badge/Version-1.1.3-green.svg)
![License](https://img.shields.io/badge/License-GPL%20v2%2B-orange.svg)

## 🚀 Features

### ✨ Core Functionality
- **Custom Keyboard Shortcuts**: Create unlimited keyboard shortcuts for any URL
- **Configurable Modifier Keys**: Choose from 7 different modifier key combinations:
  - Ctrl + Shift (default)
  - Alt + Shift
  - Ctrl + Alt
  - Ctrl + Meta (Cmd on Mac)
  - Alt + Meta (Cmd on Mac)
  - Shift + Meta (Cmd on Mac)
  - Ctrl + Shift + Alt

### 🎯 User Experience
- **Shortcuts Modal**: Press `Ctrl+/` (or `Cmd+/` on Mac) to see all available shortcuts
- **Custom Modal Text**: Add your own instructions, branding, or helpful information
- **Frontend & Backend**: Works on both admin and public-facing pages
- **Responsive Design**: Clean, modern interface with sharp corners

### 🌍 Internationalization
- **Multi-language Support**: Fully translated into:
  - Spanish (es_ES)
  - French (fr_FR)
  - Chinese Simplified (zh_CN)
  - Japanese (ja)
- **Translation Ready**: Easy to add new languages

### 🔧 Technical Features
- **WordPress Standards**: Follows WordPress coding standards and best practices
- **Clean Uninstall**: Properly removes all data when uninstalled
- **Performance Optimized**: Lightweight and fast
- **Security**: Proper sanitization and escaping

## 📦 Installation

### Method 1: Manual Installation
1. Download the plugin files
2. Upload the `shorty` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Go to **Settings > Shorty** to configure your shortcuts

### Method 2: WordPress Admin
1. Go to **Plugins > Add New**
2. Click **Upload Plugin**
3. Choose the plugin zip file
4. Click **Install Now** and then **Activate**

## ⚙️ Configuration

### Setting Up Shortcuts
1. Navigate to **Settings > Shorty**
2. Choose your preferred modifier key combination
3. Add custom text for the shortcuts modal (optional)
4. Add keyboard keys and their corresponding URLs
5. Click **Save Changes**

### Example Shortcuts
| Key | URL | Description |
|-----|-----|-------------|
| `A` | `/about` | Navigate to About page |
| `C` | `/contact` | Navigate to Contact page |
| `B` | `/blog` | Navigate to Blog page |
| `H` | `/` | Navigate to Home page |

### Using Shortcuts
- **Default**: Press `Ctrl + Shift + [Key]` to navigate
- **Custom**: Use your chosen modifier combination + [Key]
- **Help**: Press `Ctrl+/` (or `Cmd+/` on Mac) to see all shortcuts

## 🌐 Internationalization

The plugin is fully translated and ready for international use:

### Available Languages
- **Spanish (es_ES)** - Español
- **French (fr_FR)** - Français
- **Chinese Simplified (zh_CN)** - 简体中文
- **Japanese (ja)** - 日本語

### Adding New Languages
1. Copy `languages/shorty.pot` to `languages/shorty-[language_code].po`
2. Translate the strings using a tool like Poedit
3. Compile to MO format: `msgfmt -o shorty-[language_code].mo shorty-[language_code].po`
4. The translation will be automatically available

## 🛠️ Development

### File Structure
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
└── README.md             # This file
```

### Hooks and Filters
The plugin uses WordPress standard hooks and follows best practices for extensibility.

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Requirements

- **WordPress**: 5.0 or higher
- **PHP**: 7.4 or higher
- **Browser**: Modern browser with JavaScript enabled

## 🔒 Security

- All user inputs are properly sanitized
- Output is properly escaped
- Follows WordPress security best practices
- No direct file access allowed

## 📄 License

This plugin is licensed under the GPL v2 or later.

```
Copyright (C) 2024 Billy Wilcosky

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
```

## 👨‍💻 Author

**Billy Wilcosky**
- Website: [https://wilcosky.com](https://wilcosky.com)
- Email: billy@wilcosky.com

## 🤝 Support

- **Documentation**: Check the plugin settings page for help
- **Issues**: Report bugs or feature requests on GitHub
- **Translations**: Contribute translations to make the plugin available in more languages

## 🎉 Changelog

### Version 1.1.3
- Shortcuts modal adapts to the site's current background and text colors (including light/dark modes)

### Version 1.1.2
- Fix Mac shortcuts not navigating (broken `wp_localize_script` scalar values)
- Fix clear-all shortcuts, Escape listener leak, and Shift/Option key matching
- Harden URL validation and shared sanitize helpers

### Version 1.1.1
- Compatibility checks with WordPress 6.9

### Version 1.0
- Initial release
- Custom keyboard shortcuts functionality
- Configurable modifier keys
- Shortcuts modal with `Ctrl+/` trigger
- Custom modal text support
- Multi-language support (Spanish, French, Chinese, Japanese)
- WordPress standards compliance
- Clean uninstall functionality

---

**Made with ❤️ for the WordPress community**
