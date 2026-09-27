import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace window.location.href with React Router's navigate
const oldForm = `<form className="flex-1 flex items-center" onSubmit={(e) => { e.preventDefault(); if (search) window.location.href = \`/search?q=\${encodeURIComponent(search)}\`; }}>`;
const newForm = `<form className="flex-1 flex items-center" onSubmit={(e) => { e.preventDefault(); if (search) navigate(\`/search?q=\${encodeURIComponent(search)}\`); }}>`;

content = content.replace(oldForm, newForm);

// Also need to get navigate from useNavigate in Header
content = content.replace(
  /const \[search, setSearch\] = useState\(""\);/,
  'const [search, setSearch] = useState("");\n  const navigate = useNavigate();'
);

fs.writeFileSync('src/App.tsx', content);
