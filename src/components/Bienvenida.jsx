import React from 'react';
import { ArrowRight, CheckCircle2, Flower2 } from 'lucide-react';

export default function Bienvenida({ onEntrar }) {
  return (
    <div style={styles.pageWrapper}>
      {/* TARJETA CON REALCE PROFUNDO */}
      <div style={styles.iphoneCard}>
        
        {/* ICONO CON DEGRADADO */}
        <div style={styles.iconContainer}>
          <div style={styles.iconGradient}>
            <Flower2 size={38} color="white" strokeWidth={2} />
          </div>
        </div>
        
        {/* LOGO MASTERFLOR */}
        <h1 style={styles.logoText}>
          Master<span style={styles.logoAccent}>Flor</span>
          <span style={styles.proBadge}>PRO</span>
        </h1>
        
        <p style={styles.tagline}>Sistema de Gestión Agrícola</p>

        <div style={styles.lineDivider} />

        {/* INFO BOX REALZADA */}
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>INFO BOX</p>
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <CheckCircle2 size={18} color="#4CAF50" strokeWidth={2.5} />
              <span>Control total de bitácora</span>
            </div>
            <div style={styles.infoItem}>
              <CheckCircle2 size={18} color="#4CAF50" strokeWidth={2.5} />
              <span>Gestión inteligente de inventarios</span>
            </div>
            <div style={styles.infoItem}>
              <CheckCircle2 size={18} color="#4CAF50" strokeWidth={2.5} />
              <span>Reportes avanzados 2026</span>
            </div>
          </div>
        </div>

        {/* BOTÓN CON SOMBRA DE COLOR */}
        <button onClick={onEntrar} style={styles.mainButton}>
          INICIAR SESIÓN
          <ArrowRight size={20} />
        </button>
        
        {/* FOOTER DISCRETO */}
        <div style={styles.footer}>
          <span>MasterFlor Tech</span>
          <div style={styles.dot} />
          <span>Versión 2026.1</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F5', // Gris neutro claro para que el blanco resalte
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
  },
  iphoneCard: {
    width: '90%',
    maxWidth: '380px',
    backgroundColor: '#FFFFFF',
    padding: '45px 30px',
    borderRadius: '45px', // Bordes muy redondeados estilo móvil
    border: '1px solid rgba(0,0,0,0.05)',
    // Sombra de doble capa para realce máximo
    boxShadow: '0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  iconGradient: {
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)',
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(76, 175, 80, 0.3)',
  },
  logoText: {
    fontSize: '2.6rem',
    fontWeight: '900',
    color: '#1B5E20',
    margin: '0',
    letterSpacing: '-1.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAccent: {
    color: '#8BC34A',
    fontWeight: '400',
  },
  proBadge: {
    backgroundColor: '#1B5E20',
    color: 'white',
    fontSize: '0.6rem',
    fontWeight: '900',
    padding: '4px 8px',
    borderRadius: '8px',
    marginLeft: '8px',
    letterSpacing: '0.5px',
  },
  tagline: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '5px',
    fontWeight: '500',
  },
  lineDivider: {
    width: '40px',
    height: '4px',
    backgroundColor: '#E8F5E9',
    margin: '25px 0',
    borderRadius: '10px',
  },
  infoBox: {
    width: '100%',
    textAlign: 'left',
    padding: '0 10px',
    marginBottom: '35px',
  },
  infoTitle: {
    fontSize: '0.7rem',
    fontWeight: '900',
    color: '#BBB',
    letterSpacing: '1px',
    marginBottom: '15px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.9rem',
    color: '#444',
    fontWeight: '600',
  },
  mainButton: {
    width: '100%',
    padding: '18px',
    borderRadius: '22px',
    border: 'none',
    background: 'linear-gradient(90deg, #8BC34A 0%, #2E7D32 100%)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    boxShadow: '0 15px 30px rgba(46, 125, 50, 0.25)',
    transition: 'transform 0.2s ease',
  },
  footer: {
    marginTop: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.7rem',
    color: '#BBB',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  dot: {
    width: '4px',
    height: '4px',
    backgroundColor: '#DDD',
    borderRadius: '50%',
  }
};