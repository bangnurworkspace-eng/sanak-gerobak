import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import { SiteContentProvider } from './context/SiteContentContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AdminAuthProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </AdminAuthProvider>
  </ErrorBoundary>
);
