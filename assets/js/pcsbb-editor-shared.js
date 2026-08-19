/**
 * SAB Product Carousel Slider for WooCommerce  v1.5.0
 * Shared editor panel + live preview — used by BOTH the Gutenberg block
 * (assets/js/block.js) and the backend Slider editor (pcsbb-admin-editor.js).
 * This is the single source of truth for "what the settings panel looks like",
 * so the block editor and the wp-admin Carousels editor never drift apart.
 */
(function () {
  const { InspectorControls } = wp.blockEditor || wp.editor;
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
  const { useSelect } = wp.data;
  const ServerSideRender = wp.serverSideRender;

  /**
   * PCSBBFields — the entire settings panel body (Header, Typography, Columns,
   * Carousel Behavior, Navigation, Product Query, Display Options, ...).
   * Pure function of (attributes, setAttributes) — no block-editor dependency,
   * so it renders identically inside InspectorControls (block) or a plain div (admin).
   */
  function PCSBBFields(props) {
    const { attributes, setAttributes } = props;

    // ── COLLAPSIBLE STATE ─────────────────────────────────────────
    const [paddingOpen, setPaddingOpen] = useState(false);
    const [marginOpen, setMarginOpen] = useState(false);
    const [arrowSizeOpen, setArrowSizeOpen] = useState(false);

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

    return el(
      Fragment,
      null,
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
              createColorCell("Title Color", "sectionTitleColor", "#333333"),
            ),
            el(TextControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Section Subtitle",
              value: attributes.sectionSubtitle,
              onChange: (value) => setAttributes({ sectionSubtitle: value }),
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
        collapsibleToggle("Outer Padding (px)", paddingOpen, setPaddingOpen),
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
              : "All images cropped to a uniform, responsive size",
        }),
        attributes.imageHeightMode === "uniform" &&
          el(SelectControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Image Fit",
            value: attributes.imageFit || "cover",
            options: [
              { label: "Cover (crop to fill)", value: "cover" },
              { label: "Contain (fit, no crop)", value: "contain" },
              { label: "Stretch (fill, distorts)", value: "fill" },
            ],
            onChange: (value) => setAttributes({ imageFit: value }),
            help:
              (attributes.imageFit || "cover") === "contain"
                ? "Whole image stays visible, no cropping — may show empty space on two sides if proportions don't match."
                : (attributes.imageFit || "cover") === "fill"
                  ? "Image is stretched to exactly fill the space (proportions ignored)."
                  : "Image is cropped to completely fill the space (default, no distortion).",
          }),
        attributes.imageHeightMode === "uniform" &&
          (attributes.imageFit || "cover") === "cover" &&
          el(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginTop: "8px",
              },
            },
            el(SelectControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Horizontal Position",
              value: attributes.imageObjectPosition,
              options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ],
              onChange: (value) =>
                setAttributes({ imageObjectPosition: value }),
            }),
            el(SelectControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Vertical Position",
              value: attributes.imageObjectPositionY,
              options: [
                { label: "Top", value: "top" },
                { label: "Center", value: "center" },
                { label: "Bottom", value: "bottom" },
              ],
              onChange: (value) =>
                setAttributes({ imageObjectPositionY: value }),
            }),
          ),
        attributes.imageHeightMode === "uniform" &&
          (attributes.imageFit || "cover") === "cover" &&
          el(
            "p",
            {
              style: { fontSize: "11px", color: "#757575", margin: "4px 0 0" },
            },
            "Which part of the image stays visible after cropping — e.g. Center + Top keeps the top of the photo in view.",
          ),
        attributes.imageHeightMode === "uniform" &&
          el(
            "div",
            { style: { marginTop: "8px" } },
            el(
              "p",
              {
                style: {
                  fontSize: "11px",
                  color: "#757575",
                  margin: "0 0 6px",
                },
              },
              "Image Height (px) — per Device. Used instead of pure aspect-ratio for reliable, consistent sizing across themes.",
            ),
            deviceGrid4([
              {
                label: "H",
                keys: [
                  "uniformHeightDesktop",
                  "uniformHeightTablet",
                  "uniformHeightMobile",
                  "uniformHeightPhone",
                ],
                defaults: [350, 350, 350, 350],
                min: 80,
                max: 800,
              },
            ]),
            attributes.disableMobileSlider &&
              el(
                "p",
                {
                  style: {
                    fontSize: "11px",
                    color: "#757575",
                    margin: "4px 0 0",
                  },
                },
                "Mobile/Phone height is ignored while Disable Mobile Slider is on — images use their natural height in the stacked layout instead.",
              ),
          ),
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
          onChange: (value) => setAttributes({ disableMobileSlider: value }),
          help: "Show vertical list on mobile (<768px) instead of carousel",
        }),
        attributes.disableMobileSlider &&
          el(RangeControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Mobile Vertical Gap (px)",
            value: attributes.mobileVerticalGap,
            onChange: (value) => setAttributes({ mobileVerticalGap: value }),
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
              onChange: (value) => setAttributes({ navigationStyle: value }),
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
                divider,
                subheading("Arrow Position (px from edge)"),
                el(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    },
                  },
                  createNumberCell("Left Arrow Gap", "navGapLeft", 10, 0, 100),
                  createNumberCell(
                    "Right Arrow Gap",
                    "navGapRight",
                    10,
                    0,
                    100,
                  ),
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
            createColorCell("Hover Color", "productTitleHoverColor", "#000000"),
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
                onChange: (value) => setAttributes({ saleLabelText: value }),
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
          onChange: (value) => setAttributes({ showOutOfStockLabel: value }),
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
            createColorRow([["Border", "productLinkBorderColor", "#333333"]]),
            el("div", {
              style: { borderTop: "1px solid #e0e0e0", margin: "10px 0" },
            }),
            el(TextControl, {
              __next40pxDefaultSize: true,
              __nextHasNoMarginBottom: true,
              label: "Icon (Dashicon class)",
              value: attributes.productLinkIcon,
              onChange: (value) => setAttributes({ productLinkIcon: value }),
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
              createColorRow([["Border", "addToCartBorderColor", "#0073aa"]]),
              el("div", {
                style: { borderTop: "1px solid #e0e0e0", margin: "10px 0" },
              }),
              el(TextControl, {
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                label: "Icon (Dashicon class)",
                value: attributes.addToCartIcon,
                onChange: (value) => setAttributes({ addToCartIcon: value }),
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
              el("div", {
                style: { borderTop: "1px solid #e0e0e0", margin: "10px 0" },
              }),
              subheading("Button Position"),
              el(ToggleControl, {
                __nextHasNoMarginBottom: true,
                label: "Auto push to bottom (Uniform)",
                checked: attributes.actionButtonsAutoTop !== false,
                onChange: (value) =>
                  setAttributes({ actionButtonsAutoTop: value }),
                help: "Keeps buttons aligned to the card bottom regardless of content height above. Turn off to set a custom margin instead.",
              }),
              attributes.actionButtonsAutoTop === false &&
                el(
                  Fragment,
                  null,
                  el(
                    "p",
                    {
                      style: {
                        fontSize: "11px",
                        color: "#757575",
                        margin: "8px 0 4px",
                      },
                    },
                    "Margin (px)",
                  ),
                  el(
                    "div",
                    {
                      style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        gap: "6px",
                      },
                    },
                    createNumberCell(
                      "Top",
                      "actionButtonsMarginTop",
                      0,
                      -100,
                      200,
                    ),
                    createNumberCell(
                      "Right",
                      "actionButtonsMarginRight",
                      0,
                      -100,
                      200,
                    ),
                    createNumberCell(
                      "Bottom",
                      "actionButtonsMarginBottom",
                      0,
                      -100,
                      200,
                    ),
                    createNumberCell(
                      "Left",
                      "actionButtonsMarginLeft",
                      0,
                      -100,
                      200,
                    ),
                  ),
                ),
              el(
                "p",
                {
                  style: {
                    fontSize: "11px",
                    color: "#757575",
                    margin: "10px 0 4px",
                  },
                },
                "Padding (px)",
              ),
              el(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "6px",
                  },
                },
                createNumberCell("Top", "actionButtonsPaddingTop", 10, 0, 100),
                createNumberCell(
                  "Right",
                  "actionButtonsPaddingRight",
                  0,
                  0,
                  100,
                ),
                createNumberCell(
                  "Bottom",
                  "actionButtonsPaddingBottom",
                  0,
                  0,
                  100,
                ),
                createNumberCell("Left", "actionButtonsPaddingLeft", 0, 0, 100),
              ),
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
              el("label", { style: labelStyle }, "Gap Between Buttons (px)"),
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
    );
  }

  /**
   * PCSBBLivePreview — ServerSideRender wrapper + carousel-reinit-on-refresh.
   * mode "block": Gutenberg canvas (click-to-select overlay over the SSR output).
   * mode "admin": plain wp-admin preview card, no block-select overlay.
   */
  function PCSBBLivePreview(props) {
    const { attributes, mode, clientId, selectBlock, blockProps } = props;

    // ── COLLAPSIBLE STATE ─────────────────────────────────────────
    const [paddingOpen, setPaddingOpen] = useState(false);
    const [marginOpen, setMarginOpen] = useState(false);
    const [arrowSizeOpen, setArrowSizeOpen] = useState(false);

    // ── LIVE PREVIEW: ref + carousel reinit on every SSR refresh ──
    // ServerSideRender fetches the PHP render_callback via REST and swaps
    // the innerHTML when done. A MutationObserver detects that swap and
    // reinitialises PCSBBCarousel on the fresh product HTML.
    //
    // IMPORTANT — resolve jQuery/PCSBBCarousel from the DOM node's OWN
    // window, not the top-level `window`. In mode "block" the block
    // editor's canvas is iframed, and the block's registered 'script'
    // handle (pcsbb-public, which defines PCSBBCarousel) is auto-injected
    // by WordPress *inside that iframe* — a separate global scope from
    // the top-level admin window that this component itself runs in
    // (loaded via enqueue_block_editor_assets). Looking up `window.*`
    // here always missed it, so the carousel JS silently never
    // initialised on the SSR preview: the layout stayed a flat,
    // non-stretched list, so options like "Auto push to bottom (Uniform)"
    // (margin-top:auto) had no shared row height to push against and
    // appeared to do nothing — while working correctly on the frontend
    // and on the (non-iframed) Carousels admin editor screen, where
    // pcsbb-public loads in the same top-level document this code runs
    // in. Resolving via the node's own ownerDocument works in both
    // contexts, iframed or not.
    const previewRef = useRef(null);
    useEffect(
      function () {
        if (!previewRef.current) return;
        var container = previewRef.current;
        var observer;
        var pollTimer;
        var settled = false;
        var attempts = 0;
        // Polls for up to ~6s (30 × 200ms). Covers the case where this
        // effect runs before the iframe has finished executing its own
        // <script> tags — e.g. opening the page/post editor fresh, before
        // any attribute change has triggered a second SSR fetch to retry
        // against. Without this, a single early miss meant the carousel
        // script was never checked for again until the user touched a
        // setting.
        var MAX_ATTEMPTS = 30;

        function getContainerWindow() {
          return (
            (container.ownerDocument && container.ownerDocument.defaultView) ||
            window
          );
        }

        function retryOrGiveUp() {
          attempts++;
          if (attempts < MAX_ATTEMPTS) {
            pollTimer = setTimeout(tryInit, 200);
          }
        }

        function tryInit() {
          if (settled) return;
          var win = getContainerWindow();
          var $ = win.jQuery;
          if (!$ || !win.PCSBBCarousel) {
            retryOrGiveUp();
            return;
          }
          var wrappers = container.querySelectorAll(".pcsbb-carousel-wrapper");
          if (!wrappers.length) {
            retryOrGiveUp();
            return;
          }
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
            $w.data("pcsbb-carousel", new win.PCSBBCarousel($w));
          });
        }

        // subtree:true catches SSR replacing innerHTML of its wrapper div
        observer = new MutationObserver(function () {
          attempts = 0; // fresh DOM swap — give polling a full new budget
          clearTimeout(pollTimer);
          pollTimer = setTimeout(tryInit, 200);
        });
        observer.observe(container, { childList: true, subtree: true });
        // Immediate attempt for cached SSR responses, then poll if needed
        pollTimer = setTimeout(tryInit, 300);

        return function () {
          clearTimeout(pollTimer);
          if (observer) observer.disconnect();
        };
      },
      [attributes],
    );

    const ssr = el(ServerSideRender, {
      block: "pcsbb/carousel",
      attributes: attributes,
      httpMethod: "POST",
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
    });

    if (mode === "block") {
      return el(
        "div",
        Object.assign({}, blockProps, { ref: previewRef }),
        el(
          "div",
          { style: { position: "relative" } },
          ssr,
          el("div", {
            style: {
              position: "absolute",
              inset: "0",
              zIndex: 10,
              cursor: "default",
            },
            onClick: function (e) {
              e.stopPropagation();
              if (selectBlock && clientId) selectBlock(clientId);
            },
          }),
        ),
      );
    }

    // admin mode — no overlay, no block selection, just a live preview card
    return el(
      "div",
      { className: "pcsbb-admin-preview-card", ref: previewRef },
      ssr,
    );
  }

  window.PCSBBShared = {
    Fields: PCSBBFields,
    LivePreview: PCSBBLivePreview,
  };
})();
