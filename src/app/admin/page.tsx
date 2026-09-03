import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
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

  return (
    <main className="art-background min-h-screen">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <a
          href="/"
          className="text-xl font-semibold tracking-tight text-[#302638]"
        >
          arty<span className="text-[#a66cff]">.</span>
        </a>

        <span className="text-sm text-[#756d7f]">Artist studio</span>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10 md:pt-20">
        <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
          Private studio
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#2b2433] md:text-6xl">
          Welcome back.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-[#756d7f]">
          This is where Fairoz will manage her artwork and commissions.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/80 bg-white/65 p-7 shadow-[0_20px_60px_rgba(89,61,111,0.08)] backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.15em] text-[#a66cff]">
              Artwork
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-[#2b2433]">
              Manage the gallery
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#756d7f]">
              Upload new pieces, edit details, and choose featured artwork.
            </p>

            <Link
              href="/admin/artworks"
              className="mt-6 block rounded-full bg-[#2b2433] px-5 py-3 text-center text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Manage artwork →
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/65 p-7 shadow-[0_20px_60px_rgba(89,61,111,0.08)] backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.15em] text-[#a66cff]">
              Commissions
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-[#2b2433]">
              Commission requests
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#756d7f]">
              Requests from people who want something drawn by Fairoz.
            </p>

            <Link
              href="/admin/commissions"
              className="mt-6 block rounded-full bg-[#2b2433] px-5 py-3 text-center text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View commission requests →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
