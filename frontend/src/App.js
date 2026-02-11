import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// --- IMPORTS COMPOSANTS ---
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HealthModal from './components/HealthModal';

// --- IMPORTS ONGLETS ---
import TabDashboard from './components/TabDashboard';
import TabCompare from './components/TabCompare';
import TabPollutants from './components/TabPollutants';
import TabPrevention from './components/TabPrevention';
import TabForecast from './components/TabForecast';

// --- DONNÉES ---
import { WORLD_DATA } from './data/constants';

function App() {
  const safeDefaultCity = (WORLD_DATA && WORLD_DATA['France']) ? WORLD_DATA['France'].cities[0] : { name: '...', lat: 0, lng: 0, aqi: 0, status: '...' };

  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentCity, setCurrentCity] = useState(safeDefaultCity);
  const [searchText, setSearchText] = useState('');

  // Comparateur
  const [compareCity1, setCompareCity1] = useState(safeDefaultCity);
  const [compareCity2, setCompareCity2] = useState((WORLD_DATA && WORLD_DATA['Chine']) ? WORLD_DATA['Chine'].cities[0] : safeDefaultCity);
  const [compareSearch1, setCompareSearch1] = useState('');
  const [compareSearch2, setCompareSearch2] = useState('');
  const [compareHistory, setCompareHistory] = useState([]);

  // UI & Data
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  // UX Features
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState({ sensitive: false, sporty: false });

  // --- INITIALISATION ---
  useEffect(() => {
    const savedFavs = localStorage.getItem('myAirQualityFavorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    if ("Notification" in window) Notification.requestPermission();
  }, []);

  // --- TOGGLES ---
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) { document.body.classList.add('dark-mode'); localStorage.setItem('theme', 'dark'); }
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('theme', 'light'); }
  };

  const toggleProfile = (type) => {
    let newProfile = { sensitive: false, sporty: false };
    if (!userProfile[type]) newProfile[type] = true;
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const toggleFavorite = () => {
    const exists = favorites.find(city => city.name === currentCity.name);
    let newFavs;
    if (exists) { newFavs = favorites.filter(city => city.name !== currentCity.name); }
    else { newFavs = [...favorites, { name: currentCity.name, lat: currentCity.lat, lng: currentCity.lng }]; }
    setFavorites(newFavs);
    localStorage.setItem('myAirQualityFavorites', JSON.stringify(newFavs));
  };

  const checkAirQualityAlert = (city, aqi) => {
    if (aqi > 100 && Notification.permission === "granted") {
      new Notification(`Alerte Pollution à ${city}`, { body: `L'indice AQI est de ${aqi}.`, icon: '/logo192.png' });
    }
  };

  // --- APPELS API (AVEC PM10) ---
  const fetchPollutionData = async (lat, lon, cityName) => {
    try {
      // AJOUT DE PM10 ICI
      const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,nitrogen_dioxide,ozone,european_aqi&hourly=european_aqi&past_days=7&forecast_days=4`;
      const response = await fetch(meteoUrl);
      const data = await response.json();

      let realPm25 = data.current?.pm2_5 || 0;
      let realAqi = data.current?.european_aqi || Math.round(realPm25 * 3);
      let newStatus = realAqi > 50 ? (realAqi > 100 ? 'Mauvais' : 'Modéré') : 'Bon';
      if (realAqi > 150) newStatus = 'Dangereux';

      setCurrentCity({
        name: cityName,
        lat: lat,
        lng: lon,
        aqi: realAqi,
        pm25: realPm25,
        pm10: data.current?.pm10 || 0, // <--- STROCKAGE PM10
        no2: data.current?.nitrogen_dioxide || 0,
        o3: data.current?.ozone || 0,
        status: newStatus
      });

      checkAirQualityAlert(cityName, realAqi);

      const now = new Date();
      const historyTmp = [];
      const forecastTmp = [];
      if (data.hourly && data.hourly.time) {
        data.hourly.time.forEach((t, i) => {
          const date = new Date(t);
          const item = { time: date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit' }), fullDate: date, aqi: data.hourly.european_aqi[i] };
          if (date < now) historyTmp.push(item); else forecastTmp.push(item);
        });
      }
      setHistoryData(historyTmp);
      setForecastData(forecastTmp);
    } catch (error) { console.error("Erreur API:", error); }
  };

  const fetchCompareData = async (lat, lon, name, slot) => {
    try {
      // AJOUT DE PM10 ICI AUSSI
      const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,nitrogen_dioxide,ozone,european_aqi&hourly=european_aqi&past_days=7`;
      const response = await fetch(meteoUrl);
      const data = await response.json();

      let realPm25 = data.current?.pm2_5 || 0;
      let realAqi = data.current?.european_aqi || Math.round(realPm25 * 3);

      const newCityData = {
        name: name,
        aqi: realAqi,
        pm25: realPm25,
        pm10: data.current?.pm10 || 0, // <--- STOCKAGE PM10
        no2: data.current?.nitrogen_dioxide || 0,
        o3: data.current?.ozone || 0,
        status: realAqi > 100 ? 'Dangereux' : realAqi > 80 ? 'Mauvais' : realAqi > 50 ? 'Modéré' : 'Bon',
        history: data.hourly
      };

      if (slot === 1) { setCompareCity1(newCityData); setCompareSearch1(name); mergeHistoryData(newCityData, compareCity2); }
      else { setCompareCity2(newCityData); setCompareSearch2(name); mergeHistoryData(compareCity1, newCityData); }
    } catch (error) { console.error("Erreur comparateur", error); }
  };

  const mergeHistoryData = (city1, city2) => {
    if (!city1.history || !city2.history) return;
    const merged = [];
    city1.history.time.forEach((t, i) => {
      const date = new Date(t);
      if (i % 4 === 0) { merged.push({ time: date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit' }), aqi1: city1.history.european_aqi[i] || 0, aqi2: city2.history?.european_aqi[i] || 0 }); }
    });
    setCompareHistory(merged);
  };
  // eslint-disable-next-line
  useEffect(() => { if (currentCity.lat && currentCity.lng) { fetchPollutionData(currentCity.lat, currentCity.lng, currentCity.name); } }, []);

  // HANDLERS
  const handleMapClick = async (lat, lng) => { try { const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`); const geoData = await geoRes.json(); const cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Lieu sélectionné"; fetchPollutionData(lat, lng, cityName); } catch (error) { fetchPollutionData(lat, lng, "Point sur carte"); } };
  const handleCitySelect = (lat, lon, name) => { setSearchText(name); fetchPollutionData(lat, lon, name); };
  const handleCompareSelect = (lat, lon, name, slot) => { fetchCompareData(lat, lon, name, slot); };
  const handleSearch = async (e) => { if (e.key === 'Enter' && searchText.trim() !== '') { try { const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`); const geoData = await geoResponse.json(); if (geoData && geoData.length > 0) { const result = geoData[0]; await fetchPollutionData(result.lat, result.lon, result.display_name.split(',')[0]); } else { alert("Ville introuvable."); } } catch (error) { alert("Erreur de recherche."); } } };
  const handleLocateMe = () => { if (!navigator.geolocation) return alert("Pas de GPS."); navigator.geolocation.getCurrentPosition(async (position) => { const { latitude, longitude } = position.coords; try { const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`); const geoData = await geoRes.json(); fetchPollutionData(latitude, longitude, geoData.address.city || "Ma Position"); } catch (e) { fetchPollutionData(latitude, longitude, "Ma Position"); } }, () => alert("Refusé.")); };
  const handleCompareSearch = async (e, citySlot) => { if (e.key === 'Enter' && e.target.value.trim() !== '') { const query = e.target.value; try { const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`); const geoData = await geoResponse.json(); if (geoData && geoData.length > 0) { const result = geoData[0]; const name = result.display_name.split(',')[0]; fetchCompareData(result.lat, result.lon, name, citySlot); } else { alert("Ville introuvable"); } } catch (error) { alert("Erreur comparateur."); } } };
  const handleFavoriteClick = (fav) => { fetchPollutionData(fav.lat, fav.lng, fav.name); setActiveTab('dashboard'); };

  return (
    <div className="app-wrapper">
      <Analytics />
      <HealthModal showHealthModal={showHealthModal} setShowHealthModal={setShowHealthModal} currentCity={currentCity} />
      <div className="glass-dashboard">
        <Sidebar
          activeTab={activeTab} setActiveTab={setActiveTab} setCurrentCity={setCurrentCity}
          favorites={favorites} onFavoriteClick={handleFavoriteClick}
          darkMode={darkMode} toggleDarkMode={toggleDarkMode}
          userProfile={userProfile} toggleProfile={toggleProfile}
        />
        <div className="main-content">
          <Header
            currentCity={currentCity} searchText={searchText} setSearchText={setSearchText}
            handleSearch={handleSearch} handleLocateMe={handleLocateMe}
            onCitySelect={handleCitySelect} toggleFavorite={toggleFavorite} isFavorite={favorites.some(city => city.name === currentCity.name)}
          />

          {activeTab === 'dashboard' && <TabDashboard currentCity={currentCity} historyData={historyData} setShowHealthModal={setShowHealthModal} onMapClick={handleMapClick} />}
          {activeTab === 'compare' && <TabCompare compareSearch1={compareSearch1} setCompareSearch1={setCompareSearch1} compareSearch2={compareSearch2} setCompareSearch2={setCompareSearch2} handleCompareSearch={handleCompareSearch} handleCompareSelect={handleCompareSelect} compareCity1={compareCity1} compareCity2={compareCity2} compareHistory={compareHistory} />}
          {activeTab === 'pollutants' && <TabPollutants />}
          {activeTab === 'prevention' && <TabPrevention currentCity={currentCity} userProfile={userProfile} />}
          {activeTab === 'forecast' && <TabForecast forecastData={forecastData} />}
        </div>
      </div>
    </div>
  );
}

export default App;
