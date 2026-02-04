import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; 
import { 
  collection, getDocs, writeBatch, doc, serverTimestamp, query, orderBy 
} from 'firebase/firestore'; 
import { 
  Flower2, LayoutGrid, Activity, Database, 
  Loader2, Table2, ChevronRight, Search
} from 'lucide-react';
import Papa from 'papaparse';

export default function Maestro() {
  const [tab, setTab] = useState('variedades');
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [filtroProd, setFiltroProd] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroColor, setFiltroColor] = useState('');

  // Diccionario para convertir nombres de color a códigos HEX
  const mapaColores = {
    'YELLOW': '#FFD700', 'AMARILLO': '#FFD700',
    'RED': '#EF4444', 'ROJO': '#EF4444',
    'WHITE': '#FFFFFF', 'BLANCO': '#FFFFFF',
    'PINK': '#F472B6', 'ROSADO': '#F472B6', 'ROSA': '#F472B6',
    'ORANGE': '#FB923C', 'NARANJA': '#FB923C',
    'PURPLE': '#A855F7', 'MORADO': '#A855F7',
    'BLUE': '#3B82F6', 'AZUL': '#3B82F6',
    'GREEN': '#22C55E', 'VERDE': '#22C55E',
    'BRONZE': '#CD7F32', 'BRONCE': '#CD7F32',
    'BICOLOR': '#E5E7EB', 'CREAM': '#FEF3C7', 'CREMA': '#FEF3C7'
  };

  const config = {
    variedades: { color: '#4CAF50', icon: <Flower2 size={18}/>, label: 'Variedades' },
    bloques: { color: '#2196F3', icon: <LayoutGrid size={18}/>, label: 'Bloques' },
    labores: { color: '#9C27B0', icon: <Activity size={18}/>, label: 'Labores' },
    insumos: { color: '#FF9800', icon: <Database size={18}/>, label: 'Insumos' }
  };

  const colorActivo = config[tab].color;

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const q = query(collection(db, tab), orderBy("fechaImportacion", "desc"));
      const snap = await getDocs(q);
      const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDatos(lista);

      if (tab === 'variedades' && lista.length > 0) {
        const prods = [...new Set(lista.map(i => (i.Producto || i.producto || 'OTROS').toUpperCase()))].sort();
        setFiltroProd(prods[0]);
      }
    } catch (e) { console.error(e); }
    setCargando(false);
  };

  useEffect(() => { cargarDatos(); }, [tab]);

  const listaProductos = [...new Set(datos.map(i => (i.Producto || i.producto || 'OTROS').toUpperCase()))].sort();
  const listaTipos = [...new Set(datos
    .filter(i => (i.Producto || i.producto || 'OTROS').toUpperCase() === filtroProd)
    .map(i => (i["Tipo Flor"] || i.tipo || i.Tipo || 'OTROS').toUpperCase())
  )].sort();
  const listaColores = [...new Set(datos
    .filter(i => 
      (i.Producto || i.producto || 'OTROS').toUpperCase() === filtroProd &&
      (i["Tipo Flor"] || i.tipo || i.Tipo || 'OTROS').toUpperCase() === filtroTipo
    )
    .map(i => (i.Color || i.color || 'OTROS').toUpperCase())
  )].sort();

  useEffect(() => {
    if (listaTipos.length > 0 && (!filtroTipo || !listaTipos.includes(filtroTipo))) setFiltroTipo(listaTipos[0]);
  }, [filtroProd, listaTipos]);

  useEffect(() => {
    if (listaColores.length > 0 && (!filtroColor || !listaColores.includes(filtroColor))) setFiltroColor(listaColores[0]);
  }, [filtroTipo, listaColores]);

  const importarDesdeSheet = async () => {
    const url = prompt("Enlace CSV:");
    if (!url) return;
    setProcesando(true);
    try {
      const response = await fetch(url);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true, skipEmptyLines: true,
        complete: async (results) => {
          const batch = writeBatch(db);
          results.data.forEach(fila => batch.set(doc(collection(db, tab)), { ...fila, fechaImportacion: serverTimestamp() }));
          await batch.commit();
          alert("Importado");
          cargarDatos();
        }
      });
    } catch (e) { alert("Error"); }
    finally { setProcesando(false); }
  };

  const datosFiltrados = datos.filter(item => {
    if (tab !== 'variedades') return Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()));
    return (item.Producto || '').toUpperCase() === filtroProd && 
           (item["Tipo Flor"] || item.tipo || '').toUpperCase() === filtroTipo && 
           (item.Color || '').toUpperCase() === filtroColor &&
           Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()));
  });

  // Función para determinar si el texto debe ser negro o blanco según el fondo
  const getTextColor = (bgColor) => {
    if (!bgColor || bgColor === '#FFFFFF') return '#333';
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return ((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186 ? '#333' : '#FFF';
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollWrapper}>
        <div style={styles.tabsRow}>
          {Object.keys(config).map(key => (
            <button key={key} onClick={() => setTab(key)} style={styles.tabBtn(tab === key, config[key].color)}>
              {config[key].icon} <span>{config[key].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.actionsGrid}>
        <button onClick={importarDesdeSheet} disabled={procesando} style={styles.btnSync(colorActivo)}>
          {procesando ? <Loader2 className="animate-spin" size={20} /> : <Table2 size={20} />}
          <span>{procesando ? 'Sincronizando...' : 'Sincronizar Sheets'}</span>
        </button>
        <div style={styles.searchBox}>
          <Search size={18} color="#AAA" />
          <input placeholder={`Buscar en ${tab}...`} style={styles.searchInput} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </div>

      {tab === 'variedades' && datos.length > 0 && (
        <div style={styles.filterSection}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>PRODUCTO</span>
            <div style={styles.wrapContainer}>
              {listaProductos.map(p => (
                <button key={p} onClick={() => setFiltroProd(p)} style={styles.filterBtn(filtroProd === p, '#E5E7EB', '#374151')}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>TIPO DE FLOR</span>
            <div style={styles.wrapContainer}>
              {listaTipos.map(t => (
                <button key={t} onClick={() => setFiltroTipo(t)} style={styles.filterBtn(filtroTipo === t, '#E5E7EB', '#374151')}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>COLOR</span>
            <div style={styles.wrapContainer}>
              {listaColores.map(c => {
                const colorFondo = mapaColores[c] || '#444';
                const colorTexto = getTextColor(colorFondo);
                return (
                  <button 
                    key={c} 
                    onClick={() => setFiltroColor(c)} 
                    style={styles.filterBtn(filtroColor === c, colorFondo, colorTexto)}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ ...styles.title, color: colorActivo }}>{tab.toUpperCase()}</h3>
          <span style={{...styles.badge, backgroundColor: `${colorActivo}15`, color: colorActivo}}>{datosFiltrados.length}</span>
        </div>
        <div>
          {cargando ? <div style={styles.statusMsg}><Loader2 className="animate-spin" /></div> :
            datosFiltrados.map(item => (
              <div key={item.id} style={styles.listItem}>
                <div style={styles.itemLeft}>
                  <div style={{...styles.dot, backgroundColor: colorActivo}} />
                  <div style={{flex: 1}}>
                    <div style={styles.itemText}>{item.Variedad || item.Nombre || "Sin Nombre"}</div>
                    <div style={styles.itemSubText}>
                      {Object.entries(item).filter(([k]) => !['id','fechaImportacion','Variedad','variedad','Nombre','Tipo Flor','tipo','Tipo','Color','color','Producto','producto'].includes(k)).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="#EEE" />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '15px' },
  scrollWrapper: { display: 'flex', justifyContent: 'center', overflowX: 'auto', margin: '0 -10px' },
  tabsRow: { display: 'flex', gap: '8px', padding: '0 10px' },
  tabBtn: (active, color) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '20px',
    border: active ? 'none' : '1px solid #E0E0E0', backgroundColor: active ? color : 'white',
    color: active ? 'white' : '#666', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
  }),
  filterSection: { display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'white', padding: '18px', borderRadius: '24px', border: '1px solid #F0F0F0' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  filterLabel: { fontSize: '0.65rem', fontWeight: '900', color: '#AAA' },
  wrapContainer: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  filterBtn: (active, colorFondo, colorTexto) => ({
    padding: '8px 14px', borderRadius: '12px', 
    border: active ? `1.5px solid ${colorFondo === '#FFFFFF' ? '#DDD' : colorFondo}` : '1.5px solid #F0F0F0',
    backgroundColor: active ? colorFondo : 'white', 
    color: active ? colorTexto : '#777',
    fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s'
  }),
  actionsGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  btnSync: (color) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '18px', border: `2px solid ${color}`, backgroundColor: 'white', color, fontWeight: '800' }),
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px', backgroundColor: '#F5F5F5', borderRadius: '15px' },
  searchInput: { flex: 1, padding: '10px 0', border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '0.85rem' },
  card: { backgroundColor: 'white', borderRadius: '24px', padding: '10px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' },
  title: { fontSize: '0.8rem', fontWeight: '800' },
  badge: { padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F5F5F5' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  dot: { width: '6px', height: '6px', borderRadius: '50%' },
  itemText: { fontSize: '0.9rem', fontWeight: '700', color: '#333' },
  itemSubText: { fontSize: '0.65rem', color: '#AAA', marginTop: '2px' },
  statusMsg: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }
};