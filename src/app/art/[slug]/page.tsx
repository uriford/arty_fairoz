import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ArtworkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArtworkPage({
  params,
}: ArtworkPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: artwork } = await supabase
    .from("artworks")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!artwork) {
    notFound();
  }

  return (
    <main className="art-background min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-7 md:px-10">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#302638]"
        >
          arty<span className="text-[#a66cff]">.</span>
        </Link>

        <Link
          href="/"
          className="text-sm text-[#756d7f] transition-colors hover:text-[#302638]"
        >
          ← Back to gallery
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:px-10 md:py-16 lg:py-20">
        <div className="grid min-w-0 items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
          <div className="relative min-w-0 aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#eadcff] via-[#f8dce9] to-[#dcecff] shadow-[0_20px_55px_rgba(89,61,111,0.12)] sm:rounded-[2rem] lg:rounded-[2.5rem]">
            {artwork.image_url ? (
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[320px] w-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-5 text-6xl opacity-60">✦</div>
                  <p className="text-sm font-medium text-[#756d7f]">
                    Artwork preview
                  </p>
                  <p className="mt-1 text-xs text-[#958aa0]">
                    Real artwork coming soon
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
              {artwork.category}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2433] sm:text-5xl md:text-6xl">
              {artwork.title}
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#756d7f] sm:text-base sm:leading-8">
              {artwork.description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
              <button className="w-full rounded-full bg-[#2b2433] px-6 py-3 text-center text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-lg sm:w-auto">
                Support this artwork
              </button>

              <Link
                href="/#commissions"
                className="w-full rounded-full border border-[#d8c8e8] bg-white/60 px-6 py-3 text-center text-sm font-medium text-[#3a3042] backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white sm:w-auto"
              >
                Commission an artwork
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
