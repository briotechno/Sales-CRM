import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import App from "./App";
import "./index.css"; // Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#1f2937',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#FF7B1D',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #FF7B1D',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />
      <App />
    </Provider>
  </React.StrictMode>
);
