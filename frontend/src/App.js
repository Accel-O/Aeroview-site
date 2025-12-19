import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Wind, Activity, BarChart2, ShieldCheck, MapPin, AlertTriangle, X, Info, Leaf, Search 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
//
// --- CORRECTION ICONES LEAFLET ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- DONNÉES POLLUANTS (MISES À JOUR) ---
const POLLUTANTS_DATA = [
  {
    name: "PM2.5 (Particules fines)",
    form: "Minuscules particules solides ou liquides en suspension dans l'air (diamètre < 2.5 µm).",
    source: "Combustion industrielle et domestique (chauffage au bois, charbon), trafic routier (pneus, freins) et feux de forêt.",
    effects: "Pénètrent profondément dans les poumons et la circulation sanguine. Provoquent des problèmes respiratoires (asthme, bronchite), cardiovasculaires et augmentent le risque de cancer du poumon.",
    wikiLink: "https://fr.wikipedia.org/wiki/Particules_en_suspension"
  },
  {
    name: "PM10 (Grosses particules)",
    form: "Particules solides ou liquides en suspension (diamètre < 10 µm).",
    source: "Poussières du désert, construction, agriculture, et émissions industrielles ou du trafic routier moins fines.",
    effects: "Peuvent atteindre les voies respiratoires supérieures. Provoquent irritation des yeux, du nez, de la gorge et exacerbation des symptômes chez les asthmatiques.",
    wikiLink: "https://fr.wikipedia.org/wiki/Particules_en_suspension"
  },
  {
    name: "NO2 (Dioxyde d'azote)",
    form: "Gaz irritant de couleur rouge-brun. Principalement émis par la combustion de carburants fossiles.",
    source: "Trafic routier (moteurs diesel et essence), centrales électriques et installations industrielles.",
    effects: "Réduit la fonction pulmonaire, augmente la réactivité bronchique et la sensibilité aux infections respiratoires, en particulier chez les enfants et les personnes asthmatiques.",
    wikiLink: "https://fr.wikipedia.org/wiki/Dioxyde_d%27azote"
  },
  {
    name: "O3 (Ozone)",
    form: "Gaz incolore et inodore, formé par réaction chimique des polluants en présence de soleil et de chaleur.",
    source: "Pollluant secondaire. Formé à partir de précurseurs (NOx et COV) émis par l'industrie, le trafic routier et les solvants.",
    effects: "Irritant pour les voies respiratoires. Peut provoquer toux, douleurs thoraciques, essoufflement, et aggravation de l'asthme et des maladies pulmonaires chroniques.",
    wikiLink: "https://fr.wikipedia.org/wiki/Ozone"
  }
];


// --- DONNÉES PAR DÉFAUT ---
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

const HISTORY_DATA = [
  { time: '08:00', aqi: 30 }, { time: '10:00', aqi: 45 },
  { time: '12:00', aqi: 55 }, { time: '14:00', aqi: 80 },
  { time: '16:00', aqi: 70 }, { time: '18:00', aqi: 40 },
];

