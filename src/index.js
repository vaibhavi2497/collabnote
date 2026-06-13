import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext";

import { Provider } from "react-redux";
import { store } from "./app/store";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

    <Provider store={store}>
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
</Provider>
  </React.StrictMode>
);

reportWebVitals();