/**
 * Product Carousel Slider Biddut Block v1.1.0
 */

(function ($) {
  "use strict";

  class PCSBBCarousel {
    constructor($wrapper) {
      this.$wrapper = $wrapper;
      this.$container = null;
      this.$track = null;
      this.$items = null;
      this.$prevArrow = null;
      this.$nextArrow = null;
      this.$dotsContainer = null;
      this.$loader = null;

      // Unique namespace so destroy() doesn't kill other carousel instances
      this.instanceId = "pcsbb_" + Math.random().toString(36).substr(2, 9);

      // Settings from data attributes
      this.variant = this.$wrapper.data("variant") || "card";
      this.columnsDesktop =
        parseInt(this.$wrapper.data("columns-desktop")) || 4;
      this.columnsTablet = parseInt(this.$wrapper.data("columns-tablet")) || 3;
      this.columnsMobile = parseInt(this.$wrapper.data("columns-mobile")) || 2;
      this.columnsPhone = parseInt(this.$wrapper.data("columns-phone")) || 1;
      this.imageHeightMode =
        this.$wrapper.data("image-height-mode") || "natural";
      this.autoplay =
        this.$wrapper.data("autoplay") === true ||
        this.$wrapper.data("autoplay") === "true";
      this.autoplayDelay =
        parseInt(this.$wrapper.data("autoplay-delay")) || 5000;
      this.loop =
        this.$wrapper.data("loop") === true ||
        this.$wrapper.data("loop") === "true";
      this.transitionSpeed =
        parseInt(this.$wrapper.data("transition-speed")) || 500;
      this.showNavigation = this.$wrapper.data("show-navigation") !== false;
      this.navigationStyle = this.$wrapper.data("navigation-style") || "arrows";
      this.prevArrowIcon =
        this.$wrapper.data("prev-arrow-icon") || "dashicons-arrow-left-alt2";
      this.nextArrowIcon =
        this.$wrapper.data("next-arrow-icon") || "dashicons-arrow-right-alt2";
      this.hoverEffect = this.$wrapper.data("hover-effect") || "zoom";
      this.showImageDots =
        this.$wrapper.data("show-image-dots") === true ||
        this.$wrapper.data("show-image-dots") === "true";
      this.showGalleryOnHover =
        this.$wrapper.data("show-gallery-on-hover") !== false;
      this.disableMobileSlider =
        this.$wrapper.data("disable-mobile-slider") === true ||
        this.$wrapper.data("disable-mobile-slider") === "true";

      // State
      this.currentIndex = 0;
      this.itemsPerView = 4;
      this.gap = 30;
      this.totalItems = 0;
      this.maxIndex = 0;
      this.itemWidth = 0;
      this.isDragging = false;
      this.startPos = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.autoplayTimer = null;
      this.isMobileView = false;

      this.init();
    }

    init() {
      this.showLoader();

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.checkMobileView();

        if (this.isMobileView && this.disableMobileSlider) {
          // Mobile non-slider mode
          this.initMobileView();
        } else {
          // Normal carousel mode
          this.buildStructure();
          this.calculateDimensions();
          this.setupNavigation();
          this.setupDragging();
          this.setupHoverEffects();
          this.setupImageDots();
          this.updateNavigation();
          this.setupAutoplay();
          this.setupResponsive();
        }

        this.hideLoader();
      }, 100);
    }

    showLoader() {
      // Add loading state to wrapper
      this.$wrapper.addClass("pcsbb-loading");

      // Create loader element
      this.$loader = $(
        '<div class="pcsbb-loader"><div class="pcsbb-loader-dots"><span></span><span></span><span></span></div></div>',
      );
      this.$wrapper.prepend(this.$loader);
    }

    hideLoader() {
      setTimeout(() => {
        if (this.$loader) {
          this.$loader.fadeOut(300, function () {
            $(this).remove();
          });
        }
        this.$wrapper.removeClass("pcsbb-loading");
      }, 400);
    }

    checkMobileView() {
      const windowWidth = $(window).width();
      // Consider mobile as any device below 768px (tablets and phones)
      this.isMobileView = windowWidth < 768;
    }

    initMobileView() {
      // For mobile vertical layout - simple vertical stack, no carousel
      const $items = this.$wrapper.find(".pcsbb-product-item");
      this.totalItems = $items.length;

      if (this.totalItems === 0) return;

      // Create a clean vertical container
      const $verticalContainer = $(
        '<div class="pcsbb-mobile-vertical-container"></div>',
      );

      // Move all items into the vertical container
      $items.each(function () {
        $verticalContainer.append($(this));
      });

      // Replace wrapper content with vertical container
      this.$wrapper.empty().append($verticalContainer);

      // Add mobile vertical mode class
      this.$wrapper.addClass("pcsbb-mobile-vertical-mode");

      // Remove any carousel-related classes
      this.$wrapper.removeClass("dragging");

      // Setup hover effects even in mobile mode
      this.setupHoverEffects();
      this.setupImageDots();
    }

    buildStructure() {
      const $items = this.$wrapper.find(".pcsbb-product-item");
      this.totalItems = $items.length;

      if (this.totalItems === 0) return;

      // Create container
      const showArrows =
        this.showNavigation &&
        (this.navigationStyle === "arrows" || this.navigationStyle === "both");
      const showDots =
        this.showNavigation &&
        (this.navigationStyle === "dots" || this.navigationStyle === "both");

      let containerHTML =
        '<div class="pcsbb-carousel-container"><div class="pcsbb-carousel-track"></div>';

      if (showArrows) {
        containerHTML += `
          <button class="pcsbb-nav-arrow pcsbb-nav-arrow-prev" aria-label="Previous">
            <span class="dashicons ${this.prevArrowIcon}"></span>
          </button>
          <button class="pcsbb-nav-arrow pcsbb-nav-arrow-next" aria-label="Next">
            <span class="dashicons ${this.nextArrowIcon}"></span>
          </button>
        `;
      }

      if (showDots) {
        containerHTML += '<div class="pcsbb-nav-dots"></div>';
      }

      containerHTML += "</div>";

      this.$wrapper.wrapInner('<div class="pcsbb-carousel-inner"></div>');
      const $inner = this.$wrapper.find(".pcsbb-carousel-inner");
      $inner.wrap(containerHTML);
      $items.appendTo(this.$wrapper.find(".pcsbb-carousel-track"));
      $inner.remove();

      this.$container = this.$wrapper.find(".pcsbb-carousel-container");
      this.$track = this.$wrapper.find(".pcsbb-carousel-track");
      this.$items = this.$track.find(".pcsbb-product-item");
      this.$prevArrow = this.$wrapper.find(".pcsbb-nav-arrow-prev");
      this.$nextArrow = this.$wrapper.find(".pcsbb-nav-arrow-next");
      this.$dotsContainer = this.$wrapper.find(".pcsbb-nav-dots");
    }

    calculateDimensions() {
      const wrapperWidth = this.$wrapper.width();
      const windowWidth = $(window).width();

      // Check if mobile view
      this.checkMobileView();

      // Determine items per view based on screen size
      if (windowWidth >= 1280) {
        this.itemsPerView = this.columnsDesktop;
      } else if (windowWidth >= 768) {
        this.itemsPerView = this.columnsTablet;
      } else if (windowWidth >= 480) {
        this.itemsPerView = this.columnsMobile;
      } else {
        this.itemsPerView = this.columnsPhone;
      }

      // Gap must match CSS .pcsbb-carousel-track gap at each breakpoint
      if (windowWidth >= 1280) {
        this.gap = 24; // default CSS gap: 24px
      } else if (windowWidth >= 768) {
        this.gap = 20; // tablet CSS gap: 20px
      } else if (windowWidth >= 480) {
        this.gap = 16; // mobile CSS gap: 16px
      } else {
        this.gap = 12; // phone CSS gap: 12px
      }

      // Each item has padding: 4px (gallery) or 0 (card), with box-sizing: border-box
      // So the JS-set width IS the outer width in both cases — no extra offset needed
      const itemPadding = 0;

      // Calculate item width (integer pixels to avoid sub-pixel rendering gaps/clips)
      const totalGap = this.gap * (this.itemsPerView - 1);
      this.itemWidth = Math.round(
        (wrapperWidth - totalGap) / this.itemsPerView,
      );

      // Set item widths
      this.$items.css("width", this.itemWidth + "px");

      // Calculate max index
      this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);

      // Ensure current index is within bounds
      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = this.maxIndex;
      }

      // Update dots
      if (this.$dotsContainer && this.$dotsContainer.length) {
        this.buildDots();
      }
    }

    buildDots() {
      this.$dotsContainer.empty();
      const totalDots = this.maxIndex + 1;

      for (let i = 0; i < totalDots; i++) {
        const $dot = $('<button class="pcsbb-nav-dot"></button>');
        if (i === this.currentIndex) {
          $dot.addClass("active");
        }
        $dot.attr("aria-label", "Go to slide " + (i + 1));
        $dot.data("index", i);
        this.$dotsContainer.append($dot);
      }

      // Attach click handlers
      const self = this;
      this.$dotsContainer.find(".pcsbb-nav-dot").on("click", function (e) {
        e.preventDefault();
        const index = $(this).data("index");
        self.goToSlide(index);
      });
    }

    setupNavigation() {
      const self = this;

      if (this.$prevArrow && this.$prevArrow.length) {
        this.$prevArrow.on("click", function (e) {
          e.preventDefault();
          self.goToPrev();
        });
      }

      if (this.$nextArrow && this.$nextArrow.length) {
        this.$nextArrow.on("click", function (e) {
          e.preventDefault();
          self.goToNext();
        });
      }
    }

    setupDragging() {
      const self = this;
      const ns = "." + this.instanceId;

      this.$track.on("mousedown" + ns, function (e) {
        self.dragStart(e);
      });

      $(document).on("mousemove" + ns, function (e) {
        if (self.isDragging) self.drag(e);
      });

      $(document).on("mouseup" + ns, function () {
        if (self.isDragging) self.dragEnd();
      });

      this.$track.on("touchstart" + ns, function (e) {
        self.dragStart(e.touches[0]);
      });

      this.$track.on("touchmove" + ns, function (e) {
        if (self.isDragging) self.drag(e.touches[0]);
      });

      this.$track.on("touchend" + ns, function () {
        if (self.isDragging) self.dragEnd();
      });

      this.$track.find("img").on("dragstart" + ns, () => false);
    }

    dragStart(event) {
      this.isDragging = true;
      this.startPos = this.getPositionX(event);
      this.$wrapper.addClass("dragging");
      this.$track.css("transition", "none");
      this.stopAutoplay();
    }

    drag(event) {
      if (!this.isDragging) return;
      const currentPosition = this.getPositionX(event);
      this.currentTranslate =
        this.prevTranslate + currentPosition - this.startPos;
      this.setSliderPosition();
    }

    dragEnd() {
      this.isDragging = false;
      this.$wrapper.removeClass("dragging");
      this.$track.css(
        "transition",
        `transform ${this.transitionSpeed}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      );

      const movedBy = this.currentTranslate - this.prevTranslate;
      const threshold = this.itemWidth / 4;

      if (movedBy < -threshold && this.currentIndex < this.maxIndex) {
        this.currentIndex++;
      } else if (movedBy > threshold && this.currentIndex > 0) {
        this.currentIndex--;
      }

      this.goToSlide(this.currentIndex);
      this.startAutoplay();
    }

    getPositionX(event) {
      return event.type && event.type.includes("mouse")
        ? event.pageX
        : event.clientX;
    }

    setSliderPosition() {
      this.$track.css("transform", `translateX(${this.currentTranslate}px)`);
    }

    goToSlide(index) {
      this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
      // Step = item width + gap; Math.round(itemWidth) prevents sub-pixel drift on repeated clicks
      const stepWidth = this.itemWidth + this.gap;
      this.currentTranslate = -stepWidth * this.currentIndex;
      this.prevTranslate = this.currentTranslate;
      this.setSliderPosition();
      this.updateNavigation();
    }

    goToNext() {
      if (this.currentIndex < this.maxIndex) {
        this.goToSlide(this.currentIndex + 1);
      } else if (this.loop) {
        this.goToSlide(0);
      }
    }

    goToPrev() {
      if (this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1);
      } else if (this.loop) {
        this.goToSlide(this.maxIndex);
      }
    }

    updateNavigation() {
      // Update arrows - hide instead of disable
      if (this.$prevArrow && this.$prevArrow.length) {
        if (this.currentIndex === 0 && !this.loop) {
          this.$prevArrow.hide();
        } else {
          this.$prevArrow.show().removeClass("disabled");
        }
      }

      if (this.$nextArrow && this.$nextArrow.length) {
        if (this.currentIndex >= this.maxIndex && !this.loop) {
          this.$nextArrow.hide();
        } else {
          this.$nextArrow.show().removeClass("disabled");
        }
      }

      // Hide arrows if all items fit
      if (this.totalItems <= this.itemsPerView) {
        if (this.$prevArrow) this.$prevArrow.hide();
        if (this.$nextArrow) this.$nextArrow.hide();
      }

      // Update dots
      if (this.$dotsContainer && this.$dotsContainer.length) {
        this.$dotsContainer.find(".pcsbb-nav-dot").removeClass("active");
        this.$dotsContainer
          .find(".pcsbb-nav-dot")
          .eq(this.currentIndex)
          .addClass("active");
      }
    }

    setupHoverEffects() {
      const self = this;

      // Get items - works for both carousel and mobile vertical modes
      const $items = this.$wrapper.find(".pcsbb-product-item");

      $items.each(function () {
        const $item = $(this);
        const $imageWrapper = $item.find(".pcsbb-product-image-wrapper");
        const $mainImage = $item.find(".pcsbb-main-image");
        const $galleryImage = $item.find(".pcsbb-gallery-image");

        // Gallery hover effect - only if gallery image exists and has valid src
        const hasGalleryImage =
          $galleryImage.length &&
          $galleryImage.attr("src") &&
          $galleryImage.attr("src") !== "";

        if (self.showGalleryOnHover && hasGalleryImage) {
          $imageWrapper
            .on("mouseenter", function () {
              $mainImage.css("opacity", "0");
              $galleryImage.css("opacity", "1");
            })
            .on("mouseleave", function () {
              $mainImage.css("opacity", "1");
              $galleryImage.css("opacity", "0");
            });
        } else if (self.showGalleryOnHover && !hasGalleryImage) {
          // If gallery hover is enabled but no gallery image, zoom the main image
          $imageWrapper
            .on("mouseenter", function () {
              $mainImage.css("transform", "scale(1.08)");
            })
            .on("mouseleave", function () {
              $mainImage.css("transform", "scale(1)");
            });
        }

        // Apply hover effect based on setting (only if not already handled by gallery)
        if (!self.showGalleryOnHover || hasGalleryImage) {
          switch (self.hoverEffect) {
            case "zoom":
              $item
                .on("mouseenter", function () {
                  if (!self.showGalleryOnHover || !hasGalleryImage) {
                    $mainImage.css("transform", "scale(1.08)");
                  }
                })
                .on("mouseleave", function () {
                  if (!self.showGalleryOnHover || !hasGalleryImage) {
                    $mainImage.css("transform", "scale(1)");
                  }
                });
              break;

            case "lift":
              $item
                .on("mouseenter", function () {
                  // Don't apply lift in mobile vertical mode (CSS handles it)
                  if (!self.$wrapper.hasClass("pcsbb-mobile-vertical-mode")) {
                    $item.css("transform", "translateY(-10px)");
                  }
                })
                .on("mouseleave", function () {
                  if (!self.$wrapper.hasClass("pcsbb-mobile-vertical-mode")) {
                    $item.css("transform", "translateY(0)");
                  }
                });
              break;

            case "glow":
              $item
                .on("mouseenter", function () {
                  $imageWrapper.css(
                    "box-shadow",
                    "0 10px 30px rgba(0, 0, 0, 0.2)",
                  );
                })
                .on("mouseleave", function () {
                  $imageWrapper.css("box-shadow", "none");
                });
              break;
          }
        }
      });
    }

    setupImageDots() {
      if (!this.showImageDots) return;

      const self = this;

      // Find dots in the current context (works for both modes)
      const $dots = this.$wrapper.find(".pcsbb-dot");

      $dots.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $dot = $(this);
        const imageUrl = $dot.data("image");
        const $imageWrapper = $dot.closest(".pcsbb-product-image-wrapper");
        const $mainImage = $imageWrapper.find(".pcsbb-main-image");

        if (!imageUrl) return;

        $imageWrapper.find(".pcsbb-dot").removeClass("active");
        $dot.addClass("active");

        $mainImage.css("opacity", "0");
        setTimeout(function () {
          $mainImage.attr("src", imageUrl);
          $mainImage.css("opacity", "1");
        }, 200);
      });
    }

    setupAutoplay() {
      if (this.autoplay) {
        this.startAutoplay();
        const self = this;
        const ns = "." + this.instanceId;
        this.$wrapper
          .on("mouseenter" + ns, function () {
            self.stopAutoplay();
          })
          .on("mouseleave" + ns, function () {
            self.startAutoplay();
          });
      }
    }

    startAutoplay() {
      if (!this.autoplay) return;

      const self = this;
      this.stopAutoplay();
      this.autoplayTimer = setInterval(function () {
        self.goToNext();
      }, this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    setupResponsive() {
      const self = this;
      const ns = "." + this.instanceId;
      let resizeTimer;

      $(window).on("resize" + ns + " orientationchange" + ns, function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          const wasInMobileMode = self.isMobileView && self.disableMobileSlider;
          self.checkMobileView();
          const isNowInMobileMode =
            self.isMobileView && self.disableMobileSlider;

          if (wasInMobileMode !== isNowInMobileMode) {
            // Mode changed: fully reset DOM and reinit
            self.destroy();
            self.init();
          } else {
            // Same mode — just recalculate widths and re-translate
            if (self.$items && self.$items.length) {
              self.calculateDimensions();
              self.$track.css("transition", "none");
              self.goToSlide(self.currentIndex);
              setTimeout(function () {
                if (self.$track) {
                  self.$track.css(
                    "transition",
                    "transform " +
                      self.transitionSpeed +
                      "ms cubic-bezier(0.25,0.46,0.45,0.94)",
                  );
                }
              }, 50);
            }
          }
        }, 200);
      });
    }

    destroy() {
      const ns = "." + this.instanceId;
      this.stopAutoplay();

      // Remove namespaced events — safe for multi-carousel pages
      $(document).off(ns);
      $(window).off(ns);
      if (this.$wrapper) this.$wrapper.off(ns);
      if (this.$track) this.$track.off(ns);

      // Remove loader
      if (this.$loader) {
        this.$loader.remove();
        this.$loader = null;
      }

      // *** Restore flat DOM so init() can rebuild cleanly ***
      const $items = this.$wrapper.find(".pcsbb-product-item").detach();
      this.$wrapper.empty();
      $items.css("width", "").css("transform", "");
      this.$wrapper.append($items);
      this.$wrapper.removeClass(
        "dragging pcsbb-loading pcsbb-mobile-vertical-mode",
      );

      // Reset references
      this.$container = null;
      this.$track = null;
      this.$items = null;
      this.$prevArrow = null;
      this.$nextArrow = null;
      this.$dotsContainer = null;
      this.currentIndex = 0;
      this.isDragging = false;
    }
  }

  // Initialize all carousels
  function initCarousels() {
    $(".pcsbb-carousel-wrapper").each(function () {
      const $wrapper = $(this);

      if ($wrapper.data("pcsbb-carousel")) {
        return;
      }

      const carousel = new PCSBBCarousel($wrapper);
      $wrapper.data("pcsbb-carousel", carousel);
    });
  }

  $(document).ready(function () {
    initCarousels();
  });

  // Re-initialize for page builders
  $(document).on("DOMContentLoaded", initCarousels);

  window.PCSBBCarousel = PCSBBCarousel;
  window.initPCSBBCarousels = initCarousels;
})(jQuery);
