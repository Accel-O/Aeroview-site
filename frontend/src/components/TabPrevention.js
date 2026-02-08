import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PREVENTION_TIPS } from '../data/constants';

const TabPrevention = ({ currentCity }) => {
    return (
        <div className="fade-in-up">
            <div style={{ marginBottom: '30px' }}>
                <h2>Conseils de Prévention</h2>
                <p className="subtitle">Mesures pour <strong>{currentCity.name}</strong> (AQI: {currentCity.aqi})</p>
            </div>

            <div style={{ background: currentCity.aqi > 100 ? '#fef2f2' : '#f0fdf4', borderLeft: `5px solid ${currentCity.aqi > 100 ? '#ef4444' : '#10b981'}`, padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <AlertTriangle color={currentCity.aqi > 100 ? '#ef4444' : '#10b981'} size={28} />
                <div>
                    <h4 style={{ margin: 0, color: '#1e293b' }}>Note globale</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                        {currentCity.aqi > 100 ? "Qualité dégradée. Suivez les conseils." : "Conditions favorables."}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {Object.entries(PREVENTION_TIPS).map(([key, category]) => (
                    <div key={key} className="bento-card" style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: category.color }}>
                            {category.icon}
                            <h3 style={{ margin: 0, color: '#1e293b' }}>{category.title}</h3>
                        </div>
                        <ul style={{ padding: 0, listStyle: 'none' }}>
                            {category.tips.map((tip, i) => (
                                <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontSize: '0.95rem', color: '#475569' }}>
                                    <div style={{ minWidth: '6px', height: '6px', borderRadius: '50%', background: category.color, marginTop: '7px' }} />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabPrevention;