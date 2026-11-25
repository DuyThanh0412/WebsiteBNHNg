import { useState, useEffect, useRef, type FormEvent } from "react";
import { createPortal } from "react-dom";
import logoImg from "./assets/logo.png";
import ProductImage from "./shared/ProductImage";
import categoriesData from "../../Data/categories.json";
import productsData from "../../Data/products.json";
import { createBrowserRouter, RouterProvider, Outlet, Link, useParams, useOutletContext, useNavigate, useLocation, useSearchParams } from "react-router";

import AdminPage from "./admin/AdminPage";
import { API_URL } from "./shared/api";
import { fmt, toSlug, unwrapApiList, type Category } from "./shared/catalog";

const defaultCategories: Category[] = [
  { name: "Điện thoại", icon: "📱" },
  { name: "Laptop", icon: "💻" },
  { name: "Máy tính bảng", icon: "📲" },
  { name: "Âm thanh", icon: "🎧" },
  { name: "Đồng hồ thông minh", icon: "⌚" },
  { name: "Phụ kiện", icon: "🔌" },
  { name: "Camera", icon: "📷" },
  { name: "Màn hình", icon: "🖥️" },
];

const heroSlides = [
  {
    eyebrow: "Ưu đãi tốt nhất dành cho bạn",
    title: "CÔNG NGHỆ\nTRONG TẦM TAY.",
    subtitle: "Khám phá những sản phẩm mới nhất",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=500&fit=crop&auto=format",
    category: "Đồng hồ thông minh",
  },
  {
    eyebrow: "Nâng cấp trải nghiệm mỗi ngày",
    title: "SMARTPHONE\nTHẾ HỆ MỚI.",
    subtitle: "Tìm thiết bị phù hợp với bạn",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&h=500&fit=crop&auto=format",
    category: "Điện thoại",
  },
  {
    eyebrow: "Không gian làm việc sáng tạo",
    title: "LAPTOP\nSẴN SÀNG BỨT PHÁ.",
    subtitle: "Chọn thiết bị cho công việc và giải trí",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&h=500&fit=crop&auto=format",
    category: "Laptop",
  },
];

const normalizeMongoValue = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (value.$date) return String(value.$date);
    if (value.value) return String(value.value);
  }
  return String(value);
};

const normalizeSeedData = <T extends Record<string, any>>(items: T[] = []): T[] =>
  items.map((item) => ({
    ...item,
    _id: normalizeMongoValue(item?._id),
    id: normalizeMongoValue(item?._id),
  }));

const importedCategories = normalizeSeedData(categoriesData as any[]);
const importedProducts = normalizeSeedData(productsData as any[]).filter(product => product.show !== false);
const visibleProducts = (data: unknown) =>
  unwrapApiList<any>(data, "products").filter(product => product?.show !== false);
const flashSaleProducts = importedProducts
  .filter((product) => ["Điện thoại", "Laptop", "Máy tính bảng", "Đồng hồ thông minh", "Phụ kiện"].includes(product?.category))
  .sort((a, b) => Number(b.off || 0) - Number(a.off || 0))
  .slice(0, 6)
  .map((product) => ({
    ...product,
    stock: Number(product.stock) || 0,
    tag: `-${Number(product.off) || 0}%`,
  }));

