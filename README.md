# 🛍️ Product Carousel Slider for WooCommerce

<p align="center">
  <img src="https://img.shields.io/badge/version-1.3.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/WordPress-5.8%2B-0073AA?style=for-the-badge&logo=wordpress&logoColor=white" alt="WordPress">
  <img src="https://img.shields.io/badge/WooCommerce-5.0%2B-96588A?style=for-the-badge&logo=woocommerce&logoColor=white" alt="WooCommerce">
  <img src="https://img.shields.io/badge/PHP-7.4%2B-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/License-GPL%20v2-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  Transform your WooCommerce store with a stunning, fully responsive <strong>Product Carousel Slider</strong> — built as a native Gutenberg block. Choose from two beautiful design variants, control every detail from columns to colors, and deliver a seamless shopping experience across all devices.
</p>

---

## 📸 Preview

> **Gallery Variant** — Minimalist, image-first presentation with transparent backgrounds and centered text. Ideal for art, photography, and premium products.

> **Card Style Variant** — Modern card-based layout with borders, shadows, and smooth hover effects. Perfect for standard e-commerce stores.

---

## ✨ Features at a Glance

### 🎨 2 Beautiful Design Variants

| Variant               | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Card Style**        | Modern card-based layout with borders, shadows, and smooth hover effects            |
| **Gallery (Default)** | Minimalist, image-first presentation with transparent backgrounds and centered text |

---

### 📱 Fully Responsive Columns

Control the number of product columns independently for every device:

| Device     | Breakpoint     | Max Columns |
| ---------- | -------------- | ----------- |
| 🖥️ Desktop | 1280px+        | 1–6 columns |
| 💻 Tablet  | 768px – 1279px | 1–4 columns |
| 📱 Mobile  | 480px – 767px  | 1–3 columns |
| 📲 Phone   | < 480px        | 1–2 columns |

---

### 🖼️ Image Display Modes

- **Natural** — Preserves each product image's original aspect ratio for an organic feel
- **Uniform** — Forces all images to the same height for a clean, grid-like consistency

---

### 🎠 Carousel Settings

- Enable autoplay with adjustable delay
- Continuous loop mode
- Adjustable transition speed
- Smooth drag/swipe support (touch-friendly)
- **Disable Slider on Mobile** — Display all products in a vertical stack on smaller screens instead of a carousel

---

### 🧭 Navigation Options

- Arrow navigation (WordPress Dashicons — appears on hover for a cleaner UI)
- Dot pagination
- Both arrows & dots
- Completely hide navigation
- Custom arrow icon selection via free-text Dashicons class input

---

### ✨ Hover Effects

- **Zoom** — Image scales up smoothly
- **Lift** — Product card elevates on hover
- **Glow** — Shadow effect appears around the card
- **None** — Disable hover effects entirely

---

### 🛒 Add to Cart

- Show/hide the Add to Cart button with WooCommerce AJAX integration
- Fully customizable button text
- **Full color customization** — Background, text, hover, and border colors
- **Icon selector** — Add any Dashicons icon to your button
- **Icon position** — Left or right of the text

---

### 👁️ Display Controls

Show or hide any of the following elements independently:

- Product Title
- Price
- Star Ratings
- Sale / Sold Out Labels (automatically shows "Sale" when a sale price is set and "Sold Out" when stock runs out)
- "View Product" button
- "View All (Shop)" button — with customizable link text
- "Add to Cart" button

#### 🎯 Button Layout Controls (When Both Buttons Enabled)

- **Stacked** or **Inline** layout
- Customizable button order
- Adjustable gap between buttons
- **Full-width toggle** for individual buttons when only one is enabled

---

### 🖼️ Gallery Features

- Display product gallery images as clickable dots
- Show second gallery image on hover
- Smart handling for products with a single image

---

### 🔍 Advanced Product Query

