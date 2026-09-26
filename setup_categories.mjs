import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newProducts = `
const laptops = [
  { name: "MacBook Pro M2", price: 32000000, original: 35000000, off: 8, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=240&fit=crop&auto=format" },
  { name: "Dell XPS 13", price: 28000000, original: 30000000, off: 6, img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=240&fit=crop&auto=format" },
  { name: "Asus ROG Zephyrus", price: 35000000, original: 40000000, off: 12, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&h=240&fit=crop&auto=format" },
  { name: "ThinkPad X1 Carbon", price: 31000000, original: 34000000, off: 9, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=240&fit=crop&auto=format" },
  { name: "Acer Swift 3", price: 24000000, original: 27000000, off: 11, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=240&fit=crop&auto=format" }
];

const tablets = [
  { name: "iPad Pro 11 inch", price: 22000000, original: 25000000, off: 12, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=240&fit=crop&auto=format" },
  { name: "Galaxy Tab S8", price: 16000000, original: 18000000, off: 11, img: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=200&h=240&fit=crop&auto=format" },
  { name: "iPad Air 5", price: 15000000, original: 17000000, off: 11, img: "https://images.unsplash.com/photo-1554672408-730436b60dde?w=200&h=240&fit=crop&auto=format" }
];

const audio = [
  { name: "AirPods Pro 2", price: 6000000, original: 7000000, off: 14, img: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=200&h=240&fit=crop&auto=format" },
  { name: "Sony WH-1000XM5", price: 7500000, original: 8500000, off: 11, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=240&fit=crop&auto=format" },
  { name: "JBL Flip 6", price: 2500000, original: 3000000, off: 16, img: "https://images.unsplash.com/photo-1572569433114-1e0f089606d2?w=200&h=240&fit=crop&auto=format" },
  { name: "Marshall Emberton", price: 3500000, original: 4000000, off: 12, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=240&fit=crop&auto=format" }
];

const smartwatches = [
  { name: "Apple Watch Series 8", price: 10000000, original: 12000000, off: 16, img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=240&fit=crop&auto=format" },
  { name: "Galaxy Watch 5", price: 6500000, original: 7500000, off: 13, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&h=240&fit=crop&auto=format" },
  { name: "Garmin Fenix 7", price: 15000000, original: 17000000, off: 11, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=240&fit=crop&auto=format" },
];

const accessoriesData = [
  { name: "Tai nghe Bluetooth", price: 500000, original: 800000, off: 37, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=240&fit=crop&auto=format" },
  { name: "Cáp sạc Type-C", price: 150000, original: 250000, off: 40, img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&h=240&fit=crop&auto=format" },
  { name: "Ốp lưng chống sốc", price: 200000, original: 300000, off: 33, img: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=200&h=240&fit=crop&auto=format" },
  { name: "Sạc dự phòng 10000mAh", price: 450000, original: 600000, off: 25, img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=240&fit=crop&auto=format" },
  { name: "Chuột không dây", price: 350000, original: 500000, off: 30, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=240&fit=crop&auto=format" },
  { name: "Bàn phím cơ", price: 950000, original: 1200000, off: 20, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=200&h=240&fit=crop&auto=format" },
];

const topCategories = [`;

content = content.replace(/const topCategories = \[/, newProducts);

const oldCategoryPageRegex = /function CategoryPage\(\) \{[\s\S]*?const \{ onAddToCart \} = useOutletContext[\s\S]*?<\/div>\s*\);\s*\}/;
const newCategoryPage = `function CategoryPage() {
  const { id } = useParams();
  
  const categoryMatch = categories.find(c => toSlug(c.label) === id) 
    || topCategories.find(c => toSlug(c.label) === id);
    
  const title = categoryMatch 
    ? categoryMatch.label 
    : (id ? id.replace(/-/g, " ").replace(/(^\\w|[\\s]\\S)/g, l => l.toUpperCase()) : "Danh mục");

  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();

  let pageProducts = smartphones;
  if (id === 'laptop') pageProducts = laptops;
  else if (id === 'may-tinh-bang' || id === 'tablet') pageProducts = tablets;
  else if (id === 'am-thanh') pageProducts = audio;
  else if (id === 'dong-ho-thong-minh' || id === 'smartwatch') pageProducts = smartwatches;
  else if (id === 'phu-kien') pageProducts = accessoriesData;
  else if (id === 'camera' || id === 'man-hinh') pageProducts = []; // Empty state

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-6">Danh mục: {title}</h1>
      {pageProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {pageProducts.map((p, i) => (
            <ProductCard key={i} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      ) : (
         <div className="bg-white p-12 rounded-2xl border border-[#e2eaf6] text-center">
           <div className="w-16 h-16 bg-[#f0f5fc] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">📦</div>
           <h2 className="text-xl font-bold text-[#1a2236] mb-2">Đang cập nhật sản phẩm</h2>
           <p className="text-[#6b7a99]">Các sản phẩm thuộc danh mục {title} sẽ sớm được cập nhật. Vui lòng quay lại sau!</p>
         </div>
      )}
    </div>
  );
}`;

content = content.replace(oldCategoryPageRegex, newCategoryPage);

fs.writeFileSync('src/App.tsx', content);
