import Image from "next/image";
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
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

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#eadcff] via-[#f8dce9] to-[#dcecff] shadow-[0_30px_80px_rgba(89,61,111,0.12)]">
            {artwork.image_url ? (
              <Image
                src={artwork.image_url}
                alt={artwork.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
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

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
              {artwork.category}
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#2b2433] md:text-6xl">
              {artwork.title}
            </h1>

            <p className="mt-6 text-base leading-8 text-[#756d7f]">
              {artwork.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#2b2433] px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-lg">
                Support this artwork
              </button>

              <Link
                href="/#commissions"
                className="rounded-full border border-[#d8c8e8] bg-white/60 px-6 py-3 text-sm font-medium text-[#3a3042] backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white"
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
