import { useState } from "react";
import { ImageOff } from "lucide-react";
import catalogIllustrations from "../assets/catalog-illustrations.png";
import { toSlug } from "./catalog";

const catalogImageCategories = [
  "dien-thoai", "laptop", "may-tinh-bang", "am-thanh",
  "dong-ho-thong-minh", "phu-kien", "camera", "man-hinh",
];

export default function ProductImage({
  src, name, category, compact = false,
}: { src?: string; name: string; category?: string; compact?: boolean }) {
  const [failedSource, setFailedSource] = useState<string>();
  const source = typeof src === "string" ? src.trim() : "";
  if (source && !source.includes("placeholder.com") && source !== failedSource) {
    return (
      <img
        src={source}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setFailedSource(source)}
        className="h-full w-full object-contain"
      />
    );
  }

  const index = catalogImageCategories.indexOf(toSlug(category || ""));
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {index >= 0 && (
        <span role="img" aria-label={name} className="aspect-square h-full max-w-full bg-[length:300%_300%]"
          style={{
            backgroundImage: `url(${catalogIllustrations})`,
            backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
          }} />
      )}
      {index < 0 && <span role="img" aria-label={name}><ImageOff size={20} /></span>}
      {!compact && (
        <span className="absolute bottom-1 right-1 rounded bg-white/90 px-1.5 py-0.5 text-[11px] text-[#53617a]">
          {index >= 0 ? "Ảnh minh họa" : "Chưa có ảnh"}
        </span>
      )}
    </div>
  );
}
