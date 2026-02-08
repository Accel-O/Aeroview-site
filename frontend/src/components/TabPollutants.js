import React from 'react';
import { AQI_SCALE, POLLUTANTS_DATA } from '../data/constants';

const TabPollutants = () => {
    return (
        <div className="fade-in-up">
            <h2>Polluants Majeurs</h2>
            <p className="subtitle" style={{ marginBottom: '30px' }}>Comprendre les indices et les substances nocives.</p>

            {/* Tableau AQI */}
            <div className="bento-card" style={{ marginBottom: '40px', padding: '25px', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Échelle AQI</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '12px', color: '#64748b' }}>Valeur</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Niveau</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Santé</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AQI_SCALE.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.range}</td>
                                <td style={{ padding: '15px' }}><span style={{ background: item.color, color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{item.level}</span></td>
                                <td style={{ padding: '15px', color: '#475569', fontSize: '0.9rem' }}>{item.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cartes Polluants */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {POLLUTANTS_DATA.map((pollutant, index) => (
                    <div key={index} className="bento-card" style={{ padding: '25px' }}>
                        <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>{pollutant.name}</h3>
                        <div style={{ marginBottom: '10px' }}><strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Forme:</strong><p style={{ color: 'var(--text-secondary)' }}>{pollutant.form}</p></div>
                        <div style={{ marginBottom: '10px' }}><strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Source:</strong><p style={{ color: 'var(--text-secondary)' }}>{pollutant.source}</p></div>
                        <div style={{ marginBottom: '20px' }}><strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Effets:</strong><p style={{ color: 'var(--text-secondary)' }}>{pollutant.effects}</p></div>
                        <a href={pollutant.wikiLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 'bold' }}>En savoir plus →</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabPollutants;