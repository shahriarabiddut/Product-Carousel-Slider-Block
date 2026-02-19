/**
 * Product Carousel Slider Biddut Block - Gutenberg Block v1.0.0
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
  } = wp.components;
  const { __ } = wp.i18n;
  const { createElement: el, Fragment } = wp.element;
  const { useSelect } = wp.data;

  // Register the block
  registerBlockType("pcsbb/carousel", {
    title: "Product Carousel Slider",
    description:
      "Product Carousel Slider Biddut Block with Card and Art Gallery styles",
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
    supports: {
      align: ["wide", "full"],
      html: false,
    },
    attributes: {
      // Header (Title & Subtitle)
      showHeader: {
        type: "boolean",
        default: false,
      },
      sectionTitle: {
        type: "string",
        default: "",
      },
      sectionSubtitle: {
        type: "string",
        default: "",
      },

      // Typography
      sectionTitleFontSize: {
        type: "number",
        default: 32,
      },
      sectionSubtitleFontSize: {
        type: "number",
        default: 24,
      },
      productTitleFontSize: {
        type: "number",
        default: 16,
      },
      productPriceFontSize: {
        type: "number",
        default: 18,
      },

      // Colors
      sectionTitleColor: {
        type: "string",
        default: "#333",
      },
      sectionSubtitleColor: {
        type: "string",
        default: "#666",
      },
      productTitleColor: {
        type: "string",
        default: "#333",
      },
      productTitleHoverColor: {
        type: "string",
        default: "#000",
      },
      priceColor: {
        type: "string",
        default: "#333",
      },
      priceHoverColor: {
        type: "string",
        default: "#e74c3c",
      },
      navColor: {
        type: "string",
        default: "#333",
      },
      navHoverColor: {
        type: "string",
        default: "#ffffff",
      },
      navBgColor: {
        type: "string",
        default: "#ffffff",
      },
      navBgHoverColor: {
        type: "string",
        default: "#333",
      },

      // Design Variant (Only 2)
      variant: {
        type: "string",
        default: "gallery",
      },

      // Responsive Columns
      columnsDesktop: {
        type: "number",
        default: 4,
      },
      columnsTablet: {
        type: "number",
        default: 3,
      },
      columnsMobile: {
        type: "number",
        default: 2,
      },
      columnsPhone: {
        type: "number",
        default: 1,
      },

      // Image Display
      imageHeightMode: {
        type: "string",
        default: "natural",
      },

      // Carousel Settings
      autoplay: {
        type: "boolean",
        default: false,
      },
      autoplayDelay: {
        type: "number",
        default: 5000,
      },
      loop: {
        type: "boolean",
        default: true,
      },
      transitionSpeed: {
        type: "number",
        default: 500,
      },

      // Mobile Slider Control
      disableMobileSlider: {
        type: "boolean",
        default: false,
      },

      // Navigation Settings
      showNavigation: {
        type: "boolean",
        default: true,
      },
      navigationStyle: {
        type: "string",
        default: "arrows",
      },
      prevArrowIcon: {
        type: "string",
        default: "dashicons-arrow-left-alt2",
      },
      nextArrowIcon: {
        type: "string",
        default: "dashicons-arrow-right-alt2",
      },

      // Hover Effects
      hoverEffect: {
        type: "string",
        default: "zoom",
      },
      showImageDots: {
        type: "boolean",
        default: false,
      },
      showGalleryOnHover: {
        type: "boolean",
        default: true,
      },

      // Product Query
      categories: {
        type: "array",
        default: [],
      },
      limit: {
        type: "number",
        default: 12,
      },
      orderby: {
        type: "string",
        default: "date",
      },
      order: {
        type: "string",
        default: "DESC",
      },

      // Display Options
      showTitle: {
        type: "boolean",
        default: true,
      },
      showPrice: {
        type: "boolean",
        default: true,
      },
      showRating: {
        type: "boolean",
        default: false,
      },
      showSaleLabel: {
        type: "boolean",
        default: true,
      },
      saleLabelText: {
        type: "string",
        default: "SALE",
      },
      saleLabelPosition: {
        type: "string",
        default: "top-right",
      },
      saleBadgeBgColor: {
        type: "string",
        default: "#e74c3c",
      },
      saleBadgeTextColor: {
        type: "string",
        default: "#ffffff",
      },
      showOutOfStockLabel: {
        type: "boolean",
        default: false,
      },
      outOfStockLabelText: {
        type: "string",
        default: "Sold Out",
      },
      outOfStockLabelPosition: {
        type: "string",
        default: "top-right",
      },
      outOfStockBgColor: {
        type: "string",
        default: "#555555",
      },
      outOfStockTextColor: {
        type: "string",
        default: "#ffffff",
      },
      showProductLink: {
        type: "boolean",
        default: false,
      },

      // Add to Cart Options
      showAddToCart: {
        type: "boolean",
        default: false,
      },
      addToCartText: {
        type: "string",
        default: "Add to Cart",
      },
      addToCartStyle: {
        type: "string",
        default: "default",
      },

      // View All Button
      showViewAll: {
        type: "boolean",
        default: false,
      },
      viewAllText: {
        type: "string",
        default: "View All",
      },
      viewAllUrl: {
        type: "string",
        default: "",
      },
    },

    edit: function (props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps ? useBlockProps() : {};

      // Fetch WooCommerce product categories
      const categories = useSelect((select) => {
        const store = select("core");
        if (!store) return [];

        const cats = store.getEntityRecords("taxonomy", "product_cat", {
          per_page: -1,
          hide_empty: false,
        });

        return cats || [];
      }, []);

      // Prepare category options
      const categoryOptions = [
        { label: "All Categories", value: "" },
        ...(categories.map((cat) => ({
          label: cat.name,
          value: cat.slug,
        })) || []),
      ];

      return el(
        Fragment,
        null,

        // Inspector Controls
        el(
          InspectorControls,
          null,

          // Header Settings
          el(
            PanelBody,
            { title: "Header (Title & Subtitle)", initialOpen: false },
            el(ToggleControl, {
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
                  label: "Section Title",
                  value: attributes.sectionTitle,
                  onChange: (value) => setAttributes({ sectionTitle: value }),
                  placeholder: "e.g., NEW ARRIVALS",
                }),
                el(RangeControl, {
                  label: "Title Font Size (px)",
                  value: attributes.sectionTitleFontSize,
                  onChange: (value) =>
                    setAttributes({ sectionTitleFontSize: value }),
                  min: 16,
                  max: 60,
                }),
                el(TextControl, {
                  label: "Section Subtitle",
                  value: attributes.sectionSubtitle,
                  onChange: (value) =>
                    setAttributes({ sectionSubtitle: value }),
                  placeholder: "e.g., Fresh styles for the season",
                }),
                el(RangeControl, {
                  label: "Subtitle Font Size (px)",
                  value: attributes.sectionSubtitleFontSize,
                  onChange: (value) =>
                    setAttributes({ sectionSubtitleFontSize: value }),
                  min: 12,
                  max: 40,
                }),
              ),
          ),

          // Typography Settings
          el(
            PanelBody,
            { title: "Typography", initialOpen: false },
            el(RangeControl, {
              label: "Product Title Font Size (px)",
              value: attributes.productTitleFontSize,
              onChange: (value) =>
                setAttributes({ productTitleFontSize: value }),
              min: 10,
              max: 32,
            }),
            el(RangeControl, {
              label: "Product Price Font Size (px)",
              value: attributes.productPriceFontSize,
              onChange: (value) =>
                setAttributes({ productPriceFontSize: value }),
              min: 12,
              max: 36,
            }),
          ),

          // Color Settings
          // --- Section Colors (collapsible PanelBody) ---
          el(
            PanelBody,
            { title: "Section Colors", initialOpen: false },
            el(
              "div",
              {
                style: { display: "flex", flexDirection: "column", gap: "8px" },
              },
              ...[
                { label: "Section Title Color", key: "sectionTitleColor" },
                {
                  label: "Section Subtitle Color",
                  key: "sectionSubtitleColor",
                },
              ].map(({ label, key }) =>
                el(
                  "div",
                  {
                    key,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "4px 0",
                    },
                  },
                  el("input", {
                    type: "color",
                    value: attributes[key] || "#333333",
                    onChange: (e) => setAttributes({ [key]: e.target.value }),
                    style: {
                      width: "36px",
                      height: "36px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "2px",
                      flexShrink: 0,
                    },
                  }),
                  el("span", { style: { fontSize: "13px" } }, label),
                ),
              ),
            ),
          ),

          // --- Product Colors (collapsible PanelBody) ---
          el(
            PanelBody,
            { title: "Product Colors", initialOpen: false },
            el(
              "div",
              {
                style: { display: "flex", flexDirection: "column", gap: "8px" },
              },
              ...[
                { label: "Product Title Color", key: "productTitleColor" },
                {
                  label: "Product Title Hover Color",
                  key: "productTitleHoverColor",
                },
                { label: "Price Color", key: "priceColor" },
                { label: "Price Hover Color", key: "priceHoverColor" },
              ].map(({ label, key }) =>
                el(
                  "div",
                  {
                    key,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "4px 0",
                    },
                  },
                  el("input", {
                    type: "color",
                    value: attributes[key] || "#333333",
                    onChange: (e) => setAttributes({ [key]: e.target.value }),
                    style: {
                      width: "36px",
                      height: "36px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "2px",
                      flexShrink: 0,
                    },
                  }),
                  el("span", { style: { fontSize: "13px" } }, label),
                ),
              ),
            ),
          ),

          // --- Navigation Colors (collapsible PanelBody) ---
          el(
            PanelBody,
            { title: "Navigation Colors", initialOpen: false },
            el(
              "div",
              {
                style: { display: "flex", flexDirection: "column", gap: "8px" },
              },
              ...[
                { label: "Arrow Icon Color", key: "navColor" },
                { label: "Arrow Icon Hover Color", key: "navHoverColor" },
                { label: "Arrow Background Color", key: "navBgColor" },
                { label: "Arrow Background Hover", key: "navBgHoverColor" },
              ].map(({ label, key }) =>
                el(
                  "div",
                  {
                    key,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "4px 0",
                    },
                  },
                  el("input", {
                    type: "color",
                    value: attributes[key] || "#333333",
                    onChange: (e) => setAttributes({ [key]: e.target.value }),
                    style: {
                      width: "36px",
                      height: "36px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "2px",
                      flexShrink: 0,
                    },
                  }),
                  el("span", { style: { fontSize: "13px" } }, label),
                ),
              ),
            ),
          ),

          // Design Variant
          el(
            PanelBody,
            { title: "Design Variant", initialOpen: true },
            el(SelectControl, {
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
          ),

          // Responsive Columns
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
            // Row 1: Desktop and Tablet
            el(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                },
              },
              el(
                "div",
                null,
                el(RangeControl, {
                  label: "🖥️ Desktop",
                  value: attributes.columnsDesktop,
                  onChange: (value) => setAttributes({ columnsDesktop: value }),
                  min: 1,
                  max: 6,
                  help: "≥1280px",
                }),
              ),
              el(
                "div",
                null,
                el(RangeControl, {
                  label: "💻 Tablet",
                  value: attributes.columnsTablet,
                  onChange: (value) => setAttributes({ columnsTablet: value }),
                  min: 1,
                  max: 4,
                  help: "768-1279px",
                }),
              ),
            ),
            // Row 2: Mobile and Phone
            el(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                },
              },
              el(
                "div",
                null,
                el(RangeControl, {
                  label: "📱 Mobile",
                  value: attributes.columnsMobile,
                  onChange: (value) => setAttributes({ columnsMobile: value }),
                  min: 1,
                  max: 3,
                  help: "480-767px",
                }),
              ),
              el(
                "div",
                null,
                el(RangeControl, {
                  label: "📲 Phone",
                  value: attributes.columnsPhone,
                  onChange: (value) => setAttributes({ columnsPhone: value }),
                  min: 1,
                  max: 2,
                  help: "<480px",
                }),
              ),
            ),
          ),

          // Image Display Options
          el(
            PanelBody,
            { title: "Image Display Options", initialOpen: false },
            el(RadioControl, {
              label: "Image Height Mode",
              selected: attributes.imageHeightMode,
              options: [
                {
                  label: "Natural (Original aspect ratio)",
                  value: "natural",
                },
                {
                  label: "Uniform (same size for all)",
                  value: "uniform",
                },
              ],
              onChange: (value) => setAttributes({ imageHeightMode: value }),
              help:
                attributes.imageHeightMode === "natural"
                  ? "Images maintain their original proportions"
                  : "All images cropped to same size for consistency",
            }),
          ),

          // Carousel Settings
          el(
            PanelBody,
            { title: "Carousel Settings", initialOpen: false },
            el(ToggleControl, {
              label: "Enable Autoplay",
              checked: attributes.autoplay,
              onChange: (value) => setAttributes({ autoplay: value }),
              help: "Automatically rotate products",
            }),
            attributes.autoplay &&
              el(RangeControl, {
                label: "Autoplay Delay (ms)",
                value: attributes.autoplayDelay,
                onChange: (value) => setAttributes({ autoplayDelay: value }),
                min: 1000,
                max: 10000,
                step: 500,
              }),
            el(ToggleControl, {
              label: "Enable Loop",
              checked: attributes.loop,
              onChange: (value) => setAttributes({ loop: value }),
              help: "Return to start after reaching the end",
            }),
            attributes.loop &&
              el(RangeControl, {
                label: "Transition Speed (ms)",
                value: attributes.transitionSpeed,
                onChange: (value) => setAttributes({ transitionSpeed: value }),
                min: 200,
                max: 2000,
                step: 100,
              }),
            el("div", {
              style: {
                borderTop: "1px solid #ddd",
                marginTop: "12px",
                paddingTop: "12px",
              },
            }),
            el(ToggleControl, {
              label: "Disable Slider on Mobile (<480px)",
              checked: attributes.disableMobileSlider,
              onChange: (value) =>
                setAttributes({ disableMobileSlider: value }),
              help: "Show products in a vertical list instead of slider on mobile devices",
            }),
          ),

          // Navigation Settings
          el(
            PanelBody,
            { title: "Navigation", initialOpen: false },
            el(ToggleControl, {
              label: "Show Navigation",
              checked: attributes.showNavigation,
              onChange: (value) => setAttributes({ showNavigation: value }),
            }),
            attributes.showNavigation &&
              el(
                Fragment,
                null,
                el(SelectControl, {
                  label: "Navigation Style",
                  value: attributes.navigationStyle,
                  options: [
                    { label: "Arrows Only", value: "arrows" },
                    { label: "Dots Only", value: "dots" },
                    { label: "Arrows & Dots", value: "both" },
                  ],
                  onChange: (value) =>
                    setAttributes({ navigationStyle: value }),
                }),
                (attributes.navigationStyle === "arrows" ||
                  attributes.navigationStyle === "both") &&
                  el(
                    "div",
                    {
                      style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginTop: "8px",
                      },
                    },
                    el(SelectControl, {
                      label: "Prev Arrow",
                      value: attributes.prevArrowIcon,
                      options: [
                        {
                          label: "← Chevron",
                          value: "dashicons-arrow-left-alt2",
                        },
                        { label: "← Arrow", value: "dashicons-arrow-left-alt" },
                        { label: "‹ Slim", value: "dashicons-arrow-left" },
                        { label: "« Back", value: "dashicons-controls-back" },
                      ],
                      onChange: (value) =>
                        setAttributes({ prevArrowIcon: value }),
                    }),
                    el(SelectControl, {
                      label: "Next Arrow",
                      value: attributes.nextArrowIcon,
                      options: [
                        {
                          label: "Chevron →",
                          value: "dashicons-arrow-right-alt2",
                        },
                        {
                          label: "Arrow →",
                          value: "dashicons-arrow-right-alt",
                        },
                        { label: "Slim ›", value: "dashicons-arrow-right" },
                        {
                          label: "Forward »",
                          value: "dashicons-controls-forward",
                        },
                      ],
                      onChange: (value) =>
                        setAttributes({ nextArrowIcon: value }),
                    }),
                  ),
              ),
          ),

          // Hover Effects
          el(
            PanelBody,
            { title: "Hover Effects", initialOpen: false },
            el(SelectControl, {
              label: "Image Hover Effect",
              value: attributes.hoverEffect,
              options: [
                { label: "Zoom In", value: "zoom" },
                { label: "Lift Up", value: "lift" },
                { label: "Glow", value: "glow" },
                { label: "None", value: "none" },
              ],
              onChange: (value) => setAttributes({ hoverEffect: value }),
            }),
            el(ToggleControl, {
              label: "Show Image Navigation Dots",
              checked: attributes.showImageDots,
              onChange: (value) => setAttributes({ showImageDots: value }),
              help: "Display dots to navigate product gallery images",
            }),
            el(ToggleControl, {
              label: "Show Gallery Image on Hover",
              checked: attributes.showGalleryOnHover,
              onChange: (value) => setAttributes({ showGalleryOnHover: value }),
              help: "Replace main image with gallery image on hover",
            }),
          ),

          // Product Query
          el(
            PanelBody,
            { title: "Product Selection", initialOpen: true },
            el(
              "div",
              null,
              el(
                "label",
                {
                  style: {
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  },
                },
                "Categories (Select Multiple)",
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
                  },
                },
                categoryOptions
                  .filter((cat) => cat.value !== "") // Remove "All Categories" option
                  .map((cat) =>
                    el(CheckboxControl, {
                      key: cat.value,
                      label: cat.label,
                      checked: attributes.categories.includes(cat.value),
                      onChange: (checked) => {
                        const newCategories = checked
                          ? [...attributes.categories, cat.value]
                          : attributes.categories.filter(
                              (c) => c !== cat.value,
                            );
                        setAttributes({ categories: newCategories });
                      },
                    }),
                  ),
              ),
            ),
            el(RangeControl, {
              label: "Products Limit",
              value: attributes.limit,
              onChange: (value) => setAttributes({ limit: value }),
              min: 1,
              max: 20,
              help: "Maximum number of products to display",
            }),
            // Order By and Order in same row
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

          // Display Options
          el(
            PanelBody,
            { title: "Display Options", initialOpen: false },
            el(ToggleControl, {
              label: "Show Product Title",
              checked: attributes.showTitle,
              onChange: (value) => setAttributes({ showTitle: value }),
            }),
            el(ToggleControl, {
              label: "Show Price",
              checked: attributes.showPrice,
              onChange: (value) => setAttributes({ showPrice: value }),
            }),
            el(ToggleControl, {
              label: "Show Rating",
              checked: attributes.showRating,
              onChange: (value) => setAttributes({ showRating: value }),
            }),
            el(ToggleControl, {
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
                    label: "Sale Text",
                    value: attributes.saleLabelText || "SALE",
                    onChange: (value) =>
                      setAttributes({ saleLabelText: value }),
                    placeholder: "SALE",
                  }),
                  el(SelectControl, {
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
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    },
                  },
                  el(
                    "div",
                    null,
                    el(
                      "label",
                      {
                        style: {
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "500",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        },
                      },
                      "Badge BG",
                    ),
                    el("input", {
                      type: "color",
                      value: attributes.saleBadgeBgColor || "#e74c3c",
                      onChange: (e) =>
                        setAttributes({ saleBadgeBgColor: e.target.value }),
                      style: {
                        width: "100%",
                        height: "36px",
                        padding: "2px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                      },
                    }),
                  ),
                  el(
                    "div",
                    null,
                    el(
                      "label",
                      {
                        style: {
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "500",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        },
                      },
                      "Badge Text",
                    ),
                    el("input", {
                      type: "color",
                      value: attributes.saleBadgeTextColor || "#ffffff",
                      onChange: (e) =>
                        setAttributes({ saleBadgeTextColor: e.target.value }),
                      style: {
                        width: "100%",
                        height: "36px",
                        padding: "2px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                      },
                    }),
                  ),
                ),
              ),

            // Spacing divider between Sale and Sold Out
            el("div", {
              style: { borderTop: "1px solid #e0e0e0", margin: "16px 0 12px" },
            }),

            el(ToggleControl, {
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
                    label: "Sold Out Text",
                    value: attributes.outOfStockLabelText || "Sold Out",
                    onChange: (value) =>
                      setAttributes({ outOfStockLabelText: value }),
                    placeholder: "Sold Out",
                  }),
                  el(SelectControl, {
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
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    },
                  },
                  el(
                    "div",
                    null,
                    el(
                      "label",
                      {
                        style: {
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "500",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        },
                      },
                      "Badge BG",
                    ),
                    el("input", {
                      type: "color",
                      value: attributes.outOfStockBgColor || "#555555",
                      onChange: (e) =>
                        setAttributes({ outOfStockBgColor: e.target.value }),
                      style: {
                        width: "100%",
                        height: "36px",
                        padding: "2px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                      },
                    }),
                  ),
                  el(
                    "div",
                    null,
                    el(
                      "label",
                      {
                        style: {
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "500",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        },
                      },
                      "Badge Text",
                    ),
                    el("input", {
                      type: "color",
                      value: attributes.outOfStockTextColor || "#ffffff",
                      onChange: (e) =>
                        setAttributes({ outOfStockTextColor: e.target.value }),
                      style: {
                        width: "100%",
                        height: "36px",
                        padding: "2px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                      },
                    }),
                  ),
                ),
              ),

            el("div", {
              style: { borderTop: "1px solid #e0e0e0", margin: "16px 0 12px" },
            }),

            el(ToggleControl, {
              label: "Show Product Link Button",
              checked: attributes.showProductLink,
              onChange: (value) => setAttributes({ showProductLink: value }),
            }),
            el(ToggleControl, {
              label: "Show Add to Cart Button",
              checked: attributes.showAddToCart,
              onChange: (value) => setAttributes({ showAddToCart: value }),
            }),
            attributes.showAddToCart &&
              el(
                Fragment,
                null,
                el(TextControl, {
                  label: "Add to Cart Button Text",
                  value: attributes.addToCartText,
                  onChange: (value) => setAttributes({ addToCartText: value }),
                  placeholder: "Add to Cart",
                }),
                el(SelectControl, {
                  label: "Button Style",
                  value: attributes.addToCartStyle,
                  options: [
                    { label: "Default", value: "default" },
                    { label: "Primary (Blue)", value: "primary" },
                    { label: "Outline", value: "outline" },
                  ],
                  onChange: (value) => setAttributes({ addToCartStyle: value }),
                }),
              ),
            el("div", {
              style: {
                borderTop: "1px solid #ddd",
                marginTop: "12px",
                paddingTop: "12px",
              },
            }),
            el(ToggleControl, {
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
                  label: "Button Text",
                  value: attributes.viewAllText,
                  onChange: (value) => setAttributes({ viewAllText: value }),
                  placeholder: "View All",
                  help: "e.g., 'View All', 'View Shop', 'See More'",
                }),
                el(TextControl, {
                  label: "Button URL",
                  value: attributes.viewAllUrl,
                  onChange: (value) => setAttributes({ viewAllUrl: value }),
                  placeholder: "/shop",
                  help: "Link destination (e.g., /shop, /products)",
                }),
              ),
          ),
        ),

        // Editor Preview
        el(
          "div",
          blockProps,
          el(
            "div",
            {
              className: "pcsbb-editor-preview",
              style: {
                padding: "40px 20px",
                background: "#f8f9fa",
                border: "2px dashed #ccc",
                borderRadius: "8px",
                textAlign: "center",
              },
            },
            attributes.showHeader &&
              (attributes.sectionTitle || attributes.sectionSubtitle) &&
              el(
                "div",
                { style: { marginBottom: "20px" } },
                attributes.sectionTitle &&
                  el(
                    "h2",
                    {
                      style: {
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                      },
                    },
                    attributes.sectionTitle,
                  ),
                attributes.sectionSubtitle &&
                  el(
                    "h3",
                    {
                      style: {
                        fontSize: "18px",
                        fontWeight: "300",
                        color: "#666",
                        marginTop: "0",
                      },
                    },
                    attributes.sectionSubtitle,
                  ),
              ),
            el(
              "div",
              { style: { fontSize: "16px", color: "#333" } },
              el("strong", null, "🛍️Product Carousel : Biddut Blocks"),
            ),
            el(
              "p",
              { style: { margin: "10px 0", color: "#666" } },
              "Style: " +
                (attributes.variant === "card" ? "Card Style" : "Art Gallery"),
            ),
            attributes.categories.length > 0 &&
              el(
                "p",
                {
                  style: {
                    margin: "10px 0",
                    color: "#0073aa",
                    fontSize: "14px",
                  },
                },
                "📁 Categories: " + attributes.categories.join(", "),
              ),
            attributes.showAddToCart &&
              el(
                "p",
                {
                  style: {
                    margin: "10px 0",
                    color: "#0073aa",
                    fontSize: "14px",
                  },
                },
                "✓ Add to Cart enabled",
              ),
            attributes.disableMobileSlider &&
              el(
                "p",
                {
                  style: {
                    margin: "10px 0",
                    color: "#e74c3c",
                    fontSize: "14px",
                  },
                },
                "📱 Mobile Slider Disabled - Vertical layout on phones",
              ),
            el(
              "p",
              { style: { margin: "10px 0", color: "#666", fontSize: "14px" } },
              "Columns: 🖥️ " +
                attributes.columnsDesktop +
                " | 💻 " +
                attributes.columnsTablet +
                " | 📱 " +
                attributes.columnsMobile +
                " | 📲 " +
                attributes.columnsPhone,
            ),
            el(
              "p",
              {
                style: {
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "#999",
                  marginTop: "20px",
                },
              },
              "Preview will appear on the frontend. Configure all settings in the sidebar →",
            ),
          ),
        ),
      );
    },

    save: function () {
      return null;
    },
  });
})();
