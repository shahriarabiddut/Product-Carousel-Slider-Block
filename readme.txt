=== Product Carousel Slider for WooCommerce ===
Contributors: shahriarabiddut
Tags: woocommerce, carousel, slider, products, gallery
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.2.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://buymeacoffee.com/shahriarabiddut

Beautiful, Responsive Product Carousel Slider Block with responsive columns, hover effects, gallery navigation, and add to cart functionality.

== Description ==

Transform your WooCommerce store with a stunning, fully responsive **Product Carousel Slider** — built as a native Gutenberg block. Choose from two beautiful design variants, control every detail from columns to colors, and deliver a seamless shopping experience across all devices.

= Design Variants =

* **Card Style** — Modern card-based layout with borders, shadows, and smooth hover effects. Perfect for standard e-commerce stores.
* **Gallery (Default)** — Minimalist, image-first presentation with transparent backgrounds and centered text. Ideal for art, photography, and premium products.

= Key Features =

* **Fully Responsive Columns** — Set independent column counts for Desktop, Tablet, Mobile, and Phone breakpoints
* **Header Support** — Add a section title and subtitle, shown or hidden with a single toggle
* **Carousel Settings** — Enable autoplay, continuous loop, and adjust transition speed
* **Disable Slider on Mobile** — Display all products in a vertical stack on smaller screens instead of a carousel
* **Sale / Sold Out Labels** — Automatically shows "Sale" when a sale price is set and "Sold Out" when stock runs out
* **Navigation Options** — Choose arrows (shown elegantly on hover), dots, both, or none
* **Hover Effects** — Select from Zoom, Lift, Glow, or None for product card interactions
* **Gallery Features** — Display product gallery images as clickable dots; show a second image on hover
* **Add to Cart** — Fully integrated WooCommerce AJAX add-to-cart with customizable button text and style
* **Product Query** — Filter by multiple categories and control ordering with full flexibility
* **Display Controls** — Individually show or hide title, price, ratings, labels, and buttons
* **Responsive Typography** — All font sizes adjust automatically for every screen size
* **Deep Customizations** — Colors, spacing, and styles are customizable for nearly every element
* **Optimized Performance** — Clean, well-structured code with minimal dependencies

= Responsive Column Control =

* **Desktop** (1280px and above): 1–6 columns
* **Tablet** (768px–1279px): 1–4 columns
* **Mobile** (480px–767px): 1–3 columns
* **Phone** (below 480px): 1–2 columns

= Image Display Modes =

* **Natural** — Preserves each product image's original aspect ratio for an organic feel
* **Uniform** — Forces all images to the same height for a clean, grid-like consistency

= Display Controls =

Show or hide any of the following elements independently:

* Product Title
* Price
* Star Ratings
* Sale / Sold Out Labels
* "View Product" button
* "View All (Shop)" button — with customizable link text
* "Add to Cart" button — with customizable label and button style

= Add to Cart Button Styles =

* **Default** — Inherits your theme's standard button style
* **Primary** — Bold, filled button for high visibility
* **Outline** — Subtle bordered button for a minimal look

= Perfect For =

* WooCommerce online stores
* Art galleries and photography portfolios
* Fashion and lifestyle product showcases
* Featured or promotional product sections
* Any page that needs a beautiful, engaging product display

== Installation ==

1. Download the plugin ZIP file
2. In your WordPress dashboard, go to **Plugins → Add New → Upload Plugin**
3. Upload the ZIP file and click **Install Now**
4. Click **Activate Plugin**
5. Ensure **WooCommerce** is installed and activated
6. Edit any page or post, add the **Product Carousel Slider** block (found under the *Biddut Blocks* category), and configure it in the sidebar panel

Alternatively, you can upload the plugin files manually to `/wp-content/plugins/product-carousel-slider-biddut-block/` and activate it through the Plugins menu.

== Frequently Asked Questions ==

= Does this plugin require WooCommerce? =

Yes. WooCommerce must be installed and activated for the plugin to function.

= Can I use multiple carousels on one page? =

Yes. You can add as many Product Carousel Slider blocks as you need on a single page, each with its own independent settings.

= Is the plugin mobile-friendly? =

Absolutely. The plugin is fully responsive with independent column control for every device size, and supports touch/swipe gestures on mobile.

= Does it support touch and swipe on mobile? =

Yes. The carousel supports native touch gestures for smooth swiping on all mobile and tablet devices.

= Can I customize the colors and styling? =

Yes. The plugin includes two design variants, three Add to Cart button styles, full color controls for sections, products, and navigation — plus you can add your own custom CSS for further adjustments.

= How do I select products from multiple categories? =

In the Product Query settings, enter category slugs separated by commas — for example: `featured, new-arrivals, sale`.

= Why do the navigation arrows only appear on hover? =

This is an intentional design choice for a cleaner, less cluttered look. The arrows reveal themselves when a user hovers over the carousel. If you prefer them to always be visible, this can be overridden with a small CSS snippet.

= How do I customize the Add to Cart button? =

