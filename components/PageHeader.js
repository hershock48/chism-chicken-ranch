export default function PageHeader({ eyebrow, title, accent, subtitle, image }) {
  return (
    <section className="relative overflow-hidden bg-barn">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-barn/70 to-ink/85" />
      <div className="section relative py-20 text-center text-cream sm:py-24">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-wheat-light">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-4 max-w-3xl display text-4xl text-cream sm:text-6xl">
          {title}
          {accent && (
            <>
              {" "}
              <span className="font-serif font-medium text-wheat-light">
                {accent}
              </span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
