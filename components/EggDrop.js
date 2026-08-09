"use client";

import { useEffect, useRef } from "react";

/**
 * Fresh eggs, delivered by scroll.
 *
 * WHY THIS EXISTS, because the reason matters more than the code: the client
 * asked for "a little bit of motion" here, and the thing she was pointing at was
 * glazedweb.com — specifically the Chism card under "Fresh from the shop", where
 * three eggs drop in as you scroll. Her words: "maybe we can have the chicken lay
 * an egg here to break things up, lol!" She had already seen the effect and
 * described it back to us.
 *
 * So the mechanic below is not an approximation of that card. It is lifted from
 * it: the same fall, the same per-egg scroll windows, the same squash on landing,
 * the same deepening shadow, the same reduced-motion behaviour. If the glazedweb
 * version is ever retuned, retune it there and copy the numbers across rather
 * than inventing new ones here.
 *
 * WHAT IS DELIBERATELY DIFFERENT. Two things:
 *
 * 1. These are their eggs, not ours. The glazedweb version puts a green glaze cap
 *    on the big egg, because that is our logo and the joke is a glazed egg. On a
 *    poultry farm's own storefront a green-capped egg reads as a spoiled one, so
 *    the eggs here are brown and cream farm eggs, speckled, landing in pasture
 *    grass. Same motion, their brand.
 *
 * 2. There is no chicken. The client asked for one, and this is the one part of
 *    her note not taken literally, for a straightforward reason: eggs falling
 *    from above the frame is a nice piece of motion, and a hen standing next to
 *    eggs falling out of the sky is a confusing one. The glazedweb card had a hen
 *    and it was cut for the same reason. What survives of the joke is the "bok
 *    bok bok" that pops while the eggs are dropping — the chicken is off-frame
 *    and audible, which is funnier than drawing her. That bubble is one group at
 *    the end of the drawing and one CSS block; if she wants it gone it goes in a
 *    minute, and the motion is untouched.
 *
 * The egg cluster sits left of the band's centre rather than in the middle of it,
 * which is not an accident of drawing: it leaves the right-hand side to the
 * bubble. Subject left, speech right.
 *
 * Everything here is decorative: the SVG is aria-hidden, the bubble is
 * aria-hidden, and nothing on the page depends on any of it. With JavaScript off
 * the eggs render already settled in the grass, because their resting position is
 * the position in the markup and it is JS that lifts them out of frame, not JS
 * that puts them down.
 */

// How far above its resting place an egg starts, in viewBox units. The tallest
// egg has 90 units of clear headroom above it, so a little over twice that means
// each egg is out of frame at rest and visibly falls for the last stretch —
// which is the proportion the glazedweb card uses.
const FALL = 215;

// Ground line. Blades grow from just below it so the bases sit at different
// depths; egg bottoms sit a few units above it so they nestle rather than perch.
const GROUND = 192;

/**
 * One egg, as a closed path. Two mirrored cubics, wider below the middle than
 * above it, which is what makes an egg an egg rather than an ellipse. The
 * proportions (0.25 / 0.53 / 0.76 of the height, shoulders at 0.5625 of the half
 * width) are measured off the glazedweb egg so the silhouette matches.
 */
function eggPath(cx, top, halfW, h) {
  const s = halfW * 0.5625;
  const r = (n) => Math.round(n * 100) / 100;
  return [
    `M ${cx} ${top}`,
    `C ${r(cx + s)} ${top} ${r(cx + halfW)} ${r(top + h * 0.25)} ${r(cx + halfW)} ${r(top + h * 0.53)}`,
    `C ${r(cx + halfW)} ${r(top + h * 0.76)} ${r(cx + s)} ${r(top + h)} ${cx} ${r(top + h)}`,
    `C ${r(cx - s)} ${r(top + h)} ${r(cx - halfW)} ${r(top + h * 0.76)} ${r(cx - halfW)} ${r(top + h * 0.53)}`,
    `C ${r(cx - halfW)} ${r(top + h * 0.25)} ${r(cx - s)} ${top} ${cx} ${top}`,
    "Z",
  ].join(" ");
}

/**
 * One blade of grass: filled and tapered rather than a stroked line, because a
 * stroke has the same width at the tip as at the base and reads as a wire.
 */
