<?php
/**
 * Plugin Name: SAB Product Carousel Slider for WooCommerce 
 * Plugin URI: https://github.com/shahriarabiddut/Product-Carousel-Slider-Block
 * Description: Beautiful Product Carousel Slider for WooCommerce Block (Biddut Block) with responsive columns, hover effects, navigation, and lots of functionality.
 * Version: 1.5.0
 * Author: Shahriar Ahmed Biddut
 * Author URI: https://github.com/shahriarabiddut
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: product-carousel-slider-biddut-block
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Requires Plugins: woocommerce
 * WC requires at least: 5.0
 * WC tested up to: 9.4
 *
 * @package ProductCarouselSliderBiddutBlock
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants
define( 'PCSBB_VERSION', '1.5.0' );
define( 'PCSBB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PCSBB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PCSBB_PLUGIN_FILE', __FILE__ );
define( 'PCSBB_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Include required files
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-loader.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-gutenberg-block.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-slider-cpt.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-shortcode.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-rest.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-admin.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-slider-admin.php';
require_once PCSBB_PLUGIN_DIR . 'includes/class-pcsbb-core.php';

/**
 * Initialize the plugin
 *
 * @since 1.0.0
 */
function pcsbb_init() {
	try {
		if ( ! class_exists( 'PCSBB_Core' ) ) {
			return;
		}

		$plugin = new PCSBB_Core();
		$plugin->run();
	} catch ( Exception $e ) {
		// Silently fail in production.
	}
}
add_action( 'plugins_loaded', 'pcsbb_init', 10 );

/**
 * Declare WooCommerce HPOS/COT compatibility
 *
 * @since 1.0.0
 */
function pcsbb_declare_hpos_support() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', PCSBB_PLUGIN_FILE, true );
	}
}
add_action( 'before_woocommerce_init', 'pcsbb_declare_hpos_support' );

/**
 * Activation hook
 *
 * @since 1.0.0
 */
function pcsbb_activate() {
	// Check if WooCommerce is active
	if ( ! class_exists( 'WooCommerce' ) ) {
		set_transient( 'pcsbb_activation_notice', true, 5 );
	}
	
	// Clear permalinks
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'pcsbb_activate' );

/**
 * Show activation notice if WooCommerce is not active
 *
 * @since 1.0.0
 */
function pcsbb_activation_admin_notice() {
	if ( get_transient( 'pcsbb_activation_notice' ) ) {
		?>
		<div class="notice notice-warning is-dismissible">
			<p>
				<strong><?php esc_html_e( 'SAB Product Carousel Slider for WooCommerce  activated!', 'product-carousel-slider-biddut-block' ); ?></strong><br>
				<?php esc_html_e( 'This plugin requires WooCommerce to be installed and activated.', 'product-carousel-slider-biddut-block' ); ?>
				<a href="<?php echo esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ); ?>" class="button button-primary" style="margin-left: 10px;">
					<?php esc_html_e( 'Install WooCommerce', 'product-carousel-slider-biddut-block' ); ?>
				</a>
			</p>
		</div>
		<?php
		delete_transient( 'pcsbb_activation_notice' );
	}
}
add_action( 'admin_notices', 'pcsbb_activation_admin_notice' );

/**
 * Deactivation hook
 *
 * @since 1.0.0
 */
function pcsbb_deactivate() {
	delete_transient( 'pcsbb_activation_notice' );
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'pcsbb_deactivate' );