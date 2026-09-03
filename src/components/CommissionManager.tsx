"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  CommissionRequest,
  CommissionStatus,
} from "@/types/commission";

type CommissionManagerProps = {
  initialCommissions: CommissionRequest[];
};

const statuses: CommissionStatus[] = [
  "new",
  "reviewing",
  "accepted",
  "declined",
  "completed",
];

const statusLabels: Record<CommissionStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  accepted: "Accepted",
  declined: "Declined",
  completed: "Completed",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function CommissionManager({
  initialCommissions,
}: CommissionManagerProps) {
  const supabase = createClient();

  const [commissions, setCommissions] = useState(initialCommissions);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialCommissions[0]?.id ?? null,
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleStatusChange(
    commission: CommissionRequest,
    status: CommissionStatus,
  ) {
    setError("");
    setLoadingId(commission.id);

    const { error: updateError } = await supabase
      .from("commission_requests")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commission.id);

    if (updateError) {
      setError("Could not update the commission status.");
      setLoadingId(null);
      return;
    }

    setCommissions((current) =>
      current.map((item) =>
        item.id === commission.id ? { ...item, status } : item,
      ),
    );

    setLoadingId(null);
  }

  async function handleDelete(commission: CommissionRequest) {
    const confirmed = window.confirm(
      `Delete the commission request from "${commission.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setLoadingId(commission.id);

    const { error: deleteError } = await supabase
      .from("commission_requests")
      .delete()
      .eq("id", commission.id);

    if (deleteError) {
      setError("Could not delete the commission request.");
      setLoadingId(null);
      return;
    }

    if (commission.reference_path) {
      await supabase.storage
        .from("commission-references")
        .remove([commission.reference_path]);
    }

    setCommissions((current) =>
      current.filter((item) => item.id !== commission.id),
    );

    if (selectedId === commission.id) {
      setSelectedId(null);
    }

    setLoadingId(null);
  }

  if (commissions.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/80 bg-white/65 px-5 py-12 text-center sm:rounded-[2.5rem] sm:px-7 sm:py-16 shadow-[0_25px_70px_rgba(89,61,111,0.08)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eadcff] text-2xl text-[#a66cff]">
          ✦
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-[#2b2433]">
          No commission requests yet.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#756d7f]">
          When someone sends Fairoz an idea, their request will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {commissions.map((commission) => {
        const selected = selectedId === commission.id;
        const loading = loadingId === commission.id;

        return (
          <article
            key={commission.id}
            className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 shadow-[0_25px_70px_rgba(89,61,111,0.08)] backdrop-blur-md sm:rounded-[2.5rem]"
          >
            <button
              type="button"
              onClick={() =>
                setSelectedId(selected ? null : commission.id)
              }
              className="w-full px-5 py-5 text-left transition-colors hover:bg-white/40 sm:px-7 sm:py-6 md:px-9"
            >
              <div className="flex min-w-0 flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-3">
                    <h2 className="min-w-0 break-words text-lg font-semibold text-[#2b2433] sm:text-xl">
                      {commission.name}
                    </h2>

                    <span className="rounded-full bg-[#eadcff] px-3 py-1 text-xs font-medium text-[#6f4ba8]">
                      {statusLabels[commission.status]}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#756d7f]">
                    {commission.artwork_type} ·{" "}
                    {commission.budget || "Budget not specified"}
                  </p>
                </div>

                <div className="flex w-full min-w-0 items-center justify-between gap-3 text-xs text-[#958aa0] sm:w-auto sm:justify-end sm:text-sm">
                  <span>{formatDate(commission.created_at)}</span>
                  <span className="text-lg text-[#a66cff]">
                    {selected ? "−" : "+"}
                  </span>
                </div>
              </div>
            </button>

            {selected && (
              <div className="border-t border-[#e8deed] px-5 py-6 sm:px-7 sm:py-7 md:px-9">
                <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[1fr_0.8fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#a66cff]">
                      Commission idea
                    </p>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#4a3e52]">
                      {commission.description}
                    </p>

                    <div className="mt-7 grid gap-5 sm:mt-8 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-[#958aa0]">
                          Contact
                        </p>
                        <p className="mt-2 break-words text-sm font-medium text-[#302638]">
                          {commission.contact}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-[#958aa0]">
                          Budget
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#302638]">
                          {commission.budget || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {commission.reference_path ? (
                      <ReferenceImage path={commission.reference_path} />
                    ) : (
                      <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-[#cdbbe0] bg-white/40 px-6 text-center">
                        <p className="text-sm text-[#958aa0]">
                          No reference image was attached.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-5 border-t border-[#e8deed] pt-6 sm:mt-8 sm:pt-7 md:flex-row md:items-center md:justify-between">
                  <div>
                    <label
                      htmlFor={`status-${commission.id}`}
                      className="text-xs uppercase tracking-[0.15em] text-[#958aa0]"
                    >
                      Update status
                    </label>

                    <select
                      id={`status-${commission.id}`}
                      value={commission.status}
                      disabled={loading}
                      onChange={(event) =>
                        handleStatusChange(
                          commission,
                          event.target.value as CommissionStatus,
                        )
                      }
                      className="mt-2 block w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-4 py-2.5 text-sm sm:w-auto sm:rounded-full text-[#302638] outline-none focus:border-[#b995e8] focus:ring-4 focus:ring-[#eadcff]/60 disabled:opacity-60"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleDelete(commission)}
                    className="w-full rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium sm:w-auto text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Working..." : "Delete request"}
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function ReferenceImage({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadReference() {
      const supabase = createClient();

      const { data, error } = await supabase.storage
        .from("commission-references")
        .createSignedUrl(path, 60 * 10);

      if (active) {
        setUrl(error ? null : data.signedUrl);
        setLoading(false);
      }
    }

    loadReference();

    return () => {
      active = false;
    };
  }, [path]);

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-3xl bg-[#f4edf8] px-5 text-center text-sm text-[#958aa0] sm:min-h-48">
        Loading reference...
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-5 text-center text-sm text-red-700 sm:min-h-48">
        Could not load the reference image.
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#f4edf8]">
      <Image
        src={url}
        alt="Commission reference"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 40vw"
      />
    </div>
  );
}
