import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to add state for the modal options
const oldModalState = 'const [isFilterOpen, setIsFilterOpen] = useState(false);';
const newModalState = `const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };
  
  const clearFilters = () => setSelectedFilters([]);
`;

content = content.replace(oldModalState, newModalState);

// Replace button maps
const optionGroups = [
  { match: /\{(\["Cao cấp", "Tầm trung", "Giá rẻ", "Phiên bản đặc biệt"\])\.map\(f => \([\s\S]*?<button key=\{f\} className="px-4 py-2 bg-white\/5 border border-white\/10 rounded-lg text-sm hover:bg-\[#1a6fdb\] hover:border-\[#1a6fdb\] transition-colors">\{f\}<\/button>[\s\S]*?\)\)\}/, arr: '["Cao cấp", "Tầm trung", "Giá rẻ", "Phiên bản đặc biệt"]' },
  { match: /\{(\["Dưới 15 triệu", "Từ 15 - 20 triệu", "Từ 20 - 25 triệu", "Từ 25 - 30 triệu", "Trên 30 triệu"\])\.map\(f => \([\s\S]*?<button key=\{f\} className="px-4 py-2 bg-white\/5 border border-white\/10 rounded-lg text-sm hover:bg-\[#1a6fdb\] hover:border-\[#1a6fdb\] transition-colors">\{f\}<\/button>[\s\S]*?\)\)\}/, arr: '["Dưới 15 triệu", "Từ 15 - 20 triệu", "Từ 20 - 25 triệu", "Từ 25 - 30 triệu", "Trên 30 triệu"]' },
  { match: /\{(\["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"\])\.map\(f => \([\s\S]*?<button key=\{f\} className="px-4 py-2 bg-white\/5 border border-white\/10 rounded-lg text-sm hover:bg-\[#1a6fdb\] hover:border-\[#1a6fdb\] transition-colors">\{f\}<\/button>[\s\S]*?\)\)\}/, arr: '["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"]' },
  { match: /\{(\["4 GB", "6 GB", "8 GB", "12 GB"\])\.map\(f => \([\s\S]*?<button key=\{f\} className="px-4 py-2 bg-white\/5 border border-white\/10 rounded-lg text-sm hover:bg-\[#1a6fdb\] hover:border-\[#1a6fdb\] transition-colors">\{f\}<\/button>[\s\S]*?\)\)\}/, arr: '["4 GB", "6 GB", "8 GB", "12 GB"]' }
];

optionGroups.forEach(group => {
  const replacement = `{${group.arr}.map(f => {
                    const isSelected = selectedFilters.includes(f);
                    return (
                      <button 
                        key={f} 
                        onClick={() => toggleFilter(f)}
                        className={\`px-4 py-2 border rounded-lg text-sm transition-colors \${
                          isSelected 
                            ? 'bg-transparent border-[#3b82f6] text-[#3b82f6]' 
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                        }\`}
                      >
                        {f}
                      </button>
                    );
                  })}`;
  content = content.replace(group.match, replacement);
});

// Update clear button
content = content.replace(
  /<button onClick=\{\(\) => setIsFilterOpen\(false\)\} className="px-8 py-2\.5 bg-white\/10 text-white font-semibold rounded-lg hover:bg-white\/20 transition-colors">Bỏ chọn<\/button>/,
  '<button onClick={clearFilters} className="px-8 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">Bỏ chọn</button>'
);

fs.writeFileSync('src/App.tsx', content);
