# 🛍️ Product Carousel Slider Biddut Block

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/WordPress-5.8%2B-0073AA?style=for-the-badge&logo=wordpress&logoColor=white" alt="WordPress">
  <img src="https://img.shields.io/badge/WooCommerce-5.0%2B-96588A?style=for-the-badge&logo=woocommerce&logoColor=white" alt="WooCommerce">
  <img src="https://img.shields.io/badge/PHP-7.4%2B-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/License-GPL%20v2-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  Beautiful, responsive <strong>Product Carousel Slider</strong> Gutenberg Block for WooCommerce — featuring Card & Gallery design variants, hover effects, gallery navigation, and full add-to-cart functionality.
</p>

---

## 📸 Preview

> **Gallery Variant** — Minimalist style, perfect for art and premium products.

> **Card Style Variant** — Modern card-based layout with borders and hover effects.

---

## ✨ Features at a Glance

### 🎨 2 Beautiful Design Variants

| Variant | Description |
|---|---|
| **Card Style** | Modern card-based layout with borders and hover shadow effects |
| **Gallery (Default)** | Minimalist, transparent background with centered text — ideal for art or premium products |

---

### 📱 Fully Responsive Columns

Control the number of product columns independently for every device:

| Device | Breakpoint | Max Columns |
|---|---|---|
| 🖥️ Desktop | 1280px+ | 6 columns |
| 💻 Tablet | 768px – 1279px | 4 columns |
| 📱 Mobile | 480px – 767px | 3 columns |
| 📲 Phone | < 480px | 2 columns |

---

### 🖼️ Image Display Modes

- **Natural** — Maintains original image aspect ratios
- **Uniform** — Forces all images to the same height for a consistent, grid-like look

---

### 🎠 Carousel Settings

- Autoplay with adjustable delay
- Continuous loop mode
- Adjustable transition speed
- Smooth drag/swipe support (touch-friendly)
- **Disable Slider on Mobile** — Stack products vertically on smaller screens

---

### 🧭 Navigation Options

- Arrow navigation (WordPress Dashicons, appears on hover for a clean UI)
- Dot pagination
- Both arrows & dots
- Completely hide navigation

---

### ✨ Hover Effects

- **Zoom** — Image scales up smoothly
- **Lift** — Product card elevates on hover
- **Glow** — Shadow effect appears around the card
- **None** — Disable hover effects entirely

---

### 🛒 Add to Cart

- Show/hide the Add to Cart button
- Customizable button text
- Three button styles: **Default**, **Primary**, **Outline**
- Full WooCommerce AJAX cart integration

---

### 🖼️ Gallery Features

- Display product gallery images as clickable image dots
- Show second gallery image on hover
- Smart handling for products with a single image

---

### 🔍 Advanced Product Query

- **Multiple Category Support** — Enter slugs separated by commas (e.g. `featured, new-arrivals`)
- Product limit control (1–100)
- Order by: Date, Title, Price, Popularity, Rating, or Random
- Ascending or Descending order

---

### 👁️ Display Controls

Show or hide any of the following elements individually:

- Product Title
- Price
- Ratings
- Sale / Sold Out Labels
- "View Product" button
- "View All (Shop)" button *(customizable text)*
- "Add to Cart" button

---

### 🔠 Header & Typography

- Section Title & Subtitle with a single toggle
- Responsive font sizing across all breakpoints
- Full typography customization

---

### 🎨 Customization

- Section background and product color controls
- Navigation color controls
- Almost every option has its own customization settings
- Extend further with custom CSS

---

## ⚙️ Requirements

| Requirement | Minimum Version |
|---|---|
| WordPress | 5.8+ |
| WooCommerce | 5.0+ |
| PHP | 7.4+ |
| Browser | Modern browser with JavaScript enabled |

---

## 🚀 Installation

### Via WordPress Admin (Recommended)

1. Go to **WordPress Admin → Plugins → Add New → Upload Plugin**
2. Upload the plugin ZIP file
3. Activate the plugin
4. Ensure **WooCommerce** is installed and activated
5. Start building beautiful product carousels!

### Manual Installation

1. Upload the plugin folder to `/wp-content/plugins/product-carousel-slider-biddut-block/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Ensure WooCommerce is installed and activated

---

## 📖 Usage

1. Edit any **page or post** in the Gutenberg editor
2. Click the **`+`** button to add a new block
3. Search for **"Product Carousel"** (listed under the *Biddut Blocks* category)
4. Configure settings in the **right sidebar panel**
5. Publish and preview!

---

## 🗂️ File Structure

```
product-carousel-slider-biddut-block/
├── assets/
│   ├── css/
│   │   ├── block.css               # Editor styles
│   │   └── public.css              # Frontend styles
│   └── js/
│       ├── block.js                # Gutenberg block registration
│       └── public.js               # Frontend carousel logic
├── includes/
│   ├── class-pcsbb-core.php
│   ├── class-pcsbb-gutenberg-block.php
│   └── class-pcsbb-loader.php
└── product-carousel-slider-biddut-block.php
```

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile (iOS Safari, Chrome Mobile) | ✅ Supported |

---

## 🔒 Privacy

This plugin **does not collect or store any user data**. It only fetches and displays WooCommerce product data in carousel format.

---

## 📋 Changelog

### Version 1.0.0 — 2026-02-18 *(Initial Release)*

- Two design variants: **Card Style** and **Gallery**
- Fully responsive column control for all device sizes
- Gutenberg block support
- Add to Cart functionality with three customizable button styles
- WordPress Dashicons-based navigation arrows (shown on hover)
- Carousel settings: autoplay, loop, adjustable speed
- Gallery features: image dots, hover image switch
- Multiple category selection support
- WooCommerce HPOS compatibility

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
- Follows WordPress coding standards
- Dashicons for navigation arrows

---

> **Note:** Version 1.0.0 is the initial release with all core features fully tested and production-ready!