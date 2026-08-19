<?php
/**
 * PCSBB Slider Admin Class v1.5.0
 *
 * Top-level "Carousels" admin menu: All Sliders / New Slider / Slider Default
 * Setting. The New/Edit Slider screen mounts the same settings panel used by
 * the Gutenberg block (assets/js/pcsbb-editor-shared.js) via React, and every
 * saved Slider is available on the frontend either as a shortcode or by
 * selecting it inside the block — no frontend template changes required.
 *
 * @package ProductCarouselSliderBiddutBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PCSBB_Slider_Admin
 */
class PCSBB_Slider_Admin {

	const PARENT_SLUG   = 'pcsbb-carousels';
	const ALL_SLUG      = 'pcsbb-carousels';
	const EDIT_SLUG     = 'pcsbb-carousels-edit';
	const DEFAULTS_SLUG = 'pcsbb-carousels-defaults';
	const CAPABILITY    = 'manage_options';

	/**
	 * Register the "Carousels" top-level menu and its three screens.
	 */
	public function register_admin_menu() {
		add_menu_page(
			__( 'Carousels', 'product-carousel-slider-biddut-block' ),
			__( 'Carousels', 'product-carousel-slider-biddut-block' ),
			self::CAPABILITY,
			self::PARENT_SLUG,
			array( $this, 'render_all_sliders' ),
			'dashicons-slides',
			59
		);

		$all_hook = add_submenu_page(
			self::PARENT_SLUG,
			__( 'All Sliders', 'product-carousel-slider-biddut-block' ),
			__( 'All Sliders', 'product-carousel-slider-biddut-block' ),
			self::CAPABILITY,
			self::ALL_SLUG,
			array( $this, 'render_all_sliders' )
		);

		$edit_hook = add_submenu_page(
			self::PARENT_SLUG,
			__( 'New Slider', 'product-carousel-slider-biddut-block' ),
			__( 'New Slider', 'product-carousel-slider-biddut-block' ),
			self::CAPABILITY,
			self::EDIT_SLUG,
			array( $this, 'render_editor' )
		);

		$defaults_hook = add_submenu_page(
			self::PARENT_SLUG,
			__( 'Slider Default Setting', 'product-carousel-slider-biddut-block' ),
			__( 'Slider Default Setting', 'product-carousel-slider-biddut-block' ),
			self::CAPABILITY,
			self::DEFAULTS_SLUG,
			array( $this, 'render_defaults' )
		);

		foreach ( array( $all_hook, $edit_hook, $defaults_hook ) as $hook ) {
			add_action( 'admin_print_styles-' . $hook, array( $this, 'enqueue_admin_assets' ) );
		}

		// The "New Slider" submenu title is static, so the browser tab still
		// reads "New Slider" while editing an existing one — fix it up here.
		add_filter( 'admin_title', array( $this, 'filter_admin_title' ), 10, 2 );
	}

