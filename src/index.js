import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './services/parseService'; // initializing parse/back4App connection
import { isParseConfigured } from './services/parseService';
import { createBusiness } from './models/Business';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If Parse is configured, attempt to flush any locally-saved pending business submissions.
if (typeof window !== 'undefined' && isParseConfigured) {
  (async () => {
    try {
      const pendingKey = 'pendingBusinesses';
      const raw = localStorage.getItem(pendingKey);
      if (!raw) return;
      const list = JSON.parse(raw || '[]');
      if (!Array.isArray(list) || list.length === 0) return;

      console.log(`Found ${list.length} pending business(es) to flush to Parse`);
      const remaining = [];
      for (const item of list) {
        try {
          // We cannot rehydrate files stored in localStorage. Submit the business without Image.
          const toSend = { ...item, Image: null };
          await createBusiness(toSend);
          console.log('Successfully flushed pending business:', toSend.Name || '(no name)');
        } catch (err) {
          console.warn('Failed to flush pending business, will keep for later retry', err);
          remaining.push(item);
        }
      }
      if (remaining.length === 0) {
        localStorage.removeItem(pendingKey);
      } else {
        localStorage.setItem(pendingKey, JSON.stringify(remaining));
      }
    } catch (e) {
      console.error('Error flushing pending businesses on startup', e);
    }
  })();
}


