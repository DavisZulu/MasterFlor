import React, { useState } from 'react';
import Bienvenida from './components/Bienvenida';
import Bitacora from './components/Bitacora';
import Maestro from './components/Maestro'; // Importación exacta según tu archivo
import { BookOpen, Database, LogOut } from 'lucide-react';

function App() {
  const [pantalla, setPantalla] = useState('inicio');

  // Pantalla de Bienvenida (Entrada)
  if (pantalla === 'inicio') {
    return <Bienvenida onEntrar={() => setPantalla('bitacora')} />;
  }

  return (
    <div style={styles.appContainer}>
      
      {/* HEADER SUPERIOR CON EL LOGO CENTRADO */}
      <header style={styles.headerTop}>
        <div style={styles.centerLogo}>
          <h1 style={styles.logoText}>
            Master<span style={styles.logoAccent}>Flor</span>
          </h1>
          <div style={styles.proBadge}>PRO</div>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main style={styles.mainContent}>
        {pantalla === 'bitacora' && <Bitacora />}
        {pantalla === 'maestro' && <Maestro />}
      </main>

      {/* MENÚ INFERIOR (TAB BAR) */}
      <nav style={styles.bottomNav}>
        <button 
          onClick={() => setPantalla('bitacora')} 
          style={styles.navItem(pantalla === 'bitacora')}
        >
          <BookOpen size={22} />
          <span style={styles.navText}>Bitácora</span>
        </button>

        <button 
          onClick={() => setPantalla('maestro')} 
          style={styles.navItem(pantalla === 'maestro')}
        >
          <Database size={22} />
          <span style={styles.navText}>Maestro</span>
        </button>

        <button 
          onClick={() => setPantalla('inicio')} 
          style={styles.navExit}
        >
          <LogOut size={22} />
          <span style={styles.navText}>Salir</span>
        </button>
      </nav>
    </div>
  );
}

// ESTILOS DE APP.JSX
const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
    fontFamily: "'Inter', sans-serif",
  },
  headerTop: {
    backgroundColor: 'white',
    padding: '15px 0',
    display: 'flex',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderRadius: '0 0 25px 25px'
  },
  centerLogo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '1.6rem',
    fontWeight: '900',
    color: '#1B5E20',
    margin: 0,
    letterSpacing: '-1.2px',
  },
  logoAccent: {
    color: '#8BC34A',
    fontWeight: '400',
  },
  proBadge: {
    backgroundColor: '#1B5E20',
    color: 'white',
    fontSize: '0.5rem',
    fontWeight: '900',
    padding: '2px 8px',
    borderRadius: '5px',
    textTransform: 'uppercase',
    marginTop: '-2px'
  },
  mainContent: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px 15px 120px 15px',
  },
  bottomNav: {
    position: 'fixed',
    bottom: '25px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    height: '75px',
    borderRadius: '25px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.05)',
    zIndex: 1000,
  },
  navItem: (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: active ? '#1B5E20' : '#BBB',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    gap: '4px',
  }),
  navExit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#FF4D4F',
    cursor: 'pointer',
    gap: '4px',
  },
  navText: {
    fontSize: '0.65rem',
    fontWeight: '800',
    textTransform: 'uppercase',
  }
};

export default App;