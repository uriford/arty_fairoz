"use client";

import { useActionState } from "react";
import { submitCommission } from "@/app/commissions/actions/submit-commission";

export default function CommissionForm() {
  const [state, formAction, pending] = useActionState(submitCommission, {
    success: false,
  });

  if (state.success) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eadcff] text-2xl text-[#a66cff]">
          ✦
        </div>

        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#2b2433]">
          Your idea has been captured.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#756d7f]">
          The commission system is being connected behind the scenes. For now,
          this is the beginning of bringing your idea to life.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-7 rounded-full bg-[#2b2433] px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          Send another idea
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <div>
        <label
          htmlFor="name"
          className="text-sm font-medium text-[#3a3042]"
        >
          Your name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="What should Fairoz call you?"
          className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        />
      </div>

      <div>
        <label
          htmlFor="contact"
          className="text-sm font-medium text-[#3a3042]"
        >
          How can Fairoz reach you?
        </label>

        <input
          id="contact"
          name="contact"
          type="text"
          required
          placeholder="Instagram, email, or another contact"
          className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="text-sm font-medium text-[#3a3042]"
        >
          What would you like drawn?
        </label>

        <select
          id="type"
          name="type"
          required
          defaultValue=""
          className="mt-2 w-full appearance-none rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        >
          <option value="" disabled>
            Choose an artwork type
          </option>
          <option value="portrait">Portrait</option>
          <option value="character">Character illustration</option>
          <option value="anime">Anime / fan art</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-[#3a3042]"
        >
          Tell her about your idea
        </label>

        <textarea
          id="description"
          name="description"
          required
          rows={6}
          placeholder="Describe the character, pose, mood, colors, outfit, background, or anything else you have imagined..."
          className="mt-2 w-full resize-none rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm leading-7 text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        />
      </div>

      <div>
        <label
          htmlFor="reference"
          className="text-sm font-medium text-[#3a3042]"
        >
          Reference image
          <span className="ml-2 text-xs font-normal text-[#958aa0]">
            optional
          </span>
        </label>

        <label
          htmlFor="reference"
          className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#cdbbe0] bg-white/40 px-6 py-10 text-center transition-all hover:border-[#a66cff] hover:bg-white/60"
        >
          <span className="text-3xl text-[#a66cff]">✦</span>

          <span className="mt-3 text-sm font-medium text-[#4a3e52]">
            Add a reference image
          </span>

          <span className="mt-1 text-xs text-[#958aa0]">
            A photo, character reference, pose, or anything that helps explain
            your idea
          </span>

          <input
            id="reference"
            name="reference"
            type="file"
            accept="image/*"
            className="sr-only"
          />
        </label>
      </div>

      <div>
        <label
          htmlFor="budget"
          className="text-sm font-medium text-[#3a3042]"
        >
          Approximate budget
          <span className="ml-2 text-xs font-normal text-[#958aa0]">
            optional
          </span>
        </label>

        <input
          id="budget"
          name="budget"
          type="text"
          placeholder="e.g. $20–$40"
          className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
        />
      </div>

      <div className="border-t border-[#e8deed] pt-7">
        {state.error && (
          <p
            role="alert"
            className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#2b2433] px-7 py-4 text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending your idea..." : "Send commission request ✦"}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#958aa0]">
          No account needed. Just share your idea.
        </p>
      </div>
    </form>
  );
}
