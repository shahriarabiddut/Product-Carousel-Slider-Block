<?php
/**
 * PCSBB Shortcode Class v1.5.0
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_Shortcode
 */
class PCSBB_Shortcode {

	const TAG = 'pcsbb_carousel';

	/**
	 * Register the shortcode.
	 */
	public function register() {
		add_shortcode( self::TAG, array( $this, 'render' ) );
	}

	/**
	 * [pcsbb_carousel id="123"]
	 *
	 * Renders exactly what the Gutenberg block would render for the same
	 * Slider — same PHP method, same markup, same scoped CSS, no frontend
	 * template of its own to maintain or drift out of sync.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public function render( $atts ) {
		$atts = shortcode_atts( array( 'id' => 0 ), $atts, self::TAG );
		$id   = absint( $atts['id'] );

		if ( ! $id ) {
			return $this->error_message( __( 'Missing Slider ID. Use [pcsbb_carousel id="123"] — copy the shortcode from Carousels → All Sliders.', 'product-carousel-slider-biddut-block' ) );
		}

		$attributes = PCSBB_Slider_CPT::get_attributes( $id );

		if ( null === $attributes ) {
			return $this->error_message( __( 'This Slider no longer exists. Check Carousels → All Sliders for the correct shortcode.', 'product-carousel-slider-biddut-block' ) );
		}

		$block = new PCSBB_Gutenberg_Block();
		return $block->render_block( $attributes );
	}

	/**
	 * Admin-only inline notice; silent no-op for regular visitors.
	 *
	 * @param string $message Message to show admins.
	 * @return string
	 */
	private function error_message( $message ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return '';
		}
		return '<p class="pcsbb-no-products">' . esc_html( $message ) . '</p>';
	}
}
