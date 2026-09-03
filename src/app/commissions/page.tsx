import Link from "next/link";
import CommissionForm from "@/components/CommissionForm";

export default function CommissionsPage() {
  return (
    <main className="art-background min-h-screen">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-7 md:px-10">
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

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 md:px-10 md:pb-32 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#a66cff]">
            Commissions
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#2b2433] sm:text-5xl md:text-7xl">
            Have something
            <br />
            <span className="text-[#a66cff]">in mind?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#756d7f]">
            Tell Fairoz what you&apos;re imagining. Share the little details,
            add a reference if you have one, and let&apos;s turn the idea into
            art.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] sm:mt-14 sm:rounded-[2.5rem] border border-white/80 bg-white/65 p-5 shadow-[0_30px_80px_rgba(89,61,111,0.10)] backdrop-blur-md sm:p-7 md:p-10">
          <CommissionForm />
        </div>
      </section>
    </main>
  );
}
