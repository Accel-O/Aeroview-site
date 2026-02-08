import React from 'react';
import { Wind, Activity, BarChart2, Info, Leaf, Calendar, Heart } from 'lucide-react'; // Import Heart
import { WORLD_DATA } from '../data/constants';

const Sidebar = ({
    activeTab, setActiveTab, selectedCountry, setSelectedCountry, setCurrentCity,
    favorites, onFavoriteClick // <-- Nouveaux props
}) => {
    return (
        <nav className="sidebar">
            <div className="brand">
                <Wind size={32} color="white" fill="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
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
                <button className={`menu-btn ${activeTab === 'forecast' ? 'active' : ''}`} onClick={() => setActiveTab('forecast')}>
                    <Calendar size={20} /> Prévisions
                </button>
            </div>

            {/* --- SECTION FAVORIS (S'affiche s'il y en a) --- */}
            {favorites && favorites.length > 0 && (
                <div style={{ marginTop: '20px', padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {/* Titre caché sur mobile pour gagner de la place, visible sur desktop */}
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', marginBottom: '5px', textTransform: 'uppercase' }}>
                        Mes Favoris
                    </label>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {favorites.map((city, idx) => (
                            <button
                                key={idx}
                                onClick={() => onFavoriteClick(city)}
                                style={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    fontSize: '0.85rem',
                                    color: '#475569',
                                    marginBottom: '5px',
                                    fontWeight: '600'
                                }}
                            >
                                <Heart size={14} fill="#ef4444" color="#ef4444" />
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {city.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: 'auto' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', marginBottom: '5px', display: 'block' }}>PAYS SÉLECTIONNÉ</label>
                <div className="country-selector">
                    <select
                        value={selectedCountry}
                        onChange={(e) => {
                            const newCountry = e.target.value;
                            setSelectedCountry(newCountry);
                            if (WORLD_DATA[newCountry]) {
                                setCurrentCity(WORLD_DATA[newCountry].cities[0]);
                            }
                        }}
                        style={{ width: '100%' }}
                    >
                        {Object.keys(WORLD_DATA).map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;