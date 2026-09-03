import Link from "next/link";
import ArtworkManager from "@/components/ArtworkManager";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminArtworksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="art-background min-h-screen">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#302638]"
        >
          arty<span className="text-[#a66cff]">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-sm text-[#756d7f] transition-colors hover:text-[#302638]"
          >
            Studio
          </Link>

          <span className="text-sm text-[#756d7f]">Artwork</span>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10 md:pt-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
              Artist studio
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#2b2433] md:text-6xl">
              Her artwork.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#756d7f]">
              Add, edit, and curate the pieces that appear in Fairoz&apos;s
              gallery.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Could not load the artwork library.
          </div>
        ) : (
          <div className="mt-12">
            <ArtworkManager initialArtworks={artworks ?? []} />
          </div>
        )}
      </section>
    </main>
  );
}
