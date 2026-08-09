// Trimmed from eight to five. "Pasture-raised", "Non-GMO fed" and "No
// antibiotics" came out because the stats row sits directly above this strip and
// states all three as numbers, which is both more scannable and more convincing
// than a scrolling badge. What is left is the things that appear nowhere else in
// the first screen, so the strip adds instead of echoing.
const DEFAULT_ITEMS = [
  "Humanely raised",
  "Proud to support local 4-H",
  "Family-run since 2013",
  "Marshall, Michigan",
  "APPPA member",
];

export default function Marquee({ items = DEFAULT_ITEMS }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden border-y border-ink/10 bg-barn text-cream" aria-hidden="true">
      <div className="marquee-track py-3">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-6 text-sm font-medium uppercase tracking-[0.18em]">
              {item}
            </span>
            <span className="text-wheat-light">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
