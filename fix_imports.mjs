import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /import \{ createBrowserRouter, RouterProvider, Outlet, Link, useParams, useOutletContext, useNavigate, useLocation \} from "react-router";/,
  'import { createBrowserRouter, RouterProvider, Outlet, Link, useParams, useOutletContext, useNavigate, useLocation, useSearchParams } from "react-router";'
);
fs.writeFileSync('src/App.tsx', content);
