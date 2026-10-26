import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { installFetchInterceptor } from './services/http'
import { installGlobalErrorNotifier } from './ui/notify'

// Token en todas las llamadas a la API + manejo central de errores/sesión.
installFetchInterceptor()
installGlobalErrorNotifier()

if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    // Check if clicked element or its parent matches tabs or Next button
    const isTab = target.closest('[role="tab"]') ||
                  target.closest('.ant-tabs-tab') ||
                  target.closest('.chakra-tabs__tab') ||
                  target.closest('.ant-tabs-tab-btn');

    const isNextButton = (target.closest('button') && target.closest('button').textContent.toLowerCase().includes('siguiente')) ||
                         (target.closest('.ant-btn') && target.closest('.ant-btn').textContent.toLowerCase().includes('siguiente')) ||
                         (target.closest('.chakra-button') && target.closest('.chakra-button').textContent.toLowerCase().includes('siguiente'));

    if (isTab || isNextButton) {
      // Find the specific modal body to scroll
      const modalContainer = target.closest('.ant-modal-content') || target.closest('.chakra-modal__content');
      
      const scrollModalToTop = (el) => {
        if (!el) return;
        el.scrollTo({ top: 0, behavior: 'instant' });
        el.scrollTop = 0;
      };

      if (modalContainer) {
        // If the click is inside a specific modal, scroll its body
        const body = modalContainer.querySelector('.ant-modal-body') || modalContainer.querySelector('.chakra-modal__body');
        if (body) {
          setTimeout(() => scrollModalToTop(body), 20);
          setTimeout(() => scrollModalToTop(body), 100);
        }
      } else {
        // Fallback: Scroll all visible modal bodies in the document
        setTimeout(() => {
          const bodies = document.querySelectorAll('.ant-modal-body, .chakra-modal__body');
          bodies.forEach(body => scrollModalToTop(body));
        }, 20);
        setTimeout(() => {
          const bodies = document.querySelectorAll('.ant-modal-body, .chakra-modal__body');
          bodies.forEach(body => scrollModalToTop(body));
        }, 100);
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '16px',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
    <App />
  </React.StrictMode>,
)
