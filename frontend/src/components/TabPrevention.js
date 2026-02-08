import React from 'react';
import { AlertTriangle, UserCheck, HeartPulse } from 'lucide-react';
import { PREVENTION_TIPS } from '../data/constants';

const TabPrevention = ({ currentCity, userProfile }) => {

    // LOGIQUE DE FILTRAGE DES CARTES
    let displayTips = Object.entries(PREVENTION_TIPS); // Par défaut : tout

    if (userProfile?.sporty) {
        // Si sportif : On garde SEULEMENT "conducteurs" et "pietons" (sport), on vire "autres" (maison)
        displayTips = displayTips.filter(([key]) => key !== 'autres');
    }
    else if (userProfile?.sensitive) {
        // Si sensible : On met "autres" (Santé/Maison) en PREMIER
        const sante = displayTips.find(([key]) => key === 'autres');
        const reste = displayTips.filter(([key]) => key !== 'autres');
        displayTips = [sante, ...reste];
    }

    // ALERTE DYNAMIQUE
    const getAlert = () => {
        if (userProfile?.sensitive && currentCity.aqi > 50) {
            return { color: '#ef4444', icon: <HeartPulse size={24} />, title: "Attention (Sensible)", msg: "Air moyen ou mauvais. Gardez votre traitement sur vous." };
        }
        if (userProfile?.sporty && currentCity.aqi > 100) {
            return { color: '#f59e0b', icon: <UserCheck size={24} />, title: "Stop Sport", msg: "Air mauvais. Évitez tout effort intense dehors." };
        }
        return null;
    };

    const alert = getAlert();

    return (
        <div className="fade-in-up">
            <div style={{ marginBottom: '30px' }}>
                <h2>Conseils {userProfile.sporty ? "Sportifs" : userProfile.sensitive ? "Santé" : "Généraux"}</h2>
                <p className="subtitle">Adaptés à votre profil pour <strong>{currentCity.name}</strong></p>
            </div>

            {/* Alerte Profil */}
            {alert && (
                <div style={{ background: 'white', borderLeft: `5px solid ${alert.color}`, padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: alert.color }}>{alert.icon}</div>
                    <div>
                        <h4 style={{ margin: 0, color: '#1e293b' }}>{alert.title}</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{alert.msg}</p>
                    </div>
                </div>
            )}

            {/* Alerte Globale */}
            <div style={{ background: currentCity.aqi > 100 ? '#fef2f2' : '#f0fdf4', borderLeft: `5px solid ${currentCity.aqi > 100 ? '#ef4444' : '#10b981'}`, padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <AlertTriangle color={currentCity.aqi > 100 ? '#ef4444' : '#10b981'} size={28} />
                <div>
                    <h4 style={{ margin: 0, color: '#1e293b' }}>Note globale</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                        {currentCity.aqi > 100 ? "Qualité dégradée." : "Conditions favorables."}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {displayTips.map(([key, category]) => (
                    <div key={key} className="bento-card" style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: category.color }}>
                            {category.icon}
                            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{category.title}</h3>
                        </div>
                        <ul style={{ padding: 0, listStyle: 'none' }}>
                            {category.tips.map((tip, i) => (
                                <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
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