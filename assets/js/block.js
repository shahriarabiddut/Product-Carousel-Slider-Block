/**
 * Product Carousel Slider for WooCommerce (Biddut Block) v1.4.0
 */

(function () {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, useBlockProps } = wp.blockEditor || wp.editor;
  const {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    CheckboxControl,
    RadioControl,
    Spinner,
  } = wp.components;
  const { __ } = wp.i18n;
  const {
    createElement: el,
    Fragment,
    useState,
    useEffect,
    useRef,
  } = wp.element;
  const { useSelect, useDispatch } = wp.data;
  const ServerSideRender = wp.serverSideRender;

  registerBlockType("pcsbb/carousel", {
    apiVersion: 3,
    title: "Product Carousel Slider",
    description:
      "Product Carousel Slider for WooCommerce (Biddut Block) with Card and Art Gallery styles",
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
    },

    edit: function (props) {
      const { attributes, setAttributes, clientId } = props;
      const blockProps = useBlockProps ? useBlockProps() : {};
      const { selectBlock } = useDispatch("core/block-editor");

      // ── COLLAPSIBLE STATE ─────────────────────────────────────────
      const [paddingOpen, setPaddingOpen] = useState(false);
      const [marginOpen, setMarginOpen] = useState(false);
      const [arrowSizeOpen, setArrowSizeOpen] = useState(false);

      // ── LIVE PREVIEW: ref + carousel reinit on every SSR refresh ──
      // ServerSideRender fetches the PHP render_callback via REST and swaps
      // the innerHTML when done. A MutationObserver detects that swap and
      // reinitialises PCSBBCarousel on the fresh product HTML.
      const previewRef = useRef(null);
      useEffect(
        function () {
          if (!previewRef.current) return;
          var container = previewRef.current;
          var observer;
          var initTimer;
          var settled = false;

          function tryInit() {
            if (settled) return;
            var $ = window.jQuery;
            if (!$ || !window.PCSBBCarousel) return;
            var wrappers = container.querySelectorAll(
              ".pcsbb-carousel-wrapper",
            );
            if (!wrappers.length) return;
            // Guard: fresh SSR = flat .pcsbb-product-item list, no .pcsbb-carousel-track.
            // If the track already exists the carousel already ran on this DOM; skip.
            var fresh = true;
            wrappers.forEach(function (w) {
              if (w.querySelector(".pcsbb-carousel-track")) fresh = false;
            });
            if (!fresh) return;
            settled = true;
            if (observer) observer.disconnect();
            wrappers.forEach(function (wrapper) {
              var $w = $(wrapper);
              var existing = $w.data("pcsbb-carousel");
              if (existing && typeof existing.destroy === "function") {
                existing.destroy();
                $w.removeData("pcsbb-carousel");
              }
              $w.data("pcsbb-carousel", new window.PCSBBCarousel($w));
            });
          }

          // subtree:true catches SSR replacing innerHTML of its wrapper div
          observer = new MutationObserver(function () {
            clearTimeout(initTimer);
            initTimer = setTimeout(tryInit, 200);
          });
          observer.observe(container, { childList: true, subtree: true });
          // Immediate attempt for cached SSR responses
          initTimer = setTimeout(tryInit, 300);

          return function () {
            clearTimeout(initTimer);
            if (observer) observer.disconnect();
          };
        },
        [attributes],
      );

      const categories = useSelect((select) => {
        const store = select("core");
        if (!store) return [];
        const cats = store.getEntityRecords("taxonomy", "product_cat", {
          per_page: -1,
          hide_empty: false,
        });
        return cats || [];
      }, []);

      const categoryOptions = [
        { label: "All Categories", value: "" },
        ...(categories.map((cat) => ({ label: cat.name, value: cat.slug })) ||
          []),
      ];

      // ── HELPERS ──────────────────────────────────────────────────

      const labelStyle = {
        display: "block",
        fontSize: "11px",
        fontWeight: "500",
        marginBottom: "4px",
        textTransform: "uppercase",
        color: "#757575",
      };

      // Color cell: label + reset on top row, full-width color input below
      const createColorCell = (label, attributeKey, defaultColor) =>
        el(
          "div",
          null,
          el(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              },
            },
            el("label", { style: { ...labelStyle, marginBottom: "0" } }, label),
            el(
              "button",
              {
                type: "button",
                onClick: () => setAttributes({ [attributeKey]: defaultColor }),
                title: "Reset to default",
                style: {
                  fontSize: "10px",
                  color: "#aaa",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: "1",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                },
              },
              "↺",
            ),
          ),
          el("input", {
            type: "color",
            value: attributes[attributeKey] || defaultColor,
            onChange: (e) => setAttributes({ [attributeKey]: e.target.value }),
            style: {
              width: "100%",
              height: "30px",
              padding: "2px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            },
          }),
        );

      // 2-col color grid
      const createColorRow = (pairs) =>
        el(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "10px",
            },
          },
          ...pairs.map(([label, key, def]) => createColorCell(label, key, def)),
        );

      // Number input cell (for use inside grids)
      const createNumberCell = (label, attributeKey, defaultVal, min, max) =>
        el(
          "div",
          null,
          el("label", { style: labelStyle }, label),
          el("input", {
            type: "number",
            value:
              attributes[attributeKey] !== undefined
                ? attributes[attributeKey]
                : defaultVal,
            min,
            max,
            onChange: (e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) setAttributes({ [attributeKey]: val });
            },
            style: {
              width: "100%",
              padding: "5px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "13px",
              boxSizing: "border-box",
            },
          }),
        );

      // Bare number input (no label wrapper — for use in compact 4-col grids)
      const numInput = (attributeKey, defaultVal, min, max) =>
        el("input", {
          type: "number",
          value:
            attributes[attributeKey] !== undefined
              ? attributes[attributeKey]
              : defaultVal,
          min,
          max,
          onChange: (e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) setAttributes({ [attributeKey]: val });
          },
          style: {
            width: "100%",
            padding: "4px 5px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "12px",
            boxSizing: "border-box",
            textAlign: "center",
          },
        });

      // Collapsible section toggle header
      const collapsibleToggle = (label, isOpen, setOpen) =>
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              padding: "7px 10px",
              background: "#f0f0f0",
              borderRadius: "4px",
              marginBottom: isOpen ? "10px" : "0",
              userSelect: "none",
            },
            onClick: () => setOpen(!isOpen),
          },
          el(
            "span",
            { style: { fontSize: "12px", fontWeight: "600", color: "#333" } },
            label,
          ),
          el(
            "span",
            { style: { fontSize: "11px", color: "#666" } },
            isOpen ? "▲" : "▼",
          ),
        );

      // 4-device compact grid (row labels + 4 inputs per row)
      // rows = [ { label, keys: [desk, tab, mob, phone], defaults, min, max } ]
      const deviceGrid4 = (rows) =>
        el(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "28px 1fr 1fr 1fr 1fr",
              gap: "5px",
              alignItems: "center",
              marginBottom: "6px",
            },
          },
          // header row
          el("div", null),
          el(
            "div",
            {
              style: { ...labelStyle, textAlign: "center", marginBottom: "0" },
            },
            "🖥️",
          ),
          el(
            "div",
            {
              style: { ...labelStyle, textAlign: "center", marginBottom: "0" },
            },
            "💻",
          ),
          el(
            "div",
            {
              style: { ...labelStyle, textAlign: "center", marginBottom: "0" },
            },
            "📱",
          ),
          el(
            "div",
            {
              style: { ...labelStyle, textAlign: "center", marginBottom: "0" },
            },
            "📲",
          ),
          // data rows
          ...rows.flatMap(({ label, keys, defaults, min, max }) => [
            el(
              "div",
              {
                style: {
                  ...labelStyle,
                  marginBottom: "0",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#555",
                },
              },
              label,
            ),
            numInput(keys[0], defaults[0], min, max),
            numInput(keys[1], defaults[1], min, max),
            numInput(keys[2], defaults[2], min, max),
            numInput(keys[3], defaults[3], min, max),
          ]),
        );

      // Section divider line
      const divider = el("div", {
        style: { borderTop: "1px solid #e0e0e0", margin: "14px 0 12px" },
      });

      // Subsection heading
      const subheading = (text) =>
        el(
          "strong",
          {
            style: { fontSize: "13px", display: "block", marginBottom: "10px" },
          },
          text,
        );

      // ── PANELS ───────────────────────────────────────────────────

      return el(
        Fragment,
        null,

        el(
          InspectorControls,
          null,

          // ── 1. HEADER ───────────────────────────────────────────
          el(
            PanelBody,
            { title: "Header (Title & Subtitle)", initialOpen: false },
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Enable Header Section",
              checked: attributes.showHeader,
              onChange: (value) => setAttributes({ showHeader: value }),
              help: "Show a title and/or subtitle above the carousel",
            }),
            attributes.showHeader &&
              el(
                Fragment,
                null,
                el(TextControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Section Title",
                  value: attributes.sectionTitle,
                  onChange: (value) => setAttributes({ sectionTitle: value }),
                  placeholder: "e.g., NEW ARRIVALS",
                }),
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "16px",
                    },
                  },
                  createNumberCell(
                    "Font Size (px)",
                    "sectionTitleFontSize",
                    32,
                    12,
                    80,
                  ),
                  createColorCell(
                    "Title Color",
                    "sectionTitleColor",
                    "#333333",
                  ),
                ),
                el(TextControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Section Subtitle",
                  value: attributes.sectionSubtitle,
                  onChange: (value) =>
                    setAttributes({ sectionSubtitle: value }),
                  placeholder: "e.g., Fresh styles for the season",
                }),
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    },
                  },
                  createNumberCell(
                    "Font Size (px)",
                    "sectionSubtitleFontSize",
                    24,
                    10,
                    60,
                  ),
                  createColorCell(
                    "Subtitle Color",
                    "sectionSubtitleColor",
                    "#666666",
                  ),
                ),
              ),
          ),

          // ── 2. DESIGN VARIANT ────────────────────────────────────
          el(
            PanelBody,
            { title: "Design Variant", initialOpen: true },
            el(SelectControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Select Design Style",
              value: attributes.variant,
              options: [
                { label: "Art Gallery (Minimal, centered)", value: "gallery" },
                { label: "Card Style (Bordered, shadowed)", value: "card" },
              ],
              onChange: (value) => setAttributes({ variant: value }),
              help:
                attributes.variant === "gallery"
                  ? "Clean gallery style with centered product info"
                  : "Modern card style with borders and shadows",
            }),
            divider,
          ),

          // ── 3. RESPONSIVE COLUMNS ────────────────────────────────
          el(
            PanelBody,
            { title: "Responsive Columns", initialOpen: false },
            el(
              "p",
              {
                style: {
                  fontSize: "11px",
                  color: "#757575",
                  marginBottom: "8px",
                  marginTop: "0",
                },
              },
              "Set different column counts for each device size",
            ),
            el(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "10px",
                },
              },
              createNumberCell("🖥️ Desktop ", "columnsDesktop", 4, 1, 8),
              createNumberCell("💻 Tablet ", "columnsTablet", 3, 1, 6),
            ),
            el(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                },
              },
              createNumberCell("📱 Mobile ", "columnsMobile", 2, 1, 4),
              createNumberCell("📲 Phone ", "columnsPhone", 1, 1, 3),
            ),

            // ── Product Gap ──────────────────────────────────────────
            divider,
            subheading("Product Gap (px)"),
            el(
              "p",
              {
                style: {
                  fontSize: "11px",
                  color: "#757575",
                  margin: "0 0 8px",
                },
              },
              "Gap between products in the carousel track, per device.",
            ),
            deviceGrid4([
              {
                label: "Gap",
                keys: ["gapDesktop", "gapTablet", "gapMobile", "gapPhone"],
                defaults: [24, 20, 16, 12],
                min: 0,
                max: 80,
              },
            ]),
            divider,
            collapsibleToggle(
              "Outer Padding (px)",
              paddingOpen,
              setPaddingOpen,
            ),
            paddingOpen &&
              el(
                Fragment,
                null,
                el(
                  "p",
                  {
                    style: {
                      fontSize: "11px",
                      color: "#757575",
                      margin: "0 0 8px",
                    },
                  },
                  "X = left & right  |  Y = top & bottom",
                ),
                deviceGrid4([
                  {
                    label: "X",
                    keys: [
                      "outerPadXDesktop",
                      "outerPadXTablet",
                      "outerPadXMobile",
                      "outerPadXPhone",
                    ],
                    defaults: [0, 0, 0, 0],
                    min: 0,
                    max: 200,
                  },
                  {
                    label: "Y",
                    keys: [
                      "outerPadYDesktop",
                      "outerPadYTablet",
                      "outerPadYMobile",
                      "outerPadYPhone",
                    ],
                    defaults: [0, 0, 0, 0],
                    min: 0,
                    max: 200,
                  },
                ]),
              ),

            // ── Outer Margin (collapsible) ───────────────────────────
            el(
              "div",
              { style: { marginTop: paddingOpen ? "10px" : "0" } },
              collapsibleToggle("Outer Margin (px)", marginOpen, setMarginOpen),
            ),
            marginOpen &&
              el(
                Fragment,
                null,
                el(
                  "p",
                  {
                    style: {
                      fontSize: "11px",
                      color: "#757575",
                      margin: "0 0 8px",
                    },
                  },
                  "X = left & right  |  Y = top & bottom",
                ),
                deviceGrid4([
                  {
                    label: "X",
                    keys: [
                      "outerMarXDesktop",
                      "outerMarXTablet",
                      "outerMarXMobile",
                      "outerMarXPhone",
                    ],
                    defaults: [0, 0, 0, 0],
                    min: -200,
                    max: 200,
                  },
                  {
                    label: "Y",
                    keys: [
                      "outerMarYDesktop",
                      "outerMarYTablet",
                      "outerMarYMobile",
                      "outerMarYPhone",
                    ],
                    defaults: [0, 0, 0, 0],
                    min: -200,
                    max: 200,
                  },
                ]),
              ),
          ),

          // ── 4. IMAGE SETTINGS (incl. Hover Effect) ───────────────
          el(
            PanelBody,
            { title: "Image Settings", initialOpen: false },
            el(RadioControl, {
              label: "Image Height Mode",
              selected: attributes.imageHeightMode,
              options: [
                { label: "Natural (preserve aspect ratio)", value: "natural" },
                { label: "Uniform (square crop)", value: "uniform" },
              ],
              onChange: (value) => setAttributes({ imageHeightMode: value }),
              help:
                attributes.imageHeightMode === "natural"
                  ? "Images keep their original proportions"
                  : "All images cropped to uniform square",
            }),
            divider,
            el(SelectControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Image Hover Effect",
              value: attributes.hoverEffect,
              options: [
                { label: "Zoom", value: "zoom" },
                { label: "Lift (elevate card)", value: "lift" },
                { label: "Glow (shadow)", value: "glow" },
                { label: "None", value: "none" },
              ],
              onChange: (value) => setAttributes({ hoverEffect: value }),
            }),
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Gallery Image on Hover",
              checked: attributes.showGalleryOnHover,
              onChange: (value) => setAttributes({ showGalleryOnHover: value }),
              help: "Switch to second product image on hover (if available)",
            }),
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Image Dots",
              checked: attributes.showImageDots,
              onChange: (value) => setAttributes({ showImageDots: value }),
              help: "Display navigation dots for product images",
            }),
          ),

          // ── 5. CAROUSEL BEHAVIOR ─────────────────────────────────
          el(
            PanelBody,
            { title: "Carousel Behavior", initialOpen: false },
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Enable Autoplay",
              checked: attributes.autoplay,
              onChange: (value) => setAttributes({ autoplay: value }),
            }),
            attributes.autoplay &&
              el(RangeControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: "Autoplay Delay (ms)",
                value: attributes.autoplayDelay,
                onChange: (value) => setAttributes({ autoplayDelay: value }),
                min: 1000,
                max: 10000,
                step: 500,
              }),
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Loop Carousel",
              checked: attributes.loop,
              onChange: (value) => setAttributes({ loop: value }),
              help: "Return to first slide after last slide",
            }),
            attributes.loop &&
              el(RangeControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: "Transition Speed (ms)",
                value: attributes.transitionSpeed,
                onChange: (value) => setAttributes({ transitionSpeed: value }),
                min: 200,
                max: 2000,
                step: 100,
              }),
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Disable Mobile Slider",
              checked: attributes.disableMobileSlider,
              onChange: (value) =>
                setAttributes({ disableMobileSlider: value }),
              help: "Show vertical list on mobile (<768px) instead of carousel",
            }),
            attributes.disableMobileSlider &&
              el(RangeControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: "Mobile Vertical Gap (px)",
                value: attributes.mobileVerticalGap,
                onChange: (value) =>
                  setAttributes({ mobileVerticalGap: value }),
                min: 0,
                max: 80,
                step: 2,
                help: "Gap between products in the vertical stack",
              }),
            divider,
            el(
              "p",
              { style: { ...labelStyle, marginBottom: "6px" } },
              "Slide Display Mode",
            ),
            el(RadioControl, {
              selected: attributes.sliderFitMode,
              options: [
                {
                  label:
                    "Peek — shows a sliver of the next slide (current default)",
                  value: "peek",
                },
                {
                  label:
                    "Fit — selected column count fills the full slider width exactly",
                  value: "fit",
                },
              ],
              onChange: (value) => setAttributes({ sliderFitMode: value }),
              help: "Peek entices users to swipe. Fit shows clean full-width slides.",
            }),
          ),

          // ── 6. NAVIGATION ────────────────────────────────────────
          el(
            PanelBody,
            { title: "Navigation", initialOpen: false },
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Navigation",
              checked: attributes.showNavigation,
              onChange: (value) => setAttributes({ showNavigation: value }),
            }),
            attributes.showNavigation &&
              el(
                Fragment,
                null,
                el(SelectControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Navigation Style",
                  value: attributes.navigationStyle,
                  options: [
                    { label: "Arrows Only", value: "arrows" },
                    { label: "Dots Only", value: "dots" },
                    { label: "Both Arrows & Dots", value: "both" },
                  ],
                  onChange: (value) =>
                    setAttributes({ navigationStyle: value }),
                }),
                (attributes.navigationStyle === "arrows" ||
                  attributes.navigationStyle === "both") &&
                  el(
                    Fragment,
                    null,
                    el(
                      "p",
                      { style: { fontSize: "12px", margin: "8px 0 4px" } },
                      "Arrow Icons (Dashicons)",
                    ),
                    el(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                        },
                      },
                      el(TextControl, {
                        __next40pxDefaultSize: true,
                        __nextHasNoMarginBottom: true,
                        label: "Previous",
                        value: attributes.prevArrowIcon,
                        onChange: (value) =>
                          setAttributes({ prevArrowIcon: value }),
                        placeholder: "dashicons-arrow-left-alt2",
                      }),
                      el(TextControl, {
                        __next40pxDefaultSize: true,
                        __nextHasNoMarginBottom: true,
                        label: "Next",
                        value: attributes.nextArrowIcon,
                        onChange: (value) =>
                          setAttributes({ nextArrowIcon: value }),
                        placeholder: "dashicons-arrow-right-alt2",
                      }),
                    ),
                    el(
                      "p",
                      {
                        style: {
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "8px",
                        },
                      },
                      "e.g. dashicons-chevron-left, dashicons-arrow-left-alt2",
                    ),
                    divider,
                    subheading("Arrow Colors"),
                    createColorRow([
                      ["Arrow", "navColor", "#333333"],
                      ["Arrow Hover", "navHoverColor", "#ffffff"],
                    ]),
                    createColorRow([
                      ["Background", "navBgColor", "#ffffff"],
                      ["BG Hover", "navBgHoverColor", "#333333"],
                    ]),
                    divider,
                    // Arrow size controls per device (collapsible)
                    collapsibleToggle(
                      "Arrow Size (px) — per Device",
                      arrowSizeOpen,
                      setArrowSizeOpen,
                    ),
                    arrowSizeOpen &&
                      el(
                        Fragment,
                        null,
                        el(
                          "p",
                          {
                            style: {
                              fontSize: "11px",
                              color: "#757575",
                              margin: "0 0 8px",
                            },
                          },
                          "Btn = circle diameter  |  Icon = dashicon size inside",
                        ),
                        deviceGrid4([
                          {
                            label: "Btn",
                            keys: [
                              "navArrowSizeDesktop",
                              "navArrowSizeTablet",
                              "navArrowSizeMobile",
                              "navArrowSizePhone",
                            ],
                            defaults: [30, 30, 26, 22],
                            min: 14,
                            max: 60,
                          },
                          {
                            label: "Icon",
                            keys: [
                              "navIconSizeDesktop",
                              "navIconSizeTablet",
                              "navIconSizeMobile",
                              "navIconSizePhone",
                            ],
                            defaults: [13, 13, 11, 10],
                            min: 6,
                            max: 30,
                          },
                        ]),
                      ),
                  ),
              ),
          ),

          // ── 7. PRODUCT QUERY ─────────────────────────────────────
          el(
            PanelBody,
            { title: "Product Query", initialOpen: false },
            el(
              "p",
              {
                style: { fontSize: "12px", color: "#666", marginBottom: "8px" },
              },
              "Select multiple categories to display products from",
            ),
            el(
              "div",
              {
                style: {
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "8px",
                  marginBottom: "12px",
                },
              },
              categoryOptions
                .filter((cat) => cat.value !== "")
                .map((cat) =>
                  el(CheckboxControl, {
                    __nextHasNoMarginBottom: true,
                    key: cat.value,
                    label: cat.label,
                    checked:
                      attributes.categories &&
                      attributes.categories.includes(cat.value),
                    onChange: (checked) => {
                      const newCategories = checked
                        ? [...(attributes.categories || []), cat.value]
                        : (attributes.categories || []).filter(
                            (c) => c !== cat.value,
                          );
                      setAttributes({ categories: newCategories });
                    },
                  }),
                ),
            ),
            el(RangeControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Number of Products",
              value: attributes.limit,
              onChange: (value) => setAttributes({ limit: value }),
              min: 1,
              max: 50,
            }),
            el(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "12px",
                  marginTop: "8px",
                },
              },
              el(
                "div",
                null,
                el(SelectControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Order By",
                  value: attributes.orderby,
                  options: [
                    { label: "Date", value: "date" },
                    { label: "Title", value: "title" },
                    { label: "Price", value: "price" },
                    { label: "Popularity", value: "popularity" },
                    { label: "Rating", value: "rating" },
                    { label: "Random", value: "rand" },
                  ],
                  onChange: (value) => setAttributes({ orderby: value }),
                }),
              ),
              el(
                "div",
                null,
                el(SelectControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Order",
                  value: attributes.order,
                  options: [
                    { label: "DESC", value: "DESC" },
                    { label: "ASC", value: "ASC" },
                  ],
                  onChange: (value) => setAttributes({ order: value }),
                }),
              ),
            ),
          ),

          // ── 8. DISPLAY OPTIONS ───────────────────────────────────
          el(
            PanelBody,
            { title: "Display Options", initialOpen: false },

            // Product Title
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Product Title",
              checked: attributes.showTitle,
              onChange: (value) => setAttributes({ showTitle: value }),
            }),
            attributes.showTitle &&
              el(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "4px",
                  },
                },
                createNumberCell(
                  "Font Size (px)",
                  "productTitleFontSize",
                  16,
                  10,
                  40,
                ),
                createColorCell("Title Color", "productTitleColor", "#333333"),
                el("div", null), // empty first col
                createColorCell(
                  "Hover Color",
                  "productTitleHoverColor",
                  "#000000",
                ),
              ),

            divider,

            // Product Price
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Price",
              checked: attributes.showPrice,
              onChange: (value) => setAttributes({ showPrice: value }),
            }),
            attributes.showPrice &&
              el(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "4px",
                  },
                },
                createNumberCell(
                  "Font Size (px)",
                  "productPriceFontSize",
                  18,
                  10,
                  40,
                ),
                createColorCell("Price Color", "priceColor", "#333333"),
                el("div", null),
                createColorCell("Hover Color", "priceHoverColor", "#e74c3c"),
              ),

            divider,

            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Rating",
              checked: attributes.showRating,
              onChange: (value) => setAttributes({ showRating: value }),
            }),

            divider,

            // Sale Label
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Sale Label",
              checked: attributes.showSaleLabel,
              onChange: (value) => setAttributes({ showSaleLabel: value }),
              help: "Sale Price Must be Available!",
            }),
            attributes.showSaleLabel &&
              el(
                Fragment,
                null,
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "8px",
                    },
                  },
                  el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "Sale Text",
                    value: attributes.saleLabelText || "SALE",
                    onChange: (value) =>
                      setAttributes({ saleLabelText: value }),
                    placeholder: "SALE",
                  }),
                  el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "Position",
                    value: attributes.saleLabelPosition || "top-right",
                    options: [
                      { label: "Top Right", value: "top-right" },
                      { label: "Top Left", value: "top-left" },
                      { label: "Bottom Right", value: "bottom-right" },
                      { label: "Bottom Left", value: "bottom-left" },
                    ],
                    onChange: (value) =>
                      setAttributes({ saleLabelPosition: value }),
                  }),
                ),
                createColorRow([
                  ["Badge BG", "saleBadgeBgColor", "#e74c3c"],
                  ["Badge Text", "saleBadgeTextColor", "#ffffff"],
                ]),
              ),

            divider,

            // Sold Out Label
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Sold Out Label",
              checked: attributes.showOutOfStockLabel || false,
              onChange: (value) =>
                setAttributes({ showOutOfStockLabel: value }),
              help: "Show badge when a product is out of stock",
            }),
            attributes.showOutOfStockLabel &&
              el(
                Fragment,
                null,
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "8px",
                    },
                  },
                  el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "Sold Out Text",
                    value: attributes.outOfStockLabelText || "Sold Out",
                    onChange: (value) =>
                      setAttributes({ outOfStockLabelText: value }),
                    placeholder: "Sold Out",
                  }),
                  el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "Position",
                    value: attributes.outOfStockLabelPosition || "top-right",
                    options: [
                      { label: "Top Right", value: "top-right" },
                      { label: "Top Left", value: "top-left" },
                      { label: "Bottom Right", value: "bottom-right" },
                      { label: "Bottom Left", value: "bottom-left" },
                    ],
                    onChange: (value) =>
                      setAttributes({ outOfStockLabelPosition: value }),
                  }),
                ),
                createColorRow([
                  ["Badge BG", "outOfStockBgColor", "#555555"],
                  ["Badge Text", "outOfStockTextColor", "#ffffff"],
                ]),
              ),

            divider,

            // ── View Product Button ──────────────────────────────────
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show View Product Button",
              checked: attributes.showProductLink,
              onChange: (value) => setAttributes({ showProductLink: value }),
            }),
            attributes.showProductLink &&
              el(
                "div",
                { style: { paddingLeft: "16px", marginTop: "8px" } },
                subheading("Button Styling"),
                createColorRow([
                  ["Background", "productLinkBgColor", "#333333"],
                  ["Text", "productLinkTextColor", "#ffffff"],
                ]),
                createColorRow([
                  ["Hover BG", "productLinkHoverBgColor", "#000000"],
                  ["Hover Text", "productLinkHoverTextColor", "#ffffff"],
                ]),
                createColorRow([
                  ["Border", "productLinkBorderColor", "#333333"],
                ]),
                el("div", {
                  style: { borderTop: "1px solid #e0e0e0", margin: "10px 0" },
                }),
                el(TextControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Icon (Dashicon class)",
                  value: attributes.productLinkIcon,
                  onChange: (value) =>
                    setAttributes({ productLinkIcon: value }),
                  placeholder: "dashicons-external",
                  help: "e.g., dashicons-external, dashicons-arrow-right-alt2",
                }),
                // Icon Position: only when both enabled + inline layout
                attributes.showAddToCart &&
                  attributes.buttonsLayout === "inline" &&
                  el(RadioControl, {
                    label: "Icon Position",
                    selected: attributes.productLinkIconPosition,
                    options: [
                      { label: "Left", value: "left" },
                      { label: "Right", value: "right" },
                    ],
                    onChange: (value) =>
                      setAttributes({ productLinkIconPosition: value }),
                  }),
                // Single-button full-width toggle (only when other button is OFF)
                !attributes.showAddToCart &&
                  el(ToggleControl, {
                    __nextHasNoMarginBottom: true,
                    label: "Full Width Button",
                    checked: attributes.productLinkFullWidth,
                    onChange: (value) =>
                      setAttributes({ productLinkFullWidth: value }),
                    help: "Stretch button to full available width",
                  }),
              ),

            divider,

            // ── Add to Cart Button ───────────────────────────────────
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show Add to Cart Button",
              checked: attributes.showAddToCart,
              onChange: (value) => setAttributes({ showAddToCart: value }),
            }),
            attributes.showAddToCart &&
              el(
                Fragment,
                null,
                el(TextControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Button Text",
                  value: attributes.addToCartText,
                  onChange: (value) => setAttributes({ addToCartText: value }),
                  placeholder: "Add to Cart",
                }),
                el(
                  "div",
                  { style: { paddingLeft: "16px", marginTop: "8px" } },
                  subheading("Button Styling"),
                  createColorRow([
                    ["Background", "addToCartBgColor", "#0073aa"],
                    ["Text", "addToCartTextColor", "#ffffff"],
                  ]),
                  createColorRow([
                    ["Hover BG", "addToCartHoverBgColor", "#005a87"],
                    ["Hover Text", "addToCartHoverTextColor", "#ffffff"],
                  ]),
                  createColorRow([
                    ["Border", "addToCartBorderColor", "#0073aa"],
                  ]),
                  el("div", {
                    style: { borderTop: "1px solid #e0e0e0", margin: "10px 0" },
                  }),
                  el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "Icon (Dashicon class)",
                    value: attributes.addToCartIcon,
                    onChange: (value) =>
                      setAttributes({ addToCartIcon: value }),
                    placeholder: "dashicons-cart",
                    help: "e.g., dashicons-cart, dashicons-plus",
                  }),
                  // Icon Position: only when both enabled + inline layout
                  attributes.showProductLink &&
                    attributes.buttonsLayout === "inline" &&
                    el(RadioControl, {
                      label: "Icon Position",
                      selected: attributes.addToCartIconPosition,
                      options: [
                        { label: "Left", value: "left" },
                        { label: "Right", value: "right" },
                      ],
                      onChange: (value) =>
                        setAttributes({ addToCartIconPosition: value }),
                    }),
                  // Single-button full-width toggle (only when other button is OFF)
                  !attributes.showProductLink &&
                    el(ToggleControl, {
                      __nextHasNoMarginBottom: true,
                      label: "Full Width Button",
                      checked: attributes.addToCartFullWidth,
                      onChange: (value) =>
                        setAttributes({ addToCartFullWidth: value }),
                      help: "Stretch button to full available width",
                    }),
                ),
              ),

            // ── Button Layout (both enabled) ─────────────────────────
            attributes.showAddToCart &&
              attributes.showProductLink &&
              el(
                Fragment,
                null,
                divider,
                subheading("Button Layout"),
                el(RadioControl, {
                  label: "Layout Style",
                  selected: attributes.buttonsLayout,
                  options: [
                    { label: "Stacked (Full Width Each)", value: "stacked" },
                    { label: "Inline (Share Space)", value: "inline" },
                  ],
                  onChange: (value) => {
                    const updates = { buttonsLayout: value };
                    if (value === "stacked") {
                      updates.addToCartFullWidth = true;
                      updates.productLinkFullWidth = true;
                    }
                    setAttributes(updates);
                  },
                }),
                el(RadioControl, {
                  label: "Button Order",
                  selected: attributes.buttonsOrder,
                  options: [
                    { label: "Add to Cart First", value: "cart-first" },
                    { label: "View Product First", value: "link-first" },
                  ],
                  onChange: (value) => setAttributes({ buttonsOrder: value }),
                }),
                el(
                  "div",
                  null,
                  el(
                    "label",
                    { style: labelStyle },
                    "Gap Between Buttons (px)",
                  ),
                  el("input", {
                    type: "number",
                    value: attributes.buttonsGap,
                    min: 0,
                    max: 60,
                    onChange: (e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setAttributes({ buttonsGap: val });
                    },
                    style: {
                      width: "100%",
                      padding: "5px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      marginBottom: "12px",
                    },
                  }),
                ),
              ),

            divider,

            // ── View All Button ──────────────────────────────────────
            el(ToggleControl, {
              __nextHasNoMarginBottom: true,
              label: "Show View All Button",
              checked: attributes.showViewAll,
              onChange: (value) => setAttributes({ showViewAll: value }),
              help: "Display a 'View All' button at the bottom center of the carousel",
            }),
            attributes.showViewAll &&
              el(
                Fragment,
                null,
                el(TextControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Button Text",
                  value: attributes.viewAllText,
                  onChange: (value) => setAttributes({ viewAllText: value }),
                  placeholder: "View All",
                  help: "e.g., 'View All', 'View Shop', 'See More'",
                }),
                el(TextControl, {
                  __next40pxDefaultSize: true,
                  __nextHasNoMarginBottom: true,
                  label: "Button URL",
                  value: attributes.viewAllUrl,
                  onChange: (value) => setAttributes({ viewAllUrl: value }),
                  placeholder: "/shop",
                  help: "Link destination (e.g., /shop, /products)",
                }),
                el(
                  "div",
                  { style: { marginTop: "8px" } },
                  subheading("Button Styling"),
                  createColorRow([
                    ["Background", "viewAllBgColor", "#333333"],
                    ["Text", "viewAllTextColor", "#ffffff"],
                  ]),
                  createColorRow([
                    ["Hover BG", "viewAllHoverBgColor", "#000000"],
                    ["Hover Text", "viewAllHoverTextColor", "#ffffff"],
                  ]),
                  // Border + Font Size share one 2-col row
                  el(
                    "div",
                    {
                      style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        marginBottom: "10px",
                      },
                    },
                    createColorCell("Border", "viewAllBorderColor", "#333333"),
                    createNumberCell(
                      "Font Size (px)",
                      "viewAllFontSize",
                      14,
                      10,
                      40,
                    ),
                  ),
                ),
              ),
          ), // end Display Options PanelBody
        ), // end InspectorControls

        // ── LIVE EDITOR PREVIEW via ServerSideRender ─────────────────
        // The blockProps outer div is Gutenberg's click-to-select target.
        // pointer-events:none on a child div passes clicks THROUGH to elements
        // visually behind the block (parent Container), NOT up to blockProps.
        // Solution: a transparent position:absolute overlay on top of the SSR
        // content. Clicks land on the overlay → bubble up to blockProps div →
        // Gutenberg selects this block. The overlay also prevents carousel
        // link/button interactions inside the editor.
        el(
          "div",
          Object.assign({}, blockProps, { ref: previewRef }),
          el(
            "div",
            { style: { position: "relative" } },
            el(ServerSideRender, {
              block: "pcsbb/carousel",
              attributes: attributes,
              LoadingResponsePlaceholder: function () {
                return el(
                  "div",
                  {
                    style: {
                      padding: "60px 20px",
                      textAlign: "center",
                      background: "#f8f9fa",
                      border: "2px dashed #ddd",
                      borderRadius: "8px",
                    },
                  },
                  el(Spinner),
                  el(
                    "p",
                    { style: { marginTop: "12px", color: "#666" } },
                    "Loading carousel preview…",
                  ),
                );
              },
            }),
            // Transparent overlay — catches all clicks and explicitly selects
            // this block via the block-editor store. This is the only reliable
            // method; event bubbling alone doesn't trigger Gutenberg selection.
            el("div", {
              style: {
                position: "absolute",
                inset: "0",
                zIndex: 10,
                cursor: "default",
              },
              onClick: function (e) {
                e.stopPropagation();
                selectBlock(clientId);
              },
            }),
          ),
        ),
      );
    },

    save: function () {
      return null;
    },
  });
})();
