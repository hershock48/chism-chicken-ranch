"use client";

import { useEffect, useRef } from "react";

/**
 * Their logo, alive: the hen scurries in from off the right of the page and
 * settles into her spot inside the arch.
 *
 * WHY THIS EXISTS. The client asked for motion because of glazedweb.com, and
 * specifically because of the mark: "your webpage looks awesome", the drippy
 * donut is the thing they kept mentioning, and Kevin's read was that what they
 * actually want is their own logo doing what his does. So this is not another
 * scroll effect. It is the mark itself, and the whole idea is his: take the
 * chicken out of their logo and run her along to the spot where she sits.
 *
 * THE HEN IS THEIR HEN, NOT A DRAWING OF IT. That is the one decision
 * everything else follows from. Their logo exists only as a 500x500 JPEG, and
 * the hen inside it is 103x101 pixels of fine cross-hatched engraving. Redrawing
 * her as vector line art was the obvious route and it was the wrong one: a
 * redrawn hen sits inside their real arch, next to their real type, where the
 * comparison is immediate and any wobble in the linework reads as a mistake. So
 * she is cut out of the logo itself and animated as pixels.
 *
 * public/mark/ holds the three pieces that came out of logo.jpg:
 *
 *   arch.png   the mark with the hen and her grass lifted out
 *   hen.png    the hen alone, comb to feet
 *   grass.png  the tuft she stands in, which draws on top of her feet
 *
 * Composited at the offsets below they reproduce the original mark to a mean
 * error of 0.15 out of 255, which is JPEG noise. When she is home, this IS their
 * logo. Nothing about it has been redrawn or approximated.
 *
 * She runs right-to-left because that is the way she faces in the logo. Entering
 * from the left would mean mirroring her, and a hen who flips direction on
 * arrival is a hen with two poses.
 *
 * The grass appears as she stops rather than sitting there waiting, so the tuft
 * doubles as the dust she kicks up. It is also why her sprite carries her whole
 * legs and feet: the tuft draws over them at the end, exactly as in the original.
 *
 * The percentages are measured, not eyeballed — they are where each piece sat in
 * logo.jpg, as a fraction of the cropped mark. Do not round them.
 */
const HEN = { left: "33.333%", top: "26.502%", width: "35.764%" };
const GRASS = { left: "32.986%", top: "57.597%", width: "34.375%" };

export default function MarkRun() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Nothing here starts the animation on its own. The CSS default is the hen
    // already home, so with the script blocked, or with reduced motion asked
    // for, the band renders as their logo and stays that way.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        el.classList.add("is-running");
        io.disconnect(); // an entrance, once — not every time you scroll past
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mark-run relative mx-auto w-[236px] sm:w-[300px]">
      {/* The arch img below is what gives this box its height; the hen and grass
          are positioned against it as percentages, so the aspect ratio of the
          three assets has to stay locked together. */}
      {/* Three nested elements because each one owns a different transform and
          they would otherwise overwrite each other: the outer travels and skids,
          the middle does the stepped run bob, the image does the slow idle that
          keeps her alive once she has arrived. */}
      <span className="mark-hen absolute" style={HEN}>
        <span className="mark-hen-bob block">
          <img src="/mark/hen.png" alt="" width="103" height="101" className="mark-hen-idle block w-full" />
        </span>
      </span>

      {/* Drawn after the hen, so she runs BEHIND the arch and the type. arch.png
          is transparent line art rather than a tile with its own cream in it,
          which is the whole reason that works — as an opaque tile she crossed in
          front of their "2013" on the way in and it read as a mistake. It also
          means the band's own background has to be the exact cream from inside
          their logo file, and it is: bg-paper, #FAF0E6. Layered that way the
          settled mark matches the original to a mean error of 0.7/255. */}
      <img
        src="/mark/arch.png"
        alt=""
        width="288"
        height="283"
        className="pointer-events-none relative block w-full"
      />

      <img
        src="/mark/grass.png"
        alt=""
        width="99"
        height="19"
        className="mark-grass absolute"
        style={GRASS}
      />
    </div>
  );
}
