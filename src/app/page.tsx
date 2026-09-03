import ArtworkCard from "@/components/ArtworkCard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: artworks } = await supabase
    .from("artworks")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  return (
    <main className="art-background min-h-screen">
      {/* Decorative atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <span className="twinkle absolute left-[12%] top-[18%] text-2xl text-purple-300">
          ✦
        </span>

        <span className="float-slow absolute right-[13%] top-[24%] text-xl text-pink-300">
          ✧
        </span>

        <span className="float-reverse absolute bottom-[22%] left-[8%] text-lg text-purple-300">
          ⋆
        </span>

        <span className="twinkle absolute bottom-[18%] right-[10%] text-2xl text-pink-300">
          ✦
        </span>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <a
          href="#"
          className="text-xl font-semibold tracking-tight text-[#302638]"
        >
          arty<span className="text-[#a66cff]">.</span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-[#756d7f] sm:flex">
          <a className="transition-colors hover:text-[#302638]" href="#art">
            Art
          </a>
          <a
            className="transition-colors hover:text-[#302638]"
            href="#commissions"
          >
            Commissions
          </a>
          <a
            className="transition-colors hover:text-[#302638]"
            href="#about"
          >
            About
          </a>
        </div>

        <a
          href="#commissions"
          className="rounded-full border border-[#d8c8e8] bg-white/60 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white"
        >
          Commission
        </a>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-6 py-20 md:px-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="reveal mb-5 text-sm font-medium uppercase tracking-[0.25em] text-[#a66cff]">
              Artist • Illustrator
            </p>

            <h1 className="reveal reveal-delay-1 max-w-3xl text-6xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#2b2433] sm:text-7xl lg:text-8xl">
              A little world
              <br />
              drawn by <span className="text-[#a66cff]">Fairoz.</span>
            </h1>

            <p className="reveal reveal-delay-2 mt-7 max-w-lg text-base leading-7 text-[#756d7f] md:text-lg">
              Characters, stories, and little pieces of imagination brought
              to life through art.
            </p>

            <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3">
              <a
                href="#art"
                className="rounded-full bg-[#2b2433] px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Explore the art
              </a>

              <a
                href="#commissions"
                className="rounded-full border border-[#d8c8e8] bg-white/60 px-6 py-3 text-sm font-medium text-[#3a3042] backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white"
              >
                Request a commission
              </a>
            </div>
          </div>

          {/* Hero artwork placeholder */}
          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="float-slow absolute -left-7 -top-7 h-20 w-20 rounded-full bg-[#f6b8d8]/50 blur-sm" />

            <div className="float-reverse absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#d9c5ff]/60 blur-sm" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-[#eadcff] via-[#f8dce9] to-[#dcecff] p-3 shadow-[0_30px_80px_rgba(89,61,111,0.12)]">
              <div className="flex h-full items-center justify-center rounded-[2rem] border border-white/60 bg-white/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mb-4 text-6xl">🎨</div>
                  <p className="text-sm font-medium text-[#756d7f]">
                    Her artwork goes here
                  </p>
                  <p className="mt-1 text-xs text-[#958aa0]">
                    Replace this with a real piece
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Art */}
      <section id="art" className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#a66cff]">
              Selected work
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#2b2433] md:text-5xl">
              From imagination,
              <br />
              onto the canvas.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[#756d7f]">
            A collection of character art, illustrations, and drawings made
            with a whole lot of imagination.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {artworks?.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>

      {/* Commission */}
      <section
        id="commissions"
        className="mx-6 my-12 overflow-hidden rounded-[2.5rem] bg-[#302638] px-7 py-20 text-white md:mx-10 md:px-16"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#d9c5ff]">
            Commissions
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            Have a character
            <br />
            in your mind?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/65 md:text-base">
            Tell Fairoz what you have imagined and turn that idea into a
            piece of art.
          </p>

          <a
            href="/commissions"
            className="mt-9 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#302638] transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Request a commission
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
          About the artist
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#2b2433]">
          Just someone who loves to draw.
        </h2>

        <p className="mt-6 text-base leading-8 text-[#756d7f]">
          This space belongs to Fairoz — a self-taught artist exploring
          characters, people, imagination, and everything that catches her
          creative eye.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8deed] px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#756d7f] sm:flex-row sm:items-center sm:justify-between">
          <p>
            made with imagination<span className="text-[#a66cff]"> ✦</span>
          </p>

          <p>© {new Date().getFullYear()} Fairoz</p>
        </div>
      </footer>
    </main>
  );
}
