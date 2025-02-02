import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TenantProvider } from './contexts/TenantContext';
import { AppModeProvider } from './contexts/AppModeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializeApp } from 'firebase/app';
import { initializeBelts } from './services/firebase/initializeBelts';
import './index.css';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCqm2r13IkEmRw8H5oM3t-4Se22capDqj8",
  authDomain: "kohikarate-7031c.firebaseapp.com",
  projectId: "kohikarate-7031c",
  storageBucket: "kohikarate-7031c.firebasestorage.app",
  messagingSenderId: "471367523561",
  appId: "1:471367523561:web:0549f059b9c531c0f6e478"
};

// Initialize Firebase first
initializeApp(firebaseConfig);

// Initialize belts but don't block on errors
initializeBelts().catch(() => {
  // Belt initialization errors are handled gracefully inside the function
  // No need to log anything here
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <TenantProvider>
        <AppModeProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AppModeProvider>
      </TenantProvider>
    </ErrorBoundary>
  </StrictMode>
);