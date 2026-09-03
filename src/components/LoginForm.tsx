"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("The email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-[#3a3042]"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="artist@example.com"
          className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-[#3a3042]"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
          className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#2b2433] px-7 py-4 text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Enter the studio ✦"}
      </button>
    </form>
  );
}