function MapUpdater({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// --- COMPOSANT PRINCIPAL ---
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [currentCity, setCurrentCity] = useState(WORLD_DATA['France'].cities[0]);
  const [searchText, setSearchText] = useState('');
  
  const [compareCity1, setCompareCity1] = useState(WORLD_DATA['France'].cities[0]);
  const [compareCity2, setCompareCity2] = useState(WORLD_DATA['Chine'].cities[0]);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // --- FONCTION DE RECHERCHE (API OPEN-METEO : 100% FIABLE) ---
  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      try {
        // 1. Trouver les coordonnées de la ville (Nominatim)
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
          const result = geoData[0];
          const lat = result.lat;
          const lon = result.lon;

          // 2. Demander la pollution à Open-Meteo 
          const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,nitrogen_dioxide,ozone,european_aqi`;
          
          const aqResponse = await fetch(meteoUrl);
          const aqData = await aqResponse.json();
          console.log("Données Open-Meteo :", aqData);

          // 3. Traiter les données
          let realPm25 = 0;
          let realNo2 = 0;
          let realO3 = 0;
          let realAqi = 0;

          if (aqData.current) {
            realPm25 = aqData.current.pm2_5 || 0;
            realNo2 = aqData.current.nitrogen_dioxide || 0;
            realO3 = aqData.current.ozone || 0;
            realAqi = aqData.current.european_aqi || 0;
          }

          let displayAqi = realAqi > 0 ? realAqi : Math.round(realPm25 * 3);

          let newStatus = 'Bon';
          if (displayAqi > 50) newStatus = 'Modéré';
          if (displayAqi > 80) newStatus = 'Mauvais';
          if (displayAqi > 150) newStatus = 'Dangereux';

          setCurrentCity({
            name: result.display_name.split(',')[0],
            lat: parseFloat(lat),
            lng: parseFloat(lon),
            aqi: displayAqi,
            pm25: realPm25,
            no2: realNo2,
            o3: realO3,
            status: newStatus
          });
          
          setSearchText('');
        } else {
          alert("Ville introuvable 😕");
        }
      } catch (error) {
        console.error("Erreur API :", error);
        alert("Erreur technique. Vérifiez votre connexion.");
      }
    }
  };

  const getBackground = (aqi) => {
    if (aqi <= 50) return 'var(--bg-good)';
    if (aqi <= 100) return 'var(--bg-moderate)';
    if (aqi <= 150) return 'var(--bg-bad)';
    return 'var(--bg-hazardous)';
  };

  const allCities = Object.values(WORLD_DATA).flatMap(c => c.cities);

  return (
    <div className="app-wrapper" style={{ background: getBackground(currentCity.aqi) }}>
      
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
              L'exposition aux particules fines (PM2.5) peut causer des inflammations.
            </p>
            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #2563eb'}}>
              <h4>Recommandation Actuelle ({currentCity.status})</h4>
              <p>{currentCity.aqi < 50 ? "Profitez de l'extérieur !" : "Réduisez l'intensité de vos activités."}</p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-dashboard">
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
            {/* ORDRE MIS À JOUR */}
            <button className={`menu-btn ${activeTab === 'pollutants' ? 'active' : ''}`} onClick={() => setActiveTab('pollutants')}>
              <Info size={20} /> Polluants
            </button>
            <button className={`menu-btn ${activeTab === 'prevention' ? 'active' : ''}`} onClick={() => setActiveTab('prevention')}>
              <Leaf size={20} /> Prévention
            </button>
          </div>

          <div style={{marginTop: 'auto'}}>
            <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', marginBottom: '5px', display:'block'}}>PAYS SÉLECTIONNÉ</label>
            <div className="country-selector">
              <select 
                value={selectedCountry} 
                onChange={(e) => {
                  const newCountry = e.target.value;
                  setSelectedCountry(newCountry);
                  setCurrentCity(WORLD_DATA[newCountry].cities[0]);
                }} 
                style={{width: '100%'}}
              >
                {Object.keys(WORLD_DATA).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>

        <div className="main-content">
          <header className="header-section fade-in-up">
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.5)', 
                padding: '8px 15px', borderRadius: '50px', marginBottom: '15px',
                border: '1px solid rgba(255,255,255,0.8)', maxWidth: '300px'
              }}>
                <Search size={18} color="#64748b" style={{marginRight: '10px'}}/>
                <input 
                  type="text" 
                  placeholder="Ville + Entrée..." 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleSearch}
                  style={{background: 'transparent', border: 'none', outline: 'none', width: '100%', color: '#1e293b', fontWeight: '500'}}
                />
              </div>

              <h1 className="big-title">{currentCity.name}</h1>
              <p className="subtitle">Données en temps réel • {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="aqi-badge" style={{
              background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '50px', fontWeight: '800',
              color: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {currentCity.status.toUpperCase()}
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <div className="bento-grid fade-in-up">
              <div className="bento-card map-container">
                <MapContainer center={[currentCity.lat, currentCity.lng]} zoom={10} scrollWheelZoom={true}>
                  <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <MapUpdater center={[currentCity.lat, currentCity.lng]} zoom={10} />
                  <Marker position={[currentCity.lat, currentCity.lng]}>
                    <Popup><strong>{currentCity.name}</strong><br />AQI: {currentCity.aqi}</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="bento-card score-card">
                <div className="score-circle" style={{
                  backgroundColor: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981', color: 'white'
                }}>
                  {currentCity.aqi}
                </div>
                <h3>Indice de Qualité</h3>
                <p style={{color: '#64748b'}}>Standard US AQI</p>
              </div>

              <div className="bento-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee'}}>
                  <span>PM2.5</span><strong>{currentCity.pm25} µg/m³</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee'}}>
                  <span>NO2</span><strong>{currentCity.no2} µg/m³</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>O3</span><strong>{currentCity.o3} µg/m³</strong>
                </div>
              </div>

              <div className="bento-card" style={{gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap:'wrap', gap:'15px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                  <div style={{background: '#eff6ff', padding: '15px', borderRadius: '50%', color: '#2563eb'}}>
                    <AlertTriangle size={30} />
                  </div>
                  <div>
                    <h3>Impact sur votre santé</h3>
                    <p style={{maxWidth: '600px', color: '#64748b'}}>
                      {currentCity.aqi < 50 ? "L'air est pur." : "Attention si vous êtes sensible."}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowHealthModal(true)} style={{background: 'var(--text-primary)', color: 'white', padding: '12px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>
                  En savoir plus
                </button>
              </div>

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


          {activeTab === 'compare' && (
            <div className="fade-in-up">
              <h2>Comparateur</h2>
              <div style={{display: 'flex', gap: '20px', margin: '20px 0', alignItems:'center', justifyContent:'center'}}>
                <select onChange={(e) => setCompareCity1(allCities.find(c => c.name === e.target.value))}>
                  {allCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <span>VS</span>
                <select onChange={(e) => setCompareCity2(allCities.find(c => c.name === e.target.value))}>
                   {allCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="comparator-wrapper">
                <div className="city-compare-card">
                  <h3>{compareCity1.name}</h3>
                  <div style={{fontSize: '3rem'}}>{compareCity1.aqi}</div>
                </div>
                <div className="city-compare-card">
                  <h3>{compareCity2.name}</h3>
                  <div style={{fontSize: '3rem'}}>{compareCity2.aqi}</div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLETS : POLLUANTS */}
          {activeTab === 'pollutants' && (
            <div className="fade-in-up">
              <h2>Polluants Majeurs</h2>
              <p className="subtitle" style={{marginBottom: '30px'}}>Forme, sources et effets sur la santé de l'homme.</p>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                {POLLUTANTS_DATA.map((pollutant, index) => (
                  <div key={index} className="bento-card" style={{padding: '25px'}}>
                    <h3 style={{color: '#2563eb', marginBottom: '15px'}}>{pollutant.name}</h3>
                    
                    <div style={{marginBottom: '10px'}}>
                      <strong style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>Forme:</strong>
                      <p style={{color: 'var(--text-secondary)'}}>{pollutant.form}</p>
                    </div>

                    <div style={{marginBottom: '10px'}}>
                      <strong style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>Source principale:</strong>
                      <p style={{color: 'var(--text-secondary)'}}>{pollutant.source}</p>
                    </div>
                    
                    <div style={{marginBottom: '20px'}}>
                      <strong style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>Effets sur la Santé:</strong>
                      <p style={{color: 'var(--text-secondary)'}}>{pollutant.effects}</p>
                    </div>

                    <a 
                      href={pollutant.wikiLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        display: 'inline-block', 
                        fontSize: '0.9rem', 
                        color: '#2563eb', 
                        fontWeight: 'bold', 
                        textDecoration: 'none'
                      }}
                    >
                      En savoir plus sur Wikipédia →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prevention' && (
            <div className="fade-in-up">
              <h2>Prévention</h2>
              <p>Conseils adaptés pour {currentCity.name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;