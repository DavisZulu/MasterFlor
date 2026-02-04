import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { 
  collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit 
} from 'firebase/firestore';
import { 
  Sprout, Droplets, Beaker, Tractor, 
  Loader2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function Bitacora() {
  const [actividad, setActividad] = useState('Siembra');
  const [listaVariedades, setListaVariedades] = useState([]); 
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({ variedad: '', bloque: '', notas: '' });

  const actividadesMenu = [
    { id: 'Siembra', icon: <Sprout size={16} />, color: '#4CAF50', col: 'siembra' },
    { id: 'Riego', icon: <Droplets size={16} />, color: '#2196F3', col: 'riego' },
    { id: 'Fumigación', icon: <Beaker size={16} />, color: '#9C27B0', col: 'fumigacion' },
    { id: 'Cosecha', icon: <Tractor size={16} />, color: '#795548', col: 'cosecha' },
  ];

  const coleccionActiva = actividadesMenu.find(a => a.id === actividad)?.col || 'siembra';
  const colorActivo = actividadesMenu.find(a => a.id === actividad)?.color || '#4CAF50';

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Traer variedades del maestro para el select
      const varSnap = await getDocs(collection(db, "variedades"));
      const nombres = varSnap.docs.map(doc => {
        const d = doc.data();
        return (d.Variedad || d.variedad || d.Nombre || "Sin nombre").toUpperCase();
      });
      setListaVariedades([...new Set(nombres)].sort());

      // Traer historial reciente
      const q = query(collection(db, coleccionActiva), orderBy("fecha", "desc"), limit(10));
      const histSnap = await getDocs(q);
      setHistorial(histSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
    setCargando(false);
  };

  useEffect(() => { cargarDatos(); }, [actividad]);

  const guardar = async (e) => {
    e.preventDefault();
    if (!formData.variedad || !formData.bloque) return alert("Completa Variedad y Bloque");
    
    setEnviando(true);
    try {
      await addDoc(collection(db, coleccionActiva), {
        variedad: formData.variedad,
        bloque: formData.bloque,
        notas: formData.notas,
        fecha: serverTimestamp(),
        creadoEn: format(new Date(), 'dd/MM HH:mm')
      });
      setFormData({ variedad: '', bloque: '', notas: '' });
      await cargarDatos(); 
    } catch (e) { alert("Error al guardar"); }
    setEnviando(false);
  };

  return (
    <div style={styles.container}>
      
      {/* 1. MENÚ DE ACTIVIDADES */}
      <div style={styles.scrollWrapper}>
        <div style={styles.tabsRow}>
          {actividadesMenu.map((act) => (
            <button key={act.id} onClick={() => setActividad(act.id)} style={styles.tabBtn(actividad === act.id, act.color)}>
              {act.icon} <span>{act.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. FORMULARIO SIMPLIFICADO */}
      <div style={styles.card}>
        <div style={styles.headerForm}>
          <h2 style={{...styles.title, color: colorActivo}}>REGISTRO {actividad.toUpperCase()}</h2>
        </div>

        <div style={styles.formStack}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Variedad</label>
            <select 
              style={styles.select} 
              value={formData.variedad} 
              onChange={(e) => setFormData({...formData, variedad: e.target.value})}
            >
              <option value="">Selecciona la flor...</option>
              {listaVariedades.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Bloque / Cama</label>
            <input 
              style={styles.input} 
              placeholder="Ej: Bloque 4" 
              value={formData.bloque} 
              onChange={(e) => setFormData({...formData, bloque: e.target.value})} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Notas u Observaciones</label>
            <input 
              style={styles.input} 
              placeholder="Opcional..." 
              value={formData.notas} 
              onChange={(e) => setFormData({...formData, notas: e.target.value})} 
            />
          </div>
        </div>

        <button onClick={guardar} disabled={enviando} style={styles.btnSave(colorActivo)}>
          {enviando ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
          {enviando ? "Guardando..." : `Guardar Registro`}
        </button>
      </div>

      {/* 3. HISTORIAL */}
      <div style={styles.historySection}>
        <h3 style={styles.historyTitle}>HISTORIAL RECIENTE</h3>
        <div style={styles.listCard}>
          {cargando ? (
            <div style={styles.center}><Loader2 className="animate-spin" color={colorActivo} /></div>
          ) : (
            historial.map(item => (
              <div key={item.id} style={styles.listItem}>
                <div style={styles.itemLeft}>
                  <div style={{...styles.dot, backgroundColor: colorActivo}} />
                  <div>
                    <div style={styles.itemText}>{item.variedad}</div>
                    <div style={styles.itemSubText}>Bloque: {item.bloque} • {item.creadoEn}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#EEE" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  scrollWrapper: { display: 'flex', justifyContent: 'center', overflowX: 'auto', margin: '0 -10px' },
  tabsRow: { display: 'flex', gap: '8px', padding: '0 10px' },
  tabBtn: (active, color) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: '20px',
    border: active ? 'none' : '1px solid #E0E0E0', backgroundColor: active ? color : 'white',
    color: active ? 'white' : '#666', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
  }),
  card: { backgroundColor: 'white', borderRadius: '28px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  headerForm: { marginBottom: '20px', textAlign: 'center' },
  title: { fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px' },
  formStack: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.65rem', fontWeight: '800', color: '#BBB', marginLeft: '5px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #F0F0F0', backgroundColor: '#F9F9F9', fontSize: '0.95rem', outline: 'none' },
  select: { padding: '15px', borderRadius: '15px', border: '1px solid #F0F0F0', backgroundColor: '#F9F9F9', fontSize: '0.95rem', outline: 'none', appearance: 'none' },
  btnSave: (color) => ({ width: '100%', backgroundColor: color, color: 'white', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: `0 8px 20px ${color}30` }),
  historySection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  historyTitle: { fontSize: '0.7rem', fontWeight: '900', color: '#BBB', marginLeft: '10px' },
  listCard: { backgroundColor: 'white', borderRadius: '28px', padding: '10px 20px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F8F8F8' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  itemText: { fontSize: '0.95rem', fontWeight: '700', color: '#333' },
  itemSubText: { fontSize: '0.75rem', color: '#AAA', marginTop: '2px' },
  center: { padding: '30px', textAlign: 'center' }
};