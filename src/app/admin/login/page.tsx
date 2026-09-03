import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="art-background flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a
            href="/"
            className="text-xl font-semibold tracking-tight text-[#302638]"
          >
            arty<span className="text-[#a66cff]">.</span>
          </a>

          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#a66cff]">
            Artist studio
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2b2433]">
            Welcome back.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#756d7f]">
            Sign in to manage the artwork and commissions.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white/80 bg-white/70 p-7 shadow-[0_30px_80px_rgba(89,61,111,0.10)] backdrop-blur-md md:p-9">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
