import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add useSearchParams to imports
content = content.replace(
  'useNavigate, useLocation } from "react-router";',
  'useNavigate, useLocation, useSearchParams } from "react-router";'
);

// 2. Change BrandsSection and AccessoriesSection <button> to <Link to={\`/search?q=...\`}>
const oldBrandsSection = `function BrandsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6]">
        <SectionHeader title="Thương hiệu" accent="Điện tử hàng đầu" onViewAll={() => {}} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {brands.map((b) => (
            <button
              key={b.name}
              className="relative rounded-xl overflow-hidden h-36 group flex items-end"
              style={{ background: b.color }}
            >
              <img
                src={b.img}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              />
              <div className="relative z-10 p-4 text-left text-white">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{b.name}</p>
                <p className="text-sm font-bold">{b.tagline}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}`;

const newBrandsSection = `function BrandsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6]">
        <SectionHeader title="Thương hiệu" accent="Điện tử hàng đầu" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {brands.map((b) => (
            <Link
              key={b.name}
              to={\`/search?q=\${encodeURIComponent(b.name)}\`}
              className="relative rounded-xl overflow-hidden h-36 group flex items-end"
              style={{ background: b.color }}
            >
              <img
                src={b.img}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              />
              <div className="relative z-10 p-4 text-left text-white">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{b.name}</p>
                <p className="text-sm font-bold">{b.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}`;

content = content.replace(oldBrandsSection, newBrandsSection);

const oldAccessoriesSection = `function AccessoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6]">
        <SectionHeader title="Phụ kiện" accent="Nổi bật" onViewAll={() => {}} />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {accessoriesData.map((e) => (
            <button key={e.name} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f0f5fc] border border-[#e2eaf6] group-hover:border-[#1a6fdb] transition-colors">
                <img src={e.img} alt={e.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#1a2236] leading-tight">{e.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}`;
// Note: Earlier it might be mapping over "accessories" instead of "accessoriesData". Let's check.
