import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './theme/CustomThemeProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CustomThemeProvider>
        <ToastProvider>
          <CssBaseline />
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ToastProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);