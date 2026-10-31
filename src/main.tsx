import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import { SiteContentProvider } from './context/SiteContentContext.tsx';

createRoot(document.getElementById('root')!).render(
  <AdminAuthProvider>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </AdminAuthProvider>
);