- **Multiple Category Support** — Enter slugs separated by commas (e.g. `featured, new-arrivals`)
- Product limit control (1–50)
- Order by: Date, Title, Price, Popularity, Rating, or Random
- Ascending or Descending order

---

### 🔠 Header & Typography

- Section Title & Subtitle with a single toggle
- Responsive font sizing across all breakpoints
- Full typography customization

---

### 🎨 Deep Customization Options

- **Context-aware color panels** — Typography, Section Colors, Product Colors, and Navigation Colors consolidated into clean, organized panels
- **Compact 2-column grid color pickers** with reset-to-default buttons
- **View Product button** — Full color customization (background, text, hover, border) with icon selector and position
- **Add to Cart button** — Full color customization (background, text, hover, border) with icon selector and position
- **View All button** — Full color and font-size customization
- Extend further with custom CSS

---

## ⚙️ Requirements

| Requirement | Minimum Version                        |
| ----------- | -------------------------------------- |
| WordPress   | 5.8+                                   |
| WooCommerce | 5.0+                                   |
| PHP         | 7.4+                                   |
| Browser     | Modern browser with JavaScript enabled |

---

## 🚀 Installation

### Via WordPress Admin (Recommended)

1. Go to **WordPress Admin → Plugins → Add New → Upload Plugin**
2. Upload the plugin ZIP file
3. Click **Install Now**
4. Click **Activate Plugin**
5. Ensure **WooCommerce** is installed and activated
6. Edit any page or post, add the **Product Carousel Slider** block (found under the _Biddut Blocks_ category), and configure it in the sidebar panel

### Manual Installation

