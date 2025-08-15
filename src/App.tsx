import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/CONEQ/EntregaPage';
import EstoquePage from './pages/CONEQ/EstoquePage';
import SgpmPage from './pages/SGPM/SgpmPage';
import SgpmDistribuicaoPage from './pages/SGPM/SgpmDistribuicaoPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Mapa from './pages/Mapacomzoom';
import SigarfPage from './pages/SIGARF/SigarfPage';
import CautelaPage from './pages/CAUTELA/CautelaPage';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      
      <main className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/coneq" element={<HomePage />} />
          <Route path="/sgpm" element={<SgpmPage />} />
          <Route path="/sgpm-distribuicao" element={<SgpmDistribuicaoPage />} />
          <Route path="/sigarf" element={<SigarfPage />} />
          <Route path="/cautela" element={<CautelaPage />} />
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
};

export default App; 