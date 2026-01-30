$( () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  $('body').prepend(`
    <div class="vf-cursor" aria-hidden="true">
      <span class="vf-cursor__dot"></span>
      <span class="vf-cursor__diamond-wrap">
        <span class="vf-cursor__diamond"></span>
        <span class="vf-cursor__line vf-cursor__line--top"></span>
        <span class="vf-cursor__line vf-cursor__line--bottom"></span>
      </span>
    </div>
  `);

  const $cursor = $(".vf-cursor");
  const $diamondWrap = $(".vf-cursor__diamond-wrap");

  let mouseX = 0, mouseY = 0;
  let dx = 0, dy = 0;

  // Track mouse (dot snaps)
  $(window).on("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    $cursor.css({
      top: mouseY,
      left: mouseX,
      display: 'block'
    });
  });

  // Lag animation loop (diamond only)
  function animate() {
    dx += (mouseX - dx) * 0.18; // ← lag strength (lower = more lag)
    dy += (mouseY - dy) * 0.18;

    $diamondWrap.css({
      transform: `translate(${dx - mouseX}px, ${dy - mouseY}px)`
    });

    requestAnimationFrame(animate);
  }
  animate();

  // Hide on leave
  $(document).on("mouseleave", () => {
    $cursor.css("display","none");
  });

// Hover targets
const HOVER_SEL = `
  a,
  button,
  [role="button"],
  input,
  textarea,
  select,
  label,
  .sqs-block-button a,
  .sqs-block-button-element
`;

let hoverTimer = null;

$(document).on("mouseenter", HOVER_SEL, function () {
  hoverTimer = setTimeout(() => {
    $(".vf-cursor").addClass("is-hover");
  }, 100); // ⏱ 0.3s delay
});

$(document).on("mouseleave", HOVER_SEL, function () {
  clearTimeout(hoverTimer);
  hoverTimer = null;
  $(".vf-cursor").removeClass("is-hover");
});


  // Click hold (non-links)
  $(document).on("mousedown", (e) => {
    if (!$(e.target).closest("a").length) {
      $cursor.addClass("is-down");
    }
  });

  $(document).on("mouseup", () => {
    $cursor.removeClass("is-down");
  });
});