function bladePath(x, baseY, h, lean, w) {
  const r = (n) => Math.round(n * 100) / 100;
  const tipX = x + lean;
  const tipY = baseY - h;
  return [
    `M ${r(x - w / 2)} ${baseY}`,
    `C ${r(x - w / 2 + lean * 0.2)} ${r(baseY - h * 0.45)} ${r(x + lean * 0.55)} ${r(baseY - h * 0.8)} ${r(tipX)} ${r(tipY)}`,
    `C ${r(x + lean * 0.35)} ${r(baseY - h * 0.78)} ${r(x + w / 2 + lean * 0.15)} ${r(baseY - h * 0.42)} ${r(x + w / 2)} ${baseY}`,
    "Z",
  ].join(" ");
}

// Pasture green and dry stalk, from the brand tokens. TINT is a lightened
// barn-light used only for the blades furthest back, so the patch has some depth
// instead of reading as one flat comb.
const BARN = "#4E5B45";
const BARN_LIGHT = "#6F7D5A";
const TINT = "#8A9670";
const WHEAT = "#C79A54";
const WHEAT_LIGHT = "#E0C489";

// [x, baseY, height, lean, baseWidth, fill]. Dense in the middle where the eggs
// land, thinning toward the edges so the patch has an edge rather than a crop.
const GRASS_BACK = [
  [30, 195, 13, 4, 2.0, TINT],
  [44, 194, 17, -5, 2.2, TINT],
  [56, 194, 20, 6, 2.4, TINT],
  [70, 193, 27, -7, 2.6, BARN_LIGHT],
  [82, 195, 17, 5, 2.2, WHEAT_LIGHT],
  [95, 192, 34, 9, 2.8, BARN_LIGHT],
  [104, 194, 23, -6, 2.4, TINT],
  [116, 193, 39, 7, 3.0, BARN_LIGHT],
  [126, 195, 26, -9, 2.4, WHEAT_LIGHT],
  [138, 192, 44, 11, 3.0, TINT],
  [150, 194, 30, -7, 2.6, BARN_LIGHT],
  [162, 193, 48, 8, 3.2, BARN_LIGHT],
  [174, 195, 33, -10, 2.6, TINT],
  [186, 192, 52, 12, 3.2, BARN_LIGHT],
  [198, 194, 36, -8, 2.8, WHEAT_LIGHT],
  [209, 193, 45, 9, 3.0, TINT],
  [220, 195, 29, -7, 2.4, BARN_LIGHT],
  [232, 192, 40, 10, 2.8, BARN_LIGHT],
  [243, 194, 24, -6, 2.4, TINT],
  [254, 193, 31, 8, 2.6, WHEAT_LIGHT],
  [266, 195, 21, -5, 2.2, BARN_LIGHT],
  [278, 193, 26, 7, 2.4, TINT],
  [292, 194, 18, -5, 2.2, BARN_LIGHT],
  [306, 195, 14, 4, 2.0, WHEAT_LIGHT],
  [318, 194, 16, -5, 2.2, TINT],
  [332, 195, 12, 4, 2.0, TINT],
];

// Drawn after the eggs, so the eggs sit down into the grass instead of on top of
// it. Only where the eggs land. Taller than a first pass had them: at half this
// height the eggs read as resting on a lawn rather than settled in a pasture,
// and the blade tips crossing the shells are the whole point of a second layer.
const GRASS_FRONT = [
  [78, 196, 26, 6, 2.4, BARN],
  [86, 195, 20, -5, 2.2, BARN_LIGHT],
  [92, 196, 30, 7, 2.6, BARN],
  [103, 195, 22, -5, 2.2, BARN_LIGHT],
  [114, 196, 34, 8, 2.8, BARN],
  [128, 195, 25, -6, 2.4, WHEAT],
  [142, 196, 36, 9, 2.8, BARN],
  [156, 195, 27, -6, 2.4, BARN_LIGHT],
  [170, 196, 40, 10, 3.0, BARN],
  [184, 195, 30, -7, 2.6, BARN_LIGHT],
  [198, 196, 35, 8, 2.8, BARN],
  [212, 195, 23, -5, 2.2, WHEAT],
  [226, 196, 32, 8, 2.6, BARN],
  [240, 195, 26, -6, 2.4, BARN_LIGHT],
  [252, 196, 29, 7, 2.4, BARN],
  [263, 195, 20, -4, 2.2, BARN_LIGHT],
];

// Speckles, as [cx, cy, rx, ry]. Kept well inside each silhouette so no clip
// path is needed to stop them spilling over an edge.
const SPECKLE_A = [
  [150, 120, 2.2, 1.7],
  [176, 112, 1.6, 1.3],
  [182, 138, 2.6, 2.0],
  [156, 150, 1.9, 1.5],
  [171, 164, 2.3, 1.8],
  [144, 138, 1.5, 1.2],
  [189, 158, 1.7, 1.4],
  [162, 132, 1.3, 1.1],
];
const SPECKLE_C = [
  [210, 150, 1.6, 1.3],
  [225, 144, 1.3, 1.0],
  [228, 164, 1.9, 1.5],
  [214, 172, 1.5, 1.2],
  [220, 158, 1.1, 0.9],
];

