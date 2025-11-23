import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Wind, Activity, BarChart2, ShieldCheck, MapPin, AlertTriangle, X, Info, Leaf 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
// Imports Carte (Leaflet)
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CORRECTION ICONES LEAFLET (Bug connu React) ---
// Ceci permet d'afficher correctement les marqueurs sur la carte
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- DONNÉES INTELLIGENTES (DATA MODEL) ---
const WORLD_DATA = {
  France: {
    center: [46.603354, 1.888334],
    zoom: 6,
    cities: [
      { name: 'Paris', lat: 48.8566, lng: 2.3522, aqi: 42, pm25: 12, no2: 25, o3: 30, status: 'Bon' },
      { name: 'Lyon', lat: 45.7640, lng: 4.8357, aqi: 85, pm25: 35, no2: 40, o3: 45, status: 'Modéré' },
      { name: 'Marseille', lat: 43.2965, lng: 5.3698, aqi: 110, pm25: 55, no2: 50, o3: 60, status: 'Mauvais' }
    ]
  },
  Chine: {
    center: [35.8617, 104.1954],
    zoom: 4,
    cities: [
      { name: 'Beijing', lat: 39.9042, lng: 116.4074, aqi: 165, pm25: 120, no2: 80, o3: 50, status: 'Dangereux' },
      { name: 'Shanghai', lat: 31.2304, lng: 121.4737, aqi: 140, pm25: 90, no2: 70, o3: 40, status: 'Mauvais' }
    ]
  },
  USA: {
    center: [37.0902, -95.7129],
    zoom: 4,
    cities: [
      { name: 'New York', lat: 40.7128, lng: -74.0060, aqi: 35, pm25: 8, no2: 20, o3: 25, status: 'Bon' },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, aqi: 95, pm25: 40, no2: 55, o3: 60, status: 'Modéré' }
    ]
  }
};

// Données factices pour le graphique d'historique
const HISTORY_DATA = [
  { time: '08:00', aqi: 30 }, { time: '10:00', aqi: 45 },
  { time: '12:00', aqi: 55 }, { time: '14:00', aqi: 80 },
  { time: '16:00', aqi: 70 }, { time: '18:00', aqi: 40 },
];

