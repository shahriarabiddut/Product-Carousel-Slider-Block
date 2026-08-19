=== SAB Product Carousel Slider for WooCommerce  ===
Contributors: shahriarabiddut
Tags: woocommerce slider, carousel, slider, products slider, product carousel
Requires at least: 5.8
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.5.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://buymeacoffee.com/shahriarabiddut

Beautiful Product Carousel Slider for WooCommerce Block (Biddut Block) with responsive columns, hover effects, navigation, and lots of functionality.

== Description ==

Transform your WooCommerce store with a stunning, fully responsive **SAB Product Carousel Slider for WooCommerce ** — built as a native Gutenberg block. Choose from two beautiful design variants, control every detail from columns to colors, and deliver a seamless shopping experience across all devices.

= Design Variants =

* **Card Style** — Modern card-based layout with borders, shadows, and smooth hover effects. Perfect for standard e-commerce stores.
* **Art Gallery (Default)** — Minimalist, image-first presentation with transparent backgrounds and centered text. Ideal for art, photography, and premium products.

= Key Features =

* **Fully Responsive Columns** — Set independent column counts for Desktop, Tablet, Mobile, and Phone breakpoints
* **Header Support** — Add a section title and subtitle, shown or hidden with a single toggle
* **Carousel Settings** — Enable autoplay, continuous loop, and adjust transition speed
* **Disable Slider on Mobile** — Display all products in a vertical stack on smaller screens instead of a carousel
* **Sale / Sold Out Labels** — Automatically shows "Sale" when a sale price is set and "Sold Out" when stock runs out
* **Navigation Options** — Choose arrows (shown elegantly on hover), dots, both, or none
* **Arrow Position** — Set the previous/next arrow's gap from the carousel's left/right edge (px)
* **Hover Effects** — Select from Zoom, Lift, Glow, or None for product card interactions
* **Gallery Features** — Display product gallery images as clickable dots; show a second image on hover
* **Add to Cart** — Fully integrated WooCommerce AJAX add-to-cart with customizable button text and style
* **Button Position** — Independent margin/padding (all sides) for the Add to Cart / View Product button row, with an "Auto push to bottom" toggle
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
* **Uniform** — Forces all images to the same size (responsive per device) for a clean, grid-like consistency; Image Fit lets you choose Cover (crop), Contain (fit, no crop), or Stretch (fill exactly). When Image Fit is set to Cover, independent Horizontal (Left/Center/Right) and Vertical (Top/Center/Bottom) position controls appear for which part of the photo stays visible

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

= Can I build a carousel without using the block editor? =

Yes. Go to **Carousels → New Slider** in your WordPress admin, configure it in the same settings panel used by the block, save it, then paste the generated shortcode (e.g. `[pcsbb_carousel id="12"]`) anywhere shortcodes are supported. You can also select any saved Slider directly from the block's "Saved Slider" panel.

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

1. Gallery variant with Art Gallery style image-first, centered layout title
2. Gallery variant with Art Gallery style image-first, centered layout no title and All Add to cart button at bottom
3. Gallery variant with Card style - Image Uniform Contain without Add To Cart Button and Title
4. Gallery variant with Card style - Image Natural (preserve aspect ratio) with Add To Cart Button and Title
5. Gutenberg block settings panel overview
6. Header (Title & Subtitle) with Typography, Color and show/hide controls and Design Variant controls
7. Responsive column settings and Image Settings
8. Carousel Behavior — autoplay, loop, speed, and Disable Mobile Slider And Navigation Controls
9. Product Query settings — multiple categories, ordering, and Hover Effects
10. Display options panel — show/hide elements and Add to Cart settings
11. Mobile responsive view — carousel on smaller screens
12. Mobile responsive view — vertical stack layout with slider disabled
13. New Backend Panel with Live Preview 

== Changelog ==
= 1.5.0 - 2026-08-18 =
* Added: New "Carousels" admin menu (All Sliders, New Slider, Slider Default Setting) — build and manage carousels directly from wp-admin, no block required.
* Added: Every saved Slider gets its own shortcode ([pcsbb_carousel id="123"]) so it can be placed anywhere shortcodes are supported (widgets, page builders, theme templates).
* Added: The Gutenberg block can now point at a saved Slider from the "Carousels" library instead of configuring it directly — an explicit "Configure this block directly" / "Use a Slider from Carousels" choice, showing only the relevant controls for each. Existing blocks (no saved Slider) load into "Configure this block directly" exactly as before.
* Added: "Slider Default Setting" screen — set the starting values every newly created Slider is seeded with.
* Added: The backend Slider editor uses the exact same settings panel and live preview as the block editor — a left-hand tab list with the matching section on the right, and a full-width Live Preview below (skipped on Slider Default Setting, which has no single Slider to preview).
* Added: "Copy" button next to each shortcode in Carousels → All Sliders.
* Added: Arrow Position controls (Left Arrow Gap / Right Arrow Gap, in px) under Navigation — sets how far the previous/next arrows sit from the carousel's own left/right edge.
* Added: Button Position controls under Display Options → Show Add to Cart Button — independent margin and padding (all sides) for the action-buttons row, plus an "Auto push to bottom (Uniform)" toggle (on by default, matching the original fixed layout; hides the Margin fields while on).
* Added: "Image Fit" for Uniform Image Height Mode — Cover (crop to fill, default), Contain (fit, no crop — may show empty space on two sides), or Stretch (fill exactly, distorts proportions).
* Added: When Image Fit is set to Cover, independent Horizontal (Left/Center/Right) and Vertical (Top/Center/Bottom) position controls (9 combinations) appear right underneath it, for which part of the photo stays visible after cropping.
* Added: Explicit responsive Image Height (px, per device — Desktop 450 / Tablet 400 / Mobile 350 / Phone 250) for Uniform mode, more reliable across themes than aspect-ratio alone. Mobile/Phone height is automatically skipped while Disable Mobile Slider is on, so the vertical-stack layout keeps images at their natural height there.

= 1.4.0 - 2026-03-13 =
* Added: Live editor preview — block now renders a real server-side preview inside Gutenberg; every control change reflects instantly in the editor canvas exactly as it appears on the frontend.

= 1.3.0 - 2026-03-13 =
* Fixed: When "Disable Mobile Slider" was enabled, resizing from a mobile viewport back to tablet or desktop left the page stuck in vertical stack mode. The carousel now correctly re-initializes when moving back to a wider breakpoint.

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

= Support or Feature Requests =

* [GitHub Repository](https://github.com/shahriarabiddut/Product-Carousel-Slider-Block)
* [WordPress Support Forum](https://wordpress.org/support/plugin/product-carousel-slider-biddut-block/)

= Contributing =

Contributions are welcome! Visit the GitHub repository to submit a pull request or open an issue.

= Credits =

* Built with WordPress & WooCommerce
* WordPress Dashicons used for navigation arrows