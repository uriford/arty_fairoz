import Link from "next/link";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
};

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link
      href={`/art/${artwork.slug}`}
      className="art-card group block"
      aria-label={`View ${artwork.title}`}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#eadcff] via-[#f8dce9] to-[#dcecff]">
        {artwork.image_url ? (
          <div className="relative aspect-[4/5] w-full">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center sm:min-h-[360px] lg:min-h-[400px]">
            <div className="text-center">
              <div className="mb-4 text-5xl opacity-60">✦</div>
              <p className="text-sm font-medium text-[#756d7f]">
                Artwork preview
              </p>
              <p className="mt-1 text-xs text-[#958aa0]">
                Real artwork coming soon
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-6 pt-24">
          <p className="text-xs uppercase tracking-[0.18em] text-white/75">
            {artwork.category}
          </p>

          <h3 className="mt-1 text-xl font-medium text-white">
            {artwork.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
