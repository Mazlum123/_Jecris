import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PdfPage from './pages/PdfPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Route pour l'accueil */}
        <Route path="/" element={<Home />} />

        {/* Route pour afficher le PDF */}
        <Route path="/pdf" element={<PdfPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