1. Upload the plugin folder to `/wp-content/plugins/product-carousel-slider-biddut-block/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Ensure WooCommerce is installed and activated

---

## 📖 Usage

1. Edit any **page or post** in the Gutenberg editor
2. Click the **`+`** button to add a new block
3. Search for **"Product Carousel Slider"** (listed under the _Biddut Blocks_ category)
4. Configure settings in the **right sidebar panel**
5. Publish and preview!

---

## 🌐 Browser Support

| Browser                                 | Support                                |
| --------------------------------------- | -------------------------------------- |
| Chrome                                  | ✅ Latest                              |
| Firefox                                 | ✅ Latest                              |
| Safari                                  | ✅ Latest                              |
| Edge                                    | ✅ Latest                              |
| Mobile (iOS Safari, Chrome for Android) | ✅ Supported with touch/swipe gestures |

---

## 🔒 Privacy

This plugin **does not collect, store, or transmit any user data**. It only reads and displays WooCommerce product information already present in your database.

---

## 📋 Changelog

### Version 1.3.0 — 2026-03-13

- Fixed: When "Disable Mobile Slider" was enabled and you resized the window from mobile back to a wider viewport, the page stayed locked in vertical stack mode — the carousel never came back. The resize listener is now always attached regardless of which mode initializes first, so switching between breakpoints works correctly in both directions.

### Version 1.2.0 — 2026-03-12
- Added: Mobile Product Width control (under Design Variant) — choose between Full Width or Centered layout for products on mobile, applies to both slider and vertical stack modes
- Added: Outer Padding & Margin controls (under Responsive Columns) — set independent X (left/right) and Y (top/bottom) padding and margin per device breakpoint (Desktop, Tablet, Mobile, Phone) for precise spacing control
- Added: Navigation Arrow Size controls (under Navigation Settings) — independently set arrow button diameter and icon size per device breakpoint with live preview
- Fixed: Navigation arrows were oval/stretched due to Dashicons stylesheet width conflict — resolved with explicit !important overrides and aspect-ratio locking on all devices
- Fixed: Arrow vertical position now correctly centers on the product image area (not the full card including product info below), using JS image-height measurement with load-event fallback
- Fixed: Arrow icon padding was too wide on large devices, making buttons appear rectangular — resolved with padding:0 and display:flex centering
- Improved: Arrow size defaults refined across all breakpoints (Desktop/Tablet: 30px button / 14px icon, Mobile: 26px / 11px, Phone: 22px / 10px)
- Improved: Per-block scoped CSS output via unique block ID for responsive padding, margin, and arrow sizes — no global style conflicts between multiple carousel instances on the same page


### Version 1.1.0 — 2026-02-20

- **Improved UI/UX**: Sidebar panels restructured into context-aware panels for a cleaner editor experience
- **Improved Settings**: "Image Display Options" and "Hover Effects" merged into "Image Settings"
- **Improved Clarity**: "Product Selection" renamed to "Product Query"; "Carousel Settings" renamed to "Carousel Behavior"
- **Enhanced Customization**: Arrow icon selection changed from dropdown to free-text input (supports any Dashicons class)
- **Increased Flexibility**: Products limit increased from 20 to 50
- **Better Color Controls**: Compact 2-column grid color pickers with reset-to-default buttons
- **Full Button Customization**: Added complete color, icon, and layout controls for View Product, Add to Cart, and View All buttons
- **Removed**: Add to Cart "Button Style" dropdown — replaced by full color controls

### Version 1.0.0 — 2026-02-18 _(Initial Release)_

- Two design variants: **Card Style** and **Gallery (Default)**
- Fully responsive column control for Desktop, Tablet, Mobile, and Phone
- Native Gutenberg block with full sidebar settings panel
- Add to Cart with WooCommerce AJAX integration
- WordPress Dashicons-based navigation arrows (shown on hover)
- Carousel settings: autoplay, loop, adjustable speed
- Gallery features: image dots navigation, hover image switch
- Multiple category selection via comma-separated slugs
- WooCommerce High-Performance Order Storage (HPOS) compatibility

---

## ❓ Frequently Asked Questions

### Does this plugin require WooCommerce?

Yes. WooCommerce must be installed and activated for the plugin to function.

### Can I use multiple carousels on one page?

Yes. You can add as many Product Carousel Slider blocks as you need on a single page, each with its own independent settings.

### Is the plugin mobile-friendly?

Absolutely. The plugin is fully responsive with independent column control for every device size, and supports touch/swipe gestures on mobile.

### Does it support touch and swipe on mobile?

Yes. The carousel supports native touch gestures for smooth swiping on all mobile and tablet devices.

### Can I customize the colors and styling?

Yes. The plugin includes two design variants, full color controls for sections, products, and navigation — plus you can add your own custom CSS for further adjustments.

### How do I select products from multiple categories?

In the Product Query settings, enter category slugs separated by commas — for example: `featured, new-arrivals, sale`.

### Why do the navigation arrows only appear on hover?

This is an intentional design choice for a cleaner, less cluttered look. The arrows reveal themselves when a user hovers over the carousel. If you prefer them to always be visible, this can be overridden with a small CSS snippet.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue on GitHub.

- 🐛 [Report a Bug](https://github.com/shahriarabiddut/product-carousel-slider-biddut-block/issues)
- 💡 [Request a Feature](https://github.com/shahriarabiddut/product-carousel-slider-biddut-block/issues)
- 🌐 [WordPress Support Forum](https://wordpress.org/support/plugin/product-carousel-slider-biddut-block/)

---

## ☕ Support the Project

If this plugin saves you time, consider buying me a coffee!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/shahriarabiddut)

---

## 📄 License

**GPL v2 or later** — [https://www.gnu.org/licenses/gpl-2.0.html](https://www.gnu.org/licenses/gpl-2.0.html)

---

## 👨‍💻 Author

**Shahriar Ahmed Biddut**

- 🐙 GitHub: [@shahriarabiddut](https://github.com/shahriarabiddut)

---

## 🙏 Credits

- Built with ❤️ using **WordPress** & **WooCommerce**
- Follows WordPress coding standards and best practices
- WordPress Dashicons used for navigation arrows

---

> **Note:** Regular updates and improvements are planned. Star the repository to stay tuned!