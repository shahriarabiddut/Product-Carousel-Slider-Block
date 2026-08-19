/**
 * SAB Product Carousel Slider for WooCommerce  v1.5.0
 */

(function () {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, useBlockProps } = wp.blockEditor || wp.editor;
  const { PanelBody, SelectControl, RadioControl, Spinner, Button, Notice } =
    wp.components;
  const { __ } = wp.i18n;
  const { createElement: el, Fragment, useState, useEffect } = wp.element;
  const { useSelect, useDispatch } = wp.data;
  const apiFetch = wp.apiFetch;

  registerBlockType("pcsbb/carousel", {
    apiVersion: 3,
    title: "Product Carousel Slider",
    description:
      "SAB Product Carousel Slider for WooCommerce  with Card and Art Gallery styles",
    category: "biddut-blocks",
    icon: "images-alt2",
    keywords: [
      "biddut",
      "biddut blocks",
      "carousel",
      "slider",
      "products",
      "woocommerce",
      "shop",
      "gallery",
    ],
    supports: { align: ["wide", "full"], html: false },
    attributes: {
      // Header
      showHeader: { type: "boolean", default: false },
      sectionTitle: { type: "string", default: "" },
      sectionSubtitle: { type: "string", default: "" },
      sectionTitleFontSize: { type: "number", default: 32 },
      sectionSubtitleFontSize: { type: "number", default: 24 },
      sectionTitleColor: { type: "string", default: "#333333" },
      sectionSubtitleColor: { type: "string", default: "#666666" },

      // Product Typography
      productTitleFontSize: { type: "number", default: 16 },
      productPriceFontSize: { type: "number", default: 18 },
      productTitleColor: { type: "string", default: "#333333" },
      productTitleHoverColor: { type: "string", default: "#000000" },
      priceColor: { type: "string", default: "#333333" },
      priceHoverColor: { type: "string", default: "#e74c3c" },

      // Nav Colors
      navColor: { type: "string", default: "#333333" },
      navHoverColor: { type: "string", default: "#ffffff" },
      navBgColor: { type: "string", default: "#ffffff" },
      navBgHoverColor: { type: "string", default: "#333333" },

      // Design Variant
      variant: { type: "string", default: "gallery" },
      //Mobile product width
      mobileProductWidth: { type: "string", default: "center" },

      // Responsive Columns
      columnsDesktop: { type: "number", default: 4 },
      columnsTablet: { type: "number", default: 3 },
      columnsMobile: { type: "number", default: 2 },
      columnsPhone: { type: "number", default: 1 },

      // Product gap per device (carousel track gap — must stay in sync with public.js)
      gapDesktop: { type: "number", default: 24 },
      gapTablet: { type: "number", default: 20 },
      gapMobile: { type: "number", default: 16 },
      gapPhone: { type: "number", default: 12 },

      // Mobile vertical stack gap (used when disableMobileSlider is true)
      mobileVerticalGap: { type: "number", default: 20 },

      // Outer padding per device
      outerPadXDesktop: { type: "number", default: 0 },
      outerPadYDesktop: { type: "number", default: 0 },
      outerPadXTablet: { type: "number", default: 0 },
      outerPadYTablet: { type: "number", default: 0 },
      outerPadXMobile: { type: "number", default: 0 },
      outerPadYMobile: { type: "number", default: 0 },
      outerPadXPhone: { type: "number", default: 0 },
      outerPadYPhone: { type: "number", default: 0 },
      // Outer margin per device
      outerMarXDesktop: { type: "number", default: 0 },
      outerMarYDesktop: { type: "number", default: 0 },
      outerMarXTablet: { type: "number", default: 0 },
      outerMarYTablet: { type: "number", default: 0 },
      outerMarXMobile: { type: "number", default: 0 },
      outerMarYMobile: { type: "number", default: 0 },
      outerMarXPhone: { type: "number", default: 0 },
      outerMarYPhone: { type: "number", default: 0 },

      // Image Display
      imageHeightMode: { type: "string", default: "natural" },
      imageObjectPosition: { type: "string", default: "center" },
      imageObjectPositionY: { type: "string", default: "center" },
      imageFit: { type: "string", default: "cover" },
      uniformHeightDesktop: { type: "number", default: 450 },
      uniformHeightTablet: { type: "number", default: 400 },
      uniformHeightMobile: { type: "number", default: 350 },
      uniformHeightPhone: { type: "number", default: 250 },

      // Carousel Settings
      autoplay: { type: "boolean", default: false },
      autoplayDelay: { type: "number", default: 5000 },
      loop: { type: "boolean", default: true },
      transitionSpeed: { type: "number", default: 500 },
      disableMobileSlider: { type: "boolean", default: false },
      sliderFitMode: { type: "string", default: "peek" },

      // Navigation
      showNavigation: { type: "boolean", default: true },
      navigationStyle: { type: "string", default: "arrows" },
      prevArrowIcon: { type: "string", default: "dashicons-arrow-left-alt2" },
      nextArrowIcon: { type: "string", default: "dashicons-arrow-right-alt2" },
      //  Arrow size controls per device
      navArrowSizeDesktop: { type: "number", default: 30 },
      navArrowSizeTablet: { type: "number", default: 30 },
      navArrowSizeMobile: { type: "number", default: 26 },
      navArrowSizePhone: { type: "number", default: 22 },
      navIconSizeDesktop: { type: "number", default: 13 },
      navIconSizeTablet: { type: "number", default: 13 },
      navIconSizeMobile: { type: "number", default: 11 },
      navIconSizePhone: { type: "number", default: 10 },
      // Arrow horizontal position (gap from the carousel's own edge)
      navGapLeft: { type: "number", default: 10 },
      navGapRight: { type: "number", default: 10 },

      // Add to Cart / View Product button wrapper position (.pcsbb-action-buttons)
      actionButtonsAutoTop: { type: "boolean", default: true },
      actionButtonsMarginTop: { type: "number", default: 0 },
      actionButtonsMarginRight: { type: "number", default: 0 },
      actionButtonsMarginBottom: { type: "number", default: 0 },
      actionButtonsMarginLeft: { type: "number", default: 0 },
      actionButtonsPaddingTop: { type: "number", default: 10 },
      actionButtonsPaddingRight: { type: "number", default: 0 },
      actionButtonsPaddingBottom: { type: "number", default: 0 },
      actionButtonsPaddingLeft: { type: "number", default: 0 },

      // Hover / Gallery
      hoverEffect: { type: "string", default: "zoom" },
      showImageDots: { type: "boolean", default: false },
      showGalleryOnHover: { type: "boolean", default: true },

      // Product Query
      categories: { type: "array", default: [] },
      limit: { type: "number", default: 12 },
      orderby: { type: "string", default: "date" },
      order: { type: "string", default: "DESC" },

      // Display Options
      showTitle: { type: "boolean", default: true },
      showPrice: { type: "boolean", default: true },
      showRating: { type: "boolean", default: false },

      // Sale Label
      showSaleLabel: { type: "boolean", default: true },
      saleLabelText: { type: "string", default: "SALE" },
      saleLabelPosition: { type: "string", default: "top-right" },
      saleBadgeBgColor: { type: "string", default: "#e74c3c" },
      saleBadgeTextColor: { type: "string", default: "#ffffff" },

      // Out of Stock Label
      showOutOfStockLabel: { type: "boolean", default: false },
      outOfStockLabelText: { type: "string", default: "Sold Out" },
      outOfStockLabelPosition: { type: "string", default: "top-right" },
      outOfStockBgColor: { type: "string", default: "#555555" },
      outOfStockTextColor: { type: "string", default: "#ffffff" },

      // View Product Button
      showProductLink: { type: "boolean", default: false },
      productLinkBgColor: { type: "string", default: "#333333" },
      productLinkTextColor: { type: "string", default: "#ffffff" },
      productLinkHoverBgColor: { type: "string", default: "#000000" },
      productLinkHoverTextColor: { type: "string", default: "#ffffff" },
      productLinkBorderColor: { type: "string", default: "#333333" },
      productLinkIcon: { type: "string", default: "dashicons-external" },
      productLinkIconPosition: { type: "string", default: "right" },
      productLinkFullWidth: { type: "boolean", default: false },

      // Add to Cart Button
      showAddToCart: { type: "boolean", default: false },
      addToCartText: { type: "string", default: "Add to Cart" },
      addToCartBgColor: { type: "string", default: "#0073aa" },
      addToCartTextColor: { type: "string", default: "#ffffff" },
      addToCartHoverBgColor: { type: "string", default: "#005a87" },
      addToCartHoverTextColor: { type: "string", default: "#ffffff" },
      addToCartBorderColor: { type: "string", default: "#0073aa" },
      addToCartIcon: { type: "string", default: "dashicons-cart" },
      addToCartIconPosition: { type: "string", default: "left" },
      addToCartFullWidth: { type: "boolean", default: false },

      // Button Layout (both buttons)
      buttonsLayout: { type: "string", default: "stacked" },
      buttonsOrder: { type: "string", default: "cart-first" },
      buttonsGap: { type: "number", default: 10 },

      // View All Button
      viewAllFontSize: { type: "number", default: 14 },
      showViewAll: { type: "boolean", default: false },
      viewAllText: { type: "string", default: "View All" },
      viewAllUrl: { type: "string", default: "" },
      viewAllBgColor: { type: "string", default: "#333333" },
      viewAllTextColor: { type: "string", default: "#ffffff" },
      viewAllHoverBgColor: { type: "string", default: "#000000" },
      viewAllHoverTextColor: { type: "string", default: "#ffffff" },
      viewAllBorderColor: { type: "string", default: "#333333" },
      viewAllBorderColor: { type: "string", default: "#333333" },

      // Saved Slider reference (backend "Carousels" library) — 0 = use the
      // settings configured directly on this block (legacy/default behavior).
      // > 0 = render the referenced Slider's own saved settings instead.
      sliderId: { type: "number", default: 0 },
    },

    edit: function (props) {
      const { attributes, setAttributes, clientId } = props;
      const blockProps = useBlockProps ? useBlockProps() : {};
      const { selectBlock } = useDispatch("core/block-editor");

      // ── Saved Slider picker ─────────────────────────────────────────
      // Lets the user attach this block to a Slider created in
      // wp-admin → Carousels, instead of (or as well as) configuring it here.
      const [savedSliders, setSavedSliders] = useState(null);
      useEffect(function () {
        if (!apiFetch) return;
        apiFetch({ path: "/pcsbb/v1/sliders" })
          .then(function (list) {
            setSavedSliders(Array.isArray(list) ? list : []);
          })
          .catch(function () {
            setSavedSliders([]);
          });
      }, []);

      const sliderOptions = [
        {
          label: __(
            "— Select a Slider —",
            "product-carousel-slider-biddut-block",
          ),
          value: 0,
        },
        ...(savedSliders || []).map(function (s) {
          return { label: s.title || "(untitled)", value: s.id };
        }),
      ];

      // "custom" = configure this block directly (the original, pre-1.5 behavior —
      // fully preserved for existing content). "saved" = render a Slider built
      // under Carousels instead. Derived from sliderId so older blocks
      // (sliderId always 0) load straight into "custom" unaffected.
      const [source, setSource] = useState(
        attributes.sliderId ? "saved" : "custom",
      );
      const usingSavedSlider = source === "saved";

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            {
              title: __("Saved Slider", "product-carousel-slider-biddut-block"),
              initialOpen: true,
            },
            el(RadioControl, {
              label: __(
                "Slider Source",
                "product-carousel-slider-biddut-block",
              ),
              selected: source,
              options: [
                {
                  label: __(
                    "Configure this block directly",
                    "product-carousel-slider-biddut-block",
                  ),
                  value: "custom",
                },
                {
                  label: __(
                    "Use a Slider from Carousels",
                    "product-carousel-slider-biddut-block",
                  ),
                  value: "saved",
                },
              ],
              onChange: function (value) {
                setSource(value);
                if (value === "custom") {
                  setAttributes({ sliderId: 0 });
                }
              },
            }),
            usingSavedSlider &&
              el(SelectControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: __(
                  "Use a Slider from Carousels",
                  "product-carousel-slider-biddut-block",
                ),
                value: attributes.sliderId || 0,
                options: sliderOptions,
                onChange: function (value) {
                  setAttributes({ sliderId: parseInt(value, 10) || 0 });
                },
                help: __(
                  "Renders that Slider's saved settings. Edit them from Carousels → All Sliders.",
                  "product-carousel-slider-biddut-block",
                ),
              }),
            usingSavedSlider &&
              !!attributes.sliderId &&
              el(
                "a",
                {
                  href:
                    window.pcsbbBlockEditor &&
                    window.pcsbbBlockEditor.slidersAdminUrl
                      ? window.pcsbbBlockEditor.slidersAdminUrl +
                        "&action=edit&slider_id=" +
                        attributes.sliderId
                      : "#",
                  target: "_blank",
                  rel: "noopener",
                  className: "components-button is-secondary is-small",
                  style: { marginTop: "8px" },
                },
                __("Edit this Slider", "product-carousel-slider-biddut-block"),
              ),
          ),
          !usingSavedSlider &&
            el(window.PCSBBShared.Fields, {
              attributes: attributes,
              setAttributes: setAttributes,
            }),
        ),
        el(window.PCSBBShared.LivePreview, {
          attributes: attributes,
          mode: "block",
          clientId: clientId,
          selectBlock: selectBlock,
          blockProps: blockProps,
        }),
      );
    },

    save: function () {
      return null;
    },
  });
})();
