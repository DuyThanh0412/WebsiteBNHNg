import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I accidentally deleted CategoryPage and HomePage. Let's add them back right before RootLayout.
const missingPages = `
function CategoryPage() {
  const { id } = useParams();
  const title = id 
    ? decodeURIComponent(id).replace(/-/g, " ").replace(/(^\\w|[\\s]\\S)/g, l => l.toUpperCase()) 
    : "Danh mục";
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-6">Danh mục: {title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {smartphones.map((p, i) => (
          <ProductCard key={i} product={p} onAdd={onAddToCart} />
        ))}
        {smartphones.map((p, i) => (
          <ProductCard key={\`dup-\${i}\`} product={p} onAdd={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();
  return (
    <>
      <HeroBanner />
      <SmartphonesSection onAddToCart={onAddToCart} />
      <TopCategories />
      <BrandsSection />
      <AccessoriesSection />
    </>
  );
}
`;

content = content.replace(/function RootLayout\(\) \{/, missingPages + '\\nfunction RootLayout() {');
fs.writeFileSync('src/App.tsx', content);
