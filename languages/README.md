# Shorty Plugin Translations

This directory contains translation files for the Shorty WordPress plugin.

## Available Languages

The plugin is currently translated into the following languages:

- **Spanish (es_ES)** - `shorty-es_ES.mo` / `shorty-es_ES.po`
- **French (fr_FR)** - `shorty-fr_FR.mo` / `shorty-fr_FR.po`
- **Chinese Simplified (zh_CN)** - `shorty-zh_CN.mo` / `shorty-zh_CN.po`
- **Japanese (ja)** - `shorty-ja.mo` / `shorty-ja.po`

## File Types

- **`.po` files** - Portable Object files containing the source translations (editable)
- **`.mo` files** - Machine Object files compiled from PO files (used by WordPress)
- **`.pot` file** - Portable Object Template containing all translatable strings

## How Translations Work

1. WordPress automatically detects the user's language setting
2. If a translation file exists for that language, it loads the `.mo` file
3. All user-facing text is replaced with the translated version
4. The plugin works seamlessly in the user's preferred language

## Adding New Translations

To add a new language translation:

1. Copy `shorty.pot` to `shorty-[language_code].po`
2. Edit the PO file with your translations
3. Compile it to MO format using: `msgfmt -o shorty-[language_code].mo shorty-[language_code].po`
4. The translation will be automatically available to users

## Translation Tools

You can use these tools to edit translations:
- **Poedit** - Popular GUI tool for editing PO files
- **Loco Translate** - WordPress plugin for managing translations
- **WP-CLI** - Command line tool: `wp i18n make-pot . languages/shorty.pot`

## Language Codes

Use standard WordPress language codes:
- `es_ES` - Spanish (Spain)
- `fr_FR` - French (France)
- `zh_CN` - Chinese (Simplified)
- `ja` - Japanese
- `de_DE` - German (Germany)
- `it_IT` - Italian (Italy)
- etc.

## Contributing Translations

If you'd like to contribute a translation:
1. Create a new PO file based on the POT template
2. Translate all strings
3. Test the translation thoroughly
4. Submit the PO and MO files

## Notes

- All translations maintain the same functionality as the English version
- Keyboard shortcuts work the same way in all languages
- The modal window adapts to show translated text
- Admin settings are fully translated
