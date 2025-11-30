import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler for uncaught errors
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 1rem; padding: 2rem; max-width: 600px;">
          <h1 style="color: #f87171; font-size: 1.5rem; margin-bottom: 1rem;">JavaScript Error</h1>
          <p style="color: #d1d5db; margin-bottom: 1rem;">The application failed to load:</p>
          <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 0.5rem; color: #fca5a5; overflow: auto; font-size: 0.875rem;">${message}\n\nSource: ${source}\nLine: ${lineno}</pre>
        </div>
      </div>
    `;
  }
  return true;
};

// Handle unhandled promise rejections
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 1rem; padding: 2rem; max-width: 600px;">
        <h1 style="color: #f87171; font-size: 1.5rem; margin-bottom: 1rem;">Failed to Initialize</h1>
        <p style="color: #d1d5db; margin-bottom: 1rem;">The application failed to start:</p>
        <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 0.5rem; color: #fca5a5; overflow: auto; font-size: 0.875rem;">${error}</pre>
      </div>
    </div>
  `;
}