// ─── Shared Components ───────────────────────────────────────────────────────
function BrandLogo({ className = "h-11" }: { className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden rounded-lg shrink-0 ${className}`}>
      <img src={logoImg} alt="BigBang" className="h-full w-auto object-contain" />
    </span>
  );
}

function BrandLogoLink({ className = "h-11" }: { className?: string }) {
  return (
    <Link
      to="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex shrink-0 items-center gap-2"
      aria-label="Về trang chủ"
    >
      <BrandLogo className={className} />
    </Link>
  );
}

function Toast({ message, isError, onClose }: { message: string, isError?: boolean, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#1a2236] border-[#1a2236] text-white'}`}>
        <span className="text-xl">{isError ? '⚠️' : '🔔'}</span>
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: any; onAdd: (product: any) => boolean | void }) {
  const [added, setAdded] = useState(false);
  const productId = product?._id || product?.id || toSlug(product?.name || "san-pham");
  const handleAdd = () => {
    if (onAdd?.(product) === false) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="group relative flex min-w-0 flex-col gap-3 rounded-2xl border border-[#e2eaf6] bg-white p-3 transition-shadow hover:shadow-lg sm:p-4">
      {product?.off > 0 && (
        <span className="absolute top-3 right-3 bg-[#1a6fdb] text-white text-xs font-bold px-2 py-0.5 rounded-lg z-10">
          {product.off}% OFF
        </span>
      )}
      <Link to={`/product/${productId}`} aria-label={product?.name || "Xem sản phẩm"} className="flex h-32 items-center justify-center rounded-xl bg-white p-3 sm:h-40 sm:p-4">
        <div className="h-full w-full max-w-44">
          <ProductImage src={product?.img} name={product?.name || "Sản phẩm"} category={product?.category} />
        </div>
      </Link>
      <div>
        <Link to={`/product/${productId}`} className="text-sm font-semibold text-[#1a2236] leading-snug hover:text-[#1a6fdb] line-clamp-2">
          {product?.name || "Sản phẩm"}
        </Link>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-bold text-[#1a2236]">{fmt(product?.price)}</span>
          {product?.original > product?.price && (
            <span className="text-xs text-[#6b7a99] line-through">{fmt(product.original)}</span>
          )}
        </div>
      </div>
      <button
        onClick={handleAdd}
        className={`w-full py-2 text-sm font-semibold rounded-xl transition-all ${
          added ? "bg-emerald-500 text-white" : "bg-[#f0f5fc] text-[#1a6fdb] hover:bg-[#1a6fdb] hover:text-white"
        }`}
      >
        {added ? "✓ Đã thêm" : "Thêm vào giỏ"}
      </button>
    </div>
  );
}

function getCartItemKey(item: any) {
  return String(item?._id || item?.id || toSlug(item?.name || ""));
}

function CartDrawer({
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  items: any[];
  onClose: () => void;
  onUpdateQty: (item: any, delta: number) => void;
  onRemove: (item: any) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80]">
      <button type="button" aria-label="Đóng giỏ hàng" onClick={onClose} className="absolute inset-0 h-full w-full bg-black/40" />
      <aside role="dialog" aria-modal="true" aria-labelledby="cart-title" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e2eaf6] px-5 py-4">
          <h2 id="cart-title" className="text-lg font-bold text-[#1a2236]">Giỏ hàng của bạn ({items.reduce((sum, item) => sum + item.qty, 0)})</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-full p-2 text-xl text-[#6b7a99] hover:bg-[#f0f5fc]">×</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[#35415b]">Giỏ hàng đang trống</p>
              <p className="mt-2 text-sm text-[#6b7a99]">Hãy chọn sản phẩm bạn yêu thích.</p>
              <button type="button" onClick={onClose} className="mt-5 rounded-lg bg-[#1a6fdb] px-5 py-2.5 text-sm font-semibold text-white">Tiếp tục mua sắm</button>
            </div>
          ) : (
            <ul className="divide-y divide-[#e2eaf6] px-5">
              {items.map(item => (
                <li key={getCartItemKey(item)} className="flex gap-3 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f0f5fc] p-1"><ProductImage src={item.img} name={item.name} category={item.category} compact /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold text-[#1a2236]">{item.name}</p>
                      <button type="button" onClick={() => onRemove(item)} aria-label={`Xóa ${item.name}`} className="text-sm text-[#8b97aa] hover:text-red-600">Xóa</button>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#1a6fdb]">{fmt(Number(item.price) || 0)}</p>
                    <div className="mt-2 inline-flex items-center overflow-hidden rounded-md border border-[#dce4f0]">
                      <button type="button" onClick={() => onUpdateQty(item, -1)} aria-label={`Giảm số lượng ${item.name}`} className="px-2.5 py-1 text-[#35415b] hover:bg-[#f0f5fc]">−</button>
                      <span className="min-w-8 text-center text-sm">{item.qty}</span>
                      <button type="button" onClick={() => onUpdateQty(item, 1)} aria-label={`Tăng số lượng ${item.name}`} className="px-2.5 py-1 text-[#35415b] hover:bg-[#f0f5fc]">+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#e2eaf6] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#6b7a99]">Tổng cộng</span>
              <span className="text-lg font-bold text-[#1a6fdb]">{fmt(total)}</span>
            </div>
            <button type="button" onClick={onCheckout} className="w-full rounded-xl bg-[#1a6fdb] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#1558b0]">
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Header({ cartCount, isLoggedIn, user, onLogout, onCartClick }: { cartCount: number; isLoggedIn?: boolean; user?: any; onLogout?: () => void; onCartClick: () => void }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:gap-4">
        <BrandLogoLink className="h-12" />

        <div className="order-3 flex w-full min-w-0 items-center gap-3 rounded-2xl border border-[#e2eaf6] bg-[#f0f5fc] px-4 py-2.5 md:order-none md:w-auto md:flex-1 lg:max-w-2xl">
          <span aria-hidden="true" className="text-[#6b7a99]">⌕</span>
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6b7a99]"
            placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && search) navigate(`/search?q=${encodeURIComponent(search)}`); }}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:ml-0">
          {isLoggedIn && user ? (
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#e2eaf6] bg-[#f7faff] px-2 py-1.5 sm:gap-3 sm:px-3">
              {user.isAdmin && <Link to="/admin" className="text-xs font-semibold text-[#1a6fdb] hover:underline sm:text-sm">Quản trị</Link>}
              <span className="max-w-[90px] truncate text-[11px] font-semibold text-[#1a2236] sm:max-w-[140px] sm:text-sm">Xin chào, {user.name}</span>
              {!user.isAdmin && <Link to="/change-password" className="text-[11px] font-medium text-[#1a6fdb] hover:underline sm:text-sm">Đổi mật khẩu</Link>}
              <button onClick={onLogout} className="shrink-0 text-[11px] font-medium text-red-500 hover:underline sm:text-sm">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="shrink-0 rounded-xl bg-[#f0f5fc] px-3 py-2.5 text-xs font-semibold text-[#1a2236] transition-colors hover:bg-[#e2eaf6] sm:px-4 sm:text-sm">
              Đăng nhập
            </Link>
          )}

          <button
            type="button"
            onClick={onCartClick}
            className="relative shrink-0 rounded-xl bg-[#1a6fdb] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1558b0] sm:px-4 sm:text-sm"
          >
            Giỏ hàng ({cartCount})
          </button>
        </div>
      </div>
    </header>
  );
}

function CategoryNav({ categories }: { categories: Category[] }) {
  const location = useLocation();
  const list = categories.length ? categories : defaultCategories;

  return (
    <nav className="bg-white border-b border-[#e2eaf6]">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2">
        <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium ${location.pathname === '/' ? 'bg-[#1a6fdb] text-white' : 'text-[#1a2236] hover:bg-[#f0f5fc]'}`}>
          🏠 Trang chủ
        </Link>
        {list.map((c) => {
          const catName = c.name || c.label || "Danh mục";
          const slug = toSlug(catName);
          const path = `/category/${slug}`;
          return (
            <Link
              key={c._id || catName}
              to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                location.pathname === path ? "bg-[#1a6fdb] text-white" : "text-[#1a2236] hover:bg-[#f0f5fc]"
              }`}
            >
              {c.icon || "📦"} {catName}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-[#101a3a] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-2 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-xs">
        <span>Chào mừng đến BigBangMart — Mua sắm công nghệ dễ dàng!</span>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/80 sm:gap-5 sm:text-xs">
          <Link to="/track-order" className="transition-colors hover:text-white hover:underline">📦 Theo dõi đơn hàng</Link>
          <Link to="/#flash-sale" className="transition-colors hover:text-white hover:underline">🎁 Ưu đãi mỗi ngày</Link>
        </div>
      </div>
    </div>
  );
}

function HeroBanner() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slide = heroSlides[active];

  return (
    <section className="px-4 pt-5 pb-3 sm:pt-7">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#101a3a] text-white shadow-sm"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return;

          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - touchStart.current.x;
          const deltaY = touch.clientY - touchStart.current.y;
          touchStart.current = null;

          if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

          setActive((current) =>
            (current + (deltaX < 0 ? 1 : heroSlides.length - 1)) % heroSlides.length,
          );
        }}
      >
        <div className="grid min-h-[260px] grid-cols-1 items-center gap-6 px-7 py-8 sm:min-h-[310px] sm:grid-cols-[1fr_0.8fr] sm:px-12 sm:py-10">
          <div className="relative z-10">
            <p className="mb-3 text-xs font-semibold text-white/70 sm:text-sm">{slide.eyebrow}</p>
            <h1 className="whitespace-pre-line text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{slide.title}</h1>
            <p className="mt-3 text-sm text-white/75 sm:text-base">{slide.subtitle}</p>
            <Link to={`/category/${toSlug(slide.category)}`} className="mt-6 inline-flex rounded-lg bg-[#1a6fdb] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1558b0]">
              Khám phá ngay <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
          <div className="hidden h-48 overflow-hidden rounded-xl bg-white/10 sm:block sm:h-56">
            <img src={slide.image} alt={slide.category} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {heroSlides.map((item, index) => (
            <button
              key={item.category}
              type="button"
              aria-label={`Xem banner ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${active === index ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryShowcase({ categories }: { categories: Category[] }) {
  const list = categories.length ? categories : defaultCategories;

  return (
    <section className="px-4 py-3">
      <div className="mx-auto max-w-[1280px] rounded-[24px] border border-[#dfe8f6] bg-[#edf2f9] p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-bold text-[#1a2236] sm:text-2xl">Mua sắm theo <span className="text-[#1a6fdb]">danh mục</span></h2>
          <span className="hidden text-sm text-[#6b7a99] sm:block">Chọn danh mục bạn quan tâm</span>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {list.map((category) => {
            const catName = category.name || category.label || "Danh mục";
            return (
              <Link key={category._id || catName} to={`/category/${toSlug(catName)}`} className="group flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white/40 px-1 py-2 text-center transition-all hover:border-[#d9e5fb] hover:bg-white sm:px-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#dfe8f6] bg-white text-2xl shadow-sm transition-all group-hover:border-[#1a6fdb] group-hover:bg-[#eff5ff] sm:h-16 sm:w-16 sm:text-3xl">
                  {category.icon || "📦"}
                </span>
                <span className="text-[11px] font-medium leading-tight text-[#35415b] group-hover:text-[#1a6fdb] sm:text-xs">{catName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FlashSaleSection({ onAddToCart }: { onAddToCart: (product: any) => void }) {
  const flashProducts = flashSaleProducts;
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 45, seconds: 6 });
  const [startIndex, setStartIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const visibleCount = 5;
  const visibleProducts = flashProducts.slice(startIndex, startIndex + visibleCount);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        let { hours, minutes, seconds } = current;
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else {
          return { hours: 4, minutes: 45, seconds: 6 };
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (flashProducts.length <= visibleCount) return;
    const autoTimer = setInterval(() => {
      setStartIndex((current) => {
        const maxStart = Math.max(0, flashProducts.length - visibleCount);
        const next = current + 1;
        return next > maxStart ? 0 : next;
      });
    }, 4200);

    return () => clearInterval(autoTimer);
  }, [flashProducts.length]);

  const moveCarousel = (direction: number) => {
    setStartIndex((current) => {
      const maxStart = Math.max(0, flashProducts.length - visibleCount);
      const next = current + direction;
      if (next < 0) return maxStart;
      if (next > maxStart) return 0;
      return next;
    });
  };

  const handleSwipe = (deltaX: number) => {
    if (Math.abs(deltaX) < 40) return;
    moveCarousel(deltaX < 0 ? 1 : -1);
  };

  return (
    <section id="flash-sale" className="scroll-mt-6 px-4 pt-5">
      <div
        className="mx-auto max-w-[1280px] overflow-hidden rounded-[28px] border border-[#2d343d] bg-[#2a2d30] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.35)] sm:p-5"
        style={{ touchAction: "pan-y" }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          swipeStartX.current = touch.clientX;
        }}
        onTouchEnd={(event) => {
          if (swipeStartX.current === null) return;
          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - swipeStartX.current;
          swipeStartX.current = null;
          handleSwipe(deltaX);
        }}
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-end gap-3">
            <div className="text-[28px] font-black leading-none tracking-[-0.08em] text-[#f8d53a] sm:text-[54px]">
              <span className="block">FLASH</span>
              <span className="inline-block -skew-y-6 text-[#f8d53a]">SALE</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white sm:gap-4">
            <div className="text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#dfe5ef] sm:text-[11px]">Kết thúc trong</div>
              <div className="mt-2 flex items-center gap-2">
                {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((value, index) => (
                  <div key={index} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#121416] text-sm font-bold text-white shadow-inner shadow-white/5 sm:h-12 sm:w-12 sm:text-xl">
                    {String(value).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-[20px] border border-[#3a3d41] bg-[#1d1f22] sm:grid-cols-3 sm:gap-3 sm:p-3 lg:grid-cols-5">
            {visibleProducts.map((product, index) => {
              const productLink = `/product/${toSlug(product.name)}`;
              const discountText = product.off ? `-${product.off}%` : "HOT";
              return (
                <div key={product._id || product.name} className="min-w-0 border border-[#3a3d41] bg-[#1d1f22] p-3 sm:rounded-xl sm:p-2 lg:p-3">
                  <div className="overflow-hidden rounded-[16px] bg-[#dfe2e7]">
                    <Link to={productLink} className="block">
                      <div className="flex h-40 items-center justify-center bg-white p-3 sm:h-32 lg:h-36">
                        <ProductImage src={product.img} name={product.name} category={product.category} />
                      </div>
                    </Link>
                  </div>

                  <div className="pt-3 text-white">
                    <Link to={productLink} className="block">
                      <h3 className="min-h-[46px] text-[15px] font-bold leading-snug text-white sm:text-sm">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[24px] font-black text-[#f7d24e] sm:text-lg lg:text-xl">{fmt(Number(product.price) || 0)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] text-[#b7bec8] sm:text-xs">
                      <span className="line-through">{fmt(Number(product.original) || 0)}</span>
                      <span className="rounded-md bg-[#d94836] px-1.5 py-0.5 text-[10px] font-bold text-white">{discountText}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex-1 rounded-full bg-[#f3f4f6] px-2 py-1 text-[10px] font-bold text-[#1b1b1b]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#f97316] align-middle" />
                        <span className="ml-2">Còn {Math.min(Number(product.stock) || 0, 5)}/5</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-center rounded-full bg-[#ffb000] px-3 py-2 text-center text-[12px] font-bold text-[#201b0f] shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] sm:text-[11px]">
                      <span className="mr-2">🔥</span>
                      Còn {index % 2 === 0 ? 3 : 5}/5
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {flashProducts.length > visibleCount && (
            <>
              <button type="button" onClick={() => moveCarousel(-1)} aria-label="Sản phẩm trước" className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#ffffff14] text-xl text-white shadow-lg backdrop-blur-sm transition hover:bg-[#ffffff22]">
                ←
              </button>
              <button type="button" onClick={() => moveCarousel(1)} aria-label="Sản phẩm sau" className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#ffffff14] text-xl text-white shadow-lg backdrop-blur-sm transition hover:bg-[#ffffff22]">
                →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function ProductShowcaseSection({
  title,
  icon,
  category,
  items,
  onAdd,
  loading,
}: {
  title: string;
  icon: string;
  category: string;
  items: any[];
  onAdd: (product: any) => boolean | void;
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = 320;

  const moveCarousel = (direction: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * scrollByAmount, behavior: "smooth" });
  };

  return (
    <section className="py-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#1a6fdb]">Khám phá sản phẩm</p>
          <h2 className="text-xl font-bold text-[#1a2236] sm:text-2xl"><span className="mr-2">{icon}</span>{title}</h2>
        </div>
        <Link to={`/category/${toSlug(category)}`} className="text-xs font-semibold text-[#1a6fdb] hover:underline sm:text-sm">
          Xem tất cả →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-[#e2eaf6] bg-white p-4">
              <div className="h-36 rounded-xl bg-[#edf2f9] sm:h-44" />
              <div className="mt-4 h-3 w-3/4 rounded bg-[#edf2f9]" />
              <div className="mt-3 h-3 w-1/2 rounded bg-[#edf2f9]" />
              <div className="mt-5 h-9 rounded-lg bg-[#edf2f9]" />
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className="relative">
          <button
            type="button"
            aria-label={`Cuộn ${title} sang trái`}
            onClick={() => moveCarousel(-1)}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#dfe8f6] bg-white/90 p-2 text-lg text-[#1a2236] shadow-md hover:bg-white sm:flex"
          >
            ←
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-4 pr-3">
              {items.map((product, index) => (
                <div key={product?._id || product?.id || index} className="w-[220px] shrink-0 sm:w-[250px]">
                  <ProductCard product={product} onAdd={onAdd} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label={`Cuộn ${title} sang phải`}
            onClick={() => moveCarousel(1)}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#dfe8f6] bg-white/90 p-2 text-lg text-[#1a2236] shadow-md hover:bg-white sm:flex"
          >
            →
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cbd8ea] bg-white/70 px-6 py-8 text-center sm:py-10">
          <span className="text-3xl" aria-hidden="true">{icon}</span>
          <p className="mt-3 font-semibold text-[#35415b]">Sản phẩm sẽ được cập nhật tại đây</p>
          <p className="mt-1 text-sm text-[#6b7a99]">Giao diện đã sẵn sàng — hãy thêm dữ liệu sản phẩm khi bạn muốn.</p>
        </div>
      )}
    </section>
  );
}

function HomePage() {
  const location = useLocation();
  const context = useOutletContext<{ onAddToCart: (product: any) => void; categories: Category[] }>();
  const onAddToCart = context?.onAddToCart || (() => {});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const loadedProducts = visibleProducts(data);
        setProducts(unwrapApiList<any>(data, "products").length ? loadedProducts : importedProducts);
        setLoading(false);
      })
      .catch(() => {
        setProducts(importedProducts);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (location.hash !== "#flash-sale") return;
    document.getElementById("flash-sale")?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);

  const phones = products.filter(p => p?.category?.toLowerCase().includes("điện thoại"));
  const laptops = products.filter(p => p?.category?.toLowerCase().includes("laptop"));

  return (
    <div className="min-h-screen bg-[#f0f5fc] pb-10">
      <HeroBanner />
      <CategoryShowcase categories={context?.categories || []} />
      <FlashSaleSection onAddToCart={onAddToCart} />
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <ProductShowcaseSection title="Điện thoại nổi bật" icon="📱" category="Điện thoại" items={phones} onAdd={onAddToCart} loading={loading} />
        <ProductShowcaseSection title="Laptop & máy tính" icon="💻" category="Laptop" items={laptops} onAdd={onAddToCart} loading={loading} />
      </div>
    </div>
  );
}

const categoryPriceRanges = [
  { label: "Dưới 2 triệu", min: 0, max: 2_000_000 },
  { label: "Từ 2 – 4 triệu", min: 2_000_000, max: 4_000_000 },
  { label: "Từ 4 – 7 triệu", min: 4_000_000, max: 7_000_000 },
  { label: "Từ 7 – 13 triệu", min: 7_000_000, max: 13_000_000 },
  { label: "Từ 13 – 20 triệu", min: 13_000_000, max: 20_000_000 },
  { label: "Từ 20 triệu", min: 20_000_000, max: Infinity },
];

function CategoryPage() {
  const { id } = useParams();
  return <CategoryProducts key={id} id={id} />;
}

function CategoryProducts({ id }: { id?: string }) {
  const context = useOutletContext<{ onAddToCart: (product: any) => void; categories: Category[] }>();
  const onAddToCart = context?.onAddToCart || (() => {});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState("");
  const [rangeIndex, setRangeIndex] = useState(-1);
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(
        visibleProducts(data).filter(product => toSlug(product?.category || "") === id)
      ))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [id]);

  const categoryName = defaultCategories.find(category => toSlug(category.name || "") === id)?.name
    || context?.categories.find(category => toSlug(category.name || "") === id)?.name
    || products[0]?.category
    || id?.replace(/-/g, " ");
  const brands = [...new Set(products.map(product => String(product.brand ?? "").trim()).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, "vi"));
  const range = categoryPriceRanges[rangeIndex];
  const results = products.filter(product =>
    (!brand || String(product.brand ?? "").trim() === brand) &&
    (!range || (Number(product.price) >= range.min && Number(product.price) < range.max))
  );
  if (sort) {
    results.sort((first, second) => sort === "asc" ? first.price - second.price : second.price - first.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-6">Danh mục: {categoryName}</h1>
      {products.length > 0 && (
        <section aria-label="Bộ lọc sản phẩm" className="mb-6 space-y-4 rounded-2xl border border-[#e2eaf6] bg-white p-4 sm:p-5">
          {brands.length > 0 && (
            <fieldset>
              <legend className="mb-2 font-semibold text-[#1a2236]">Thương hiệu</legend>
              <div className="flex flex-wrap gap-2">
                {["", ...brands].map(option => (
                  <button key={option} type="button" aria-pressed={brand === option} onClick={() => setBrand(option)}
                    className="rounded-lg border border-[#d9e5fb] px-3 py-2 text-sm hover:border-[#1a6fdb] aria-pressed:border-[#1a6fdb] aria-pressed:bg-[#edf5ff] aria-pressed:text-[#1558b0]">
                    {option || "Tất cả hãng"}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <div className="flex flex-wrap items-end gap-3 border-t border-[#e2eaf6] pt-4">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Khoảng giá
              <select value={rangeIndex} onChange={event => setRangeIndex(Number(event.target.value))} className="rounded-lg border border-[#d9e5fb] bg-white px-3 py-2 font-normal">
                <option value={-1}>Tất cả mức giá</option>
                {categoryPriceRanges.map((option, index) => <option key={option.min} value={index}>{option.label}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Sắp xếp theo giá
              <select value={sort} onChange={event => setSort(event.target.value)} className="rounded-lg border border-[#d9e5fb] bg-white px-3 py-2 font-normal">
                <option value="">Mặc định</option>
                <option value="asc">Thấp đến cao</option>
                <option value="desc">Cao đến thấp</option>
              </select>
            </label>
            {(brand || range || sort) && (
              <button type="button" onClick={() => { setBrand(""); setRangeIndex(-1); setSort(""); }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#1558b0] hover:bg-[#edf5ff]">
                Đặt lại
              </button>
            )}
            <p role="status" className="py-2 text-sm text-[#6b7a99] sm:ml-auto">{results.length} sản phẩm</p>
          </div>
        </section>
      )}
      {loading ? (
        <p role="status" className="text-[#6b7a99]">Đang tải sản phẩm…</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {results.map(p => (
            <ProductCard key={p._id || p.id || toSlug(p.name || "")} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-[#e2eaf6] text-center">
          <p className="text-[#6b7a99]">{products.length ? "Không tìm thấy sản phẩm phù hợp với bộ lọc." : "Chưa có sản phẩm nào thuộc danh mục này."}</p>
        </div>
      )}
    </div>
  );
}

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const context = useOutletContext<{ onAddToCart: (product: any) => void }>();
  const onAddToCart = context?.onAddToCart || (() => {});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const allProducts = visibleProducts(data);
        setProducts(query
          ? allProducts.filter(product => product?.name?.toLowerCase().includes(query.toLowerCase()))
          : allProducts);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#1a2236]">
        Kết quả tìm kiếm{query ? <> cho <span className="text-[#1a6fdb]">“{query}”</span></> : ""}
      </h1>
      {loading ? (
        <p className="text-[#6b7a99]">Đang tìm sản phẩm...</p>
      ) : products.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product?._id || product?.id || index} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cbd8ea] bg-white px-6 py-10 text-center">
          <p className="font-semibold text-[#35415b]">Chưa có sản phẩm phù hợp</p>
          <p className="mt-1 text-sm text-[#6b7a99]">Kết quả sẽ xuất hiện tại đây sau khi bạn thêm dữ liệu sản phẩm.</p>
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const context = useOutletContext<{ onAddToCart: (product: any) => boolean | void; onBuyNow: (product: any) => void }>();
  const onAddToCart = context?.onAddToCart || (() => {});
  const onBuyNow = context?.onBuyNow || (() => {});
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const products = visibleProducts(data);
        const foundProduct = products.find(item =>
          normalizeMongoValue(item?._id || item?.id || "") === id || toSlug(item?.name || "") === id
        ) || importedProducts.find(item =>
          normalizeMongoValue(item?._id || item?.id || "") === id || toSlug(item?.name || "") === id
        ) || null;
        setProduct(foundProduct);
        setActiveImage(foundProduct?.img || "");
        setLoading(false);
      })
      .catch(() => {
        const fallbackProduct = importedProducts.find(item =>
          normalizeMongoValue(item?._id || item?.id || "") === id || toSlug(item?.name || "") === id
        ) || null;
        setProduct(fallbackProduct);
        setActiveImage(fallbackProduct?.img || "");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-12 text-center text-[#6b7a99]">Đang tải dữ liệu sản phẩm...</div>;
  if (!product) return <div className="p-12 text-center text-[#6b7a99]">Không tìm thấy sản phẩm.</div>;

  const images = [...new Set([product.img, ...(Array.isArray(product.images) ? product.images : [])].filter((image): image is string => typeof image === "string" && image.trim().length > 0))];
  const discount = Number(product.original) > Number(product.price)
    ? Math.round((1 - Number(product.price) / Number(product.original)) * 100)
    : Number(product.off) || 0;
  const inStock = Number(product.stock) > 0;

  return (
    <div className="mx-auto my-5 max-w-7xl px-3 py-4 sm:px-4 sm:py-7">
      <nav aria-label="Đường dẫn" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#71809a] sm:text-sm">
        <Link to="/" className="hover:text-[#1a6fdb]">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <span>{product.category || "Sản phẩm"}</span>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-[#35415b]">{product.name}</span>
      </nav>
      <div className="grid gap-5 rounded-2xl border border-[#e2eaf6] bg-white p-4 shadow-sm sm:gap-8 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <section aria-label="Hình ảnh sản phẩm" className="min-w-0">
          <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5fc] p-5 sm:h-[420px] sm:p-8">
            <ProductImage src={activeImage} name={product.name} category={product.category} />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(image)} aria-label={`Xem ảnh ${index + 1}`} aria-pressed={activeImage === image} className={`h-16 w-16 shrink-0 rounded-lg border-2 bg-white p-1 sm:h-20 sm:w-20 ${activeImage === image ? "border-[#1a6fdb]" : "border-[#e2eaf6]"}`}>
                  <ProductImage src={image} name={product.name} category={product.category} compact />
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["Danh mục", product.category || "Chưa cập nhật"],
              ["Thương hiệu", product.brand || "Chưa cập nhật"],
              ["Tình trạng", inStock ? `Còn hàng${product.stock ? ` (${product.stock})` : ""}` : "Hết hàng"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#e8edf5] bg-[#fbfcff] px-3 py-2.5">
                <p className="text-[11px] text-[#71809a]">{label}</p>
                <p className="mt-1 truncate text-xs font-semibold text-[#35415b] sm:text-sm">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1a6fdb]">{product.brand || "BigBangMart"}</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-[#1a2236] sm:text-3xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-2xl font-extrabold text-[#1a6fdb] sm:text-3xl">{fmt(Number(product.price) || 0)}</p>
            {Number(product.original) > Number(product.price) && <p className="text-sm text-[#8b97aa] line-through">{fmt(Number(product.original))}</p>}
            {discount > 0 && <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600">-{discount}%</span>}
          </div>
          <div className="mt-5 rounded-xl border border-[#dce8f8] bg-[#f7faff] p-4">
            <h2 className="font-semibold text-[#1a2236]">Thông tin giá và ưu đãi</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#52617a]">
              {Number(product.original) > Number(product.price)
                ? `Giá hiện tại đã giảm ${fmt(Number(product.original) - Number(product.price))} so với giá niêm yết.`
                : "Giá bán hiện tại của sản phẩm tại BigBangMart."}
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-[#e2eaf6] p-4">
            <h2 className="font-semibold text-[#1a2236]">Mô tả sản phẩm</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#52617a]">{product.description || "Thông tin chi tiết sản phẩm đang được cập nhật."}</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className={inStock ? "font-medium text-emerald-700" : "font-medium text-red-600"}>{inStock ? "Sẵn sàng đặt hàng" : "Tạm hết hàng"}</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => onBuyNow(product)} disabled={!inStock} className="w-full rounded-xl bg-[#1a6fdb] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1558b0] disabled:cursor-not-allowed disabled:bg-[#aab8cc]">
              Mua ngay
            </button>
            <button type="button" onClick={() => onAddToCart(product)} disabled={!inStock} className="w-full rounded-xl border border-[#1a6fdb] bg-white px-5 py-3.5 text-sm font-bold text-[#1a6fdb] transition-colors hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:border-[#cbd5e1] disabled:text-[#8b97aa]">
              Thêm vào giỏ hàng
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-[#71809a]">Thanh toán khi nhận hàng, chuyển khoản hoặc đặt cọc khi thanh toán.</p>
        </section>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const context = useOutletContext<any>();
  const items = context?.cartItems || [];
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [paymentConfigError, setPaymentConfigError] = useState("");
  const [qrImageError, setQrImageError] = useState(false);
  const [paymentReference] = useState(() => {
    const bytes = window.crypto.getRandomValues(new Uint8Array(5));
    return `BBM${Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState<any>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * item.qty, 0);
  const baseShippingFee = 30000;
  const shippingFee = appliedPromotion?.type === "Miễn phí vận chuyển" ? 0 : baseShippingFee;
  const discount = appliedPromotion && appliedPromotion.type !== "Miễn phí vận chuyển"
    ? Math.min(subtotal, Math.floor(subtotal * (Number(appliedPromotion.value) || 0) / 100))
    : 0;
  const total = Math.max(0, subtotal - discount) + shippingFee;
  const depositAmount = Math.ceil(total / 2);
  const qrAmount = paymentMethod === "deposit" ? depositAmount : total;
  const checkoutQrUrl = paymentConfig?.configured
    ? (() => {
      const url = new URL("https://vietqr.app/img");
      url.searchParams.set("acc", paymentConfig.accountNumber);
      url.searchParams.set("bank", paymentConfig.bank);
      url.searchParams.set("amount", String(qrAmount));
      url.searchParams.set("des", paymentReference);
      url.searchParams.set("template", "compact");
      url.searchParams.set("showinfo", "true");
      url.searchParams.set("holder", paymentConfig.accountHolder);
      if (paymentConfig.storeName) url.searchParams.set("store", paymentConfig.storeName);
      return url.toString();
    })()
    : "";

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/payment-config`)
      .then(async response => {
        if (!response.ok) throw new Error("Không tải được thông tin tài khoản nhận tiền.");
        return response.json();
      })
      .then(data => {
        if (!cancelled) setPaymentConfig(data);
      })
      .catch(error => {
        if (!cancelled) setPaymentConfigError(error instanceof Error ? error.message : "Không tải được thông tin thanh toán.");
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setQrImageError(false);
  }, [checkoutQrUrl]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/promotions`)
      .then(async response => {
        if (!response.ok) throw new Error("Không tải được danh sách mã khuyến mãi.");
        return response.json();
      })
      .then(data => {
        if (!cancelled) setPromotions(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        if (!cancelled) setCouponMessage(error instanceof Error ? error.message : "Không tải được danh sách mã khuyến mãi.");
      });
    return () => { cancelled = true; };
  }, []);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage("Vui lòng nhập mã giảm giá.");
      return;
    }
    setCheckingCoupon(true);
    setCouponMessage("");
    try {
      const response = await fetch(`${API_URL}/promotions`);
      if (!response.ok) throw new Error("Không thể kiểm tra mã khuyến mãi.");
      const records = await response.json();
      const today = new Date().toISOString().slice(0, 10);
      const promotion = (Array.isArray(records) ? records : []).find((item: any) =>
        item.code?.toUpperCase() === code &&
        item.status === "active" &&
        (!item.startDate || item.startDate <= today) &&
        (!item.endDate || item.endDate >= today)
      );
      if (!promotion) {
        setAppliedPromotion(null);
        setCouponMessage("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        return;
      }
      setPromotions(records);
      setAppliedPromotion(promotion);
      setCouponCode(code);
      setCouponMessage(promotion.type === "Miễn phí vận chuyển" ? "Đã áp dụng miễn phí vận chuyển." : `Đã áp dụng mã ${promotion.code}.`);
    } catch (error) {
      setAppliedPromotion(null);
      setCouponMessage(error instanceof Error ? error.message : "Không thể kiểm tra mã giảm giá.");
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) {
      context?.showToast?.("Giỏ hàng đang trống.", true);
      navigate("/");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            address: formData.get("address"),
            note: formData.get("note"),
          },
          items: items.map((item: any) => ({
            productId: getCartItemKey(item),
            quantity: item.qty,
          })),
          paymentMethod,
          paymentReference: paymentMethod === "bank" || paymentMethod === "deposit" ? paymentReference : undefined,
          couponCode: appliedPromotion?.code || "",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        context?.showToast?.(data.message || "Không thể tạo đơn hàng.", true);
        return;
      }
      context?.clearCart?.();
      const params = new URLSearchParams({
        order: data.order?.orderNumber || data.order?._id || "",
        reference: data.order?.paymentReference || "",
        payment: data.order?.paymentMethod || paymentMethod,
        total: String(data.order?.total ?? total),
        deposit: String(data.order?.depositAmount ?? (paymentMethod === "deposit" ? depositAmount : 0)),
      });
      navigate(`/order-success?${params.toString()}`);
    } catch {
      context?.showToast?.("Không thể kết nối đến máy chủ để đặt hàng.", true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto my-12 max-w-2xl rounded-2xl border border-[#e2eaf6] bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-[#1a2236]">Giỏ hàng đang trống</h1>
        <p className="mt-2 text-sm text-[#6b7a99]">Thêm sản phẩm vào giỏ trước khi thanh toán.</p>
        <Link to="/" className="mt-5 inline-flex rounded-lg bg-[#1a6fdb] px-5 py-3 text-sm font-semibold text-white">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a6fdb]">Bước cuối cùng</p>
      <h1 className="mb-2 text-2xl font-bold text-[#1a2236]">Thanh toán đơn hàng</h1>
      <p className="mb-6 text-sm text-[#6b7a99]">Kiểm tra sản phẩm và điền thông tin nhận hàng.</p>
      <form onSubmit={handleCheckout} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e2eaf6] bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-[#1a2236]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a6fdb] text-sm text-white">1</span>Thông tin giao hàng</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-[#35415b]">Họ và tên
                <input name="name" autoComplete="name" required defaultValue={context?.user?.name || ""} placeholder="Ví dụ: Nguyễn Văn A" className="mt-1.5 w-full rounded-lg border border-[#dce4f0] bg-[#f8faff] px-3 py-2.5 outline-none focus:border-[#1a6fdb]" />
              </label>
              <label className="text-sm font-medium text-[#35415b]">Số điện thoại
                <input name="phone" type="tel" autoComplete="tel" required placeholder="Ví dụ: 0912345678" className="mt-1.5 w-full rounded-lg border border-[#dce4f0] bg-[#f8faff] px-3 py-2.5 outline-none focus:border-[#1a6fdb]" />
              </label>
              <label className="text-sm font-medium text-[#35415b] sm:col-span-2">Địa chỉ nhận hàng
                <input name="address" autoComplete="street-address" required placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..." className="mt-1.5 w-full rounded-lg border border-[#dce4f0] bg-[#f8faff] px-3 py-2.5 outline-none focus:border-[#1a6fdb]" />
              </label>
              <label className="text-sm font-medium text-[#35415b] sm:col-span-2">Email <span className="font-normal text-[#8b97aa]">(tùy chọn)</span>
                <input name="email" type="email" autoComplete="email" defaultValue={context?.user?.email || ""} className="mt-1.5 w-full rounded-lg border border-[#dce4f0] bg-[#f8faff] px-3 py-2.5 outline-none focus:border-[#1a6fdb]" />
              </label>
              <label className="text-sm font-medium text-[#35415b] sm:col-span-2">Ghi chú <span className="font-normal text-[#8b97aa]">(tùy chọn)</span>
                <textarea name="note" rows={3} placeholder="Ghi chú về giao hàng..." className="mt-1.5 w-full resize-y rounded-lg border border-[#dce4f0] bg-[#f8faff] px-3 py-2.5 outline-none focus:border-[#1a6fdb]" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e2eaf6] bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-[#1a2236]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a6fdb] text-sm text-white">2</span>Phương thức thanh toán</h2>
            <div className="space-y-3">
              {[
                { value: "cod", icon: "💵", label: "Thanh toán khi nhận hàng (COD)", helper: "Trả tiền mặt cho nhân viên giao hàng." },
                { value: "bank", icon: "🏦", label: "Chuyển khoản ngân hàng", helper: "Thanh toán toàn bộ đơn hàng bằng chuyển khoản." },
                { value: "deposit", icon: "🪙", label: "Đặt cọc qua chuyển khoản", helper: `Cọc 50% giá trị đơn hàng: ${fmt(depositAmount)}.` },
                { value: "card", icon: "💳", label: "Thẻ tín dụng / thẻ ghi nợ", helper: "Đơn sẽ được ghi nhận chờ thanh toán; cổng thẻ trực tuyến chưa được kết nối." },
              ].map(option => (
                <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${paymentMethod === option.value ? "border-[#1a6fdb] bg-[#f4f8ff]" : "border-[#e2eaf6] hover:border-[#1a6fdb]"}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3fc] text-lg">{option.icon}</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold text-[#1a2236]">{option.label}</span><span className="mt-1 block text-xs text-[#71809a]">{option.helper}</span></span>
                  <input className="mt-1 accent-[#1a6fdb]" type="radio" name="payment" value={option.value} checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} />
                </label>
              ))}
            </div>
            {(paymentMethod === "bank" || paymentMethod === "deposit") && <div className="mt-4 rounded-xl border border-[#dce8f8] bg-[#f7faff] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><h3 className="font-semibold text-[#1a2236]">Quét mã QR để chuyển khoản</h3><p className="mt-1 text-xs text-[#71809a]">Số tiền: <strong className="text-[#1a6fdb]">{fmt(qrAmount)}</strong></p></div>
                {paymentConfig?.configured && !qrImageError && <img src={checkoutQrUrl} alt="Mã QR chuyển khoản" onError={() => setQrImageError(true)} className="h-36 w-36 rounded-lg border border-[#e2eaf6] bg-white p-1" />}
              </div>
              {paymentConfig?.configured ? qrImageError
                ? <p role="alert" className="mt-3 text-sm text-red-700">Không tải được mã QR. Bạn vẫn có thể chuyển khoản theo thông tin bên dưới.</p>
                : null
                : <p role={paymentConfigError ? "alert" : "status"} className="mt-3 text-sm text-amber-800">{paymentConfigError || "Đang tải thông tin ngân hàng..."}</p>}
              {paymentConfig?.configured && <div className="mt-3 space-y-1 text-sm text-[#52617a]">
                <p>Ngân hàng: <strong>{paymentConfig.bank}</strong> · Số tài khoản: <strong className="select-all">{paymentConfig.accountNumber}</strong></p>
                <p>Chủ tài khoản: <strong>{paymentConfig.accountHolder}</strong></p>
                <p>Nội dung chuyển khoản: <strong className="select-all text-[#1a6fdb]">{paymentReference}</strong></p>
              </div>}
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">Vui lòng bấm “Xác nhận đặt hàng” trước khi chuyển khoản. Mã QR đã gắn đúng số tiền và mã đơn để hệ thống tự đối soát.</p>
            </div>}
            {paymentMethod === "card" && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">Chưa nhập thông tin thẻ ở trang này. Đơn hàng sẽ ở trạng thái chưa thanh toán cho đến khi cửa hàng kết nối cổng thanh toán an toàn.</p>}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-[#e2eaf6] bg-white p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-[#1a2236]">Tóm tắt đơn hàng</h2>
          <ul className="max-h-72 space-y-4 overflow-y-auto">
            {items.map((item: any) => (
              <li key={getCartItemKey(item)} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f0f5fc] p-1"><ProductImage src={item.img} name={item.name} category={item.category} compact /></div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-[#35415b]">{item.name}</p>
                  <p className="text-xs text-[#6b7a99]">Số lượng: {item.qty}</p>
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-[#1a2236]">{fmt((Number(item.price) || 0) * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[#e2eaf6] pt-4">
            <label className="mb-2 block text-sm font-semibold text-[#35415b]">🏷️ Mã khuyến mãi</label>
            <div className="flex gap-2">
              <input value={couponCode} onChange={event => setCouponCode(event.target.value.toUpperCase())} disabled={Boolean(appliedPromotion)} placeholder="Nhập mã giảm giá" className="min-w-0 flex-1 rounded-lg border border-[#dce4f0] px-3 py-2 text-sm uppercase outline-none focus:border-[#1a6fdb]" />
              {appliedPromotion
                ? <button type="button" onClick={() => { setAppliedPromotion(null); setCouponCode(""); setCouponMessage(""); }} className="rounded-lg border border-[#dce4f0] px-3 text-sm font-semibold text-red-600">Xóa</button>
                : <button type="button" disabled={checkingCoupon} onClick={applyCoupon} className="rounded-lg bg-[#0b1b3d] px-3 text-sm font-semibold text-white disabled:opacity-60">{checkingCoupon ? "..." : "Áp dụng"}</button>}
            </div>
            {couponMessage && <p role={appliedPromotion ? "status" : "alert"} className={`mt-2 text-xs ${appliedPromotion ? "text-emerald-700" : "text-[#71809a]"}`}>{couponMessage}</p>}
            {!appliedPromotion && promotions.some(promotion => promotion.status === "active") && <div className="mt-2 flex flex-wrap gap-2">{promotions.filter(promotion => promotion.status === "active").slice(0, 3).map(promotion => <button type="button" key={promotion._id} onClick={() => setCouponCode(promotion.code)} className="rounded-md border border-[#dce4f0] px-2 py-1 text-xs font-semibold text-[#1a6fdb]">{promotion.code}</button>)}</div>}
          </div>
          <div className="mt-4 space-y-2 border-t border-[#e2eaf6] pt-4 text-sm">
            <div className="flex justify-between"><span className="text-[#6b7a99]">Tạm tính</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#6b7a99]">Phí vận chuyển</span><span>{shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : fmt(shippingFee)}</span></div>
            {discount > 0 && <div className="flex justify-between"><span className="text-[#6b7a99]">Giảm giá ({appliedPromotion?.code})</span><span className="text-emerald-600">−{fmt(discount)}</span></div>}
            <div className="flex justify-between border-t border-[#e2eaf6] pt-3 text-base font-bold"><span>Tổng cộng</span><span className="text-lg text-[#1a6fdb]">{fmt(total)}</span></div>
            {paymentMethod === "deposit" && <div className="flex justify-between rounded-lg bg-blue-50 p-3 text-sm"><span className="font-medium text-[#35415b]">Tiền cọc (50%)</span><span className="font-bold text-[#1a6fdb]">{fmt(depositAmount)}</span></div>}
          </div>
          <div className="mt-5">
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#1a6fdb] px-5 py-3 font-semibold text-white hover:bg-[#1558b0] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Đang tạo đơn hàng..." : "Xác nhận đặt hàng"}
            </button>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-[#8b97aa]">Bằng việc đặt hàng, bạn đồng ý với điều khoản và chính sách của cửa hàng.</p>
            <Link to="/" className="mt-3 block text-center text-sm font-medium text-[#1a6fdb] hover:underline">Tiếp tục mua sắm</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const paymentReference = searchParams.get("reference") || "";
  const paymentMethod = searchParams.get("payment") || "cod";
  const total = Number(searchParams.get("total")) || 0;
  const deposit = Number(searchParams.get("deposit")) || 0;
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentError, setPaymentError] = useState("");
  const isQrPayment = paymentMethod === "bank" || paymentMethod === "deposit";
  const qrAmount = paymentMethod === "deposit" ? deposit : total;
  const qrUrl = paymentConfig?.configured && paymentReference
    ? (() => {
      const url = new URL("https://vietqr.app/img");
      url.searchParams.set("acc", paymentConfig.accountNumber);
      url.searchParams.set("bank", paymentConfig.bank);
      url.searchParams.set("amount", String(qrAmount));
      url.searchParams.set("des", paymentReference);
      url.searchParams.set("template", "compact");
      url.searchParams.set("showinfo", "true");
      url.searchParams.set("holder", paymentConfig.accountHolder);
      if (paymentConfig.storeName) url.searchParams.set("store", paymentConfig.storeName);
      return url.toString();
    })()
    : "";

  useEffect(() => {
    if (!isQrPayment) return;
    let cancelled = false;
    fetch(`${API_URL}/payment-config`)
      .then(async response => {
        if (!response.ok) throw new Error("Không tải được cấu hình tài khoản nhận tiền.");
        return response.json();
      })
      .then(data => {
        if (!cancelled) setPaymentConfig(data);
      })
      .catch(error => {
        if (!cancelled) setPaymentError(error instanceof Error ? error.message : "Không tải được thông tin thanh toán.");
      });
    return () => { cancelled = true; };
  }, [isQrPayment]);

  useEffect(() => {
    if (!isQrPayment || !orderNumber) return;
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${encodeURIComponent(orderNumber)}/payment-status`);
        if (!response.ok) throw new Error("Không kiểm tra được trạng thái giao dịch.");
        const data = await response.json();
        if (cancelled) return;
        setPaymentStatus(data.paymentStatus || "unpaid");
        setOrderStatus(data.status || "pending");
        setPaidAmount(Number(data.paidAmount) || 0);
        if (data.paymentStatus !== "paid" && attempts < 60) {
          attempts += 1;
          timer = window.setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        if (!cancelled) setPaymentError(error instanceof Error ? error.message : "Không kiểm tra được trạng thái thanh toán.");
      }
    };
    void checkStatus();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [isQrPayment, orderNumber]);

  const paymentInstructions: Record<string, string> = {
    cod: "Bạn thanh toán khi nhận hàng.",
    bank: `Quét mã QR bên dưới để thanh toán ${fmt(total)}.`,
    deposit: `Quét mã QR bên dưới để đặt cọc ${fmt(deposit)}. Phần còn lại ${fmt(Math.max(0, total - deposit))} thanh toán khi nhận hàng.`,
    card: "Đơn hàng đã được ghi nhận nhưng chưa thanh toán. Cổng thanh toán thẻ sẽ được bổ sung sau.",
  };

  return (
    <div className="mx-auto my-12 max-w-xl rounded-2xl border border-[#e2eaf6] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">✓</div>
      <h1 className="mt-4 text-2xl font-bold text-[#1a2236]">Đặt hàng thành công</h1>
      <p className="mt-2 text-sm text-[#6b7a99]">Cảm ơn bạn đã mua sắm tại BigBangMart.</p>
      {orderNumber && <p className="mt-3 text-sm font-semibold text-[#35415b]">Mã đơn hàng: {orderNumber}</p>}
      <p className="mt-3 rounded-xl bg-[#f3f6fb] p-4 text-sm leading-relaxed text-[#52617a]">{paymentInstructions[paymentMethod] || paymentInstructions.cod}</p>
      {orderNumber && <Link to={`/track-order?order=${encodeURIComponent(orderNumber)}`} className="mt-5 inline-flex rounded-lg bg-[#1a6fdb] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1558b0]">Theo dõi đơn hàng</Link>}
      {isQrPayment && (
        <section className="mt-5 rounded-2xl border border-[#e2eaf6] bg-white p-5 text-left">
          <h2 className="text-lg font-bold text-[#1a2236]">Thanh toán qua SePay</h2>
          {paymentStatus === "paid" ? (
            <div role="status" className="mt-4 rounded-xl bg-emerald-50 p-4 text-center">
              <p className="font-bold text-emerald-700">{paymentMethod === "deposit" ? "Đã nhận tiền đặt cọc" : "Đã nhận thanh toán thành công"}</p>
              <p className="mt-1 text-sm text-emerald-700">Đã nhận: {fmt(paidAmount || qrAmount)}</p>
              {orderStatus === "processing" && <p className="mt-2 text-sm font-semibold text-emerald-800">Đơn hàng đang chờ cửa hàng chuẩn bị.</p>}
            </div>
          ) : paymentConfig?.configured && qrUrl ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center">
              <img src={qrUrl} alt="Mã QR chuyển khoản SePay" className="mx-auto w-full max-w-[190px] rounded-lg border border-[#e2eaf6] bg-white p-2" />
              <div className="space-y-2 text-sm text-[#52617a]">
                <p>Ngân hàng: <strong className="text-[#1a2236]">{paymentConfig.bank}</strong></p>
                <p>Số tài khoản: <strong className="text-[#1a2236]">{paymentConfig.accountNumber}</strong></p>
                <p>Chủ tài khoản: <strong className="text-[#1a2236]">{paymentConfig.accountHolder}</strong></p>
                <p>Số tiền: <strong className="text-[#1a6fdb]">{fmt(qrAmount)}</strong></p>
                <p>Nội dung chuyển khoản: <strong className="select-all text-[#1a2236]">{paymentReference}</strong></p>
                {paymentStatus === "partial" && <p className="pt-2 text-xs text-[#71809a]">Đã nhận {fmt(paidAmount)}, còn thiếu {fmt(Math.max(0, qrAmount - paidAmount))}</p>}
              </div>
            </div>
          ) : (
            <p role="alert" className="mt-3 text-sm text-amber-700">{paymentError || "Tài khoản nhận tiền chưa được cấu hình trên backend."}</p>
          )}
          {paymentError && paymentStatus !== "paid" && <p role="alert" className="mt-3 text-xs text-amber-700">{paymentError}</p>}
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">Chỉ xác nhận giao dịch khi trạng thái được SePay đối soát. Không chia sẻ thông tin đăng nhập ngân hàng hoặc mã OTP.</p>
        </section>
      )}
      <Link to="/" className="mt-6 inline-flex rounded-lg bg-[#1a6fdb] px-5 py-3 text-sm font-semibold text-white">Tiếp tục mua sắm</Link>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem("bbm-remembered-email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem("bbm-remembered-email")));
  const [submitting, setSubmitting] = useState(false);
  const context = useOutletContext<any>();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        context?.showToast?.(data.message || "Tài khoản hoặc mật khẩu không chính xác", true);
        return;
      }
      context?.login?.(data.user);
      if (rememberMe) localStorage.setItem("bbm-remembered-email", email);
      else localStorage.removeItem("bbm-remembered-email");
      navigate("/");
    } catch {
      context?.showToast?.("Không thể kết nối đến máy chủ. Vui lòng thử lại.", true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#f3f6fb] lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#1a6fdb] via-[#1859ac] to-[#103b78] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute bottom-16 right-20 h-48 w-48 rounded-full border border-white/10" />
        <div className="relative z-10">
          <BrandLogo className="h-16" />
          <p className="mt-4 max-w-md text-sm text-blue-100">Quản lý cửa hàng điện tử của bạn, mọi lúc mọi nơi</p>
          <ul className="mt-8 space-y-4 text-sm">
            {["Quản lý đơn hàng nhanh chóng", "Theo dõi doanh thu hiệu quả", "Báo cáo chi tiết, trực quan", "Tối ưu trải nghiệm khách hàng"].map(item => <li key={item} className="flex items-center gap-3"><span className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-xs">✓</span>{item}</li>)}
          </ul>
        </div>
        <div className="relative z-10 flex items-end gap-5 text-6xl" aria-hidden="true"><span>💻</span><span>🛍️</span><span>📦</span></div>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-2xl border border-[#e2eaf6] bg-white p-6 shadow-sm sm:p-8">
          <Link to="/" className="text-xs font-medium text-[#71809a] hover:text-[#1a6fdb]">← Về cửa hàng</Link>
          <h1 className="mt-5 text-2xl font-bold text-[#1a2236]">Đăng nhập tài khoản</h1>
          <p className="mt-1 text-sm text-[#71809a]">Vui lòng nhập thông tin để đăng nhập</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-xs font-medium text-[#52617a]">Email / tài khoản
              <input className="mt-1.5 w-full rounded-lg border border-[#dfe6f0] px-3 py-3 text-sm outline-none focus:border-[#1a6fdb]" type="text" autoComplete="username" placeholder="Nhập email hoặc tài khoản" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label className="block text-xs font-medium text-[#52617a]">Mật khẩu
              <span className="mt-1.5 flex items-center rounded-lg border border-[#dfe6f0] pr-3 focus-within:border-[#1a6fdb]">
                <input className="w-full rounded-lg px-3 py-3 text-sm outline-none" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="text-[#71809a]">{showPassword ? "Ẩ" : "◉"}</button>
              </span>
            </label>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#52617a]"><input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} className="accent-[#1a6fdb]" />Ghi nhớ email</label>
              <Link to="/forgot-password" className="font-medium text-[#1a6fdb] hover:underline">Quên mật khẩu?</Link>
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#1a6fdb] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1558b0] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Đang đăng nhập..." : "Đăng nhập"}</button>
          </form>
          <p className="mt-6 text-center text-xs text-[#71809a]">Chưa có tài khoản? <Link to="/register" className="font-semibold text-[#1a6fdb] hover:underline">Đăng ký ngay</Link></p>
        </div>
      </section>
    </div>
  );
}

function PasswordPage({ mode }: { mode: "change" | "forgot" | "reset" }) {
  const context = useOutletContext<any>();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ error: boolean; message: string } | null>(null);
  const [done, setDone] = useState(false);
  const [token] = useState(() => new URLSearchParams(location.hash.slice(1)).get("token") || "");
  useEffect(() => {
    if (mode === "reset" && location.hash) {
      window.history.replaceState(window.history.state, "", location.pathname + location.search);
    }
  }, [mode, location.hash, location.pathname, location.search]);
  const title = mode === "change" ? "Đổi mật khẩu" : mode === "forgot" ? "Quên mật khẩu" : "Đặt lại mật khẩu";
  const fieldClass = "w-full rounded-xl border border-[#e2eaf6] p-3 outline-none focus:border-[#1a6fdb]";
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    if (mode !== "forgot" && newPassword !== confirmation) {
      setResult({ error: true, message: "Mật khẩu xác nhận không khớp." });
      return;
    }
    setBusy(true);
    try {
      const body = mode === "forgot" ? { email }
        : mode === "change" ? { email: context.user.email, currentPassword, newPassword }
        : { token, newPassword };
      const endpoint = mode === "change" ? "change-password" : mode === "forgot" ? "forgot-password" : "reset-password";
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        setResult({ error: true, message: response.status === 404
          ? "Backend đang chạy chưa có chức năng này. Vui lòng dừng backend cũ ở cổng 5000 rồi chạy lại npm start trong thư mục backend."
          : "Máy chủ trả về phản hồi không hợp lệ. Vui lòng thử lại sau." });
        return;
      }
      const data = await response.json();
      setResult({ error: !response.ok, message: data.message || "Không thể xử lý yêu cầu." });
      if (response.ok) {
        setDone(mode !== "forgot");
        setCurrentPassword(""); setNewPassword(""); setConfirmation("");
        if (mode === "change") context.logout?.();
      }
    } catch {
      setResult({ error: true, message: "Không thể xử lý yêu cầu. Vui lòng kiểm tra kết nối và thử lại." });
    } finally { setBusy(false); }
  };
  return (
    <section className="mx-auto my-12 w-full max-w-md rounded-2xl border border-[#e2eaf6] bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-[#1a2236]">{title}</h1>
      <p className="mt-2 text-sm text-[#6b7a99]">{mode === "forgot" ? "Nhập email đăng ký để nhận liên kết đặt lại mật khẩu, có hiệu lực trong 15 phút." : "Mật khẩu mới cần từ 6 đến 128 ký tự."}</p>
      {result && <p role={result.error ? "alert" : "status"} className={`mt-5 rounded-lg p-3 text-sm ${result.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{result.message}</p>}
      {!done && mode === "change" && !context?.user && <p className="mt-5 text-sm">Vui lòng <Link to="/login" className="text-[#1a6fdb] underline">đăng nhập</Link> để đổi mật khẩu.</p>}
      {!done && mode === "reset" && !token && <p role="alert" className="mt-5 text-sm text-red-700">Liên kết không hợp lệ. Vui lòng yêu cầu liên kết mới.</p>}
      {!done && (mode !== "change" || context?.user) && (mode !== "reset" || token) && <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "forgot" && <label className="block text-sm">Email đăng ký<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className={`${fieldClass} mt-1`} /></label>}
        {mode === "change" && <><p className="break-all text-sm text-[#6b7a99]">Tài khoản: {context.user.email}</p><label className="block text-sm">Mật khẩu hiện tại<input type="password" autoComplete="current-password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={`${fieldClass} mt-1`} /></label></>}
        {mode !== "forgot" && <>
          <label className="block text-sm">Mật khẩu mới<input type="password" autoComplete="new-password" required minLength={6} maxLength={128} value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`${fieldClass} mt-1`} /></label>
          <label className="block text-sm">Xác nhận mật khẩu mới<input type="password" autoComplete="new-password" required minLength={6} maxLength={128} value={confirmation} onChange={e => setConfirmation(e.target.value)} className={`${fieldClass} mt-1`} /></label>
        </>}
        <button disabled={busy} className="w-full rounded-xl bg-[#1a6fdb] p-3 font-bold text-white hover:bg-[#1558b0] disabled:opacity-60">{busy ? "Đang xử lý..." : mode === "forgot" ? "Gửi liên kết khôi phục" : "Lưu mật khẩu mới"}</button>
      </form>}
      <div className="mt-6 flex justify-between text-sm text-[#1a6fdb]"><Link to="/login" className="hover:underline">Về đăng nhập</Link>{mode === "reset" && <Link to="/forgot-password" className="hover:underline">Yêu cầu liên kết mới</Link>}</div>
    </section>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const context = useOutletContext<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      context?.showToast?.("Mật khẩu xác nhận không khớp.", true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        context?.showToast?.(data.message || "Không thể tạo tài khoản.", true);
        return;
      }
      context?.login?.(data.user);
      context?.showToast?.("Đăng ký tài khoản thành công.");
      navigate("/");
    } catch {
      context?.showToast?.("Không thể kết nối đến máy chủ. Vui lòng thử lại.", true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-2xl border border-[#e2eaf6] shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-2 text-[#1a2236]">Tạo tài khoản</h1>
      <p className="mb-6 text-center text-sm text-[#6b7a99]">Đăng ký để mua sắm và theo dõi đơn hàng</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <input className="w-full p-3 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" type="text" autoComplete="name" placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full p-3 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" type="email" autoComplete="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full p-3 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" type="password" autoComplete="new-password" placeholder="Mật khẩu" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required />
        <input className="w-full p-3 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type="submit" disabled={submitting} className="w-full py-3 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] disabled:cursor-not-allowed disabled:opacity-60 transition-colors">
          {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6b7a99]">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-[#1a6fdb] hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
}

function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(() => searchParams.get("order") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearching(true);
    setError("");
    setOrder(null);
    try {
      const response = await fetch(
        `${API_URL}/orders/${encodeURIComponent(orderNumber.trim())}/tracking?phone=${encodeURIComponent(phone.trim())}`
      );
      if (!response.headers.get("content-type")?.includes("application/json")) {
        setError(response.status === 404
          ? "Máy chủ chưa cập nhật chức năng tra cứu đơn hàng. Vui lòng khởi động lại backend."
          : "Máy chủ trả về phản hồi không hợp lệ. Vui lòng thử lại sau.");
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Không thể tra cứu đơn hàng.");
        return;
      }
      setOrder(data);
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
    } finally {
      setSearching(false);
    }
  };

  const statusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    processing: "Chờ cửa hàng chuẩn bị",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  const progressStatuses = ["pending", "processing", "shipped", "delivered"];
  const currentStep = order ? progressStatuses.indexOf(order.status) : -1;

  return (
    <div className="mx-auto my-10 w-full max-w-2xl px-4">
      <section className="rounded-2xl border border-[#e2eaf6] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a6fdb]">Tra cứu đơn hàng</p>
        <h1 className="mt-2 text-2xl font-bold text-[#1a2236]">Theo dõi đơn hàng của bạn</h1>
        <p className="mt-2 text-sm text-[#6b7a99]">Nhập mã đơn hàng và số điện thoại đã dùng khi đặt hàng.</p>
        <form onSubmit={handleSearch} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-[#52617a]">Mã đơn hàng
            <input required value={orderNumber} onChange={event => setOrderNumber(event.target.value)} placeholder="Ví dụ: BBM-..." className="mt-1.5 w-full rounded-lg border border-[#dfe6f0] bg-[#f8faff] px-3 py-3 outline-none focus:border-[#1a6fdb]" />
          </label>
          <label className="text-sm font-medium text-[#52617a]">Số điện thoại đặt hàng
            <input required type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="Nhập số điện thoại" className="mt-1.5 w-full rounded-lg border border-[#dfe6f0] bg-[#f8faff] px-3 py-3 outline-none focus:border-[#1a6fdb]" />
          </label>
          <button type="submit" disabled={searching} className="rounded-lg bg-[#1a6fdb] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1558b0] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2">
            {searching ? "Đang tra cứu..." : "Tra cứu đơn hàng"}
          </button>
        </form>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>

      {order && (
        <section className="mt-5 rounded-2xl border border-[#e2eaf6] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#1a2236]">Đơn hàng {order.orderNumber}</h2>
              <p className="mt-1 text-sm text-[#6b7a99]">Đặt lúc {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "—"}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === "cancelled" ? "bg-red-50 text-red-700" : order.status === "delivered" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
              {statusLabels[order.status] || order.status}
            </span>
          </div>
          {order.status === "cancelled" ? (
            <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">Đơn hàng đã bị hủy. Vui lòng liên hệ cửa hàng nếu bạn cần hỗ trợ.</p>
          ) : (
            <ol aria-label="Tiến trình đơn hàng" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {progressStatuses.map((status, index) => (
                <li key={status} className={`border-t-2 pt-3 text-xs font-medium ${index <= currentStep ? "border-[#1a6fdb] text-[#1a6fdb]" : "border-[#dfe6f0] text-[#71809a]"}`}>
                  <span className="block font-bold">{index + 1}. {statusLabels[status]}</span>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-7 border-t border-[#e2eaf6] pt-5">
            <h3 className="font-semibold text-[#1a2236]">Sản phẩm</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#52617a]">
              {order.items.map((item: { name: string; quantity: number }, index: number) => (
                <li key={`${item.name}-${index}`} className="flex justify-between gap-4"><span>{item.name}</span><span className="shrink-0">x{item.quantity}</span></li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-[#e2eaf6] pt-4 font-bold text-[#1a2236]"><span>Tổng thanh toán</span><span>{fmt(Number(order.total) || 0)}</span></p>
            {["paid", "partial"].includes(order.paymentStatus) && <p className="mt-2 text-xs text-[#71809a]">Thanh toán: {order.paymentStatus === "paid" ? "Đã thanh toán" : "Đã thanh toán một phần"}</p>}
            
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (location.pathname.startsWith("/product/")) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        const loaded = unwrapApiList<Category>(data, "categories");
        setCategories(loaded.length ? loaded : importedCategories as Category[]);
      })
      .catch(() => setCategories(importedCategories as Category[]));
  }, []);

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn || !user) {
      setToastMsg({ text: "Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.", isError: true });
      navigate("/login");
      return false;
    }
    setCartItems(prev => {
      const existing = prev.find(item => getCartItemKey(item) === getCartItemKey(product));
      if (existing) return prev.map(item => getCartItemKey(item) === getCartItemKey(product) ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    return true;
  };

  const handleBuyNow = (product: any) => {
    if (!isLoggedIn || !user) {
      setToastMsg({ text: "Vui lòng đăng nhập trước khi mua hàng.", isError: true });
      navigate("/login");
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(item => getCartItemKey(item) === getCartItemKey(product));
      if (existing) return prev.map(item => getCartItemKey(item) === getCartItemKey(product) ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleUpdateCartQty = (product: any, delta: number) => {
    setCartItems(prev => prev.flatMap(item => {
      if (getCartItemKey(item) !== getCartItemKey(product)) return [item];
      const qty = item.qty + delta;
      return qty > 0 ? [{ ...item, qty }] : [];
    }));
  };

  const handleRemoveFromCart = (product: any) => {
    setCartItems(prev => prev.filter(item => getCartItemKey(item) !== getCartItemKey(product)));
  };

  const handleOpenCart = () => {
    if (!isLoggedIn || !user) {
      setToastMsg({ text: "Vui lòng đăng nhập để xem giỏ hàng.", isError: true });
      navigate("/login");
      return;
    }
    setCartOpen(true);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f0f5fc] flex flex-col">
      {!isAdminRoute && !isAuthRoute && <AnnouncementBar />}
      {!isAdminRoute && !isAuthRoute && (
        <Header 
          cartCount={cartItems.reduce((a, b) => a + (b.qty || 1), 0)} 
          isLoggedIn={isLoggedIn} 
          user={user} 
          onLogout={() => { setUser(null); setIsLoggedIn(false); setCartItems([]); }} 
          onCartClick={handleOpenCart}
        />
      )}
      {!isAdminRoute && !isAuthRoute && <CategoryNav categories={categories} />}
      <main className="flex-1">
        <Outlet context={{ 
          onAddToCart: handleAddToCart, 
          onBuyNow: handleBuyNow,
          categories,
          cartItems, 
          clearCart: () => setCartItems([]),
          login: (u: any) => { setUser(u); setIsLoggedIn(true); }, 
          logout: () => { setUser(null); setIsLoggedIn(false); setCartItems([]); },
          user,
          showToast: (text: string, isError = false) => setToastMsg({ text, isError }) 
        }} />
      </main>
      {!isAdminRoute && !isAuthRoute && cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateCartQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      )}
      {toastMsg && <Toast message={toastMsg.text} isError={toastMsg.isError} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

// ─── Router Configuration ────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "change-password", element: <PasswordPage key="change" mode="change" /> },
      { path: "forgot-password", element: <PasswordPage key="forgot" mode="forgot" /> },
      { path: "reset-password", element: <PasswordPage key="reset" mode="reset" /> },
      { path: "category", element: <HomePage /> },
      { path: "category/:id", element: <CategoryPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "product/:id", element: <ProductPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-success", element: <OrderSuccessPage /> },
      { path: "track-order", element: <TrackOrderPage /> },
      { path: "admin/*", element: <AdminPage /> },
      { path: "*", element: <HomePage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
