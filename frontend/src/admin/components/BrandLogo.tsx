import { useState } from "react"
import storeLogo from "../../assets/logo.png"

export const BIGBANGMART_LOGO_URL = storeLogo

interface BrandLogoProps {
  size?: "sm" | "md" | "lg"
  darkSurface?: boolean
}

export function BrandLogo({ size = "md", darkSurface = true }: BrandLogoProps) {
  const [imgError, setImgError] = useState(false)

  const boxClass =
    size === "sm"
      ? "w-9 h-9 rounded-lg"
      : size === "lg"
        ? "w-14 h-14 rounded-xl"
        : "w-10 h-10 rounded-lg"

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`${boxClass} shrink-0 bg-black overflow-hidden border ${
          darkSurface ? "border-slate-700/80" : "border-slate-200"
        } flex items-center justify-center`}
      >
        {!imgError ? (
          <img
            src={BIGBANGMART_LOGO_URL}
            alt="Logo BigBangMart"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover scale-125"
          />
        ) : (
          <span className="font-display font-extrabold text-xs tracking-tight text-white">
            BBM
          </span>
        )}
      </div>
      <div className="min-w-0">
        <span
          className={`block font-display font-bold tracking-tight whitespace-nowrap truncate ${
            size === "lg" ? "text-xl" : "text-base"
          } ${darkSurface ? "text-white" : "text-slate-900"}`}
        >
          BigBangMart
        </span>
      </div>
    </div>
  )
}