export default function EggDrop() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // zone is the slice of the band's travel through the viewport over which this
    // egg makes its whole fall. Overlapping windows, so the big one is already
    // down before the last one commits — three separate arrivals rather than one
    // synchronised drop, which is the difference between this reading as weather
    // and reading as a slide transition.
    const eggs = [
      { el: root.querySelector(".egg-a"), sh: root.querySelector(".sh-a"), zone: [0.26, 0.4], tilt: 0 },
      { el: root.querySelector(".egg-b"), sh: root.querySelector(".sh-b"), zone: [0.34, 0.48], tilt: -7 },
      { el: root.querySelector(".egg-c"), sh: root.querySelector(".sh-c"), zone: [0.42, 0.56], tilt: 6 },
    ].filter((e) => e.el);
    if (!eggs.length) return;

    const clamp01 = (v) => Math.min(1, Math.max(0, v));

    // ei is 0 at the top of the fall and 1 landed. The squash only exists in the
    // last 14% of it: a half sine, so the egg compresses on contact and comes
    // straight back to shape. Without it an egg arrives like a lift reaching a
    // floor.
    const place = (egg, ei) => {
      const y = -FALL * (1 - ei);
      const k = ei > 0.86 ? (ei - 0.86) / 0.14 : 0;
      const squash = 1 - 0.13 * Math.sin(k * Math.PI);
      egg.el.style.transform = `translateY(${y}px) rotate(${egg.tilt * ei}deg) scaleY(${squash})`;
      if (egg.sh) {
        egg.sh.style.opacity = String(0.1 + 0.9 * ei);
        egg.sh.style.transform = `scaleX(${0.5 + 0.5 * ei})`;
      }
    };

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Not "no animation, so no eggs": the settled scene, held still. Somebody
      // who has asked their machine to stop moving things still gets the picture.
      eggs.forEach((egg) => place(egg, 1));
      return;
    }

    root.classList.add("egg-drop-armed");

    let raf = 0;
    let hideT = 0;
    let visible = false;

    const render = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the band's top edge is level with the bottom of the viewport, 1
      // when its bottom edge has left the top. Independent of page length, so it
      // behaves the same whatever gets added above or below this section.
      const cp = clamp01((vh - r.top) / (vh + r.height));
      eggs.forEach((egg) => place(egg, clamp01((cp - egg.zone[0]) / (egg.zone[1] - egg.zone[0]))));
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (!visible) root.classList.remove("boking");
        else render();
      },
      { threshold: 0.2 }
    );
    io.observe(root);

    const onScroll = () => {
      if (visible) {
        root.classList.add("boking");
        clearTimeout(hideT);
        hideT = setTimeout(() => root.classList.remove("boking"), 1200);
      }
      if (!raf) raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(hideT);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("egg-drop-armed", "boking");
    };
  }, []);

  return (
    // Left-aligned, not centred. Centred inside the section it floated in the
    // middle of the page with a third of the width empty either side, above a
    // heading that is hard left — a decoration sitting near some text rather than
    // a thing introducing it. Flush left, the eggs land directly over "Fresh from
    // the pasture" and the eye falls from one into the other, which is the whole
    // job. max-w keeps an egg egg-sized on a wide monitor.
    <div ref={rootRef} className="egg-drop w-full max-w-[440px]">
      <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <defs>
          {/* Light from the upper left on all three, same as the photography. */}
          <radialGradient id="edBrown" cx="36%" cy="26%" r="82%">
            <stop offset="0%" stopColor="#F6E6CA" />
            <stop offset="42%" stopColor="#E2C08A" />
            <stop offset="100%" stopColor="#BE8F4E" />
          </radialGradient>
          <radialGradient id="edCream" cx="36%" cy="26%" r="82%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFF9EE" />
            <stop offset="100%" stopColor="#EADCC4" />
          </radialGradient>
          {/* Sunlit haze behind the grass. This started as a rectangle with a
              gradient in it and it read as exactly that: a tan panel with three
              hard edges sitting on the cream. An ellipse whose centre is well
              above the bottom of the frame fades out in every direction on its
              own, including downward, so the band has no edge anywhere. */}
          <radialGradient id="edHaze">
            <stop offset="0%" stopColor="#E8D8BE" stopOpacity="0.62" />
            <stop offset="58%" stopColor="#E8D8BE" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E8D8BE" stopOpacity="0" />
          </radialGradient>
          {/* Contact shadows. Hard-edged ellipses read as grey stickers under the
              eggs; blurred, they read as eggs touching ground. The generous
              filter region is deliberate — the default cuts the blur off at 10%
              past the shape and you get a soft shadow with a crisp rectangle
              around it. */}
          <filter id="edSoft" x="-40%" y="-260%" width="180%" height="620%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <filter id="edSofter" x="-40%" y="-260%" width="180%" height="620%">
            <feGaussianBlur stdDeviation="3.4" />
          </filter>
        </defs>

        <ellipse cx="180" cy="168" rx="164" ry="30" fill="url(#edHaze)" />
        {/* The ground the blades grow out of. Without it they sprout from the
            bottom crop line and look like they are standing on nothing. */}
        <ellipse cx="180" cy="191" rx="134" ry="5" fill="#6B5A4E" fillOpacity="0.18" filter="url(#edSofter)" />

        <g>
          {GRASS_BACK.map(([x, y, h, lean, w, fill], i) => (
            <path key={`gb${i}`} d={bladePath(x, y, h, lean, w)} fill={fill} />
          ))}
        </g>

        {/* Landing shadows. The fill carries the transparency and the element
            opacity carries the animation, so with no JS these render at their
            settled weight instead of as three solid brown blots. */}
        <ellipse className="eggshadow sh-a" cx="166" cy={GROUND + 4} rx="32" ry="5" fill="#3B2F28" fillOpacity="0.3" filter="url(#edSoft)" />
        <ellipse className="eggshadow sh-b" cx="104" cy={GROUND + 5} rx="25" ry="4" fill="#3B2F28" fillOpacity="0.3" filter="url(#edSoft)" />
        <ellipse className="eggshadow sh-c" cx="218" cy={GROUND + 5.5} rx="20" ry="3.2" fill="#3B2F28" fillOpacity="0.3" filter="url(#edSoft)" />

        {/* Big brown one, dead centre, first to arrive. */}
        <g className="egg egg-a">
          <path d={eggPath(166, 90, 34, 92)} fill="url(#edBrown)" />
          {SPECKLE_A.map(([cx, cy, rx, ry], i) => (
            <ellipse key={`sa${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#9C7038" opacity="0.38" />
          ))}
          <path d="M 138 128 A 28 36 0 0 1 149 104" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.5" />
          <circle cx="155" cy="99" r="2.2" fill="#FFFFFF" opacity="0.55" />
        </g>

        {/* Cream one, left, tipped anticlockwise where it comes to rest. */}
        <g className="egg egg-b">
          <path d={eggPath(104, 113, 27, 72)} fill="url(#edCream)" />
          <path d="M 82 146 A 20 26 0 0 1 91 128" fill="none" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* Small brown one, right, last in. */}
        <g className="egg egg-c">
          <path d={eggPath(218, 128, 22, 58)} fill="url(#edBrown)" />
          {SPECKLE_C.map(([cx, cy, rx, ry], i) => (
            <ellipse key={`sc${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#9C7038" opacity="0.38" />
          ))}
          <path d="M 200 158 A 16 21 0 0 1 207 143" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" opacity="0.5" />
        </g>

        <g>
          {GRASS_FRONT.map(([x, y, h, lean, w, fill], i) => (
            <path key={`gf${i}`} d={bladePath(x, y, h, lean, w)} fill={fill} />
          ))}
        </g>

        {/* The chicken, off-frame right, drawn last so she sits in front of the
            grass. This is inside the SVG rather than positioned over it as HTML,
            and that is the whole point: as an absolutely-positioned span with a
            px font size, the bubble stayed the same size while the band shrank
            with the viewport, so the gap between it and the small egg closed as
            the screen narrowed. It cleared by 1px at 390 and overlapped the shell
            by 18px at 320. In here it is in the same coordinate space as the eggs
            and holds the same relationship to them at every width, which is a
            thing that cannot drift rather than a number that happened to fit. */}
        <g className="bok">
          <path
            d="M 274 148 L 340 148 A 12 12 0 0 1 340 172 L 290 172 L 266 184 L 278 172 L 274 172 A 12 12 0 0 1 274 148 Z"
            fill="#FFFCF6"
            stroke="#3B2F28"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text
            x="307"
            y="164"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="800"
            letterSpacing="0.2"
            fill="#9E4739"
          >
            bok bok bok
          </text>
        </g>
      </svg>
    </div>
  );
}
