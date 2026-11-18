# Shenyandayi

An unofficial client for [Shenyandayi](https://www.shenyandayi.com/), a Chinese reverse dictionary and quotation search service. Describe a meaning to find words, or a theme to find poetry and quotations.

## Commands

- **Search Words** displays Chinese words that match a meaning or situation.
- **Search Quotes** displays quotations that match a theme, with full text, author, and work when available.

Preview the converted query before pressing Return to search. Result actions copy the original text or a quotation with its source. Press `⌘O` to open the same query on the website.

## Setup and Privacy

The bundled Swift helper uses macOS WebKit to load the public result page when you press Return. It reads the first page of visible results in an ephemeral guest session. The extension keeps no search history or result cache. Using the browser action opens the search URL in your default browser.

The single **Convert search queries to Simplified Chinese** preference is enabled by default and applies to both search commands. Disable it to send the original query. Results are not converted.

## Availability

This extension requires macOS. Building from source requires Xcode and a Node.js toolchain. The prebuilt extension uses macOS WebKit.

The [standalone repository](https://github.com/BaksiLi/shenyandayi-launcher) also maintains a multilingual Tinycast version.

## Attribution

OpenCC JavaScript and dictionary licenses are included in `assets/licenses/` and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This extension is not affiliated with Shenyandayi, DeepLang AI, Raycast, or Tinycast.
