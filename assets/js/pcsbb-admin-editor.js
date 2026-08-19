/**
 * SAB Product Carousel Slider for WooCommerce  v1.5.0
 * Backend "Carousels" Slider editor — New Slider / Edit Slider / Slider Default Settings.
 * Reuses window.PCSBBShared (assets/js/pcsbb-editor-shared.js) so this panel is
 * identical to the one inside the Gutenberg block.
 */
(function () {
  const {
    createElement: el,
    render,
    useState,
    useRef,
    useEffect,
    Component,
  } = wp.element;
  const { Button, TextControl, Notice, Spinner } = wp.components;
  const { __ } = wp.i18n;
  const apiFetch = wp.apiFetch;

  const cfg = window.pcsbbAdminEditor || {};
  const isDefaults = cfg.mode === "defaults";

  /**
   * Wraps window.PCSBBShared.Fields (an accordion of PanelBody sections —
   * unchanged, still shared verbatim with the block editor) with a left-hand
   * tab list built from those same section titles. Clicking a tab opens that
   * section and closes the rest, so it reads as tabs even though the
   * underlying panel is still a real, unmodified PanelBody accordion.
   */
  function TabbedFields(props) {
    const containerRef = useRef(null);
    const [tabs, setTabs] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(function () {
      if (!containerRef.current) return;
      const buttons = containerRef.current.querySelectorAll(
        ".components-panel__body-title .components-button",
      );
      const list = Array.prototype.map.call(buttons, function (btn) {
        return btn.textContent.trim();
      });
      setTabs(list);
      goTo(0, list.length);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function goTo(index, count) {
      setActive(index);
      if (!containerRef.current) return;
      const bodies = containerRef.current.querySelectorAll(
        ".components-panel__body",
      );
      Array.prototype.forEach.call(bodies, function (body, i) {
        const isOpen = body.classList.contains("is-opened");
        const shouldOpen = i === index;
        if (isOpen !== shouldOpen) {
          const btn = body.querySelector(
            ".components-panel__body-title .components-button",
          );
          if (btn) btn.click();
        }
      });
      if (typeof count !== "number") {
        containerRef.current.scrollTop = 0;
      }
    }

    return el(
      "div",
      { className: "pcsbb-admin-editor-settings" },
      el(
        "div",
        { className: "pcsbb-tab-nav", role: "tablist" },
        tabs.map(function (label, i) {
          return el(
            "button",
            {
              key: i,
              type: "button",
              role: "tab",
              "aria-selected": i === active,
              className:
                "pcsbb-tab-nav-item" + (i === active ? " is-active" : ""),
              onClick: function () {
                goTo(i);
              },
            },
            label,
          );
        }),
      ),
      el(
        "div",
        { className: "pcsbb-admin-editor-fields", ref: containerRef },
        el(window.PCSBBShared.Fields, props),
      ),
    );
  }

  /**
   * Surfaces real JS errors on-screen instead of a silent blank page.
   * Without this, a thrown error inside App() leaves the container empty
   * with nothing but a console stack trace to go on.
   */
  class PCSBBErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
      return { error: error };
    }
    componentDidCatch(error, info) {
      // eslint-disable-next-line no-console
      console.error("PCSBB Carousels editor error:", error, info);
    }
    render() {
      if (this.state.error) {
        return el(
          "div",
          { className: "notice notice-error", style: { padding: "12px 16px" } },
          el(
            "p",
            null,
            el("strong", null, "Carousels editor failed to load: "),
          ),
          el(
            "pre",
            { style: { whiteSpace: "pre-wrap" } },
            String(
              (this.state.error && this.state.error.message) ||
                this.state.error,
            ),
          ),
          el(
            "p",
            null,
            "Open your browser console (F12) for the full stack trace.",
          ),
        );
      }
      return this.props.children;
    }
  }

  function App() {
    if (!window.PCSBBShared) {
      throw new Error(
        "window.PCSBBShared is missing — pcsbb-editor-shared.js did not load before pcsbb-admin-editor.js. Check for a JS error earlier in the console, or a caching/CDN issue serving assets/js/pcsbb-editor-shared.js.",
      );
    }
    const [title, setTitle] = useState(cfg.title || "");
    const [attributes, setAttrs] = useState(cfg.attributes || {});
    const [sliderId, setSliderId] = useState(Number(cfg.sliderId) || 0);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState(null);

    function setAttributes(partial) {
      setAttrs(function (prev) {
        return Object.assign({}, prev, partial);
      });
    }

    function save() {
      if (!isDefaults && title.trim() === "") {
        setNotice({
          status: "error",
          msg: __(
            "Please name this Slider.",
            "product-carousel-slider-biddut-block",
          ),
        });
        return;
      }
      setSaving(true);
      setNotice(null);

      let path, method;
      if (isDefaults) {
        path = "/pcsbb/v1/default-settings";
        method = "POST";
      } else if (sliderId) {
        path = "/pcsbb/v1/sliders/" + sliderId;
        method = "POST"; // WP_REST_Server::EDITABLE accepts POST/PUT/PATCH
      } else {
        path = "/pcsbb/v1/sliders";
        method = "POST";
      }

      apiFetch({
        path: path,
        method: method,
        data: { title: title, attributes: attributes },
      })
        .then(function (res) {
          setSaving(false);
          if (!isDefaults) {
            setSliderId(Number(res.id) || 0);
            if (res.attributes) setAttrs(res.attributes);
          }
          setNotice({
            status: "success",
            msg: isDefaults
              ? __(
                  "Default settings saved. New Sliders will start with these values.",
                  "product-carousel-slider-biddut-block",
                )
              : __("Slider saved.", "product-carousel-slider-biddut-block"),
          });
        })
        .catch(function (err) {
          setSaving(false);
          setNotice({
            status: "error",
            msg:
              (err && err.message) ||
              __("Save failed.", "product-carousel-slider-biddut-block"),
          });
        });
    }

    function copyShortcode() {
      const shortcode = '[pcsbb_carousel id="' + sliderId + '"]';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shortcode);
      }
      setNotice({
        status: "success",
        msg: __(
          "Shortcode copied to clipboard.",
          "product-carousel-slider-biddut-block",
        ),
      });
    }

    const shortcode =
      !isDefaults && sliderId ? '[pcsbb_carousel id="' + sliderId + '"]' : null;

    return el(
      "div",
      { className: "pcsbb-admin-editor" },
      notice &&
        el(
          Notice,
          {
            status: notice.status,
            isDismissible: true,
            onRemove: function () {
              setNotice(null);
            },
          },
          notice.msg,
        ),
      el(
        "div",
        { className: "pcsbb-admin-editor-toolbar" },
        !isDefaults &&
          el(TextControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: __("Slider Name", "product-carousel-slider-biddut-block"),
            value: title,
            onChange: setTitle,
            placeholder: __(
              "e.g. Homepage Featured Products",
              "product-carousel-slider-biddut-block",
            ),
            className: "pcsbb-admin-editor-title",
          }),
        isDefaults &&
          el(
            "p",
            { className: "pcsbb-admin-editor-defaults-help" },
            __(
              "These values are the starting point for every new Slider you create.",
              "product-carousel-slider-biddut-block",
            ),
          ),
        el(
          "div",
          { className: "pcsbb-admin-editor-toolbar-actions" },
          shortcode &&
            el(
              "div",
              { className: "pcsbb-shortcode-box" },
              el("code", null, shortcode),
              el(
                Button,
                { variant: "secondary", onClick: copyShortcode },
                __("Copy Shortcode", "product-carousel-slider-biddut-block"),
              ),
            ),
          el(
            Button,
            {
              variant: "primary",
              isBusy: saving,
              disabled: saving,
              onClick: save,
            },
            saving
              ? el(Spinner)
              : isDefaults
                ? __("Save Defaults", "product-carousel-slider-biddut-block")
                : sliderId
                  ? __("Update Slider", "product-carousel-slider-biddut-block")
                  : __("Create Slider", "product-carousel-slider-biddut-block"),
          ),
          !isDefaults &&
            el(
              "a",
              {
                href: cfg.listUrl || "#",
                className: "components-button is-tertiary",
              },
              __(
                "← Back to All Sliders",
                "product-carousel-slider-biddut-block",
              ),
            ),
        ),
      ),
      el(
        "div",
        { className: "pcsbb-admin-editor-body" },
        el(TabbedFields, {
          attributes: attributes,
          setAttributes: setAttributes,
        }),
        !isDefaults &&
          el(
            "div",
            { className: "pcsbb-admin-editor-preview" },
            el(
              "h3",
              { className: "pcsbb-admin-editor-preview-heading" },
              __("Live Preview", "product-carousel-slider-biddut-block"),
            ),
            el(window.PCSBBShared.LivePreview, {
              attributes: attributes,
              mode: "admin",
            }),
          ),
      ),
    );
  }

  const rootEl = document.getElementById("pcsbb-slider-editor-root");
  if (rootEl) {
    render(el(PCSBBErrorBoundary, null, el(App)), rootEl);
  }
})();
