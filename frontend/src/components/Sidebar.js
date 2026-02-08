import React from 'react';
import { Wind, Activity, BarChart2, Info, Leaf, Calendar, Heart, Moon, Sun, UserCheck, HeartPulse } from 'lucide-react';

const Sidebar = ({
    activeTab, setActiveTab, setCurrentCity,
    favorites, onFavoriteClick,
    darkMode, toggleDarkMode,
    userProfile, toggleProfile
}) => {
    return (
        <nav className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* 1. HEADER FIXE */}
            <div className="brand" style={{ marginBottom: '30px', flexShrink: 0 }}>
                <Wind size={32} color="var(--text-primary)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                <span style={{ color: 'var(--text-primary)' }}>AeroView</span>
            </div>

            {/* 2. ZONE DE SCROLL (Menu + Profils + Favoris) */}
            <div className="scrollable-content" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>

                {/* MENU */}
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

                {/* PROFIL SANTÉ (Type "Radio Button") */}
                <div style={{ marginTop: '25px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', display: 'block' }}>
                        Mon Profil
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => toggleProfile('sensitive')}
                            style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                padding: '10px', borderRadius: '12px',
                                border: userProfile.sensitive ? '2px solid #ef4444' : '1px solid var(--glass-border)',
                                background: userProfile.sensitive ? 'rgba(239, 68, 68, 0.1)' : 'var(--card-bg)',
                                color: userProfile.sensitive ? '#ef4444' : 'var(--text-secondary)',
                                cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 'bold'
                            }}
                        >
                            <HeartPulse size={20} />
                            Sensible
                        </button>

                        <button
                            onClick={() => toggleProfile('sporty')}
                            style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                padding: '10px', borderRadius: '12px',
                                border: userProfile.sporty ? '2px solid #3b82f6' : '1px solid var(--glass-border)',
                                background: userProfile.sporty ? 'rgba(59, 130, 246, 0.1)' : 'var(--card-bg)',
                                color: userProfile.sporty ? '#3b82f6' : 'var(--text-secondary)',
                                cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 'bold'
                            }}
                        >
                            <UserCheck size={20} />
                            Sportif
                        </button>
                    </div>
                </div>

                {/* FAVORIS */}
                {favorites && favorites.length > 0 && (
                    <div style={{ marginTop: '25px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', display: 'block' }}>
                            Favoris
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {favorites.map((city, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onFavoriteClick(city)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '8px 10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
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
            </div>

            {/* 3. FOOTER FIXE (Dark Mode) */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', flexShrink: 0 }}>
                <button
                    onClick={toggleDarkMode}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                        background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold', width: '100%'
                    }}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    {darkMode ? "Clair" : "Sombre"}
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;