export function MinimalLuxuryLanding() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <a className="text-sm font-black uppercase tracking-[0.28em]" href="#top">
          Proximus Shev
        </a>
        <a
          className="rounded-full border border-black/20 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
          href="mailto:jaappiah30@gmail.com"
        >
          Contact
        </a>
      </header>

      <section
        id="top"
        className="grid min-h-[calc(100vh-88px)] content-between px-6 pb-8 sm:px-10 lg:px-16"
      >
        <div className="pt-16 lg:pt-20">
          <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.32em] text-blue-700">
            Frontend / Full-stack / Software Developer
          </p>
          <h1 className="animate-fade-up-delay-1 mt-8 max-w-7xl text-[clamp(3.4rem,12vw,10.5rem)] font-black uppercase leading-[0.82] tracking-tight">
            John
            <span className="block text-blue-700">Amoako</span>
            <span className="block">Appiah</span>
          </h1>
        </div>

        <div className="animate-fade-up-delay-2 grid gap-8 border-t border-black/12 pt-8 md:grid-cols-[1fr_1.3fr_1fr]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">
            Proximus Shev
          </p>
          <p className="max-w-2xl text-xl font-light leading-8 text-black/72">
            I build portfolio-ready digital products with clean interfaces,
            practical architecture, and a calm obsession with details.
          </p>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {["React", "Next.js", "TypeScript"].map((item) => (
              <span
                className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
