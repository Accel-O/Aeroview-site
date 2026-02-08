import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const TabForecast = ({ forecastData }) => {
    return (
        <div className="fade-in-up">
            <h2>Prévisions (4 Jours)</h2>
            <p className="subtitle" style={{ marginBottom: '30px' }}>Estimation à venir.</p>

            {/* Cartes par jour */}
            <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {forecastData.filter(d => d.fullDate.getHours() === 12).map((day, idx) => (
                    <div key={idx} className="bento-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <h3 style={{ textTransform: 'capitalize', color: '#64748b' }}>{day.fullDate.toLocaleDateString('fr-FR', { weekday: 'long' })}</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>{day.fullDate.toLocaleDateString()}</p>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px auto', background: day.aqi > 50 ? (day.aqi > 100 ? '#ef4444' : '#f59e0b') : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {day.aqi}
                        </div>
                        <p style={{ fontWeight: 'bold', color: '#1e293b' }}>{day.aqi > 50 ? (day.aqi > 100 ? 'Mauvais' : 'Moyen') : 'Bon'}</p>
                    </div>
                ))}
            </div>

            {/* Graphique */}
            <div className="bento-card" style={{ marginTop: '30px', height: '300px' }}>
                <h3>Tendance détaillée</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ left: -20, right: 10 }}>
                        <defs>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="time" minTickGap={30} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickCount={6} />
                        <Tooltip />
                        <Area type="monotone" dataKey="aqi" stroke="#9333ea" fill="url(#colorForecast)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TabForecast;