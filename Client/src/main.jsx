import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { WebSocketProvider } from './context/WebSocketContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './theme/CustomThemeProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CustomThemeProvider>
        <ToastProvider>
          <NotificationProvider>
            <WebSocketProvider>
              <CssBaseline />
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </WebSocketProvider>
          </NotificationProvider>
        </ToastProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);