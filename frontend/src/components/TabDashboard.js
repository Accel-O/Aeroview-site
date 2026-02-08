import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import MapComponent from './MapComponent';

// Ajout de la prop 'onMapClick' reçue depuis App.js
const TabDashboard = ({ currentCity, historyData, setShowHealthModal, onMapClick }) => {
    return (
        <div className="bento-grid fade-in-up">
            <div className="bento-card map-container">
                {/* On passe la fonction à la carte */}
                <MapComponent currentCity={currentCity} onMapClick={onMapClick} />
            </div>

            <div className="bento-card score-card">
                <div className="score-circle" style={{ backgroundColor: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981' }}>
                    {currentCity.aqi}
                </div>
                <h3>Indice de Qualité</h3>
                <p style={{ color: '#64748b' }}>Standard US AQI</p>
            </div>

            {/* Le reste ne change pas... */}
            <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                    <span>PM2.5</span><strong>{currentCity.pm25} µg/m³</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                    <span>NO2</span><strong>{currentCity.no2} µg/m³</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>O3</span><strong>{currentCity.o3} µg/m³</strong>
                </div>
            </div>

            <div className="bento-card" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '50%', color: '#2563eb' }}>
                        <AlertTriangle size={30} />
                    </div>
                    <div>
                        <h3>Impact sur votre santé</h3>
                        <p style={{ maxWidth: '600px', color: '#64748b' }}>
                            {currentCity.aqi < 50 ? "L'air est pur." : "Attention si vous êtes sensible."}
                        </p>
                    </div>
                </div>
                <button onClick={() => setShowHealthModal(true)} style={{ background: 'var(--text-primary)', color: 'white', padding: '12px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    En savoir plus
                </button>
            </div>

            <div className="bento-card" style={{ gridColumn: '1 / -1', height: '300px' }}>
                <h3 style={{ marginBottom: '15px' }}>Historique (7 Jours)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData} margin={{ left: -20, right: 10 }}>
                        <defs>
                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="time" minTickGap={30} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickCount={5} />
                        <Tooltip />
                        <Area type="monotone" dataKey="aqi" stroke="#2563eb" fillOpacity={1} fill="url(#colorAqi)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TabDashboard;