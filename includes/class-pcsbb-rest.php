<?php
/**
 * PCSBB REST Controller v1.5.0
 *
 * Backs the wp-admin "Carousels" Slider editor (assets/js/pcsbb-admin-editor.js)
 * and the block's "Saved Slider" picker (assets/js/block.js).
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_REST
 */
class PCSBB_REST {

	const NAMESPACE_ = 'pcsbb/v1';

	/**
	 * Register all routes.
	 */
	public function register_routes() {
		register_rest_route(
			self::NAMESPACE_,
			'/sliders',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'list_sliders' ),
					'permission_callback' => array( $this, 'can_read' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_slider' ),
					'permission_callback' => array( $this, 'can_edit' ),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_,
			'/sliders/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_slider' ),
					'permission_callback' => array( $this, 'can_edit' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_slider' ),
					'permission_callback' => array( $this, 'can_edit' ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_slider' ),
					'permission_callback' => array( $this, 'can_edit' ),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_,
			'/sliders/(?P<id>\d+)/duplicate',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'duplicate_slider' ),
				'permission_callback' => array( $this, 'can_edit' ),
			)
		);

		register_rest_route(
			self::NAMESPACE_,
			'/default-settings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_default_settings' ),
					'permission_callback' => array( $this, 'can_edit' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'save_default_settings' ),
					'permission_callback' => array( $this, 'can_edit' ),
				),
			)
		);
	}

	/**
	 * Permission: anyone who can see the block editor's Slider dropdown.
	 */
	public function can_read( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Permission: anyone allowed into the Carousels admin screens.
	 */
	public function can_edit( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * GET /sliders — lightweight list for dropdowns + the All Sliders table.
	 */
	public function list_sliders( $request ) {
		$posts = get_posts(
			array(
				'post_type'      => PCSBB_Slider_CPT::POST_TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$out = array();
		foreach ( $posts as $post ) {
			$out[] = array(
				'id'        => $post->ID,
				'title'     => get_the_title( $post ),
				'shortcode' => PCSBB_Slider_CPT::get_shortcode( $post->ID ),
				'date'      => get_the_date( 'Y-m-d', $post ),
				'editUrl'   => admin_url( 'admin.php?page=' . PCSBB_Slider_Admin::EDIT_SLUG . '&slider_id=' . $post->ID ),
			);
		}
		return rest_ensure_response( $out );
	}

	/**
	 * POST /sliders — create a new Slider, seeded from the site defaults.
	 */
	public function create_slider( $request ) {
		$title = sanitize_text_field( $request->get_param( 'title' ) );
		if ( '' === $title ) {
			$title = __( 'New Slider', 'product-carousel-slider-biddut-block' );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => PCSBB_Slider_CPT::POST_TYPE,
				'post_status' => 'publish',
				'post_title'  => $title,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$attributes = $request->get_param( 'attributes' );
		$attributes = is_array( $attributes ) ? $attributes : array();
		$merged     = wp_parse_args( $attributes, PCSBB_Slider_CPT::get_default_settings() );
		PCSBB_Slider_CPT::save_attributes( $post_id, $merged );

		return $this->single_response( $post_id );
	}

	/**
	 * GET /sliders/{id}
	 */
	public function get_slider( $request ) {
		$post_id = absint( $request['id'] );
		$post    = get_post( $post_id );
		if ( ! $post || PCSBB_Slider_CPT::POST_TYPE !== $post->post_type ) {
			return new WP_Error( 'pcsbb_not_found', __( 'Slider not found.', 'product-carousel-slider-biddut-block' ), array( 'status' => 404 ) );
		}
		return $this->single_response( $post_id );
	}

	/**
	 * PUT/PATCH /sliders/{id}
	 */
	public function update_slider( $request ) {
		$post_id = absint( $request['id'] );
		$post    = get_post( $post_id );
		if ( ! $post || PCSBB_Slider_CPT::POST_TYPE !== $post->post_type ) {
			return new WP_Error( 'pcsbb_not_found', __( 'Slider not found.', 'product-carousel-slider-biddut-block' ), array( 'status' => 404 ) );
		}

		$title = $request->get_param( 'title' );
		if ( null !== $title ) {
			wp_update_post(
				array(
					'ID'         => $post_id,
					'post_title' => sanitize_text_field( $title ),
				)
			);
		}

		$attributes = $request->get_param( 'attributes' );
		if ( is_array( $attributes ) ) {
			$existing = PCSBB_Slider_CPT::get_attributes( $post_id );
			PCSBB_Slider_CPT::save_attributes( $post_id, wp_parse_args( $attributes, $existing ) );
		}

		return $this->single_response( $post_id );
	}

	/**
	 * DELETE /sliders/{id}
	 */
	public function delete_slider( $request ) {
		$post_id = absint( $request['id'] );
		$post    = get_post( $post_id );
		if ( ! $post || PCSBB_Slider_CPT::POST_TYPE !== $post->post_type ) {
			return new WP_Error( 'pcsbb_not_found', __( 'Slider not found.', 'product-carousel-slider-biddut-block' ), array( 'status' => 404 ) );
		}
		wp_delete_post( $post_id, true );
		return rest_ensure_response( array( 'deleted' => true, 'id' => $post_id ) );
	}

	/**
	 * POST /sliders/{id}/duplicate
	 */
	public function duplicate_slider( $request ) {
		$post_id = absint( $request['id'] );
		$post    = get_post( $post_id );
		if ( ! $post || PCSBB_Slider_CPT::POST_TYPE !== $post->post_type ) {
			return new WP_Error( 'pcsbb_not_found', __( 'Slider not found.', 'product-carousel-slider-biddut-block' ), array( 'status' => 404 ) );
		}

		$new_id = wp_insert_post(
			array(
				'post_type'   => PCSBB_Slider_CPT::POST_TYPE,
				'post_status' => 'publish',
				/* translators: %s: original slider title */
				'post_title'  => sprintf( __( '%s (Copy)', 'product-carousel-slider-biddut-block' ), get_the_title( $post ) ),
			),
			true
		);
		if ( is_wp_error( $new_id ) ) {
			return $new_id;
		}

		PCSBB_Slider_CPT::save_attributes( $new_id, PCSBB_Slider_CPT::get_attributes( $post_id ) );

		return $this->single_response( $new_id );
	}

	/**
	 * GET /default-settings
	 */
	public function get_default_settings( $request ) {
		return rest_ensure_response(
			array(
				'attributes' => PCSBB_Slider_CPT::get_default_settings(),
			)
		);
	}

	/**
	 * PUT /default-settings
	 */
	public function save_default_settings( $request ) {
		$attributes = $request->get_param( 'attributes' );
		PCSBB_Slider_CPT::save_default_settings( is_array( $attributes ) ? $attributes : array() );
		return rest_ensure_response(
			array(
				'attributes' => PCSBB_Slider_CPT::get_default_settings(),
			)
		);
	}

	/**
	 * Shared single-Slider response shape.
	 *
	 * @param int $post_id Slider post ID.
	 * @return WP_REST_Response
	 */
	private function single_response( $post_id ) {
		return rest_ensure_response(
			array(
				'id'         => $post_id,
				'title'      => get_the_title( $post_id ),
				'shortcode'  => PCSBB_Slider_CPT::get_shortcode( $post_id ),
				'attributes' => PCSBB_Slider_CPT::get_attributes( $post_id ),
			)
		);
	}
}
