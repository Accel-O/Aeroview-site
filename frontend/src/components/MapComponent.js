import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'; // Ajout de useMapEvents
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CORRECTION ICONES LEAFLET ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapUpdater({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

// --- NOUVEAU COMPOSANT POUR LE CLIC ---
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            // On renvoie la lat/lng au parent quand on clique
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

const MapComponent = ({ currentCity, onMapClick }) => { // Ajout de la prop onMapClick
    if (!currentCity || !currentCity.lat) return <div>Chargement de la carte...</div>;

    return (
        <MapContainer
            center={[currentCity.lat, currentCity.lng]}
            zoom={10}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <MapUpdater center={[currentCity.lat, currentCity.lng]} zoom={10} />

            {/* Gestionnaire de clic */}
            <MapClickHandler onMapClick={onMapClick} />

            <Marker position={[currentCity.lat, currentCity.lng]}>
                <Popup><strong>{currentCity.name}</strong><br />AQI: {currentCity.aqi}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;