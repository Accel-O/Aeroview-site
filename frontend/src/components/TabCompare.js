import React from 'react';
import { MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import PollutantComparisonBar from './PollutantBar';
import SearchInput from './SearchInput';

const TabCompare = ({
    compareSearch1, setCompareSearch1,
    compareSearch2, setCompareSearch2,
    handleCompareSearch,
    handleCompareSelect,
    compareCity1, compareCity2,
    compareHistory
}) => {
    return (
        <div className="fade-in-up">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Comparateur Avancé</h2>
                <p className="subtitle">Analyse comparative en temps réel et historique</p>
            </div>

            {/* Graphique Comparatif */}
            {compareHistory && compareHistory.length > 0 && (
                <div className="bento-card" style={{ marginBottom: '30px', height: '300px' }}>
                    <h3>Historique Comparé (7 Jours - AQI)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={compareHistory} margin={{ left: -20, right: 10 }}>
                            <defs>
                                <linearGradient id="colorCity1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCity2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                            <XAxis dataKey="time" minTickGap={30} tick={{ fill: 'var(--text-secondary)' }} />
                            <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '10px', border: 'none' }} />
                            <Legend verticalAlign="top" height={36} />

                            <Area name={compareCity1.name} type="monotone" dataKey="aqi1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCity1)" strokeWidth={3} />
                            <Area name={compareCity2.name} type="monotone" dataKey="aqi2" stroke="#ef4444" fillOpacity={1} fill="url(#colorCity2)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Recherche */}
            <div style={{ display: 'flex', gap: '20px', margin: '20px auto 40px auto', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '800px' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative', zIndex: 20 }}>
                    <SearchInput
                        value={compareSearch1}
                        onChange={(e) => setCompareSearch1(e.target.value)}
                        onKeyDown={(e) => handleCompareSearch(e, 1)}
                        onSelect={(lat, lon, name) => handleCompareSelect(lat, lon, name, 1)}
                        placeholder="Rechercher ville 1..."
                    />
                </div>
                <div style={{ background: 'var(--text-primary)', color: 'var(--card-bg)', padding: '8px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>VS</div>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative', zIndex: 20 }}>
                    <SearchInput
                        value={compareSearch2}
                        onChange={(e) => setCompareSearch2(e.target.value)}
                        onKeyDown={(e) => handleCompareSearch(e, 2)}
                        onSelect={(lat, lon, name) => handleCompareSelect(lat, lon, name, 2)}
                        placeholder="Rechercher ville 2..."
                    />
                </div>
            </div>

            {/* Cartes Stats (AVEC PM10) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {[compareCity1, compareCity2].map((city, index) => (
                    <div key={index} className="bento-card fade-in-up" style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            <MapPin size={16} />
                            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{city.name}</h3>
                        </div>
                        <div style={{ fontSize: '4.5rem', fontWeight: '900', color: city.aqi > 100 ? '#ef4444' : city.aqi > 50 ? '#f59e0b' : '#10b981', lineHeight: '1' }}>
                            {city.aqi}
                        </div>
                        <p style={{ fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '25px', letterSpacing: '1px' }}>
                            {city.status?.toUpperCase()}
                        </p>
                        <div style={{ textAlign: 'left', marginTop: '20px', background: 'var(--input-bg)', padding: '15px', borderRadius: '12px' }}>
                            <PollutantComparisonBar label="PM2.5" value={city.pm25} max={150} color="#3b82f6" />

                            {/* NOUVEAU PM10 */}
                            <PollutantComparisonBar label="PM10" value={city.pm10} max={150} color="#10b981" />

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