<?php
/**
 * PCSBB Slider CPT Class v1.5.0
 *
 * Storage layer for the "Carousels" library. Each saved Slider is a
 * `pcsbb_slider` post whose settings live in a single JSON post-meta field —
 * the exact same attribute shape used by the Gutenberg block, so
 * PCSBB_Gutenberg_Block::render_block() can render either one unmodified.
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_Slider_CPT
 */
class PCSBB_Slider_CPT {

	const POST_TYPE  = 'pcsbb_slider';
	const META_KEY    = 'pcsbb_attributes';
	const OPTION_DEFAULTS = 'pcsbb_default_slider_settings';

	/**
	 * Register the CPT. No public UI/archive — it's managed entirely through
	 * the custom "Carousels" admin screens and the REST controller.
	 */
	public function register() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'             => array(
					'name'          => __( 'Carousel Sliders', 'product-carousel-slider-biddut-block' ),
					'singular_name' => __( 'Carousel Slider', 'product-carousel-slider-biddut-block' ),
				),
				'public'              => false,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'supports'            => array( 'title' ),
			)
		);
	}

	/**
	 * Get a Slider's saved attributes, merged over the plugin defaults
	 * (which are themselves overridable via the "Slider Default Settings" page).
	 *
	 * @param int $post_id Slider post ID.
	 * @return array|null Full attribute array, or null if the Slider doesn't exist.
	 */
	public static function get_attributes( $post_id ) {
		$post_id = absint( $post_id );
		$post    = $post_id ? get_post( $post_id ) : null;

		if ( ! $post || self::POST_TYPE !== $post->post_type ) {
			return null;
		}

		$saved = json_decode( (string) get_post_meta( $post_id, self::META_KEY, true ), true );
		if ( ! is_array( $saved ) ) {
			$saved = array();
		}

		$attributes = wp_parse_args( $saved, self::get_default_settings() );

		// Normalize legacy values (e.g. the retired "cover" Image Height Mode)
		// so the REST API, the Carousels admin editor, and the [pcsbb_carousel]
		// shortcode all see the same, current attribute shape as the block.
		return PCSBB_Gutenberg_Block::normalize_attributes( $attributes );
	}

	/**
	 * Save (partial or full) attributes for a Slider.
	 *
	 * @param int   $post_id    Slider post ID.
	 * @param array $attributes Attribute values to store.
	 */
	public static function save_attributes( $post_id, $attributes ) {
		$clean = self::sanitize_attributes( $attributes );
		update_post_meta( $post_id, self::META_KEY, wp_json_encode( $clean ) );
	}

	/**
	 * Site-wide default settings used to seed every newly created Slider.
	 * Falls back to the block's hard-coded defaults for any key not
	 * explicitly overridden on the "Slider Default Settings" page.
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		$overrides = get_option( self::OPTION_DEFAULTS, array() );
		if ( ! is_array( $overrides ) ) {
			$overrides = array();
		}
		$defaults = wp_parse_args( $overrides, PCSBB_Gutenberg_Block::get_default_attributes() );
		return PCSBB_Gutenberg_Block::normalize_attributes( $defaults );
	}

	/**
	 * Save the site-wide default settings.
	 *
	 * @param array $attributes Attribute values to store as defaults.
	 */
	public static function save_default_settings( $attributes ) {
		update_option( self::OPTION_DEFAULTS, self::sanitize_attributes( $attributes ), false );
	}

	/**
	 * Keep only known attribute keys — drops anything not in the schema so a
	 * stale/tampered payload can never inject arbitrary post meta / option data.
	 *
	 * @param array $attributes Raw attribute values.
	 * @return array
	 */
	public static function sanitize_attributes( $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return array();
		}
		$schema = PCSBB_Gutenberg_Block::get_block_attributes();
		$clean  = array();
		foreach ( $schema as $key => $def ) {
			if ( 'sliderId' === $key || ! array_key_exists( $key, $attributes ) ) {
				continue;
			}
			$value = $attributes[ $key ];
			switch ( $def['type'] ) {
				case 'boolean':
					$clean[ $key ] = (bool) $value;
					break;
				case 'number':
					$clean[ $key ] = is_numeric( $value ) ? $value + 0 : $def['default'];
					break;
				case 'array':
					$clean[ $key ] = is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : array();
					break;
				default:
					$clean[ $key ] = wp_kses_post( (string) $value );
			}
		}
		return $clean;
	}

	/**
	 * Build the shortcode string for a Slider.
	 *
	 * @param int $post_id Slider post ID.
	 * @return string
	 */
	public static function get_shortcode( $post_id ) {
		return '[pcsbb_carousel id="' . absint( $post_id ) . '"]';
	}
}