In the block settings panel, enable **Show Add to Cart**, then choose from Default, Primary, or Outline button styles and set your preferred button text.

= Where can I find full documentation? =

Full documentation is available on the WordPress Plugin Details page and in the GitHub repository.

== Screenshots ==

1. Gallery variant with minimalist style image-first, centered layout no title
2. Gallery variant with minimalist style without Add To Cart Button and Title
3. Card Style variant with modern card design and hover effects , without Add To Cart 
4. Gutenberg block settings panel overview
5. Header (Title & Subtitle) with Typography, Color and show/hide controls and Design Variant controls
6. Responsive column settings and Image Settings
7. Carousel Behavior — autoplay, loop, speed, and Disable Mobile Slider And Navigation Controls
8. Product Query settings — multiple categories, ordering, and Hover Effects
9. Display options panel — show/hide elements and Add to Cart settings
10. Mobile responsive view — carousel on smaller screens
11. Mobile responsive view — vertical stack layout with slider disabled

== Changelog ==
= 1.2.0 - 2026-03-12 =
* Added: Mobile Product Width control (under Design Variant) — choose between Full Width or Centered layout for products on mobile, applies to both slider and vertical stack modes
* Added: Outer Padding & Margin controls (under Responsive Columns) — set independent X (left/right) and Y (top/bottom) padding and margin per device breakpoint (Desktop, Tablet, Mobile, Phone) for precise spacing control
* Added: Navigation Arrow Size controls (under Navigation Settings) — independently set arrow button diameter and icon size per device breakpoint with live preview
* Fixed: Navigation arrows were oval/stretched due to Dashicons stylesheet width conflict — resolved with explicit !important overrides and aspect-ratio locking on all devices
* Fixed: Arrow vertical position now correctly centers on the product image area (not the full card including product info below), using JS image-height measurement with load-event fallback
* Fixed: Arrow icon padding was too wide on large devices, making buttons appear rectangular — resolved with padding:0 and display:flex centering
* Improved: Arrow size defaults refined across all breakpoints (Desktop/Tablet: 30px button / 14px icon, Mobile: 26px / 11px, Phone: 22px / 10px)
* Improved: Per-block scoped CSS output via unique block ID for responsive padding, margin, and arrow sizes — no global style conflicts between multiple carousel instances on the same page

= 1.1.0 - 2026-02-20 =
* Improved: Sidebar panels restructured — Typography, Section Colors, Product Colors,
  and Navigation Colors consolidated into context-aware panels for a cleaner editor experience
* Improved: "Image Display Options" and "Hover Effects" merged into a single "Image Settings" panel
* Improved: "Product Selection" panel renamed to "Product Query" for clarity
* Improved: "Carousel Settings" panel renamed to "Carousel Behavior"
* Improved: Arrow icon selection changed from dropdown to free-text input, supporting any Dashicons class
* Improved: Products limit increased from 20 to 50
* Improved: Color pickers now use compact 2-column grid layout with reset-to-default buttons
* Added: Full color customization for View Product button (background, text, hover, border)
* Added: Full color customization for Add to Cart button (background, text, hover, border)
* Added: Icon selector and icon position controls for both View Product and Add to Cart buttons
* Added: Full-width toggle for individual buttons when only one button is enabled
* Added: Button Layout controls when both buttons are enabled (Stacked / Inline, order, gap)
* Added: Full color and font-size customization for View All button
* Removed: Add to Cart "Button Style" dropdown (Default / Primary / Outline) — replaced by full color controls

= 1.0.0 - 2026-02-18 =
* Initial release
* Two design variants: Card Style and Gallery (Default)
* Fully responsive column control for Desktop, Tablet, Mobile, and Phone
* Native Gutenberg block with full sidebar settings panel
* Add to Cart with WooCommerce AJAX integration and three button styles
* WordPress Dashicons-based navigation arrows (shown on hover)
* Carousel settings: autoplay, continuous loop, adjustable speed
* Gallery features: image dots navigation, hover image switch
* Multiple category selection via comma-separated slugs
* WooCommerce High-Performance Order Storage (HPOS) compatibility

== Additional Info ==

= Browser Support =

* Chrome (latest)
* Firefox (latest)
* Safari (latest)
* Microsoft Edge (latest)
* Mobile browsers — iOS Safari, Chrome for Android

= Requirements =

* WordPress 5.8 or higher
* WooCommerce 5.0 or higher
* PHP 7.4 or higher
* A modern browser with JavaScript enabled

= Privacy =

This plugin does not collect, store, or transmit any user data. It only reads and displays WooCommerce product information already present in your database.

= Support or Feature Requests=

* [GitHub Repository](https://github.com/shahriarabiddut/Product-Carousel-Slider-Block)
* [WordPress Support Forum](https://wordpress.org/support/plugin/product-carousel-slider-biddut-block/)

= Contributing =

Contributions are welcome! Visit the GitHub repository to submit a pull request or open an issue.

= Credits =

* Built with WordPress & WooCommerce
* Follows WordPress coding standards and best practices
* WordPress Dashicons used for navigation arrows