// Composant utilitaire pour recentrer la carte quand on change de pays
function MapUpdater({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// --- COMPOSANT PRINCIPAL ---
function App() {
  // États (Mémoire de l'app)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [currentCity, setCurrentCity] = useState(WORLD_DATA['France'].cities[0]); // Paris par défaut
  
  // États pour le comparateur
  const [compareCity1, setCompareCity1] = useState(WORLD_DATA['France'].cities[0]);
  const [compareCity2, setCompareCity2] = useState(WORLD_DATA['Chine'].cities[0]);

  // État pour la Modale Santé
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Fonction : Change l'ambiance globale selon l'AQI
  const getBackground = (aqi) => {
    if (aqi <= 50) return 'var(--bg-good)';
    if (aqi <= 100) return 'var(--bg-moderate)';
    if (aqi <= 150) return 'var(--bg-bad)';
    return 'var(--bg-hazardous)';
  };

  // Liste plate de toutes les villes pour le comparateur (pour faciliter la sélection)
  const allCities = Object.values(WORLD_DATA).flatMap(c => c.cities);

  return (
    <div className="app-wrapper" style={{ background: getBackground(currentCity.aqi) }}>
      
      {/* --- MODALE SANTÉ (Overlay) --- */}
      {showHealthModal && (
        <div className="modal-overlay" onClick={() => setShowHealthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowHealthModal(false)}><X size={20}/></button>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <ShieldCheck size={50} color="#2563eb" />
              <h2 style={{color: '#1e293b'}}>Impact Santé & Détails</h2>
            </div>
            
            <h3>Quels sont les risques ?</h3>
            <p style={{color: '#475569', lineHeight: '1.6', marginBottom: '20px'}}>
              L'exposition aux particules fines (PM2.5) peut causer des inflammations des voies respiratoires. 
              L'ozone (O3) est irritant et peut déclencher des crises d'asthme.
            </p>

            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #2563eb'}}>
              <h4>Recommandation Actuelle ({currentCity.status})</h4>
              <p>
                {currentCity.aqi < 50 ? "Aucun risque. Profitez de l'extérieur !" : 
                 currentCity.aqi < 100 ? "Réduisez l'intensité de vos activités sportives." : 
                 "Port du masque recommandé. Évitez de sortir."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- CADRE EN VERRE (Le container principal) --- */}
      <div className="glass-dashboard">
        
        {/* BARRE LATÉRALE DE NAVIGATION */}
        <nav className="sidebar">
          <div className="brand">
            <Wind size={32} color="white" fill="white" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}} />
            <span>AeroView</span>
          </div>

          <div className="menu">
            <button className={`menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <Activity size={20} /> Tableau de Bord
            </button>
            <button className={`menu-btn ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>
              <BarChart2 size={20} /> Comparateur
            </button>
            <button className={`menu-btn ${activeTab === 'prevention' ? 'active' : ''}`} onClick={() => setActiveTab('prevention')}>
              <Leaf size={20} /> Prévention
            </button>
          </div>

          {/* Sélecteur de Pays (Impacte la carte) */}
          <div style={{marginTop: 'auto'}}>
            <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', marginBottom: '5px', display:'block'}}>PAYS SÉLECTIONNÉ</label>
            <div className="country-selector">
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{width: '100%'}}>
                {Object.keys(WORLD_DATA).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>

        {/* CONTENU PRINCIPAL (Change selon l'onglet) */}
        <div className="main-content">
          
          {/* EN-TÊTE DE LA VILLE */}
          <header className="header-section fade-in-up">
            <div>
              <h1 className="big-title">{currentCity.name}</h1>
              <p className="subtitle">Données en temps réel • {new Date().toLocaleDateString()}</p>
            </div>
            <div className="aqi-badge" style={{
              background: 'rgba(255,255,255,0.9)', 
              padding: '10px 20px', 
              borderRadius: '50px', 
              fontWeight: '800',
              color: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {currentCity.status.toUpperCase()}
            </div>
          </header>

          {/* --- ONGLET 1 : DASHBOARD (CARTE & DONNÉES) --- */}
          {activeTab === 'dashboard' && (
            <div className="bento-grid fade-in-up">
              
              {/* 1. LA CARTE INTERACTIVE */}
              <div className="bento-card map-container">
                <MapContainer center={WORLD_DATA[selectedCountry].center} zoom={WORLD_DATA[selectedCountry].zoom} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <MapUpdater center={WORLD_DATA[selectedCountry].center} zoom={WORLD_DATA[selectedCountry].zoom} />
                  
                  {/* Marqueurs des villes */}
                  {WORLD_DATA[selectedCountry].cities.map((city, idx) => (
                    <Marker 
                      key={idx} 
                      position={[city.lat, city.lng]}
                      eventHandlers={{
                        click: () => {
                          setCurrentCity(city); // Met à jour tout le site au clic !
                        },
                      }}
                    >
                      <Popup>
                        <strong>{city.name}</strong><br />
                        AQI: {city.aqi}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                <div style={{position: 'absolute', top: 20, left: 20, zIndex: 999, background: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'}}>
                  Cliquez sur un marqueur pour voir les détails
                </div>
              </div>

              {/* 2. LE CERCLE DE SCORE AQI */}
              <div className="bento-card score-card">
                <div className="score-circle" style={{
                  backgroundColor: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981',
                  color: 'white'
                }}>
                  {currentCity.aqi}
                </div>
                <h3>Indice de Qualité</h3>
                <p style={{color: '#64748b'}}>Standard US AQI</p>
              </div>

              {/* 3. LES DÉTAILS (PM2.5, NO2, O3) */}
              <div className="bento-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                  <span>PM2.5</span>
                  <strong>{currentCity.pm25} µg/m³</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                  <span>NO2</span>
                  <strong>{currentCity.no2} µg/m³</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>O3</span>
                  <strong>{currentCity.o3} µg/m³</strong>
                </div>
              </div>

              {/* 4. IMPACT SANTÉ & BOUTON SAVOIR PLUS */}
              <div className="bento-card" style={{gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap:'wrap', gap:'15px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                  <div style={{background: '#eff6ff', padding: '15px', borderRadius: '50%', color: '#2563eb'}}>
                    <AlertTriangle size={30} />
                  </div>
                  <div>
                    <h3>Impact sur votre santé</h3>
                    <p style={{maxWidth: '600px', color: '#64748b'}}>
                      {currentCity.aqi < 50 
                        ? "L'air est pur. Aucun impact négatif prévu pour la santé."
                        : "La qualité de l'air peut irriter les personnes sensibles."}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHealthModal(true)}
                  style={{background: 'var(--text-primary)', color: 'white', padding: '12px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s'}}
                >
                  En savoir plus
                </button>
              </div>

              {/* 5. GRAPHIQUE D'HISTORIQUE */}
              <div className="bento-card" style={{gridColumn: '1 / -1', height: '300px'}}>
                  <h3 style={{marginBottom:'15px'}}>Historique (12h)</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORY_DATA}>
                      <defs>
                        <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" />
                      <Tooltip />
                      <Area type="monotone" dataKey="aqi" stroke="#2563eb" fillOpacity={1} fill="url(#colorAqi)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* --- ONGLET 2 : COMPARATEUR --- */}
          {activeTab === 'compare' && (
            <div className="fade-in-up">
              <h2>Comparateur de Villes</h2>
              
              {/* Sélecteurs de comparaison */}
              <div style={{display: 'flex', gap: '20px', margin: '20px 0', alignItems:'center', justifyContent:'center'}}>
                <select style={{padding: '12px', borderRadius: '12px', border: '1px solid #ccc', fontSize:'1rem'}} onChange={(e) => setCompareCity1(allCities.find(c => c.name === e.target.value))}>
                  {allCities.map(c => <option key={c.name} value={c.name} selected={c.name === compareCity1.name}>{c.name}</option>)}
                </select>
                <span style={{fontSize:'1.5rem', fontWeight:'900', color:'var(--text-secondary)'}}>VS</span>
                <select style={{padding: '12px', borderRadius: '12px', border: '1px solid #ccc', fontSize:'1rem'}} onChange={(e) => setCompareCity2(allCities.find(c => c.name === e.target.value))}>
                  {allCities.map(c => <option key={c.name} value={c.name} selected={c.name === compareCity2.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="comparator-wrapper">
                {/* Ville 1 */}
                <div className="city-compare-card">
                  <h3>{compareCity1.name}</h3>
                  <div style={{fontSize: '4rem', fontWeight: '800', color: compareCity1.aqi > 100 ? '#ef4444' : '#10b981'}}>
                    {compareCity1.aqi}
                  </div>
                  <p>AQI</p>
                  <div style={{marginTop: '20px', textAlign: 'left', background:'#f8fafc', padding:'20px', borderRadius:'16px'}}>
                    <p>PM2.5: <strong>{compareCity1.pm25}</strong></p>
                    <p>NO2: <strong>{compareCity1.no2}</strong></p>
                  </div>
                </div>

                {/* Ville 2 */}
                <div className="city-compare-card">
                  <h3>{compareCity2.name}</h3>
                  <div style={{fontSize: '4rem', fontWeight: '800', color: compareCity2.aqi > 100 ? '#ef4444' : '#10b981'}}>
                    {compareCity2.aqi}
                  </div>
                  <p>AQI</p>
                  <div style={{marginTop: '20px', textAlign: 'left', background:'#f8fafc', padding:'20px', borderRadius:'16px'}}>
                    <p>PM2.5: <strong>{compareCity2.pm25}</strong></p>
                    <p>NO2: <strong>{compareCity2.no2}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- ONGLET 3 : PRÉVENTION (Adaptée à la ville) --- */}
          {activeTab === 'prevention' && (
            <div className="fade-in-up">
              <h2>Prévention à {currentCity.name}</h2>
              <p style={{marginBottom: '30px', color: 'var(--text-secondary)'}}>Conseils adaptés à la qualité de l'air actuelle ({currentCity.status}).</p>
              
              <div className="bento-grid" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
                {/* Cartes de conseils qui changent selon la pollution */}
                <div className="bento-card">
                  <div style={{background: currentCity.aqi > 100 ? '#fee2e2' : '#dcfce7', padding: '15px', borderRadius: '12px', display:'inline-block', marginBottom: '15px'}}>
                    🏃‍♂️
                  </div>
                  <h3>Sport en extérieur</h3>
                  <p style={{marginTop: '10px'}}>
                    {currentCity.aqi > 100 
                      ? "DÉCONSEILLÉ. La pollution est trop élevée. Privilégiez le sport en salle."
                      : "AUTORISÉ. L'air est de bonne qualité pour courir ou faire du vélo."}
                  </p>
                </div>

                <div className="bento-card">
                  <div style={{background: '#e0f2fe', padding: '15px', borderRadius: '12px', display:'inline-block', marginBottom: '15px'}}>
                    🪟
                  </div>
                  <h3>Aération</h3>
                  <p style={{marginTop: '10px'}}>
                    {currentCity.aqi > 100 
                      ? "Fermez les fenêtres pour éviter de faire entrer les polluants."
                      : "Ouvrez grand ! Renouvelez l'air de votre logement maintenant."}
                  </p>
                </div>

                <div className="bento-card">
                  <div style={{background: '#fef3c7', padding: '15px', borderRadius: '12px', display:'inline-block', marginBottom: '15px'}}>
                    😷
                  </div>
                  <h3>Protection</h3>
                  <p style={{marginTop: '10px'}}>
                    {currentCity.aqi > 150 
                      ? "Masque N95 recommandé pour les personnes fragiles."
                      : "Aucune protection particulière n'est nécessaire aujourd'hui."}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;