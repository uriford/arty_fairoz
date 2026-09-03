"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Artwork = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

type ArtworkManagerProps = {
  initialArtworks: Artwork[];
};

export default function ArtworkManager({
  initialArtworks,
}: ArtworkManagerProps) {
  const supabase = createClient();

  const [artworks, setArtworks] = useState(initialArtworks);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!image) {
      setError("Please choose an artwork image.");
      return;
    }

    if (!title.trim() || !category.trim() || !description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const baseSlug = createSlug(title);

      if (!baseSlug) {
        throw new Error("Please use a valid artwork title.");
      }

      const fileExtension = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `${baseSlug}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("artworks").getPublicUrl(filePath);

      const { data: artwork, error: insertError } = await supabase
        .from("artworks")
        .insert({
          slug: baseSlug,
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          image_url: publicUrl,
          featured,
        })
        .select()
        .single();

      if (insertError) {
        await supabase.storage.from("artworks").remove([filePath]);
        throw insertError;
      }

      setArtworks((current) => [artwork, ...current]);

      setTitle("");
      setCategory("");
      setDescription("");
      setFeatured(false);
      setImage(null);

      const fileInput = document.getElementById(
        "artwork-image",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage("Artwork added to the studio ✦");
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while adding the artwork.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(artwork: Artwork) {
    const confirmed = window.confirm(
      `Delete "${artwork.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artwork.id);

    if (deleteError) {
      setError("Could not delete the artwork.");
      return;
    }

    if (artwork.image_url) {
      const marker = "/storage/v1/object/public/artworks/";
      const index = artwork.image_url.indexOf(marker);

      if (index !== -1) {
        const filePath = decodeURIComponent(
          artwork.image_url.slice(index + marker.length),
        );

        await supabase.storage.from("artworks").remove([filePath]);
      }
    }

    setArtworks((current) =>
      current.filter((item) => item.id !== artwork.id),
    );

    setMessage("Artwork removed.");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="h-fit rounded-[2.5rem] border border-white/80 bg-white/65 p-7 shadow-[0_25px_70px_rgba(89,61,111,0.08)] backdrop-blur-md md:p-9">
        <p className="text-sm uppercase tracking-[0.18em] text-[#a66cff]">
          New piece
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2433]">
          Add artwork
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="artwork-image"
              className="text-sm font-medium text-[#3a3042]"
            >
              Artwork image
            </label>

            <input
              id="artwork-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={(event) =>
                setImage(event.target.files?.[0] ?? null)
              }
              className="mt-2 block w-full rounded-2xl border border-dashed border-[#cdbbe0] bg-white/50 p-4 text-sm text-[#756d7f] file:mr-4 file:rounded-full file:border-0 file:bg-[#eadcff] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#6f4ba8]"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-[#3a3042]"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Starlight"
              className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="text-sm font-medium text-[#3a3042]"
            >
              Category
            </label>

            <input
              id="category"
              type="text"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Character Illustration"
              className="mt-2 w-full rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-[#3a3042]"
            >
              Description
            </label>

            <textarea
              id="description"
              required
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A little story about this piece..."
              className="mt-2 w-full resize-none rounded-2xl border border-[#dfd3e8] bg-white/70 px-5 py-4 text-sm leading-7 text-[#302638] outline-none transition-all placeholder:text-[#a49aaa] focus:border-[#b995e8] focus:bg-white focus:ring-4 focus:ring-[#eadcff]/60"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="h-4 w-4 rounded border-[#cdbbe0]"
            />

            <span className="text-sm text-[#4a3e52]">
              Show this piece in selected work
            </span>
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </p>
          ) : null}

          {message ? (
            <p
              role="status"
              className="rounded-2xl border border-[#dccaf0] bg-[#f6effd] px-4 py-3 text-sm leading-6 text-[#6f4ba8]"
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#2b2433] px-7 py-4 text-sm font-medium text-white transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding artwork..." : "Add to gallery ✦"}
          </button>
        </form>
      </div>

      <div>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#a66cff]">
              Gallery library
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2b2433]">
              {artworks.length} {artworks.length === 1 ? "piece" : "pieces"}
            </h2>
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-[#cdbbe0] bg-white/40 px-7 py-20 text-center">
            <div className="text-4xl text-[#a66cff]">✦</div>

            <h3 className="mt-4 text-xl font-semibold text-[#2b2433]">
              The gallery is waiting.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#756d7f]">
              Add Fairoz&apos;s first piece using the form beside it.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {artworks.map((artwork) => (
              <article
                key={artwork.id}
                className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 shadow-[0_20px_60px_rgba(89,61,111,0.08)] backdrop-blur-md"
              >
                <div className="relative aspect-[4/5] bg-[#eadcff]">
                  {artwork.image_url ? (
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#a66cff]">
                      ✦
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-[#a66cff]">
                        {artwork.category}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-[#2b2433]">
                        {artwork.title}
                      </h3>
                    </div>

                    {artwork.featured ? (
                      <span className="rounded-full bg-[#eadcff] px-3 py-1 text-[11px] font-medium text-[#6f4ba8]">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(artwork)}
                    className="mt-5 text-xs font-medium text-[#9b687b] transition-colors hover:text-red-600"
                  >
                    Delete artwork
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
