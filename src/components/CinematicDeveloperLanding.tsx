const projects = [
  "AI Study Assistant",
  "Finance Dashboard",
  "Appointment Booking",
  "Mini E-Commerce Store",
];

export function CinematicDeveloperLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(37,99,235,0.32),transparent_26%),radial-gradient(circle_at_24%_72%,rgba(14,165,233,0.18),transparent_24%),linear-gradient(135deg,#020617_0%,#030712_45%,#000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-30" />
      <div className="absolute right-[-12rem] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-blue-300/20 shadow-[0_0_120px_35px_rgba(37,99,235,0.24)] hero-glow" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <a className="text-lg font-black uppercase tracking-[0.3em]" href="#top">
          Proximus Shev
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {["Work", "Stack", "About", "Contact"].map((item) => (
            <a
              className="text-xs font-bold uppercase tracking-[0.24em] text-white/58 transition hover:text-white"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          className="border border-blue-200/25 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-blue-100 transition hover:border-blue-200 hover:bg-blue-400/10"
          href="mailto:jaappiah30@gmail.com"
        >
          Contact
        </a>
      </header>

      <section
        id="top"
        className="relative z-10 grid min-h-[calc(100vh-92px)] items-center gap-10 px-6 pb-14 pt-8 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-16"
      >
        <div>
          <div className="animate-fade-up mb-7 inline-flex items-center gap-3 border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-blue-100">
            <span className="h-2 w-2 bg-blue-300 shadow-[0_0_18px_rgba(147,197,253,0.9)]" />
            Frontend / Full-stack / Software Developer
          </div>

          <h1 className="animate-fade-up-delay-1 max-w-5xl text-[clamp(3.1rem,9.5vw,8.4rem)] font-black uppercase leading-[0.84] tracking-tight">
            John
            <span className="block text-blue-200">Amoako</span>
            <span className="block">Appiah.</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            I design and build crisp digital products with strong interfaces,
            practical systems, and enough polish to feel production-ready.
          </p>

          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap gap-4">
            <a
              className="bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-blue-100"
              href="#work"
            >
              View projects
            </a>
            <a
              className="border border-white/20 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:border-blue-300 hover:bg-blue-500/10"
              href="mailto:jaappiah30@gmail.com"
            >
              Hire me
            </a>
          </div>
        </div>

        <aside className="animate-fade-up-delay-4 relative mx-auto hidden w-full max-w-lg lg:block">
          <div className="absolute inset-8 border border-blue-200/15 bg-blue-500/5 blur-sm" />
          <div className="relative border border-white/12 bg-black/35 p-5 shadow-[0_0_80px_rgba(37,99,235,0.16)] backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
              <span>Project Deck</span>
              <span>2026</span>
            </div>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div
                  className="group flex items-center justify-between border border-white/10 bg-white/[0.035] p-4 transition hover:border-blue-300/50 hover:bg-blue-400/10"
                  key={project}
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                      0{index + 1}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{project}</p>
                  </div>
                  <span className="text-2xl text-white/35 transition group-hover:text-blue-200">
                    /
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
