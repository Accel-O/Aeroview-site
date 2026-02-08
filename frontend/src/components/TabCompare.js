import React from 'react';
import { MapPin } from 'lucide-react';
import PollutantComparisonBar from './PollutantBar';
import SearchInput from './SearchInput';

const TabCompare = ({
    compareSearch1, setCompareSearch1,
    compareSearch2, setCompareSearch2,
    handleCompareSearch,
    handleCompareSelect, // <--- Nouvelle prop reçue
    compareCity1, compareCity2
}) => {
    return (
        <div className="fade-in-up">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Comparateur de Villes</h2>
                <p className="subtitle">Recherchez deux villes pour comparer leur qualité de l'air</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px auto 40px auto', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '800px' }}>
                {/* Ville 1 */}
                <div style={{ flex: 1, minWidth: '250px', position: 'relative', zIndex: 20 }}>
                    <SearchInput
                        value={compareSearch1}
                        onChange={(e) => setCompareSearch1(e.target.value)}
                        onKeyDown={(e) => handleCompareSearch(e, 1)}
                        onSelect={(lat, lon, name) => handleCompareSelect(lat, lon, name, 1)} // <--- On connecte l'autocomplete
                        placeholder="Rechercher ville 1..."
                    />
                </div>

                <div style={{ background: '#1e293b', color: 'white', padding: '8px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>VS</div>

                {/* Ville 2 */}
                <div style={{ flex: 1, minWidth: '250px', position: 'relative', zIndex: 20 }}>
                    <SearchInput
                        value={compareSearch2}
                        onChange={(e) => setCompareSearch2(e.target.value)}
                        onKeyDown={(e) => handleCompareSearch(e, 2)}
                        onSelect={(lat, lon, name) => handleCompareSelect(lat, lon, name, 2)} // <--- On connecte l'autocomplete
                        placeholder="Rechercher ville 2..."
                    />
                </div>
            </div>

            {/* Résultats (inchangés) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {[compareCity1, compareCity2].map((city, index) => (
                    <div key={index} className="bento-card fade-in-up" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.8)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', marginBottom: '10px' }}>
                            <MapPin size={16} />
                            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{city.name}</h3>
                        </div>
                        <div style={{ fontSize: '4.5rem', fontWeight: '900', color: city.aqi > 100 ? '#ef4444' : city.aqi > 50 ? '#f59e0b' : '#10b981', lineHeight: '1' }}>
                            {city.aqi}
                        </div>
                        <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '25px', letterSpacing: '1px' }}>
                            {city.status?.toUpperCase()}
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
    );
};

export default TabCompare;