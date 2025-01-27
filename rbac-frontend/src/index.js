import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <ToastContainer
        position="top-right"
        autoClose={3000} // Closes the toast after 3 seconds
        hideProgressBar={false}
        newestOnTop={true} // Ensure the latest toast is always on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={1}
      />
    <App />
  </React.StrictMode>
);
reportWebVitals();