	/**
	 * Swap the browser tab title to "Edit Slider" when a slider_id is present.
	 *
	 * @param string $admin_title Full formatted title (e.g. "New Slider < Site — WordPress").
	 * @param string $title       Raw page title as registered with add_submenu_page().
	 * @return string
	 */
	public function filter_admin_title( $admin_title, $title ) {
		if ( ! isset( $_GET['page'] ) || self::EDIT_SLUG !== $_GET['page'] || empty( $_GET['slider_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only title swap.
			return $admin_title;
		}
		return str_replace( $title, __( 'Edit Slider', 'product-carousel-slider-biddut-block' ), $admin_title );
	}

	/**
	 * Enqueue the shared editor-panel script + admin app + styles.
	 * Only loaded on the three Carousels screens (see register_admin_menu()).
	 */
	public function enqueue_admin_assets() {
		wp_enqueue_style( 'dashicons' );
		wp_enqueue_style( 'wp-components' );

		// The block's 'style'/'script' handles (registered in
		// PCSBB_Gutenberg_Block::register()) are auto-attached by WP inside
		// the real block editor and on the frontend — but not on a plain
		// admin page like this one, so the Live Preview would otherwise
		// render as bare unstyled HTML. Enqueue them explicitly here.
		wp_enqueue_style( 'pcsbb-public' );
		wp_enqueue_script( 'pcsbb-public' );

		wp_enqueue_script(
			'pcsbb-editor-shared',
			PCSBB_PLUGIN_URL . 'assets/js/pcsbb-editor-shared.js',
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data', 'wp-core-data', 'wp-server-side-render' ),
			PCSBB_VERSION,
			true
		);

		// ServerSideRender requires the block to exist in the client-side block
		// registry (wp.blocks.getBlockType) even when only rendering it via
		// REST — this only happens automatically on post-edit screens, so on
		// these standalone Carousels pages we register it ourselves. This is
		// the exact same script the block editor uses; registration alone
		// doesn't invoke its edit()/save(), so it's safe to load here too.
		wp_enqueue_script(
			'pcsbb-block-editor',
			PCSBB_PLUGIN_URL . 'assets/js/block.js',
			array( 'pcsbb-editor-shared', 'wp-blocks', 'wp-element', 'wp-editor', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data', 'wp-api-fetch', 'wp-server-side-render' ),
			PCSBB_VERSION,
			true
		);

		wp_enqueue_script(
			'pcsbb-admin-editor',
			PCSBB_PLUGIN_URL . 'assets/js/pcsbb-admin-editor.js',
			array( 'pcsbb-editor-shared', 'pcsbb-block-editor', 'wp-element', 'wp-components', 'wp-i18n', 'wp-api-fetch' ),
			PCSBB_VERSION,
			true
		);

		wp_enqueue_style(
			'pcsbb-admin-editor',
			PCSBB_PLUGIN_URL . 'assets/css/pcsbb-admin-editor.css',
			array( 'wp-components' ),
			PCSBB_VERSION
		);
	}

	/**
	 * "All Sliders" — list every saved Slider with its shortcode + actions.
	 */
	public function render_all_sliders() {
		$posts = get_posts(
			array(
				'post_type'      => PCSBB_Slider_CPT::POST_TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);
		?>
		<div class="wrap pcsbb-carousels-wrap">
			<h1 class="wp-heading-inline"><?php esc_html_e( 'All Sliders', 'product-carousel-slider-biddut-block' ); ?></h1>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::EDIT_SLUG ) ); ?>" class="page-title-action">
				<?php esc_html_e( 'New Slider', 'product-carousel-slider-biddut-block' ); ?>
			</a>
			<hr class="wp-header-end">

			<?php if ( empty( $posts ) ) : ?>
				<div class="pcsbb-sliders-table-wrap">
					<p class="pcsbb-sliders-empty">
						<?php esc_html_e( "You haven't created any Sliders yet.", 'product-carousel-slider-biddut-block' ); ?>
						<br>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::EDIT_SLUG ) ); ?>">
							<?php esc_html_e( 'Create your first Slider →', 'product-carousel-slider-biddut-block' ); ?>
						</a>
					</p>
				</div>
			<?php else : ?>
				<div class="pcsbb-sliders-table-wrap">
					<table class="pcsbb-sliders-table">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Name', 'product-carousel-slider-biddut-block' ); ?></th>
								<th><?php esc_html_e( 'Shortcode', 'product-carousel-slider-biddut-block' ); ?></th>
								<th><?php esc_html_e( 'Date', 'product-carousel-slider-biddut-block' ); ?></th>
								<th><?php esc_html_e( 'Actions', 'product-carousel-slider-biddut-block' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( $posts as $post ) :
								$edit_url   = admin_url( 'admin.php?page=' . self::EDIT_SLUG . '&slider_id=' . $post->ID );
								$shortcode  = PCSBB_Slider_CPT::get_shortcode( $post->ID );
								$delete_url = wp_nonce_url(
									admin_url( 'admin-post.php?action=pcsbb_delete_slider&slider_id=' . $post->ID ),
									'pcsbb_delete_slider_' . $post->ID
								);
								?>
								<tr>
									<td data-label="<?php esc_attr_e( 'Name', 'product-carousel-slider-biddut-block' ); ?>">
										<strong><a href="<?php echo esc_url( $edit_url ); ?>"><?php echo esc_html( get_the_title( $post ) ); ?></a></strong>
									</td>
									<td data-label="<?php esc_attr_e( 'Shortcode', 'product-carousel-slider-biddut-block' ); ?>">
										<span class="pcsbb-shortcode-chip"><?php echo esc_html( $shortcode ); ?></span>
										<button
											type="button"
											class="button button-small pcsbb-copy-shortcode"
											data-shortcode="<?php echo esc_attr( $shortcode ); ?>"
										><?php esc_html_e( 'Copy', 'product-carousel-slider-biddut-block' ); ?></button>
									</td>
									<td data-label="<?php esc_attr_e( 'Date', 'product-carousel-slider-biddut-block' ); ?>">
										<?php echo esc_html( get_the_date( '', $post ) ); ?>
									</td>
									<td data-label="<?php esc_attr_e( 'Actions', 'product-carousel-slider-biddut-block' ); ?>">
										<a href="<?php echo esc_url( $edit_url ); ?>"><?php esc_html_e( 'Edit', 'product-carousel-slider-biddut-block' ); ?></a>
										|
										<a href="<?php echo esc_url( $delete_url ); ?>" onclick="return confirm('<?php echo esc_js( __( 'Delete this Slider? This cannot be undone.', 'product-carousel-slider-biddut-block' ) ); ?>');">
											<?php esc_html_e( 'Delete', 'product-carousel-slider-biddut-block' ); ?>
										</a>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
			<?php endif; ?>
		</div>
		<script>
		document.addEventListener( 'click', function ( e ) {
			var btn = e.target.closest && e.target.closest( '.pcsbb-copy-shortcode' );
			if ( ! btn ) {
				return;
			}
			var text = btn.getAttribute( 'data-shortcode' );
			navigator.clipboard.writeText( text ).then( function () {
				var original = btn.textContent;
				btn.textContent = '<?php echo esc_js( __( 'Copied!', 'product-carousel-slider-biddut-block' ) ); ?>';
				setTimeout( function () {
					btn.textContent = original;
				}, 1500 );
			} );
		} );
		</script>
		<?php
	}

	/**
	 * "New Slider" / "Edit Slider" — same screen, same React app as the block's panel.
	 */
	public function render_editor() {
		$slider_id  = isset( $_GET['slider_id'] ) ? absint( $_GET['slider_id'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only page load.
		$title      = '';
		$attributes = PCSBB_Slider_CPT::get_default_settings();

		if ( $slider_id ) {
			$post = get_post( $slider_id );
			if ( ! $post || PCSBB_Slider_CPT::POST_TYPE !== $post->post_type ) {
				$slider_id = 0;
			} else {
				$title      = get_the_title( $post );
				$attributes = PCSBB_Slider_CPT::get_attributes( $slider_id );
			}
		}

		wp_add_inline_script(
			'pcsbb-admin-editor',
			'window.pcsbbAdminEditor = ' . wp_json_encode(
				array(
					'mode'       => 'slider',
					'sliderId'   => $slider_id,
					'title'      => $title,
					'attributes' => $attributes,
					'listUrl'    => admin_url( 'admin.php?page=' . self::ALL_SLUG ),
				)
			) . ';',
			'before'
		);
		?>
		<div class="wrap pcsbb-carousels-wrap">
			<h1><?php echo $slider_id ? esc_html__( 'Edit Slider', 'product-carousel-slider-biddut-block' ) : esc_html__( 'New Slider', 'product-carousel-slider-biddut-block' ); ?></h1>
			<div id="pcsbb-slider-editor-root"><p><?php esc_html_e( 'Loading editor…', 'product-carousel-slider-biddut-block' ); ?></p></div>
		</div>
		<?php
	}

	/**
	 * "Slider Default Setting" — same panel, saved to the site-wide defaults option.
	 */
	public function render_defaults() {
		wp_add_inline_script(
			'pcsbb-admin-editor',
			'window.pcsbbAdminEditor = ' . wp_json_encode(
				array(
					'mode'       => 'defaults',
					'attributes' => PCSBB_Slider_CPT::get_default_settings(),
				)
			) . ';',
			'before'
		);
		?>
		<div class="wrap pcsbb-carousels-wrap">
			<h1><?php esc_html_e( 'Slider Default Setting', 'product-carousel-slider-biddut-block' ); ?></h1>
			<p><?php esc_html_e( 'These settings are applied to every new Slider you create — change one place, start every future Slider from it.', 'product-carousel-slider-biddut-block' ); ?></p>
			<div id="pcsbb-slider-editor-root"><p><?php esc_html_e( 'Loading editor…', 'product-carousel-slider-biddut-block' ); ?></p></div>
		</div>
		<?php
	}

	/**
	 * admin-post.php handler for the "Delete" row action (nonce-protected GET).
	 */
	public function handle_delete() {
		$slider_id = isset( $_GET['slider_id'] ) ? absint( $_GET['slider_id'] ) : 0;
		check_admin_referer( 'pcsbb_delete_slider_' . $slider_id );

		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to do this.', 'product-carousel-slider-biddut-block' ) );
		}

		$post = get_post( $slider_id );
		if ( $post && PCSBB_Slider_CPT::POST_TYPE === $post->post_type ) {
			wp_delete_post( $slider_id, true );
		}

		wp_safe_redirect( admin_url( 'admin.php?page=' . self::ALL_SLUG ) );
		exit;
	}
}
