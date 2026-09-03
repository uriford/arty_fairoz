import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CommissionManager from "@/components/CommissionManager";
import type { CommissionRequest } from "@/types/commission";

export default async function AdminCommissionsPage() {
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

  const { data: commissions, error } = await supabase
    .from("commission_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="art-background min-h-screen">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-7 md:px-10">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#302638]"
        >
          arty<span className="text-[#a66cff]">.</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/admin"
            className="text-sm text-[#756d7f] transition-colors hover:text-[#302638]"
          >
            Studio
          </Link>

          <Link
            href="/admin/artworks"
            className="text-sm text-[#756d7f] transition-colors hover:text-[#302638]"
          >
            Artwork
          </Link>

          <span className="text-sm text-[#756d7f]">Commissions</span>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 md:px-10 md:pt-16">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
            Artist studio
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#2b2433] sm:text-5xl md:text-6xl">
            Commission requests.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#756d7f]">
            Ideas from people who would love to have something drawn by Fairoz.
          </p>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Could not load commission requests.
          </div>
        ) : (
          <div className="mt-12">
            <CommissionManager
              initialCommissions={(commissions ?? []) as CommissionRequest[]}
            />
          </div>
        )}
      </section>
    </main>
  );
}
