const DEFAULT_ITEMS = [
  "Pasture-raised",
  "Non-GMO fed",
  "No antibiotics",
  "No hormones",
  "Humanely raised",
  "Est. 2013",
  "Proud to support local 4-H",
  "Marshall, Michigan",
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
