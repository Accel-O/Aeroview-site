/* =========================================
   COMPOSANT : CARTE INTERACTIVE (LEAFLET)
   =========================================
   Gère l'affichage de la carte, les marqueurs et les événements de clic.
   On utilise la librairie 'react-leaflet' qui est un wrapper React pour Leaflet.js.
   ========================================= */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import obligatoire du CSS de la carte
import L from 'leaflet';

// --- CORRECTION BUG ICONES LEAFLET ---
// Par défaut, Leaflet perd les liens vers ses images de marqueurs quand on build avec Webpack/React.
// On doit réassigner manuellement les chemins des icônes ici, sinon les marqueurs sont invisibles.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- COMPOSANT UTILITAIRE : MISE À JOUR CAMÉRA ---
// React-Leaflet est "immobile" par défaut : si on change les props center, la carte ne bouge pas.
// On crée ce petit composant qui utilise le hook 'useMap' pour forcer la caméra 
// à voler vers la nouvelle ville quand les coordonnées changent.
function MapUpdater({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom); // Déplacement fluide
    return null; // Ce composant n'affiche rien visuellement
}

// --- COMPOSANT UTILITAIRE : GESTION DES CLICS ---
// Permet de cliquer n'importe où sur la carte pour récupérer la pollution de ce point.
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            // On capture l'événement de clic et on remonte les coordonnées (lat, lng)
            // vers le composant parent (App.js) pour lancer une nouvelle recherche API.
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

const MapComponent = ({ currentCity, onMapClick }) => {
    // SÉCURITÉ : Si l'API n'a pas encore répondu ou si la ville est vide,
    // on affiche un message d'attente pour éviter de faire planter Leaflet.
    if (!currentCity || !currentCity.lat) return <div>Chargement de la carte...</div>;

    return (
        <MapContainer
            center={[currentCity.lat, currentCity.lng]}
            zoom={10}
            scrollWheelZoom={true} // Autorise le zoom avec la molette de la souris
            style={{ height: '100%', width: '100%' }} // La carte prend toute la place du bloc Bento
        >
            {/* FOND DE CARTE (TILE LAYER) */}
            {/* On utilise le style 'Voyager' de CartoDB car il est épuré et lisible */}
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Intégration de nos utilitaires invisibles */}
            <MapUpdater center={[currentCity.lat, currentCity.lng]} zoom={10} />
            <MapClickHandler onMapClick={onMapClick} />

            {/* MARQUEUR DE LA VILLE */}
            <Marker position={[currentCity.lat, currentCity.lng]}>
                {/* Info-bulle qui s'ouvre au clic sur le marqueur */}
                <Popup>
                    <strong>{currentCity.name}</strong><br />
                    AQI: {currentCity.aqi}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;