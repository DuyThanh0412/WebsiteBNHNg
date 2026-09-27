import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure useLocation is imported
if (!content.includes('useLocation')) {
  content = content.replace(
    'useNavigate } from "react-router";',
    'useNavigate, useLocation } from "react-router";'
  );
}

const oldCategoryNav = `function CategoryNav() {
  const [active, setActive] = useState(0);
  return (
    <nav className="bg-white border-b border-[#e2eaf6]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
          {categories.map((c, i) => {
            const slug = toSlug(c.label);
            return (
              <Link
                key={c.label}
                to={\`/category/\${slug}\`}
                onClick={() => setActive(i)}
                className={\`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all \${
                  i === active
                    ? "bg-[#1a6fdb] text-white"
                    : "text-[#1a2236] hover:bg-[#f0f5fc]"
                }\`}
              >
                <span>{c.icon}</span>
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}`;

const newCategoryNav = `function CategoryNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <nav className="bg-white border-b border-[#e2eaf6]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
          {categories.map((c) => {
            const slug = toSlug(c.label);
            const path = \`/category/\${slug}\`;
            const isActive = currentPath === path || (currentPath === '/' && slug === 'dien-thoai'); // Default first item on home if wanted, or just currentPath === path
            return (
              <Link
                key={c.label}
                to={path}
                className={\`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all \${
                  isActive
                    ? "bg-[#1a6fdb] text-white"
                    : "text-[#1a2236] hover:bg-[#f0f5fc]"
                }\`}
              >
                <span>{c.icon}</span>
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}`;

content = content.replace(oldCategoryNav, newCategoryNav);

fs.writeFileSync('src/App.tsx', content);
