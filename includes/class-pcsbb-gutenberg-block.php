<?php
/**
 * PCSBB Gutenberg Block Class v1.0.0
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
	 * Constructor
	 */
	public function __construct() {
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );
	}

	/**
	 * Register custom block category
	 *
	 * @param array  $categories Existing block categories.
	 * @param object $post       Current post or editor context.
	 * @return array
	 */
	public function register_block_category( $categories, $post ) {
		// Avoid duplicate: check if 'biddut-blocks' already exists.
		foreach ( $categories as $cat ) {
			if ( 'biddut-blocks' === $cat['slug'] ) {
				return $categories;
			}
		}
		return array_merge(
			array(
				array(
					'slug'  => 'biddut-blocks',
					'title' => __( 'Biddut Blocks', 'product-carousel-slider-biddut-block' ),
					'icon'  => null,
				),
			),
			$categories
		);
	}

	/**
	 * Register block type and its editor assets.
	 */
	public function register() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		// Register editor script — wp-data is required for useSelect (category fetching).
		wp_register_script(
			'pcsbb-block-editor',
			PCSBB_PLUGIN_URL . 'assets/js/block.js',
			array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n', 'wp-data' ),
			PCSBB_VERSION,
			true
		);

		wp_register_style(
			'pcsbb-block-editor-style',
			PCSBB_PLUGIN_URL . 'assets/css/block.css',
			array(),
			PCSBB_VERSION
		);

		wp_register_style(
			'pcsbb-block-style',
			PCSBB_PLUGIN_URL . 'assets/css/public.css',
			array(),
			PCSBB_VERSION
		);

		register_block_type(
			'pcsbb/carousel',
			array(
				'api_version'     => 2,
				'editor_script'   => 'pcsbb-block-editor',
				'editor_style'    => 'pcsbb-block-editor-style',
				'style'           => 'pcsbb-block-style',
				'render_callback' => array( $this, 'render_block' ),
			)
		);
	}

	/**
	 * Render block on frontend.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Inner block content (unused for server-rendered blocks).
	 * @return string
	 */
	public function render_block( $attributes, $content = '' ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return '<div class="pcsbb-notice" style="padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; margin: 20px 0;"><p><strong>' .
				   esc_html__( 'Product Carousel Slider Biddut Block:', 'product-carousel-slider-biddut-block' ) . '</strong> ' .
				   esc_html__( 'This block requires WooCommerce to be installed and activated.', 'product-carousel-slider-biddut-block' ) . ' ' .
				   '<a href="' . esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ) . '">' .
				   esc_html__( 'Install WooCommerce', 'product-carousel-slider-biddut-block' ) . '</a></p></div>';
		}

		// Set defaults with gallery as default variant.
		$attributes = wp_parse_args(
			$attributes,
			array(
				'showHeader'               => false,
				'sectionTitle'             => '',
				'sectionSubtitle'          => '',
				'sectionTitleFontSize'     => 32,
				'sectionSubtitleFontSize'  => 24,
				'productTitleFontSize'     => 16,
				'productPriceFontSize'     => 18,
				'sectionTitleColor'        => '#333',
				'sectionSubtitleColor'     => '#666',
				'productTitleColor'        => '#333',
				'productTitleHoverColor'   => '#000',
				'priceColor'               => '#333',
				'priceHoverColor'          => '#e74c3c',
				'navColor'                 => '#333',
				'navHoverColor'            => '#ffffff',
				'navBgColor'               => '#ffffff',
				'navBgHoverColor'          => '#333',
				'variant'                  => 'gallery',
				'columnsDesktop'           => 4,
				'columnsTablet'            => 3,
				'columnsMobile'            => 2,
				'columnsPhone'             => 1,
				'imageHeightMode'          => 'natural',
				'autoplay'                 => false,
				'autoplayDelay'            => 5000,
				'loop'                     => true,
				'transitionSpeed'          => 500,
				'disableMobileSlider'      => false,
				'showNavigation'           => true,
				'navigationStyle'          => 'arrows',
				'prevArrowIcon'            => 'dashicons-arrow-left-alt2',
				'nextArrowIcon'            => 'dashicons-arrow-right-alt2',
				'hoverEffect'              => 'zoom',
				'showImageDots'            => false,
				'showGalleryOnHover'       => true,
				'categories'               => array(),
				'limit'                    => 12,
				'orderby'                  => 'date',
				'order'                    => 'DESC',
				'showTitle'                => true,
				'showPrice'                => true,
				'showRating'               => false,
				'showSaleLabel'            => true,
				'saleLabelText'            => 'SALE',
				'saleLabelPosition'        => 'top-right',
				'saleBadgeBgColor'         => '#e74c3c',
				'saleBadgeTextColor'       => '#ffffff',
				'showOutOfStockLabel'      => false,
				'outOfStockLabelText'      => 'Sold Out',
				'outOfStockLabelPosition'  => 'top-right',
				'outOfStockBgColor'        => '#555555',
				'outOfStockTextColor'      => '#ffffff',
				'showProductLink'          => false,
				'showAddToCart'            => false,
				'addToCartText'            => __( 'Add to Cart', 'product-carousel-slider-biddut-block' ),
				'addToCartStyle'           => 'default',
				'showViewAll'              => false,
				'viewAllText'              => __( 'View All', 'product-carousel-slider-biddut-block' ),
				'viewAllUrl'               => '',
			)
		);

		// Build query args.
		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => intval( $attributes['limit'] ),
			'post_status'    => 'publish',
		);

		// Category filter — supports multiple categories via tax_query.
		// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		if ( ! empty( $attributes['categories'] ) && is_array( $attributes['categories'] ) ) {
			$args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'slug',
					'terms'    => array_map( 'sanitize_text_field', $attributes['categories'] ),
					'operator' => 'IN',
				),
			);
		}

		// Order by — meta_key is required for price/popularity/rating sorting.
		switch ( $attributes['orderby'] ) {
			case 'price':
				$args['meta_key'] = '_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['orderby']  = 'meta_value_num';
				break;
			case 'popularity':
				$args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['orderby']  = 'meta_value_num';
				break;
			case 'rating':
				$args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$args['orderby']  = 'meta_value_num';
				break;
			case 'title':
				$args['orderby'] = 'title';
				break;
			case 'rand':
				$args['orderby'] = 'rand';
				break;
			case 'date':
			default:
				$args['orderby'] = 'date';
				break;
		}

		$args['order'] = in_array( strtoupper( $attributes['order'] ), array( 'ASC', 'DESC' ), true )
			? strtoupper( $attributes['order'] )
			: 'DESC';

		$query = new WP_Query( $args );

		$carousel_id = 'pcsbb-carousel-' . wp_rand( 1000, 9999 );

		ob_start();
		?>
		<div class="pcsbb-main-wrapper"
			 data-variant="<?php echo esc_attr( $attributes['variant'] ); ?>"
			 style="
			 	--pcsbb-section-title-color: <?php echo esc_attr( $attributes['sectionTitleColor'] ); ?>;
			 	--pcsbb-section-subtitle-color: <?php echo esc_attr( $attributes['sectionSubtitleColor'] ); ?>;
			 	--pcsbb-product-title-color: <?php echo esc_attr( $attributes['productTitleColor'] ); ?>;
			 	--pcsbb-product-title-hover-color: <?php echo esc_attr( $attributes['productTitleHoverColor'] ); ?>;
			 	--pcsbb-price-color: <?php echo esc_attr( $attributes['priceColor'] ); ?>;
			 	--pcsbb-price-hover-color: <?php echo esc_attr( $attributes['priceHoverColor'] ); ?>;
			 	--pcsbb-nav-color: <?php echo esc_attr( $attributes['navColor'] ); ?>;
			 	--pcsbb-nav-hover-color: <?php echo esc_attr( $attributes['navHoverColor'] ); ?>;
			 	--pcsbb-nav-bg-color: <?php echo esc_attr( $attributes['navBgColor'] ); ?>;
			 	--pcsbb-nav-bg-hover-color: <?php echo esc_attr( $attributes['navBgHoverColor'] ); ?>;
			 ">

			<?php if ( ! empty( $attributes['showHeader'] ) && ( ! empty( $attributes['sectionTitle'] ) || ! empty( $attributes['sectionSubtitle'] ) ) ) : ?>
				<div class="pcsbb-header">
					<?php if ( ! empty( $attributes['sectionTitle'] ) ) : ?>
						<h2 class="pcsbb-section-title" style="font-size: <?php echo esc_attr( $attributes['sectionTitleFontSize'] ); ?>px;"><?php echo esc_html( $attributes['sectionTitle'] ); ?></h2>
					<?php endif; ?>

					<?php if ( ! empty( $attributes['sectionSubtitle'] ) ) : ?>
						<h3 class="pcsbb-section-subtitle" style="font-size: <?php echo esc_attr( $attributes['sectionSubtitleFontSize'] ); ?>px;"><?php echo esc_html( $attributes['sectionSubtitle'] ); ?></h3>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<div class="pcsbb-carousel-wrapper"
				id="<?php echo esc_attr( $carousel_id ); ?>"
				data-variant="<?php echo esc_attr( $attributes['variant'] ); ?>"
				data-columns-desktop="<?php echo esc_attr( $attributes['columnsDesktop'] ); ?>"
				data-columns-tablet="<?php echo esc_attr( $attributes['columnsTablet'] ); ?>"
				data-columns-mobile="<?php echo esc_attr( $attributes['columnsMobile'] ); ?>"
				data-columns-phone="<?php echo esc_attr( $attributes['columnsPhone'] ); ?>"
				data-image-height-mode="<?php echo esc_attr( $attributes['imageHeightMode'] ); ?>"
				data-autoplay="<?php echo $attributes['autoplay'] ? 'true' : 'false'; ?>"
				data-autoplay-delay="<?php echo esc_attr( $attributes['autoplayDelay'] ); ?>"
				data-loop="<?php echo $attributes['loop'] ? 'true' : 'false'; ?>"
				data-transition-speed="<?php echo esc_attr( $attributes['transitionSpeed'] ); ?>"
				data-disable-mobile-slider="<?php echo $attributes['disableMobileSlider'] ? 'true' : 'false'; ?>"
				data-show-navigation="<?php echo $attributes['showNavigation'] ? 'true' : 'false'; ?>"
				data-navigation-style="<?php echo esc_attr( $attributes['navigationStyle'] ); ?>"
				data-prev-arrow-icon="<?php echo esc_attr( $attributes['prevArrowIcon'] ); ?>"
				data-next-arrow-icon="<?php echo esc_attr( $attributes['nextArrowIcon'] ); ?>"
				data-hover-effect="<?php echo esc_attr( $attributes['hoverEffect'] ); ?>"
				data-show-image-dots="<?php echo $attributes['showImageDots'] ? 'true' : 'false'; ?>"
				data-show-gallery-on-hover="<?php echo $attributes['showGalleryOnHover'] ? 'true' : 'false'; ?>"
				data-product-title-font-size="<?php echo esc_attr( $attributes['productTitleFontSize'] ); ?>"
				data-product-price-font-size="<?php echo esc_attr( $attributes['productPriceFontSize'] ); ?>">

				<?php
				if ( $query->have_posts() ) {
					while ( $query->have_posts() ) {
						$query->the_post();
						$product = wc_get_product( get_the_ID() );
						if ( $product ) {
							$this->render_product_item( $product, $attributes );
						}
					}
					wp_reset_postdata();
				} else {
					echo '<div class="pcsbb-no-products">' . esc_html__( 'No products found.', 'product-carousel-slider-biddut-block' ) . '</div>';
				}
				?>
			</div>

			<?php if ( ! empty( $attributes['showViewAll'] ) && ! empty( $attributes['viewAllUrl'] ) ) : ?>
				<div class="pcsbb-view-all-wrapper">
					<a href="<?php echo esc_url( $attributes['viewAllUrl'] ); ?>" class="pcsbb-view-all-button">
						<?php echo esc_html( ! empty( $attributes['viewAllText'] ) ? $attributes['viewAllText'] : __( 'View All', 'product-carousel-slider-biddut-block' ) ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render a single product item.
	 *
	 * @param WC_Product $product    WooCommerce product object.
	 * @param array      $attributes Block attributes.
	 */
	private function render_product_item( $product, $attributes ) {
		// Collect product images.
		$images     = array();
		$main_image = get_the_post_thumbnail_url( $product->get_id(), 'full' );

		if ( $main_image ) {
			$images[] = $main_image;
		} else {
			$images[] = wc_placeholder_img_src( 'full' );
		}

		// Append gallery images.
		$gallery_ids = $product->get_gallery_image_ids();
		foreach ( $gallery_ids as $gallery_id ) {
			$gallery_image = wp_get_attachment_url( $gallery_id );
			if ( $gallery_image ) {
				$images[] = $gallery_image;
			}
		}

		$image_url     = $images[0];
		$gallery_image = isset( $images[1] ) ? $images[1] : '';

		// Determine stock status.
		$is_in_stock = (bool) $product->is_in_stock();

		// Robust sale detection.
		// 1. Try WooCommerce native is_on_sale() — handles scheduled sales & all product types.
		$is_on_sale = (bool) $product->is_on_sale();

		// 2. Fallback for simple products: compare prices directly.
		//    Handles edge cases where WC cache may not reflect current state.
		//    Only flags as sale when BOTH prices exist and sale < regular.
		if ( ! $is_on_sale ) {
			$regular_price = (float) $product->get_regular_price();
			$sale_price    = (string) $product->get_sale_price(); // keep as string to detect empty vs zero
			if ( $regular_price > 0 && '' !== $sale_price && (float) $sale_price < $regular_price ) {
				$is_on_sale = true;
			}
		}

		// 3. For variable products: check if ANY child variation is on sale.
		if ( ! $is_on_sale && $product->is_type( 'variable' ) ) {
			foreach ( $product->get_children() as $child_id ) {
				$variation = wc_get_product( $child_id );
				if ( ! $variation ) {
					continue;
				}
				if ( $variation->is_on_sale() ) {
					$is_on_sale = true;
					break;
				}
				$var_regular = (float) $variation->get_regular_price();
				$var_sale    = (string) $variation->get_sale_price();
				if ( $var_regular > 0 && '' !== $var_sale && (float) $var_sale < $var_regular ) {
					$is_on_sale = true;
					break;
				}
			}
		}
		?>
		<div class="pcsbb-product-item"
			 data-variant="<?php echo esc_attr( $attributes['variant'] ); ?>"
			 data-product-id="<?php echo esc_attr( $product->get_id() ); ?>">

			<div class="pcsbb-product-image-wrapper">

				<?php /* Product image link */ ?>
				<a href="<?php echo esc_url( get_permalink( $product->get_id() ) ); ?>" class="pcsbb-product-image-link" tabindex="0" aria-label="<?php echo esc_attr( $product->get_name() ); ?>">
					<img src="<?php echo esc_url( $image_url ); ?>"
						 alt="<?php echo esc_attr( $product->get_name() ); ?>"
						 class="pcsbb-product-image pcsbb-main-image"
						 loading="lazy">
				</a>

				<?php if ( ! empty( $attributes['showGalleryOnHover'] ) && ! empty( $gallery_image ) ) : ?>
					<img src="<?php echo esc_url( $gallery_image ); ?>"
						 alt="<?php echo esc_attr( $product->get_name() ); ?>"
						 class="pcsbb-product-image pcsbb-gallery-image"
						 loading="lazy">
				<?php endif; ?>

				<?php /* Sale badge — always rendered last so it sits on top */ ?>
				<?php if ( true === (bool) $attributes['showSaleLabel'] && $is_on_sale ) : ?>
					<span class="pcsbb-sale-badge pcsbb-badge-<?php echo esc_attr( $attributes['saleLabelPosition'] ); ?>"
					      style="background-color:<?php echo esc_attr( $attributes['saleBadgeBgColor'] ); ?>;color:<?php echo esc_attr( $attributes['saleBadgeTextColor'] ); ?>;">
						<?php echo esc_html( ! empty( $attributes['saleLabelText'] ) ? $attributes['saleLabelText'] : 'SALE' ); ?>
					</span>
				<?php endif; ?>

				<?php /* Out-of-stock badge */ ?>
				<?php if ( true === (bool) $attributes['showOutOfStockLabel'] && ! $is_in_stock ) : ?>
					<span class="pcsbb-sold-out-badge pcsbb-badge-<?php echo esc_attr( $attributes['outOfStockLabelPosition'] ); ?>"
					      style="background-color:<?php echo esc_attr( $attributes['outOfStockBgColor'] ); ?>;color:<?php echo esc_attr( $attributes['outOfStockTextColor'] ); ?>;">
						<?php echo esc_html( ! empty( $attributes['outOfStockLabelText'] ) ? $attributes['outOfStockLabelText'] : 'Sold Out' ); ?>
					</span>
				<?php endif; ?>

				<?php if ( ! empty( $attributes['showImageDots'] ) && count( $images ) > 1 ) : ?>
					<div class="pcsbb-image-dots">
						<?php foreach ( $images as $index => $image ) : ?>
							<span class="pcsbb-dot <?php echo 0 === $index ? 'active' : ''; ?>"
								  data-image="<?php echo esc_url( $image ); ?>"
								  data-index="<?php echo esc_attr( $index ); ?>"
								  role="button"
								  aria-label="<?php
								  	// translators: %d is the image number in the product gallery.
								  	echo esc_attr( sprintf( __( 'View image %d', 'product-carousel-slider-biddut-block' ), $index + 1 ) );
								  ?>"></span>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

			</div><!-- .pcsbb-product-image-wrapper -->

			<div class="pcsbb-product-info">
				<?php if ( ! empty( $attributes['showTitle'] ) ) : ?>
					<h3 class="pcsbb-product-title" style="font-size: <?php echo esc_attr( $attributes['productTitleFontSize'] ); ?>px;">
						<a href="<?php echo esc_url( get_permalink( $product->get_id() ) ); ?>">
							<?php echo esc_html( $product->get_name() ); ?>
						</a>
					</h3>
				<?php endif; ?>

				<?php if ( ! empty( $attributes['showRating'] ) && $product->get_average_rating() > 0 ) : ?>
					<div class="pcsbb-product-rating">
						<?php echo wc_get_rating_html( $product->get_average_rating() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $attributes['showPrice'] ) ) : ?>
					<div class="pcsbb-product-price" style="font-size: <?php echo esc_attr( $attributes['productPriceFontSize'] ); ?>px;">
						<?php echo wp_kses_post( $product->get_price_html() ); ?>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $attributes['showAddToCart'] ) ) : ?>
					<?php $this->render_add_to_cart( $product, $attributes ); ?>
				<?php endif; ?>

				<?php if ( ! empty( $attributes['showProductLink'] ) ) : ?>
					<a href="<?php echo esc_url( get_permalink( $product->get_id() ) ); ?>" class="pcsbb-product-link">
						<?php esc_html_e( 'View Product', 'product-carousel-slider-biddut-block' ); ?>
					</a>
				<?php endif; ?>
			</div><!-- .pcsbb-product-info -->
		</div><!-- .pcsbb-product-item -->
		<?php
	}

	/**
	 * Render add to cart button.
	 *
	 * @param WC_Product $product    WooCommerce product object.
	 * @param array      $attributes Block attributes.
	 */
	private function render_add_to_cart( $product, $attributes ) {
		if ( ! $product->is_purchasable() || ! $product->is_in_stock() ) {
			return;
		}

		$button_text  = ! empty( $attributes['addToCartText'] ) ? $attributes['addToCartText'] : __( 'Add to Cart', 'product-carousel-slider-biddut-block' );
		$button_style = ! empty( $attributes['addToCartStyle'] ) ? $attributes['addToCartStyle'] : 'default';

		$classes   = array( 'pcsbb-add-to-cart', 'button', 'add_to_cart_button', 'ajax_add_to_cart' );
		$classes[] = 'pcsbb-cart-style-' . sanitize_html_class( $button_style );
		?>
		<a href="<?php echo esc_url( $product->add_to_cart_url() ); ?>"
		   data-quantity="1"
		   data-product_id="<?php echo esc_attr( $product->get_id() ); ?>"
		   data-product_sku="<?php echo esc_attr( $product->get_sku() ); ?>"
		   class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>"
		   rel="nofollow">
			<?php echo esc_html( $button_text ); ?>
		</a>
		<?php
	}
}