import React, { useState, useEffect } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HealthModal from './components/HealthModal';

import TabDashboard from './components/TabDashboard';
import TabCompare from './components/TabCompare';
import TabPollutants from './components/TabPollutants';
import TabPrevention from './components/TabPrevention';
import TabForecast from './components/TabForecast';

import { WORLD_DATA } from './data/constants';

function App() {
  const safeDefaultCity = (WORLD_DATA && WORLD_DATA['France']) ? WORLD_DATA['France'].cities[0] : { name: '...', lat: 0, lng: 0, aqi: 0, status: '...' };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [currentCity, setCurrentCity] = useState(safeDefaultCity);
  const [searchText, setSearchText] = useState('');

  // Comparateur
  const [compareCity1, setCompareCity1] = useState(safeDefaultCity);
  const [compareCity2, setCompareCity2] = useState((WORLD_DATA && WORLD_DATA['Chine']) ? WORLD_DATA['Chine'].cities[0] : safeDefaultCity);
  const [compareSearch1, setCompareSearch1] = useState('');
  const [compareSearch2, setCompareSearch2] = useState('');

  const [showHealthModal, setShowHealthModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  // --- GESTION FAVORIS (STATE) ---
  const [favorites, setFavorites] = useState([]);

  // 1. Au démarrage, on charge les favoris du LocalStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem('myAirQualityFavorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // 2. Fonction pour Ajouter/Retirer un favori
  const toggleFavorite = () => {
    // On vérifie si la ville est déjà dedans (par nom)
    const exists = favorites.find(city => city.name === currentCity.name);

    let newFavs;
    if (exists) {
      // Si elle existe, on la supprime
      newFavs = favorites.filter(city => city.name !== currentCity.name);
    } else {
      // Sinon, on l'ajoute (juste les infos nécessaires)
      const newFav = {
        name: currentCity.name,
        lat: currentCity.lat,
        lng: currentCity.lng
      };
      newFavs = [...favorites, newFav];
    }

    setFavorites(newFavs);
    // On sauvegarde dans le navigateur
    localStorage.setItem('myAirQualityFavorites', JSON.stringify(newFavs));
  };

  // --- INITIALISATION ---
  useEffect(() => {
    if (currentCity.lat && currentCity.lng) {
      fetchPollutionData(currentCity.lat, currentCity.lng, currentCity.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPollutionData = async (lat, lon, cityName) => {
    try {
      const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,nitrogen_dioxide,ozone,european_aqi&hourly=european_aqi&past_days=7&forecast_days=4`;
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
        no2: data.current?.nitrogen_dioxide || 0,
        o3: data.current?.ozone || 0,
        status: newStatus
      });

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
      const meteoUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,nitrogen_dioxide,ozone,european_aqi`;
      const response = await fetch(meteoUrl);
      const data = await response.json();

      let realPm25 = data.current?.pm2_5 || 0;
      let realAqi = data.current?.european_aqi || Math.round(realPm25 * 3);

      const newCityData = {
        name: name,
        aqi: realAqi,
        pm25: realPm25,
        no2: data.current?.nitrogen_dioxide || 0,
        o3: data.current?.ozone || 0,
        status: realAqi > 100 ? 'Dangereux' : realAqi > 80 ? 'Mauvais' : realAqi > 50 ? 'Modéré' : 'Bon'
      };

      if (slot === 1) {
        setCompareCity1(newCityData);
        setCompareSearch1(name);
      } else {
        setCompareCity2(newCityData);
        setCompareSearch2(name);
      }
    } catch (error) { console.error("Erreur comparateur", error); }
  };

  // --- GESTIONNAIRES ---
  const handleMapClick = async (lat, lng) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const geoData = await geoRes.json();
      const cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Lieu sélectionné";
      fetchPollutionData(lat, lng, cityName);
    } catch (error) {
      fetchPollutionData(lat, lng, "Point sur carte");
    }
  };

  const handleCitySelect = (lat, lon, name) => {
    setSearchText(name);
    fetchPollutionData(lat, lon, name);
  };

  const handleCompareSelect = (lat, lon, name, slot) => {
    fetchCompareData(lat, lon, name, slot);
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      try {
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
        const geoData = await geoResponse.json();
        if (geoData && geoData.length > 0) {
          const result = geoData[0];
          await fetchPollutionData(result.lat, result.lon, result.display_name.split(',')[0]);
        } else { alert("Ville introuvable."); }
      } catch (error) { alert("Erreur de recherche."); }
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert("Pas de GPS.");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const geoData = await geoRes.json();
        fetchPollutionData(latitude, longitude, geoData.address.city || "Ma Position");
      } catch (e) { fetchPollutionData(latitude, longitude, "Ma Position"); }
    }, () => alert("Refusé."));
  };

  const handleCompareSearch = async (e, citySlot) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const query = e.target.value;
      try {
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const geoData = await geoResponse.json();
        if (geoData && geoData.length > 0) {
          const result = geoData[0];
          const name = result.display_name.split(',')[0];
          fetchCompareData(result.lat, result.lon, name, citySlot);
        } else { alert("Ville introuvable"); }
      } catch (error) { alert("Erreur comparateur."); }
    }
  };

  const handleFavoriteClick = (fav) => {
    fetchPollutionData(fav.lat, fav.lng, fav.name);
    // Optionnel : Basculer vers le dashboard si on est ailleurs
    setActiveTab('dashboard');
  };

  const getBackground = (aqi) => {
    if (aqi <= 50) return 'var(--bg-good)';
    if (aqi <= 100) return 'var(--bg-moderate)';
    if (aqi <= 150) return 'var(--bg-bad)';
    return 'var(--bg-hazardous)';
  };

  return (
    <div className="app-wrapper" style={{ background: getBackground(currentCity.aqi) }}>

      <HealthModal showHealthModal={showHealthModal} setShowHealthModal={setShowHealthModal} currentCity={currentCity} />

      <div className="glass-dashboard">

        {/* On passe la liste des favoris et la fonction de clic à la Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          setCurrentCity={setCurrentCity}
          favorites={favorites}
          onFavoriteClick={handleFavoriteClick}
        />

        <div className="main-content">

          {/* On passe la fonction toggleFavorite et l'état isFavorite au Header */}
          <Header
            currentCity={currentCity}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            handleLocateMe={handleLocateMe}
            onCitySelect={handleCitySelect}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.some(city => city.name === currentCity.name)}
          />

          {activeTab === 'dashboard' && (
            <TabDashboard
              currentCity={currentCity}
              historyData={historyData}
              setShowHealthModal={setShowHealthModal}
              onMapClick={handleMapClick}
            />
          )}

          {activeTab === 'compare' && (
            <TabCompare
              compareSearch1={compareSearch1} setCompareSearch1={setCompareSearch1}
              compareSearch2={compareSearch2} setCompareSearch2={setCompareSearch2}
              handleCompareSearch={handleCompareSearch}
              handleCompareSelect={handleCompareSelect}
              compareCity1={compareCity1} compareCity2={compareCity2}
            />
          )}

          {activeTab === 'pollutants' && <TabPollutants />}
          {activeTab === 'prevention' && <TabPrevention currentCity={currentCity} />}
          {activeTab === 'forecast' && <TabForecast forecastData={forecastData} />}

        </div>
      </div>
    </div>
  );
}

export default App;