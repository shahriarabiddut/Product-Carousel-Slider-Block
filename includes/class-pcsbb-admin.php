<?php
/**
 * PCSBB Admin Class v1.2.0
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_Admin
 */
class PCSBB_Admin {

	/**
	 * Register admin menu pages
	 */
	public function register_admin_menu() {
		$overview_hook = add_menu_page(
			__( 'Product Carousel Slider', 'product-carousel-slider-biddut-block' ),
			__( 'Carousel Slider', 'product-carousel-slider-biddut-block' ),
			'manage_options',
			'pcsbb-settings',
			array( $this, 'render_settings_page' ),
			'dashicons-images-alt2',
			58
		);

		add_submenu_page(
			'pcsbb-settings',
			__( 'Overview', 'product-carousel-slider-biddut-block' ),
			__( 'Overview', 'product-carousel-slider-biddut-block' ),
			'manage_options',
			'pcsbb-settings',
			array( $this, 'render_settings_page' )
		);

		$guide_hook = add_submenu_page(
			'pcsbb-settings',
			__( 'How to Use Guide', 'product-carousel-slider-biddut-block' ),
			__( 'How to Use Guide', 'product-carousel-slider-biddut-block' ),
			'manage_options',
			'pcsbb-guide',
			array( $this, 'render_guide_page' )
		);

		add_action( 'admin_print_styles-' . $overview_hook, array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_print_styles-' . $guide_hook,    array( $this, 'enqueue_admin_styles' ) );
	}

	/**
	 * Enqueue admin styles
	 */
	public function enqueue_admin_styles() {
		wp_enqueue_style( 'dashicons' );

		$css = "
			/* ── Layout ── */
			.pcsbb-wrap {
				margin: 20px 20px 20px 0;
			}

			/* ── Page header ── */
			.pcsbb-page-header {
				background: #fff;
				border: 1px solid #c3c4c7;
				box-shadow: 0 1px 1px rgba(0,0,0,.04);
				padding: 16px 24px;
				margin-bottom: 20px;
				display: flex;
				align-items: center;
				gap: 12px;
			}
			.pcsbb-page-header h1 {
				margin: 0;
				padding: 0;
				font-size: 22px;
				font-weight: 400;
				line-height: 1.3;
				display: flex;
				align-items: center;
				gap: 10px;
			}
			.pcsbb-page-header .dashicons {
				color: #2271b1;
				font-size: 26px;
				width: 26px;
				height: 26px;
			}

			/* ── Notice strip ── */
			.pcsbb-notice {
				padding: 10px 16px;
				margin-bottom: 20px;
				border-left: 4px solid #72aee6;
				background: #f6f7f7;
			}
			.pcsbb-notice.is-error   { border-color: #d63638; background: #fcf0f1; }
			.pcsbb-notice.is-success { border-color: #00a32a; background: #edfaef; }
			.pcsbb-notice p { margin: 6px 0; font-size: 13px; }

			/* ── Card grid (overview) ── */
			.pcsbb-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
				gap: 20px;
				margin-bottom: 20px;
			}
			.pcsbb-card {
				background: #fff;
				border: 1px solid #c3c4c7;
				box-shadow: 0 1px 1px rgba(0,0,0,.04);
				padding: 20px 24px;
			}
			.pcsbb-card-title {
				margin: 0 0 14px;
				padding-bottom: 10px;
				border-bottom: 1px solid #c3c4c7;
				font-size: 14px;
				font-weight: 600;
				color: #1d2327;
			}

			/* ── Info table (overview) ── */
			.pcsbb-info-table {
				width: 100%;
				border-collapse: collapse;
			}
			.pcsbb-info-table td {
				padding: 9px 12px;
				border-bottom: 1px solid #f0f0f1;
				font-size: 13px;
				vertical-align: top;
			}
			.pcsbb-info-table tr:last-child td {
				border-bottom: none;
			}
			.pcsbb-info-table td:first-child {
				font-weight: 600;
				color: #1d2327;
				width: 160px;
				white-space: nowrap;
			}
			.pcsbb-info-table tr:nth-child(even) td {
				background: #f9f9f9;
			}
			.pcsbb-status-active   { color: #00a32a; font-weight: 600; }
			.pcsbb-status-inactive { color: #d63638; font-weight: 600; }
			.pcsbb-mono {
				font-family: Consolas, Monaco, monospace;
				font-size: 12px;
				background: #f0f0f1;
				padding: 2px 6px;
				border-radius: 3px;
				color: #50575e;
				word-break: break-all;
			}

			/* ── CTA bar ── */
			.pcsbb-cta-bar {
				background: #fff;
				border: 1px solid #c3c4c7;
				box-shadow: 0 1px 1px rgba(0,0,0,.04);
				padding: 16px 24px;
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
				align-items: center;
			}

			/* ── Guide sections ── */
			.pcsbb-guide-section {
				background: #fff;
				border: 1px solid #c3c4c7;
				box-shadow: 0 1px 1px rgba(0,0,0,.04);
				padding: 20px 24px;
				margin-bottom: 14px;
			}
			.pcsbb-guide-section h3 {
				margin: 0 0 12px;
				font-size: 15px;
				font-weight: 600;
				color: #1d2327;
			}
			.pcsbb-guide-section ul {
				margin: 0;
				padding-left: 22px;
			}
			.pcsbb-guide-section li {
				margin-bottom: 7px;
				font-size: 13px;
				line-height: 1.65;
				color: #2c3338;
			}
			.pcsbb-guide-section code {
				background: #f0f0f1;
				padding: 2px 5px;
				border-radius: 3px;
				font-family: Consolas, Monaco, monospace;
				font-size: 12px;
				color: #d63638;
			}
			.pcsbb-guide-section a {
				color: #2271b1;
				text-decoration: none;
			}
			.pcsbb-guide-section a:hover {
				color: #135e96;
				text-decoration: underline;
			}

			/* ── Support footer ── */
			.pcsbb-support-box {
				background: #f0f6fc;
				border: 1px solid #c3d9f0;
				padding: 16px 20px;
				margin-top: 4px;
			}
			.pcsbb-support-box p {
				margin: 0 0 8px;
				font-size: 13px;
			}
			.pcsbb-support-box p:last-child {
				margin: 0;
				font-size: 12px;
				color: #555;
			}
			.pcsbb-support-box a {
				color: #2271b1;
			}

			/* ── Responsive ── */
			@media screen and (max-width: 900px) {
				.pcsbb-grid {
					grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
				}
			}
			@media screen and (max-width: 782px) {
				.pcsbb-wrap {
					margin: 10px 10px 10px 0;
				}
				.pcsbb-grid {
					grid-template-columns: 1fr;
				}
				.pcsbb-info-table td:first-child {
					width: auto;
					white-space: normal;
				}
				.pcsbb-cta-bar {
					flex-direction: column;
					align-items: flex-start;
				}
			}
			@media screen and (max-width: 480px) {
				.pcsbb-page-header h1 {
					font-size: 18px;
				}
				.pcsbb-card,
				.pcsbb-guide-section {
					padding: 14px 16px;
				}
			}
		";

		wp_add_inline_style( 'dashicons', $css );
	}

	/**
	 * Render the Overview / Settings page
	 */
	public function render_settings_page() {
		$woo_active = class_exists( 'WooCommerce' );
		?>
		<div class="wrap pcsbb-wrap">

			<div class="pcsbb-page-header">
				<h1>
					<span class="dashicons dashicons-images-alt2"></span>
					<?php esc_html_e( 'Product Carousel Slider for WooCommerce — Biddut Block', 'product-carousel-slider-biddut-block' ); ?>
				</h1>
			</div>

			<?php if ( ! $woo_active ) : ?>
			<div class="pcsbb-notice is-error">
				<p>
					<strong><?php esc_html_e( 'WooCommerce is not active!', 'product-carousel-slider-biddut-block' ); ?></strong>
					<?php esc_html_e( 'This plugin requires WooCommerce to display products.', 'product-carousel-slider-biddut-block' ); ?>
					&nbsp;
					<a href="<?php echo esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ); ?>" class="button button-primary">
						<?php esc_html_e( 'Install WooCommerce', 'product-carousel-slider-biddut-block' ); ?>
					</a>
				</p>
			</div>
			<?php else : ?>
			<div class="pcsbb-notice is-success">
				<p>✅ <?php esc_html_e( 'WooCommerce is active — your carousel blocks are ready to use!', 'product-carousel-slider-biddut-block' ); ?></p>
			</div>
			<?php endif; ?>

			<div class="pcsbb-grid">

				<!-- Plugin Info -->
				<div class="pcsbb-card">
					<h2 class="pcsbb-card-title"><?php esc_html_e( 'Plugin Information', 'product-carousel-slider-biddut-block' ); ?></h2>
					<table class="pcsbb-info-table">
						<tbody>
							<tr>
								<td><?php esc_html_e( 'Version', 'product-carousel-slider-biddut-block' ); ?></td>
								<td><?php echo esc_html( PCSBB_VERSION ); ?></td>
							</tr>
							<tr>
								<td><?php esc_html_e( 'Block Name', 'product-carousel-slider-biddut-block' ); ?></td>
								<td>Product Carousel Slider <em>(Biddut Blocks)</em></td>
							</tr>
							<tr>
								<td><?php esc_html_e( 'WooCommerce', 'product-carousel-slider-biddut-block' ); ?></td>
								<td>
									<?php if ( $woo_active ) : ?>
										<span class="pcsbb-status-active">
											<?php
											printf(
												/* translators: %s: WooCommerce version */
												esc_html__( '✓ Active (%s)', 'product-carousel-slider-biddut-block' ),
												esc_html( WC()->version )
											);
											?>
										</span>
									<?php else : ?>
										<span class="pcsbb-status-inactive">✗ <?php esc_html_e( 'Not active', 'product-carousel-slider-biddut-block' ); ?></span>
									<?php endif; ?>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- WordPress Info -->
				<div class="pcsbb-card">
					<h2 class="pcsbb-card-title"><?php esc_html_e( 'Environment', 'product-carousel-slider-biddut-block' ); ?></h2>
					<table class="pcsbb-info-table">
						<tbody>
							<tr>
								<td><?php esc_html_e( 'WordPress', 'product-carousel-slider-biddut-block' ); ?></td>
								<td><?php echo esc_html( get_bloginfo( 'version' ) ); ?></td>
							</tr>
							<tr>
								<td><?php esc_html_e( 'PHP', 'product-carousel-slider-biddut-block' ); ?></td>
								<td><?php echo esc_html( PHP_VERSION ); ?></td>
							</tr>
							<tr>
								<td><?php esc_html_e( 'Site URL', 'product-carousel-slider-biddut-block' ); ?></td>
								<td><span class="pcsbb-mono"><?php echo esc_html( get_site_url() ); ?></span></td>
							</tr>
						</tbody>
					</table>
				</div>

			</div>

			<div class="pcsbb-cta-bar">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=pcsbb-guide' ) ); ?>" class="button button-primary">
					📖 <?php esc_html_e( 'Open How to Use Guide', 'product-carousel-slider-biddut-block' ); ?>
				</a>
				<a href="https://github.com/shahriarabiddut/Product-Carousel-Slider-Block" target="_blank" rel="noopener" class="button">
					🐙 <?php esc_html_e( 'GitHub Repository', 'product-carousel-slider-biddut-block' ); ?>
				</a>
				<a href="https://wordpress.org/support/plugin/product-carousel-slider-biddut-block/" target="_blank" rel="noopener" class="button">
					💬 <?php esc_html_e( 'Support Forum', 'product-carousel-slider-biddut-block' ); ?>
				</a>
			</div>

		</div>
		<?php
	}

	/**
	 * Render the How to Use Guide page
	 */
	public function render_guide_page() {
		?>
		<div class="wrap pcsbb-wrap">

			<div class="pcsbb-page-header">
				<h1>
					<span class="dashicons dashicons-book-alt"></span>
					<?php esc_html_e( 'How to Use Guide — Product Carousel Slider', 'product-carousel-slider-biddut-block' ); ?>
				</h1>
			</div>

			<?php $this->render_guide_section(
				'🚀 ' . __( 'Quick Start', 'product-carousel-slider-biddut-block' ),
				array(
					__( 'Ensure WooCommerce is installed and has published products.', 'product-carousel-slider-biddut-block' ),
					__( 'Edit any page or post using the Gutenberg block editor.', 'product-carousel-slider-biddut-block' ),
					__( 'Click the <strong>+ Add Block</strong> button (or press /) and search for <strong>"Product Carousel Slider"</strong>.', 'product-carousel-slider-biddut-block' ),
					__( 'The block appears under the <strong>Biddut Blocks</strong> category.', 'product-carousel-slider-biddut-block' ),
					__( 'Select the block — a live preview placeholder appears. Open the right sidebar to configure all settings.', 'product-carousel-slider-biddut-block' ),
					__( 'Click <strong>Publish</strong> or <strong>Update</strong> — the full carousel renders on the frontend.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'🎨 ' . __( 'Design Variant Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( '<strong>Art Gallery (default)</strong> — Transparent background, centered product text, minimal style. Best for art, photography, and luxury products.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Card Style</strong> — White cards with border, drop shadow, and hover lift. Best for standard e-commerce stores.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Mobile Product Width</strong> — Choose <em>Full Width</em> (products fill the container) or <em>Centered</em> (products sit centered with a max-width of ~420px). Applies to both slider and vertical-stack mobile layouts.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'📐 ' . __( 'Responsive Columns & Spacing Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( 'Set column counts independently for each breakpoint: 🖥️ Desktop (≥1280px), 💻 Tablet (768–1279px), 📱 Mobile (480–767px), 📲 Phone (&lt;480px).', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Outer Padding (X/Y)</strong> — Adds internal spacing inside the carousel container. X = left & right padding; Y = top & bottom. Set per device breakpoint.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Outer Margin (X/Y)</strong> — Adds external spacing around the carousel block. Use negative values to bleed the block to the page edge. Set per device breakpoint.', 'product-carousel-slider-biddut-block' ),
					__( 'Tip: To make the carousel stretch full-bleed (edge to edge), use the block\'s <strong>Align → Full Width</strong> setting in the toolbar, or set negative margin X values.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'🖼️ ' . __( 'Image Settings Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( '<strong>Natural</strong> — Preserves each product image\'s original aspect ratio. Suitable for art and photography where cropping would harm the composition.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Uniform (square crop)</strong> — Forces all images to a 1:1 aspect ratio so the grid is perfectly consistent. Best for product photos with consistent subjects.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Hover Effect</strong> — Zoom (image scales up), Lift (card rises), Glow (shadow appears), or None.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Show Gallery Image on Hover</strong> — Swaps to the product\'s second WooCommerce gallery image on mouse hover. Falls back to zoom if no second image exists.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Show Image Dots</strong> — Displays clickable navigation dots below the image for all gallery images.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'🎠 ' . __( 'Carousel Behavior Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( '<strong>Autoplay</strong> — Automatically advances slides. Set delay in milliseconds (1000 = 1 second). Autoplay pauses when the user hovers the carousel.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Loop</strong> — When enabled, the carousel wraps back to the first slide after the last. Also enables the Transition Speed setting.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Transition Speed</strong> — Duration of the slide animation in milliseconds (200–2000ms). Requires Loop to be enabled.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Disable Mobile Slider</strong> — On screens below 768px, instead of a carousel, products stack vertically. The Mobile Product Width setting (Design Variant panel) controls whether they appear full-width or centered.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'🧭 ' . __( 'Navigation Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( '<strong>Navigation Style</strong> — Arrows Only, Dots Only, Both, or hidden. Arrows appear elegantly on hover by default.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Arrow Icons</strong> — Enter any WordPress Dashicons class (e.g. <code>dashicons-arrow-left-alt2</code>, <code>dashicons-chevron-left</code>). Browse all icons at <a href="https://developer.wordpress.org/resource/dashicons/" target="_blank" rel="noopener">developer.wordpress.org/resource/dashicons/</a>.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Arrow Colors</strong> — Set arrow icon color, hover color, background, and background-hover independently.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Arrow Size (per Device)</strong> — Control arrow circle diameter and icon size per breakpoint. Button = circle diameter in px; Icon = Dashicon glyph size in px. Defaults: Desktop/Tablet 30px button / 14px icon; Mobile 26px / 11px; Phone 22px / 10px.', 'product-carousel-slider-biddut-block' ),
					__( 'Tip: If arrows are always visible (not just on hover), add this CSS snippet: <code>.pcsbb-nav-arrow { opacity: 1 !important; visibility: visible !important; }</code>', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'🔍 ' . __( 'Product Query Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( '<strong>Categories</strong> — Check one or more WooCommerce categories to filter which products appear. Leave all unchecked to show products from all categories.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Number of Products</strong> — How many products to load (1–50). Note: this is the total pool, not the number visible at once (that is controlled by columns).', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Order By</strong> — Date, Title, Price, Popularity (total sales), Rating, or Random.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Order</strong> — Descending (newest/highest first) or Ascending.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'👁️ ' . __( 'Display Options Panel', 'product-carousel-slider-biddut-block' ),
				array(
					__( 'Toggle visibility of: Product Title, Price, Star Rating, Sale Label, Sold Out Label.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Sale Label</strong> — Automatically appears when a WooCommerce sale price is set on the product. Customize text, position (4 corners), background and text colors.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Sold Out Label</strong> — Appears when a product\'s stock is zero. Customize text, position, and colors.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>View Product Button</strong> — Links to the product single page. Customize icon (Dashicons), icon position (left/right), and full color suite (BG, text, hover BG, hover text, border). When only this button is shown, use the Full Width toggle.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Add to Cart Button</strong> — AJAX add-to-cart. Customize button text, icon, icon position, and full color suite. When only this button is shown, use the Full Width toggle.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Button Layout</strong> (when both buttons are enabled) — Stacked (each full-width, one above the other) or Inline (side by side). Control order (cart first / view product first) and gap between buttons.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>View All Button</strong> — Shows a centered button below the carousel linking to a page of your choice (e.g. /shop). Customize text, URL, and full color suite including font size.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'💡 ' . __( 'Pro Tips', 'product-carousel-slider-biddut-block' ),
				array(
					__( 'You can place <strong>multiple carousel blocks</strong> on a single page — each has its own independent settings, unique block ID, and scoped CSS so they never interfere with each other.', 'product-carousel-slider-biddut-block' ),
					__( 'Use the block\'s <strong>Align → Wide Width or Full Width</strong> toolbar setting to make the carousel span beyond the content column.', 'product-carousel-slider-biddut-block' ),
					__( 'To create a featured-product section, set Products = 1 and Columns = 1 for all devices. Use Card Style with all details shown.', 'product-carousel-slider-biddut-block' ),
					__( 'The Gallery variant works best with product images that have consistent aspect ratios. Use the Uniform image mode if your images are inconsistent.', 'product-carousel-slider-biddut-block' ),
					__( 'Add custom CSS in <strong>Appearance → Customize → Additional CSS</strong> using the block\'s scoped ID (inspect the page source to find it, e.g. <code>#pcsbb-block-12</code>).', 'product-carousel-slider-biddut-block' ),
					__( 'Touch/swipe gestures work out of the box on mobile and tablet — no extra configuration needed.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<?php $this->render_guide_section(
				'❓ ' . __( 'Troubleshooting', 'product-carousel-slider-biddut-block' ),
				array(
					__( '<strong>Products not showing?</strong> — Verify WooCommerce is active and products are Published. Check that selected categories have products assigned. Increase the Products limit.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Arrows look oval/stretched?</strong> — This was a known bug fixed in v1.2.0. Update the plugin and clear any caching plugins.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Carousel not sliding?</strong> — Check your browser console for JavaScript errors. Ensure jQuery is loading (it is bundled with WordPress). Disable conflicting plugins one by one.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Add to Cart not working?</strong> — Ensure WooCommerce AJAX is not blocked by your theme or a caching plugin. Exclude the page from full-page caching.', 'product-carousel-slider-biddut-block' ),
					__( '<strong>Images not loading?</strong> — Ensure products have a Featured Image set in WooCommerce. Regenerate thumbnails via WooCommerce → Status → Tools.', 'product-carousel-slider-biddut-block' ),
				)
			); ?>

			<div class="pcsbb-support-box">
				<p><strong>📬 <?php esc_html_e( 'Support & Contributing', 'product-carousel-slider-biddut-block' ); ?></strong></p>
				<p>
					<a href="https://wordpress.org/support/plugin/product-carousel-slider-biddut-block/" target="_blank" rel="noopener"><?php esc_html_e( 'WordPress Support Forum', 'product-carousel-slider-biddut-block' ); ?></a>
					&nbsp;|&nbsp;
					<a href="https://github.com/shahriarabiddut/Product-Carousel-Slider-Block/issues" target="_blank" rel="noopener"><?php esc_html_e( 'GitHub Issues', 'product-carousel-slider-biddut-block' ); ?></a>
					&nbsp;|&nbsp;
					<a href="https://buymeacoffee.com/shahriarabiddut" target="_blank" rel="noopener">☕ <?php esc_html_e( 'Buy Me a Coffee', 'product-carousel-slider-biddut-block' ); ?></a>
				</p>
				<p><?php printf( 'Version %s &nbsp;|&nbsp; Author: Shahriar Ahmed Biddut', esc_html( PCSBB_VERSION ) ); ?></p>
			</div>

		</div>
		<?php
	}

	/**
	 * Helper: render a guide section
	 *
	 * @param string $title  Section heading.
	 * @param array  $points Array of HTML strings.
	 */
	private function render_guide_section( $title, $points ) {
		?>
		<div class="pcsbb-guide-section">
			<h3><?php echo esc_html( $title ); ?></h3>
			<ul>
				<?php foreach ( $points as $point ) : ?>
					<li><?php echo wp_kses_post( $point ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
	}
}