<?php
/**
 * PCSBB Core Class v1.0.0
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_Core
 */
class PCSBB_Core {

	/**
	 * Loader instance
	 *
	 * @var PCSBB_Loader
	 */
	private $loader;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->loader = new PCSBB_Loader();
		$this->define_hooks();
	}

	/**
	 * Define all hooks
	 */
	private function define_hooks() {
		// Register the Gutenberg block (also registers editor scripts via PCSBB_Gutenberg_Block)
		$this->loader->add_action( 'init', $this, 'register_block' );

		// Register the "Carousels" storage layer (CPT) and [pcsbb_carousel] shortcode.
		$this->loader->add_action( 'init', $this, 'register_slider_cpt' );
		$this->loader->add_action( 'init', $this, 'register_shortcode' );

		// REST API for the backend Slider editor + the block's Saved Slider dropdown.
		$this->loader->add_action( 'rest_api_init', $this, 'register_rest_routes' );

		// Only load frontend assets if WooCommerce is active
		if ( $this->is_woocommerce_active() ) {
			$this->loader->add_action( 'wp_enqueue_scripts', $this, 'enqueue_public_assets' );
		}

		// Register admin pages
		$this->loader->add_action( 'admin_menu', $this, 'register_admin_page' );
		$this->loader->add_action( 'admin_menu', $this, 'register_slider_admin_page' );
		$this->loader->add_action( 'admin_post_pcsbb_delete_slider', $this, 'handle_delete_slider' );
	}

	/**
	 * Check if WooCommerce is active
	 *
	 * @return bool
	 */
	private function is_woocommerce_active() {
		return class_exists( 'WooCommerce' );
	}

	/**
	 * Run the plugin
	 */
	public function run() {
		// Show admin notice if WooCommerce is not active
		if ( is_admin() && ! $this->is_woocommerce_active() ) {
			add_action( 'admin_notices', array( $this, 'woocommerce_missing_notice' ) );
		}

		$this->loader->run();
	}

	/**
	 * Show admin notice if WooCommerce is missing
	 */
	public function woocommerce_missing_notice() {
		?>
		<div class="notice notice-warning is-dismissible">
			<p>
				<strong><?php esc_html_e( 'SAB Product Carousel Slider for WooCommerce :', 'product-carousel-slider-biddut-block' ); ?></strong>
				<?php esc_html_e( 'This plugin requires WooCommerce to be installed and activated.', 'product-carousel-slider-biddut-block' ); ?>
				<a href="<?php echo esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ); ?>">
					<?php esc_html_e( 'Install WooCommerce', 'product-carousel-slider-biddut-block' ); ?>
				</a>
			</p>
		</div>
		<?php
	}

	/**
	 * Enqueue public (frontend) assets
	 */
	public function enqueue_public_assets() {
		// Dashicons are bundled with WordPress — enqueue for frontend use
		wp_enqueue_style( 'dashicons' );

		// Plugin CSS
		wp_enqueue_style(
			'pcsbb-public',
			PCSBB_PLUGIN_URL . 'assets/css/public.css',
			array( 'dashicons' ),
			PCSBB_VERSION
		);

		// Plugin JS (with jQuery dependency)
		wp_enqueue_script(
			'pcsbb-public',
			PCSBB_PLUGIN_URL . 'assets/js/public.js',
			array( 'jquery' ),
			PCSBB_VERSION,
			true
		);

		// Localize script for AJAX (if needed in future)
		wp_localize_script(
			'pcsbb-public',
			'pcsbbData',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'pcsbb_nonce' ),
			)
		);
	}

	/**
	 * Register Gutenberg block
	 * Block editor scripts/styles are registered inside PCSBB_Gutenberg_Block::register().
	 */
	public function register_block() {
		$gutenberg = new PCSBB_Gutenberg_Block();
		$gutenberg->register();
	}

	/**
	 * Register admin page
	 */
	public function register_admin_page() {
		$admin = new PCSBB_Admin();
		$admin->register_admin_menu();
	}

	/**
	 * Register the Carousel Slider CPT (storage for saved Sliders).
	 */
	public function register_slider_cpt() {
		$cpt = new PCSBB_Slider_CPT();
		$cpt->register();
	}

	/**
	 * Register the [pcsbb_carousel] shortcode.
	 */
	public function register_shortcode() {
		$shortcode = new PCSBB_Shortcode();
		$shortcode->register();
	}

	/**
	 * Register the pcsbb/v1 REST routes.
	 */
	public function register_rest_routes() {
		$rest = new PCSBB_REST();
		$rest->register_routes();
	}

	/**
	 * Register the "Carousels" admin menu (All Sliders / New Slider / Slider Default Setting).
	 */
	public function register_slider_admin_page() {
		$admin = new PCSBB_Slider_Admin();
		$admin->register_admin_menu();
	}

	/**
	 * admin-post.php handler for deleting a Slider from the All Sliders list.
	 */
	public function handle_delete_slider() {
		$admin = new PCSBB_Slider_Admin();
		$admin->handle_delete();
	}
}