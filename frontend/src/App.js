import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Wind, Activity, BarChart2, ShieldCheck, MapPin, AlertTriangle, X, Info, Leaf, Search, Calendar, Locate
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CORRECTION ICONES LEAFLET ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- NOUVEAU : DONNÉES DES SEUILS AQI ---
const AQI_SCALE = [
  { range: "0 - 50", level: "Bon", color: "#10b981", desc: "Qualité de l'air satisfaisante, peu ou pas de risque." },
  { range: "51 - 100", level: "Modéré", color: "#f59e0b", desc: "Qualité acceptable ; risque modéré pour les personnes sensibles." },
  { range: "101 - 150", level: "Mauvais", color: "#ef4444", desc: "Les groupes sensibles peuvent ressentir des effets sur la santé." },
  { range: "151 - 200", level: "Très Mauvais", color: "#9333ea", desc: "Tout le monde peut ressentir des effets sur la santé." },
  { range: "201+", level: "Dangereux", color: "#7f1d1d", desc: "Alerte sanitaire : les risques sont sérieux pour tous." }
];

// --- DONNÉES POLLUANTS (CONSERVÉES) ---
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

const PREVENTION_TIPS = {
  conducteurs: {
    title: "Conducteurs",
    icon: <Activity size={24} />,
    color: "#3b82f6",
    tips: [
      "Privilégiez le recyclage de l'air intérieur dans les tunnels ou les bouchons.",
      "Vérifiez et remplacez régulièrement votre filtre d'habitacle (filtre à pollen/charbon actif).",
      "Adoptez l'éco-conduite pour réduire vos propres émissions de NO2.",
      "Évitez de laisser tourner le moteur à l'arrêt, surtout devant les écoles."
    ]
  },
  pietons: {
    title: "Piétons & Sportifs",
    icon: <MapPin size={24} />,
    color: "#10b981",
    tips: [
      "Privilégiez les rues peu circulées et les parcs pour vos trajets à pied.",
      "En cas de pic de pollution, évitez les activités sportives intenses en extérieur.",
      "Le matin tôt est souvent le moment où l'air est le plus sain en ville (hors hiver).",
      "Éloignez-vous du bord de la chaussée : la concentration de polluants y est maximale."
    ]
  },
  autres: {
    title: "Habitation & Santé",
    icon: <ShieldCheck size={24} />,
    color: "#f59e0b",
    tips: [
      "Aérez votre logement au moins 10 min par jour, de préférence avant 8h ou après 20h.",
      "Évitez les bougies, l'encens et les produits d'entretien chimiques lors des alertes.",
      "Les personnes vulnérables (enfants, seniors) doivent limiter les sorties prolongées.",
      "Maintenez une hydratation régulière pour aider vos muqueuses respiratoires."
    ]
  }
};

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
  const [compareSearch1, setCompareSearch1] = useState('');
  const [compareSearch2, setCompareSearch2] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [currentCity, setCurrentCity] = useState(WORLD_DATA['France'].cities[0]);
  const [searchText, setSearchText] = useState('');
  
  const [compareCity1, setCompareCity1] = useState(WORLD_DATA['France'].cities[0]);
  const [compareCity2, setCompareCity2] = useState(WORLD_DATA['Chine'].cities[0]);
  const [showHealthModal, setShowHealthModal] = useState(false);


  const handleCompareSearch = async (e, citySlot) => {
  if (e.key === 'Enter' && e.target.value.trim() !== '') {
    const query = e.target.value;
    try {
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        const result = geoData[0];
        const lat = result.lat;
        const lon = result.lon;

        const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,nitrogen_dioxide,ozone,european_aqi`;
        const aqResponse = await fetch(meteoUrl);
        const aqData = await aqResponse.json();

        let realPm25 = aqData.current?.pm2_5 || 0;
        let realAqi = aqData.current?.european_aqi || Math.round(realPm25 * 3);
        
        const newCityData = {
          name: result.display_name.split(',')[0],
          aqi: realAqi,
          pm25: realPm25,
          no2: aqData.current?.nitrogen_dioxide || 0,
          o3: aqData.current?.ozone || 0,
          status: realAqi > 100 ? 'Dangereux' : realAqi > 80 ? 'Mauvais' : realAqi > 50 ? 'Modéré' : 'Bon'
        };

        if (citySlot === 1) {
          setCompareCity1(newCityData);
          setCompareSearch1('');
        } else {
          setCompareCity2(newCityData);
          setCompareSearch2('');
        }
      }
    } catch (error) {
      alert("Erreur lors de la recherche comparative.");
    }
  }
};

  // --- FONCTION DE RECHERCHE ---
  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      try {
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
          const result = geoData[0];
          const lat = result.lat;
          const lon = result.lon;

          const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,nitrogen_dioxide,ozone,european_aqi`;
          const aqResponse = await fetch(meteoUrl);
          const aqData = await aqResponse.json();

          let realPm25 = 0, realNo2 = 0, realO3 = 0, realAqi = 0;

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
          alert("Ville introuvable ");
        }
      } catch (error) {
        alert("Erreur technique.");
      }
    }
  };

  // --- FONCTION GÉOLOCALISATION ---
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Votre navigateur ne supporte pas la géolocalisation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        // 1. Trouver le nom de la ville
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const geoData = await geoRes.json();
        // On essaie de récupérer la ville, sinon le village, sinon "Ma Position"
        const cityName = geoData.address.city || geoData.address.town || geoData.address.village || "Ma Position";

        // 2. Récupérer la pollution 
        const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,nitrogen_dioxide,ozone,european_aqi`;
        const aqResponse = await fetch(meteoUrl);
        const aqData = await aqResponse.json();

        // 3. Mise à jour des données (
        let realPm25 = aqData.current?.pm2_5 || 0;
        let realAqi = aqData.current?.european_aqi || Math.round(realPm25 * 3);
        
        let newStatus = 'Bon';
        if (realAqi > 50) newStatus = 'Modéré';
        if (realAqi > 80) newStatus = 'Mauvais';
        if (realAqi > 150) newStatus = 'Dangereux';

        setCurrentCity({
          name: cityName,
          lat: lat,
          lng: lon,
          aqi: realAqi,
          pm25: realPm25,
          no2: aqData.current?.nitrogen_dioxide || 0,
          o3: aqData.current?.ozone || 0,
          status: newStatus
        });

      } catch (error) {
        console.error(error);
        alert("Impossible de récupérer les données pour votre position.");
      }
    }, () => {
      alert("Veuillez autoriser la localisation pour utiliser cette fonction.");
    });
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
              <button 
                  onClick={handleLocateMe}
                  title="Me localiser"
                  style={{
                    background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', color: '#2563eb', transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Locate size={20} />
                </button>
              

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
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Comparateur de Villes</h2>
      <p className="subtitle">Recherchez deux villes pour comparer leur qualité de l'air</p>
    </div>

    {/* BARRES DE RECHERCHE COMPARATIVES */}
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      margin: '20px auto 40px auto', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexWrap: 'wrap',
      maxWidth: '800px' 
    }}>
      {/* Barre 1 */}
      <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
        <div className="search-bar-container" style={{
          display: 'flex', alignItems: 'center', background: 'white', 
          padding: '10px 15px', borderRadius: '12px', border: '1px solid #ddd'
        }}>
          <Search size={16} color="#64748b" style={{marginRight: '10px'}}/>
          <input 
            type="text" 
            placeholder="Comparer la ville 1..." 
            value={compareSearch1}
            onChange={(e) => setCompareSearch1(e.target.value)}
            onKeyDown={(e) => handleCompareSearch(e, 1)}
            style={{border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem'}}
          />
        </div>
      </div>

      <div style={{ background: '#1e293b', color: 'white', padding: '8px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>VS</div>

      {/* Barre 2 */}
      <div style={{ flex: 1, minWidth: '250px' }}>
        <div className="search-bar-container" style={{
          display: 'flex', alignItems: 'center', background: 'white', 
          padding: '10px 15px', borderRadius: '12px', border: '1px solid #ddd'
        }}>
          <Search size={16} color="#64748b" style={{marginRight: '10px'}}/>
          <input 
            type="text" 
            placeholder="Comparer la ville 2..." 
            value={compareSearch2}
            onChange={(e) => setCompareSearch2(e.target.value)}
            onKeyDown={(e) => handleCompareSearch(e, 2)}
            style={{border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem'}}
          />
        </div>
      </div>
    </div>

    
    {/* AFFICHAGE DES RÉSULTATS */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      {[compareCity1, compareCity2].map((city, index) => (
        <div key={index} className="bento-card fade-in-up" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'#64748b', marginBottom:'10px'}}>
            <MapPin size={16}/>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{city.name}</h3>
          </div>
          <div style={{ 
            fontSize: '4.5rem', 
            fontWeight: '900', 
            color: city.aqi > 100 ? '#ef4444' : city.aqi > 50 ? '#f59e0b' : '#10b981', 
            lineHeight: '1'
          }}>
            {city.aqi}
          </div>
          <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '25px', letterSpacing: '1px' }}>
            {city.status.toUpperCase()}
          </p>
          <div style={{ textAlign: 'left', marginTop: '20px', background: 'white', padding: '15px', borderRadius: '12px' }}>
            <PollutantComparisonBar label="PM2.5" value={city.pm25} max={150} color="#3b82f6" />
            <PollutantComparisonBar label="NO2" value={city.no2} max={100} color="#8b5cf6" />
            <PollutantComparisonBar label="Ozone" value={city.o3} max={180} color="#06b6d4" />
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          {activeTab === 'pollutants' && (
            <div className="fade-in-up">
              <h2>Polluants Majeurs</h2>
              <p className="subtitle" style={{marginBottom: '30px'}}>Comprendre les indices et les substances nocives.</p>

              {/* --- TABLEAU DES SEUILS AQI AJOUTÉ --- */}
              <div className="bento-card" style={{marginBottom: '40px', padding: '25px', overflowX: 'auto'}}>
                <h3 style={{marginBottom: '20px', color: '#1e293b'}}>Échelle de l'Indice de Qualité de l'Air (AQI)</h3>
                
                

[Image of air quality index scale chart]


                <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #f1f5f9'}}>
                      <th style={{padding: '12px', color: '#64748b'}}>Valeur AQI</th>
                      <th style={{padding: '12px', color: '#64748b'}}>Niveau</th>
                      <th style={{padding: '12px', color: '#64748b'}}>Conséquences pour la santé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AQI_SCALE.map((item, idx) => (
                      <tr key={idx} style={{borderBottom: '1px solid #f8fafc'}}>
                        <td style={{padding: '15px', fontWeight: 'bold'}}>{item.range}</td>
                        <td style={{padding: '15px'}}>
                          <span style={{
                            background: item.color, color: 'white', padding: '5px 12px', 
                            borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
                          }}>{item.level}</span>
                        </td>
                        <td style={{padding: '15px', color: '#475569', fontSize: '0.9rem'}}>{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                {POLLUTANTS_DATA.map((pollutant, index) => (
                  <div key={index} className="bento-card" style={{padding: '25px'}}>
                    <h3 style={{color: '#2563eb', marginBottom: '15px'}}>{pollutant.name}</h3>
                    <div style={{marginBottom: '10px'}}><strong style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>Forme:</strong><p style={{color: 'var(--text-secondary)'}}>{pollutant.form}</p></div>
                    <div style={{marginBottom: '10px'}}><strong style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>Source principale:</strong><p style={{color: 'var(--text-secondary)'}}>{pollutant.source}</p></div>
                    <div style={{marginBottom: '20px'}}><strong style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>Effets sur la Santé:</strong><p style={{color: 'var(--text-secondary)'}}>{pollutant.effects}</p></div>
                    <a href={pollutant.wikiLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '0.9rem', color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>En savoir plus sur Wikipédia →</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prevention' && (
  <div className="fade-in-up">
    <div style={{ marginBottom: '30px' }}>
      <h2>Conseils de Prévention</h2>
      <p className="subtitle">
        Mesures recommandées pour <strong>{currentCity.name}</strong> (AQI: {currentCity.aqi})
      </p>
    </div>

    {/* Bannière d'alerte dynamique selon l'AQI */}
    <div style={{
      background: currentCity.aqi > 100 ? '#fef2f2' : '#f0fdf4',
      borderLeft: `5px solid ${currentCity.aqi > 100 ? '#ef4444' : '#10b981'}`,
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <AlertTriangle color={currentCity.aqi > 100 ? '#ef4444' : '#10b981'} size={28} />
      <div>
        <h4 style={{ margin: 0, color: '#1e293b' }}>Note globale pour aujourd'hui</h4>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
          {currentCity.aqi > 100 
            ? "La qualité de l'air est dégradée. Suivez scrupuleusement les conseils ci-dessous." 
            : "Les conditions sont globalement favorables, mais quelques précautions restent utiles."}
        </p>
      </div>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    }}>
      {Object.entries(PREVENTION_TIPS).map(([key, category]) => (
        <div key={key} className="bento-card" style={{ padding: '25px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            color: category.color
          }}>
            {category.icon}
            <h3 style={{ margin: 0, color: '#1e293b' }}>{category.title}</h3>
          </div>
          
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {category.tips.map((tip, i) => (
              <li key={i} style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '15px',
                fontSize: '0.95rem',
                color: '#475569',
                lineHeight: '1.4'
              }}>
                <div style={{ 
                  minWidth: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: category.color, 
                  marginTop: '7px' 
                }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>


    {/* Pied de page prévention */}
    <div style={{ 
      marginTop: '30px', 
      textAlign: 'center', 
      padding: '20px', 
      background: 'rgba(255,255,255,0.3)', 
      borderRadius: '15px' 
    }}>
      <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
        Source : Recommandations de l'Organisation Mondiale de la Santé (OMS) et des agences régionales de santé.
      </p>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

const PollutantComparisonBar = ({ label, value, max, color }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
        <span style={{ color: '#64748b' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{value} µg/m³</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 1s ease-in-out', borderRadius: '10px' }} />
      </div>
    </div>
  );
};

export default App;