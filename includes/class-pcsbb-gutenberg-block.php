<?php
/**
 * PCSBB Gutenberg Block Class v1.4.0
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_Gutenberg_Block
 */
class PCSBB_Gutenberg_Block {

	/**
	 * Register the block
	 */
	public function register() {
		// Register block category
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );

		// Enqueue editor assets
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );

		// Pre-register public handles so register_block_type can reference them via 'style'/'script'.
		// WP then injects these automatically inside the editor iframe (required for apiVersion 3 /
		// WP 6.9+ iframe canvas). The frontend also receives them via enqueue_public_assets()
		// in class-pcsbb-core.php — WP deduplicates by handle, so no double-load.
		wp_register_style(
			'pcsbb-public',
			PCSBB_PLUGIN_URL . 'assets/css/public.css',
			array( 'dashicons' ),
			PCSBB_VERSION
		);
		wp_register_script(
			'pcsbb-public',
			PCSBB_PLUGIN_URL . 'assets/js/public.js',
			array( 'jquery' ),
			PCSBB_VERSION,
			true
		);

		// Register the block type
		register_block_type(
			'pcsbb/carousel',
			array(
				'render_callback' => array( $this, 'render_block' ),
				'attributes'      => $this->get_block_attributes(),
				'style'           => 'pcsbb-public', // CSS: loaded in editor iframe + frontend
				'script'          => 'pcsbb-public', // JS:  loaded in editor iframe + frontend
			)
		);
	}

	/**
	 * Register custom block category
	 */
	public function register_block_category( $categories, $post ) {
		foreach ( $categories as $category ) {
			if ( $category['slug'] === 'biddut-blocks' ) {
				return $categories;
			}
		}
		array_unshift(
			$categories,
			array(
				'slug'  => 'biddut-blocks',
				'title' => __( 'Biddut Blocks', 'product-carousel-slider-biddut-block' ),
				'icon'  => 'screenoptions',
			)
		);
		return $categories;
	}

	/**
	 * Enqueue editor assets
	 */
	public function enqueue_editor_assets() {
		// Ensure dashicons available in editor
		wp_enqueue_style( 'dashicons' );

		wp_enqueue_script(
			'pcsbb-block-editor',
			PCSBB_PLUGIN_URL . 'assets/js/block.js',
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data', 'wp-server-side-render' ),
			PCSBB_VERSION,
			true
		);

		wp_enqueue_style(
			'pcsbb-block-editor',
			PCSBB_PLUGIN_URL . 'assets/css/block.css',
			array( 'wp-edit-blocks' ),
			PCSBB_VERSION
		);
	}

	/**
	 * Get all block attribute definitions
	 *
	 * @return array
	 */
	private function get_block_attributes() {
		return array(
			// Header
			'showHeader'               => array( 'type' => 'boolean', 'default' => false ),
			'sectionTitle'             => array( 'type' => 'string',  'default' => '' ),
			'sectionSubtitle'          => array( 'type' => 'string',  'default' => '' ),
			'sectionTitleFontSize'     => array( 'type' => 'number',  'default' => 32 ),
			'sectionSubtitleFontSize'  => array( 'type' => 'number',  'default' => 24 ),
			'sectionTitleColor'        => array( 'type' => 'string',  'default' => '#333333' ),
			'sectionSubtitleColor'     => array( 'type' => 'string',  'default' => '#666666' ),

			// Product Typography
			'productTitleFontSize'     => array( 'type' => 'number',  'default' => 16 ),
			'productPriceFontSize'     => array( 'type' => 'number',  'default' => 18 ),
			'productTitleColor'        => array( 'type' => 'string',  'default' => '#333333' ),
			'productTitleHoverColor'   => array( 'type' => 'string',  'default' => '#000000' ),
			'priceColor'               => array( 'type' => 'string',  'default' => '#333333' ),
			'priceHoverColor'          => array( 'type' => 'string',  'default' => '#e74c3c' ),

			// Nav Colors
			'navColor'                 => array( 'type' => 'string',  'default' => '#333333' ),
			'navHoverColor'            => array( 'type' => 'string',  'default' => '#ffffff' ),
			'navBgColor'               => array( 'type' => 'string',  'default' => '#ffffff' ),
			'navBgHoverColor'          => array( 'type' => 'string',  'default' => '#333333' ),

			// Design Variant
			'variant'                  => array( 'type' => 'string',  'default' => 'gallery' ),

			// Mobile Product Width (always centered — full-width 100vw is theme-dependent and unreliable)
			'mobileProductWidth'       => array( 'type' => 'string',  'default' => 'center' ),

			// Responsive Columns
			'columnsDesktop'           => array( 'type' => 'number',  'default' => 4 ),
			'columnsTablet'            => array( 'type' => 'number',  'default' => 3 ),
			'columnsMobile'            => array( 'type' => 'number',  'default' => 2 ),
			'columnsPhone'             => array( 'type' => 'number',  'default' => 1 ),

			// Product gap per device (carousel track gap, must stay in sync with JS)
			'gapDesktop'               => array( 'type' => 'number',  'default' => 24 ),
			'gapTablet'                => array( 'type' => 'number',  'default' => 20 ),
			'gapMobile'                => array( 'type' => 'number',  'default' => 16 ),
			'gapPhone'                 => array( 'type' => 'number',  'default' => 12 ),

			// Mobile vertical gap (used when disableMobileSlider is true)
			'mobileVerticalGap'        => array( 'type' => 'number',  'default' => 20 ),

			// Outer padding per device 
			'outerPadXDesktop'         => array( 'type' => 'number',  'default' => 0 ),
			'outerPadYDesktop'         => array( 'type' => 'number',  'default' => 0 ),
			'outerPadXTablet'          => array( 'type' => 'number',  'default' => 0 ),
			'outerPadYTablet'          => array( 'type' => 'number',  'default' => 0 ),
			'outerPadXMobile'          => array( 'type' => 'number',  'default' => 0 ),
			'outerPadYMobile'          => array( 'type' => 'number',  'default' => 0 ),
			'outerPadXPhone'           => array( 'type' => 'number',  'default' => 0 ),
			'outerPadYPhone'           => array( 'type' => 'number',  'default' => 0 ),

			// Outer margin per device
			'outerMarXDesktop'         => array( 'type' => 'number',  'default' => 0 ),
			'outerMarYDesktop'         => array( 'type' => 'number',  'default' => 0 ),
			'outerMarXTablet'          => array( 'type' => 'number',  'default' => 0 ),
			'outerMarYTablet'          => array( 'type' => 'number',  'default' => 0 ),
			'outerMarXMobile'          => array( 'type' => 'number',  'default' => 0 ),
			'outerMarYMobile'          => array( 'type' => 'number',  'default' => 0 ),
			'outerMarXPhone'           => array( 'type' => 'number',  'default' => 0 ),
			'outerMarYPhone'           => array( 'type' => 'number',  'default' => 0 ),

			// Image Display
			'imageHeightMode'          => array( 'type' => 'string',  'default' => 'natural' ),

			// Carousel Behavior
			'autoplay'                 => array( 'type' => 'boolean', 'default' => false ),
			'autoplayDelay'            => array( 'type' => 'number',  'default' => 5000 ),
			'loop'                     => array( 'type' => 'boolean', 'default' => true ),
			'transitionSpeed'          => array( 'type' => 'number',  'default' => 500 ),
			'disableMobileSlider'      => array( 'type' => 'boolean', 'default' => false ),
			'sliderFitMode'            => array( 'type' => 'string',  'default' => 'peek' ),

			// Navigation
			'showNavigation'           => array( 'type' => 'boolean', 'default' => true ),
			'navigationStyle'          => array( 'type' => 'string',  'default' => 'arrows' ),
			'prevArrowIcon'            => array( 'type' => 'string',  'default' => 'dashicons-arrow-left-alt2' ),
			'nextArrowIcon'            => array( 'type' => 'string',  'default' => 'dashicons-arrow-right-alt2' ),

			// Arrow size controls per device
			'navArrowSizeDesktop'      => array( 'type' => 'number',  'default' => 30 ),
			'navArrowSizeTablet'       => array( 'type' => 'number',  'default' => 30 ),
			'navArrowSizeMobile'       => array( 'type' => 'number',  'default' => 26 ),
			'navArrowSizePhone'        => array( 'type' => 'number',  'default' => 22 ),
			'navIconSizeDesktop'       => array( 'type' => 'number',  'default' => 13 ),
			'navIconSizeTablet'        => array( 'type' => 'number',  'default' => 13 ),
			'navIconSizeMobile'        => array( 'type' => 'number',  'default' => 11 ),
			'navIconSizePhone'         => array( 'type' => 'number',  'default' => 10 ),

			// Hover / Gallery
			'hoverEffect'              => array( 'type' => 'string',  'default' => 'zoom' ),
			'showImageDots'            => array( 'type' => 'boolean', 'default' => false ),
			'showGalleryOnHover'       => array( 'type' => 'boolean', 'default' => true ),

			// Product Query
			'categories'               => array( 'type' => 'array',   'default' => array(), 'items' => array( 'type' => 'string' ) ),
			'limit'                    => array( 'type' => 'number',  'default' => 12 ),
			'orderby'                  => array( 'type' => 'string',  'default' => 'date' ),
			'order'                    => array( 'type' => 'string',  'default' => 'DESC' ),

			// Display Options
			'showTitle'                => array( 'type' => 'boolean', 'default' => true ),
			'showPrice'                => array( 'type' => 'boolean', 'default' => true ),
			'showRating'               => array( 'type' => 'boolean', 'default' => false ),

			// Sale Label
			'showSaleLabel'            => array( 'type' => 'boolean', 'default' => true ),
			'saleLabelText'            => array( 'type' => 'string',  'default' => 'SALE' ),
			'saleLabelPosition'        => array( 'type' => 'string',  'default' => 'top-right' ),
			'saleBadgeBgColor'         => array( 'type' => 'string',  'default' => '#e74c3c' ),
			'saleBadgeTextColor'       => array( 'type' => 'string',  'default' => '#ffffff' ),

			// Out of Stock Label
			'showOutOfStockLabel'      => array( 'type' => 'boolean', 'default' => false ),
			'outOfStockLabelText'      => array( 'type' => 'string',  'default' => 'Sold Out' ),
			'outOfStockLabelPosition'  => array( 'type' => 'string',  'default' => 'top-right' ),
			'outOfStockBgColor'        => array( 'type' => 'string',  'default' => '#555555' ),
			'outOfStockTextColor'      => array( 'type' => 'string',  'default' => '#ffffff' ),

			// View Product Button
			'showProductLink'          => array( 'type' => 'boolean', 'default' => false ),
			'productLinkBgColor'       => array( 'type' => 'string',  'default' => '#333333' ),
			'productLinkTextColor'     => array( 'type' => 'string',  'default' => '#ffffff' ),
			'productLinkHoverBgColor'  => array( 'type' => 'string',  'default' => '#000000' ),
			'productLinkHoverTextColor'=> array( 'type' => 'string',  'default' => '#ffffff' ),
			'productLinkBorderColor'   => array( 'type' => 'string',  'default' => '#333333' ),
			'productLinkIcon'          => array( 'type' => 'string',  'default' => 'dashicons-external' ),
			'productLinkIconPosition'  => array( 'type' => 'string',  'default' => 'right' ),
			'productLinkFullWidth'     => array( 'type' => 'boolean', 'default' => false ),

			// Add to Cart Button
			'showAddToCart'            => array( 'type' => 'boolean', 'default' => false ),
			'addToCartText'            => array( 'type' => 'string',  'default' => 'Add to Cart' ),
			'addToCartBgColor'         => array( 'type' => 'string',  'default' => '#0073aa' ),
			'addToCartTextColor'       => array( 'type' => 'string',  'default' => '#ffffff' ),
			'addToCartHoverBgColor'    => array( 'type' => 'string',  'default' => '#005a87' ),
			'addToCartHoverTextColor'  => array( 'type' => 'string',  'default' => '#ffffff' ),
			'addToCartBorderColor'     => array( 'type' => 'string',  'default' => '#0073aa' ),
			'addToCartIcon'            => array( 'type' => 'string',  'default' => 'dashicons-cart' ),
			'addToCartIconPosition'    => array( 'type' => 'string',  'default' => 'left' ),
			'addToCartFullWidth'       => array( 'type' => 'boolean', 'default' => false ),

			// Button Layout
			'buttonsLayout'            => array( 'type' => 'string',  'default' => 'stacked' ),
			'buttonsOrder'             => array( 'type' => 'string',  'default' => 'cart-first' ),
			'buttonsGap'               => array( 'type' => 'number',  'default' => 10 ),

			// View All Button
			'viewAllFontSize'          => array( 'type' => 'number',  'default' => 14 ),
			'showViewAll'              => array( 'type' => 'boolean', 'default' => false ),
			'viewAllText'              => array( 'type' => 'string',  'default' => 'View All' ),
			'viewAllUrl'               => array( 'type' => 'string',  'default' => '' ),
			'viewAllBgColor'           => array( 'type' => 'string',  'default' => '#333333' ),
			'viewAllTextColor'         => array( 'type' => 'string',  'default' => '#ffffff' ),
			'viewAllHoverBgColor'      => array( 'type' => 'string',  'default' => '#000000' ),
			'viewAllHoverTextColor'    => array( 'type' => 'string',  'default' => '#ffffff' ),
			'viewAllBorderColor'       => array( 'type' => 'string',  'default' => '#333333' ),
		);
	}

	/**
	 * Render the block on the frontend
	 *
	 * @param array $attributes Block attributes.
	 * @return string HTML output.
	 */
	public function render_block( $attributes ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return '<p class="pcsbb-no-products">' . esc_html__( 'WooCommerce is required.', 'product-carousel-slider-biddut-block' ) . '</p>';
		}

		$a = wp_parse_args( $attributes, $this->get_default_attributes() );

		// Generate unique block ID for scoped CSS
		$block_id = 'pcsbb-block-' . wp_unique_id();

		// Get products
		$products = $this->get_products( $a );

		if ( empty( $products ) ) {
			return '<p class="pcsbb-no-products">' . esc_html__( 'No products found.', 'product-carousel-slider-biddut-block' ) . '</p>';
		}

		// Scoped CSS delivery:
		// - Frontend (do_blocks): wp_footer used because wp_kses strips inline <style> tags from
		//   render_callback output, and wp_add_inline_style() silently fails after wp_head() runs.
		// - Editor SSR preview (REST API): wp_footer never fires during a REST request, so the
		//   style is inlined directly. REST_REQUEST is set (true) for the full REST request
		//   duration; available since WP 4.4 — safe for our 5.8+ requirement.
		$scoped_css       = $this->build_scoped_css( $block_id, $a );
		$inline_style_tag = '';
		if ( $scoped_css ) {
			$safe_id  = esc_attr( $block_id );
			$safe_css = wp_strip_all_tags( $scoped_css );
			if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized above
				$inline_style_tag = '<style id="' . $safe_id . '-css">' . $safe_css . '</style>';
			} else {
				add_action( 'wp_footer', static function() use ( $safe_id, $safe_css ) {
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized above
					echo '<style id="' . $safe_id . '-css">' . $safe_css . '</style>' . "\n";
				} );
			}
		}

		ob_start();

		// Inline scoped styles for SSR/REST context (editor preview).
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized above
		echo $inline_style_tag;

		// CSS custom properties for colors (scoped to block ID)
		$css_vars = $this->get_css_vars( $a );

		// Main wrapper
		printf(
			'<div id="%s" class="pcsbb-main-wrapper wp-block-pcsbb-carousel" data-variant="%s" style="%s">',
			esc_attr( $block_id ),
			esc_attr( $a['variant'] ),
			esc_attr( $css_vars )
		);

		// Header
		if ( ! empty( $a['showHeader'] ) ) {
			$this->render_header( $a );
		}

		// Carousel wrapper — all data-* attrs read by public.js
		printf(
			'<div class="pcsbb-carousel-wrapper" 
				data-variant="%s"
				data-columns-desktop="%d"
				data-columns-tablet="%d"
				data-columns-mobile="%d"
				data-columns-phone="%d"
				data-image-height-mode="%s"
				data-autoplay="%s"
				data-autoplay-delay="%d"
				data-loop="%s"
				data-transition-speed="%d"
				data-show-navigation="%s"
				data-navigation-style="%s"
				data-prev-arrow-icon="%s"
				data-next-arrow-icon="%s"
				data-hover-effect="%s"
				data-show-image-dots="%s"
				data-show-gallery-on-hover="%s"
				data-disable-mobile-slider="%s"
				data-mobile-product-width="%s"
				data-slider-fit-mode="%s"
				data-gap-desktop="%d"
				data-gap-tablet="%d"
				data-gap-mobile="%d"
				data-gap-phone="%d"
			>',
			esc_attr( $a['variant'] ),
			intval( $a['columnsDesktop'] ),
			intval( $a['columnsTablet'] ),
			intval( $a['columnsMobile'] ),
			intval( $a['columnsPhone'] ),
			esc_attr( $a['imageHeightMode'] ),
			$a['autoplay'] ? 'true' : 'false',
			intval( $a['autoplayDelay'] ),
			$a['loop'] ? 'true' : 'false',
			intval( $a['transitionSpeed'] ),
			$a['showNavigation'] ? 'true' : 'false',
			esc_attr( $a['navigationStyle'] ),
			esc_attr( $a['prevArrowIcon'] ),
			esc_attr( $a['nextArrowIcon'] ),
			esc_attr( $a['hoverEffect'] ),
			$a['showImageDots'] ? 'true' : 'false',
			$a['showGalleryOnHover'] ? 'true' : 'false',
			$a['disableMobileSlider'] ? 'true' : 'false',
			esc_attr( $a['mobileProductWidth'] ),
			esc_attr( $a['sliderFitMode'] ),
			intval( $a['gapDesktop'] ),
			intval( $a['gapTablet'] ),
			intval( $a['gapMobile'] ),
			intval( $a['gapPhone'] )
		);

		// Product items
		foreach ( $products as $product_id ) {
			$product = wc_get_product( $product_id );
			if ( $product ) {
				$this->render_product_item( $product, $a );
			}
		}

		echo '</div>'; // .pcsbb-carousel-wrapper

		// View All button
		if ( ! empty( $a['showViewAll'] ) ) {
			$this->render_view_all( $a );
		}

		echo '</div>'; // .pcsbb-main-wrapper

		return ob_get_clean();
	}

	/**
	 * Output scoped <style> block for this block instance.
	 * Build scoped CSS string for this block instance.
	 * Returns a plain CSS string — output as a <style> tag inside the block HTML.
	 *
	 * @param string $block_id Unique block HTML ID.
	 * @param array  $a        Block attributes.
	 * @return string CSS string (no <style> tags).
	 */
	private function build_scoped_css( $block_id, $a ) {
		$id = '#' . $block_id; // already sanitized via wp_unique_id()

		$pad_x_d = intval( $a['outerPadXDesktop'] );
		$pad_y_d = intval( $a['outerPadYDesktop'] );
		$pad_x_t = intval( $a['outerPadXTablet'] );
		$pad_y_t = intval( $a['outerPadYTablet'] );
		$pad_x_m = intval( $a['outerPadXMobile'] );
		$pad_y_m = intval( $a['outerPadYMobile'] );
		$pad_x_p = intval( $a['outerPadXPhone'] );
		$pad_y_p = intval( $a['outerPadYPhone'] );

		$mar_x_d = intval( $a['outerMarXDesktop'] );
		$mar_y_d = intval( $a['outerMarYDesktop'] );
		$mar_x_t = intval( $a['outerMarXTablet'] );
		$mar_y_t = intval( $a['outerMarYTablet'] );
		$mar_x_m = intval( $a['outerMarXMobile'] );
		$mar_y_m = intval( $a['outerMarYMobile'] );
		$mar_x_p = intval( $a['outerMarXPhone'] );
		$mar_y_p = intval( $a['outerMarYPhone'] );

		$arr_d = intval( $a['navArrowSizeDesktop'] );
		$arr_t = intval( $a['navArrowSizeTablet'] );
		$arr_m = intval( $a['navArrowSizeMobile'] );
		$arr_p = intval( $a['navArrowSizePhone'] );
		$ico_d = intval( $a['navIconSizeDesktop'] );
		$ico_t = intval( $a['navIconSizeTablet'] );
		$ico_m = intval( $a['navIconSizeMobile'] );
		$ico_p = intval( $a['navIconSizePhone'] );



		$css = '';

		// ── Carousel track gap (overrides global CSS gap at each breakpoint) ──
		// MUST stay in sync with JS calculateDimensions() which also reads data-gap-* attrs.
		$gap_d    = intval( $a['gapDesktop'] );
		$gap_t    = intval( $a['gapTablet'] );
		$gap_m    = intval( $a['gapMobile'] );
		$gap_p    = intval( $a['gapPhone'] );
		$vert_gap = intval( $a['mobileVerticalGap'] );

		$css .= "{$id} .pcsbb-carousel-track{gap:{$gap_d}px;}";
		$css .= "@media(max-width:1279px){{$id} .pcsbb-carousel-track{gap:{$gap_t}px;}}";
		$css .= "@media(max-width:767px){{$id} .pcsbb-carousel-track{gap:{$gap_m}px;}}";
		$css .= "@media(max-width:479px){{$id} .pcsbb-carousel-track{gap:{$gap_p}px;}}";

		// ── Mobile vertical stack gap ──────────────────────────────────────────
		// .pcsbb-mobile-vertical-container only exists when disableMobileSlider=true.
		// Scoped ID rule has higher specificity than public.css class rule, so it always wins.
		$css .= "{$id} .pcsbb-mobile-vertical-container{gap:{$vert_gap}px;}";

		// Desktop base.
		// Padding: straightforward, ID specificity beats class rule.
		// Margin-Y: top/bottom margin works normally on width:100% elements.
		// Margin-X: margin-left/right on a width:100% element causes overflow (total = 100% + 2X).
		//   Instead, use width:calc(100% - 2*X) + margin:auto to shrink the element inward
		//   from both sides symmetrically — correct visual result without overflow.
		$mar_x_d_css = $mar_x_d > 0
			? "width:calc(100% - " . ( $mar_x_d * 2 ) . "px);margin-left:auto;margin-right:auto;"
			: "";
		$css .= "{$id}{" .
			"padding:{$pad_y_d}px {$pad_x_d}px;" .
			"margin-top:{$mar_y_d}px;" .
			"margin-bottom:{$mar_y_d}px;" .
			$mar_x_d_css .
		"}";
		$css .= "{$id} .pcsbb-nav-arrow{width:{$arr_d}px;height:{$arr_d}px;min-width:{$arr_d}px;min-height:{$arr_d}px;max-width:{$arr_d}px;max-height:{$arr_d}px;}";
		$css .= "{$id} .pcsbb-nav-arrow .dashicons{font-size:{$ico_d}px;width:{$ico_d}px!important;height:{$ico_d}px!important;line-height:{$ico_d}px!important;}";

		// Tablet
		$mar_x_t_css = $mar_x_t > 0
			? "width:calc(100% - " . ( $mar_x_t * 2 ) . "px);margin-left:auto;margin-right:auto;"
			: "";
		$css .= "@media(max-width:1279px){" .
			"{$id}{" .
				"padding:{$pad_y_t}px {$pad_x_t}px;" .
				"margin-top:{$mar_y_t}px;" .
				"margin-bottom:{$mar_y_t}px;" .
				$mar_x_t_css .
			"}" .
		"}";
		$css .= "@media(max-width:1279px){{$id} .pcsbb-nav-arrow{width:{$arr_t}px;height:{$arr_t}px;min-width:{$arr_t}px;min-height:{$arr_t}px;max-width:{$arr_t}px;max-height:{$arr_t}px;}}";
		$css .= "@media(max-width:1279px){{$id} .pcsbb-nav-arrow .dashicons{font-size:{$ico_t}px;width:{$ico_t}px!important;height:{$ico_t}px!important;line-height:{$ico_t}px!important;}}";

		// Mobile
		$mar_x_m_css = $mar_x_m > 0
			? "width:calc(100% - " . ( $mar_x_m * 2 ) . "px);margin-left:auto;margin-right:auto;"
			: "";
		$css .= "@media(max-width:767px){" .
			"{$id}{" .
				"padding:{$pad_y_m}px {$pad_x_m}px;" .
				"margin-top:{$mar_y_m}px;" .
				"margin-bottom:{$mar_y_m}px;" .
				$mar_x_m_css .
			"}" .
		"}";
		$css .= "@media(max-width:767px){{$id} .pcsbb-nav-arrow{width:{$arr_m}px;height:{$arr_m}px;min-width:{$arr_m}px;min-height:{$arr_m}px;max-width:{$arr_m}px;max-height:{$arr_m}px;}}";
		$css .= "@media(max-width:767px){{$id} .pcsbb-nav-arrow .dashicons{font-size:{$ico_m}px;width:{$ico_m}px!important;height:{$ico_m}px!important;line-height:{$ico_m}px!important;}}";

		// Phone
		$mar_x_p_css = $mar_x_p > 0
			? "width:calc(100% - " . ( $mar_x_p * 2 ) . "px);margin-left:auto;margin-right:auto;"
			: "";
		$css .= "@media(max-width:479px){" .
			"{$id}{" .
				"padding:{$pad_y_p}px {$pad_x_p}px;" .
				"margin-top:{$mar_y_p}px;" .
				"margin-bottom:{$mar_y_p}px;" .
				$mar_x_p_css .
			"}" .
		"}";
		$css .= "@media(max-width:479px){{$id} .pcsbb-nav-arrow{width:{$arr_p}px;height:{$arr_p}px;min-width:{$arr_p}px;min-height:{$arr_p}px;max-width:{$arr_p}px;max-height:{$arr_p}px;}}";
		$css .= "@media(max-width:479px){{$id} .pcsbb-nav-arrow .dashicons{font-size:{$ico_p}px;width:{$ico_p}px!important;height:{$ico_p}px!important;line-height:{$ico_p}px!important;}}";

		// Mobile vertical layout centering — only applied when mobile slider is disabled.
		// The wrapper reset (width:100%, margin:0) removes the intentional breathing-room
		// negative margin (-6px each side). In carousel/slider mode that breathing room is
		// required so card shadows and borders aren't hard-clipped by overflow:hidden.
		// Resetting it in slider mode makes the wrapper wider than its parent → cards overflow.
		// When disableMobileSlider=true the JS switches to vertical stack mode (no overflow:hidden
		// needed) so the reset is safe to apply there only.
		if ( ! empty( $a['disableMobileSlider'] ) ) {
			$css .= "@media(max-width:767px){" .
				"{$id} .pcsbb-carousel-wrapper{width:100%!important;margin-left:0!important;margin-right:0!important;}" .
				"{$id} .pcsbb-mobile-vertical-container{align-items:center;width:100%;}" .
				"{$id} .pcsbb-mobile-vertical-container .pcsbb-product-item{" .
					"width:100%!important;" .
					"max-width:420px!important;" .
					"margin-left:auto!important;" .
					"margin-right:auto!important;" .
				"}" .
			"}";
		}

		return $css;
	}

	/**
	 * Build CSS custom property string for color variables
	 */
	private function get_css_vars( $a ) {
		return implode( ';', array(
			'--pcsbb-product-title-color:'       . esc_attr( $a['productTitleColor'] ),
			'--pcsbb-product-title-hover-color:' . esc_attr( $a['productTitleHoverColor'] ),
			'--pcsbb-price-color:'               . esc_attr( $a['priceColor'] ),
			'--pcsbb-price-hover-color:'         . esc_attr( $a['priceHoverColor'] ),
			'--pcsbb-nav-color:'                 . esc_attr( $a['navColor'] ),
			'--pcsbb-nav-hover-color:'           . esc_attr( $a['navHoverColor'] ),
			'--pcsbb-nav-bg-color:'              . esc_attr( $a['navBgColor'] ),
			'--pcsbb-nav-bg-hover-color:'        . esc_attr( $a['navBgHoverColor'] ),
			'--pcsbb-section-title-color:'       . esc_attr( $a['sectionTitleColor'] ),
			'--pcsbb-section-subtitle-color:'    . esc_attr( $a['sectionSubtitleColor'] ),
			'--pcsbb-view-all-bg:'               . esc_attr( $a['viewAllBgColor'] ),
			'--pcsbb-view-all-text:'             . esc_attr( $a['viewAllTextColor'] ),
			'--pcsbb-view-all-hover-bg:'         . esc_attr( $a['viewAllHoverBgColor'] ),
			'--pcsbb-view-all-hover-text:'       . esc_attr( $a['viewAllHoverTextColor'] ),
			'--pcsbb-view-all-border:'           . esc_attr( $a['viewAllBorderColor'] ),
			'--pcsbb-view-all-font-size:'        . intval( $a['viewAllFontSize'] ) . 'px',
			'--pcsbb-product-link-bg:'           . esc_attr( $a['productLinkBgColor'] ),
			'--pcsbb-product-link-text:'         . esc_attr( $a['productLinkTextColor'] ),
			'--pcsbb-product-link-hover-bg:'     . esc_attr( $a['productLinkHoverBgColor'] ),
			'--pcsbb-product-link-hover-text:'   . esc_attr( $a['productLinkHoverTextColor'] ),
			'--pcsbb-product-link-border:'       . esc_attr( $a['productLinkBorderColor'] ),
			'--pcsbb-add-to-cart-bg:'            . esc_attr( $a['addToCartBgColor'] ),
			'--pcsbb-add-to-cart-text:'          . esc_attr( $a['addToCartTextColor'] ),
			'--pcsbb-add-to-cart-hover-bg:'      . esc_attr( $a['addToCartHoverBgColor'] ),
			'--pcsbb-add-to-cart-hover-text:'    . esc_attr( $a['addToCartHoverTextColor'] ),
			'--pcsbb-add-to-cart-border:'        . esc_attr( $a['addToCartBorderColor'] ),
		) ) . ';';
	}

	/**
	 * Render the header (title & subtitle)
	 */
	private function render_header( $a ) {
		echo '<div class="pcsbb-header">';
		if ( ! empty( $a['sectionTitle'] ) ) {
			printf(
				'<h2 class="pcsbb-section-title" style="font-size:%dpx">%s</h2>',
				intval( $a['sectionTitleFontSize'] ),
				esc_html( $a['sectionTitle'] )
			);
		}
		if ( ! empty( $a['sectionSubtitle'] ) ) {
			printf(
				'<p class="pcsbb-section-subtitle" style="font-size:%dpx">%s</p>',
				intval( $a['sectionSubtitleFontSize'] ),
				esc_html( $a['sectionSubtitle'] )
			);
		}
		echo '</div>';
	}

	/**
	 * Get products based on block attributes
	 *
	 * @return int[] Array of product IDs
	 */
	private function get_products( $a ) {
		$args = array(
			'status'   => 'publish',
			'limit'    => intval( $a['limit'] ),
			'orderby'  => sanitize_text_field( $a['orderby'] ),
			'order'    => sanitize_text_field( $a['order'] ),
			'return'   => 'ids',
		);

		if ( ! empty( $a['categories'] ) && is_array( $a['categories'] ) ) {
			$args['category'] = array_map( 'sanitize_text_field', $a['categories'] );
		}

		return wc_get_products( $args );
	}

	/**
	 * Render a single product item
	 */
	private function render_product_item( $product, $a ) {
		$product_id   = $product->get_id();
		$product_url  = get_permalink( $product_id );
		$product_name = $product->get_name();
		$is_on_sale   = $product->is_on_sale();
		$is_in_stock  = $product->is_in_stock();

		// Use 'large' (uncropped) so natural mode shows real proportions.
		// 'woocommerce_thumbnail' is square-cropped by default, which breaks natural aspect ratio.
		// CSS object-fit handles cropping/sizing per mode (contain = natural, cover = uniform).
		$img_size     = 'large';
		$main_img_id  = $product->get_image_id();
		$main_img_alt = $main_img_id
			? get_post_meta( $main_img_id, '_wp_attachment_image_alt', true )
			: $product_name;
		if ( ! $main_img_alt ) {
			$main_img_alt = $product_name;
		}

		// Gallery image (second in gallery)
		$gallery_ids     = $product->get_gallery_image_ids();
		$gallery_img_id  = ( ! empty( $gallery_ids ) && $a['showGalleryOnHover'] ) ? $gallery_ids[0] : 0;

		echo '<div class="pcsbb-product-item">';

		// Image wrapper
		echo '<div class="pcsbb-product-image-wrapper">';

		// Sale badge
		if ( ! empty( $a['showSaleLabel'] ) && $is_on_sale ) {
			$sale_pos = sanitize_html_class( $a['saleLabelPosition'] ?? 'top-right' );
			printf(
				'<span class="pcsbb-sale-badge pcsbb-badge-%s" style="background-color:%s;color:%s;">%s</span>',
				esc_attr( $sale_pos ),
				esc_attr( $a['saleBadgeBgColor'] ),
				esc_attr( $a['saleBadgeTextColor'] ),
				esc_html( $a['saleLabelText'] )
			);
		}

		// Out of stock badge
		if ( ! empty( $a['showOutOfStockLabel'] ) && ! $is_in_stock ) {
			$oos_pos = sanitize_html_class( $a['outOfStockLabelPosition'] ?? 'top-right' );
			printf(
				'<span class="pcsbb-sold-out-badge pcsbb-badge-%s" style="background-color:%s;color:%s;">%s</span>',
				esc_attr( $oos_pos ),
				esc_attr( $a['outOfStockBgColor'] ),
				esc_attr( $a['outOfStockTextColor'] ),
				esc_html( $a['outOfStockLabelText'] )
			);
		}

		// Product image link
		printf( '<a href="%s" class="pcsbb-product-image-link" title="%s">',
			esc_url( $product_url ),
			esc_attr( $product_name )
		);

		// Main image — wp_get_attachment_image includes width/height attrs so browser
		// can reserve correct intrinsic space before CSS is applied
		if ( $main_img_id ) {
			echo wp_get_attachment_image(
				$main_img_id,
				$img_size,
				false,
				array(
					'class'   => 'pcsbb-product-image pcsbb-main-image',
					'alt'     => esc_attr( $main_img_alt ),
					'loading' => 'lazy',
				)
			);
		} else {
			// Fallback placeholder
			printf(
				'<img src="%s" alt="%s" class="pcsbb-product-image pcsbb-main-image" loading="lazy">',
				esc_url( wc_placeholder_img_src( $img_size ) ),
				esc_attr( $product_name )
			);
		}

		// Gallery image (hover swap)
		if ( $gallery_img_id ) {
			echo wp_get_attachment_image(
				$gallery_img_id,
				$img_size,
				false,
				array(
					'class'   => 'pcsbb-product-image pcsbb-gallery-image',
					'alt'     => esc_attr( $product_name ),
					'loading' => 'lazy',
				)
			);
		} else {
			// Empty src so CSS [src=""] rule hides it
			echo '<img src="" alt="" class="pcsbb-product-image pcsbb-gallery-image">';
		}

		echo '</a>';

		// Image dots (gallery navigation) — thumbnails are fine for dots (small)
		if ( ! empty( $a['showImageDots'] ) && ! empty( $gallery_ids ) ) {
			echo '<div class="pcsbb-image-dots">';
			$all_images = array_merge( array( $main_img_id ), $gallery_ids );
			foreach ( $all_images as $i => $img_id ) {
				$dot_img = wp_get_attachment_image_url( $img_id, 'woocommerce_thumbnail' );
				if ( $dot_img ) {
					printf(
						'<span class="pcsbb-dot %s" data-image="%s" title="%d"></span>',
						0 === $i ? 'active' : '',
						esc_url( $dot_img ),
						absint( $i + 1 )
					);
				}
			}
			echo '</div>';
		}

		echo '</div>'; // .pcsbb-product-image-wrapper

		// Product info
		echo '<div class="pcsbb-product-info">';

		if ( ! empty( $a['showTitle'] ) ) {
			printf(
				'<h3 class="pcsbb-product-title" style="font-size:%dpx"><a href="%s">%s</a></h3>',
				intval( $a['productTitleFontSize'] ),
				esc_url( $product_url ),
				esc_html( $product_name )
			);
		}

		if ( ! empty( $a['showPrice'] ) ) {
			printf(
				'<div class="pcsbb-product-price" style="font-size:%dpx">%s</div>',
				intval( $a['productPriceFontSize'] ),
				wp_kses_post( $product->get_price_html() )
			);
		}

		if ( ! empty( $a['showRating'] ) ) {
			$avg = $product->get_average_rating();
			if ( $avg > 0 ) {
				printf(
					'<div class="pcsbb-product-rating">%s</div>',
					wp_kses_post( wc_get_rating_html( $avg ) )
				);
			}
		}

		// Buttons
		$show_link = ! empty( $a['showProductLink'] );
		$show_cart = ! empty( $a['showAddToCart'] );

		if ( $show_link || $show_cart ) {
			$layout      = $show_link && $show_cart ? sanitize_text_field( $a['buttonsLayout'] ) : 'stacked';
			$gap         = intval( $a['buttonsGap'] );
			$order       = sanitize_text_field( $a['buttonsOrder'] );
			$layout_cls  = 'pcsbb-buttons-' . $layout;

			printf(
				'<div class="pcsbb-action-buttons %s" style="gap:%dpx">',
				esc_attr( $layout_cls ),
				absint( $gap )
			);

			// Render buttons in correct order
			$cart_btn = '';
			$link_btn = '';

			if ( $show_cart ) {
				$icon_pos  = sanitize_text_field( $a['addToCartIconPosition'] );
				$icon_cls  = sanitize_html_class( $a['addToCartIcon'] );
				$icon_html = $icon_cls ? sprintf( '<span class="dashicons %s"></span>', esc_attr( $icon_cls ) ) : '';
				$btn_text  = esc_html( $a['addToCartText'] );
				$full_cls  = ( ! $show_link && ! empty( $a['addToCartFullWidth'] ) ) ? 'pcsbb-btn-full-width' : ( ! $show_link ? 'pcsbb-btn-auto' : '' );
				$cart_btn  = sprintf(
					'<a href="%s?add-to-cart=%d" data-product-id="%d" class="pcsbb-add-to-cart %s" rel="nofollow">%s%s%s</a>',
					esc_url( wc_get_cart_url() ),
					$product_id,
					$product_id,
					esc_attr( $full_cls ),
					'left' === $icon_pos ? $icon_html : '',
					$btn_text,
					'right' === $icon_pos ? $icon_html : ''
				);
			}

			if ( $show_link ) {
				$icon_pos  = sanitize_text_field( $a['productLinkIconPosition'] );
				$icon_cls  = sanitize_html_class( $a['productLinkIcon'] );
				$icon_html = $icon_cls ? sprintf( '<span class="dashicons %s"></span>', esc_attr( $icon_cls ) ) : '';
				$full_cls  = ( ! $show_cart && ! empty( $a['productLinkFullWidth'] ) ) ? 'pcsbb-btn-full-width' : ( ! $show_cart ? 'pcsbb-btn-auto' : '' );
				$link_btn  = sprintf(
					'<a href="%s" class="pcsbb-product-link %s">%s%s%s</a>',
					esc_url( $product_url ),
					esc_attr( $full_cls ),
					'left' === $icon_pos ? $icon_html : '',
					esc_html__( 'View Product', 'product-carousel-slider-biddut-block' ),
					'right' === $icon_pos ? $icon_html : ''
				);
			}

			if ( 'cart-first' === $order ) {
				echo wp_kses_post( $cart_btn . $link_btn );
			} else {
				echo wp_kses_post( $link_btn . $cart_btn );
			}

			echo '</div>'; // .pcsbb-action-buttons
		}

		echo '</div>'; // .pcsbb-product-info
		echo '</div>'; // .pcsbb-product-item
	}

	/**
	 * Render the View All button
	 */
	private function render_view_all( $a ) {
		if ( empty( $a['viewAllUrl'] ) && empty( $a['viewAllText'] ) ) {
			return;
		}
		 printf(
			'<div class="pcsbb-view-all-wrapper"><a href="%s" class="pcsbb-view-all-button">%s</a></div>',
			! empty( $a['viewAllUrl'] ) ? esc_url( $a['viewAllUrl'] ) : esc_url( wc_get_page_permalink( 'shop' ) ),
			esc_html( $a['viewAllText'] )
		);
	}

	/**
	 * Get default attribute values as a flat array
	 */
	private function get_default_attributes() {
		$defaults = array();
		foreach ( $this->get_block_attributes() as $key => $def ) {
			$defaults[ $key ] = $def['default'] ?? null;
		}
		return $defaults;
	}
}