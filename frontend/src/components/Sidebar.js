import React, { useState } from 'react';
import {
    Activity, BarChart2, Info, Leaf, Calendar,
    Heart, Moon, Sun, UserCheck, HeartPulse,
    ChevronDown, ChevronRight, Menu, X // Ajout de Menu et X
} from 'lucide-react';

const Sidebar = ({
    activeTab, setActiveTab,
    favorites, onFavoriteClick,
    darkMode, toggleDarkMode,
    userProfile, toggleProfile
}) => {

    const [isFavOpen, setIsFavOpen] = useState(false);

    // NOUVEAU : État pour le menu mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="sidebar">

                {/* HEADER (Desktop uniquement) */}
                <div className="brand" style={{ marginBottom: '30px', flexShrink: 0 }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    <span style={{ color: 'var(--text-primary)' }}>AeroView</span>
                </div>

                {/* CONTENU SCROLLABLE */}
                <div className="scrollable-content">

                    {/* MENU NAVIGATION */}
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

                        {/* NOUVEAU BOUTON MENU (MOBILE UNIQUEMENT via CSS) */}
                        <button className="menu-btn mobile-only-btn" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={20} /> Menu
                        </button>
                    </div>

                    {/* --- SECTION DESKTOP (Cachée sur mobile par CSS existant) --- */}
                    <div className="desktop-only-content">
                        {/* PROFIL SANTÉ */}
                        <div style={{ marginTop: '25px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', display: 'block' }}>
                                Mon Profil
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => toggleProfile('sensitive')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '10px', borderRadius: '12px', border: userProfile.sensitive ? '2px solid #ef4444' : '1px solid var(--glass-border)', background: userProfile.sensitive ? 'rgba(239, 68, 68, 0.1)' : 'var(--card-bg)', color: userProfile.sensitive ? '#ef4444' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    <HeartPulse size={20} /> Sensible
                                </button>
                                <button onClick={() => toggleProfile('sporty')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '10px', borderRadius: '12px', border: userProfile.sporty ? '2px solid #3b82f6' : '1px solid var(--glass-border)', background: userProfile.sporty ? 'rgba(59, 130, 246, 0.1)' : 'var(--card-bg)', color: userProfile.sporty ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    <UserCheck size={20} /> Sportif
                                </button>
                            </div>
                        </div>

                        {/* FAVORIS */}
                        {favorites && favorites.length > 0 && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                                <button onClick={() => setIsFavOpen(!isFavOpen)} style={{ background: 'transparent', border: 'none', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '5px 0', marginBottom: '5px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer' }}>Mes Favoris ({favorites.length})</label>
                                    {isFavOpen ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                                </button>
                                {isFavOpen && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '5px', animation: 'fadeIn 0.3s' }}>
                                        {favorites.map((city, idx) => (
                                            <button key={idx} onClick={() => onFavoriteClick(city)} style={{ background: 'transparent', border: 'none', padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '0.9rem', color: 'var(--text-secondary)', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <Heart size={14} fill="#ef4444" color="#ef4444" />
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER (Desktop uniquement) */}
                <div className="desktop-footer" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', flexShrink: 0 }}>
                    <button onClick={toggleDarkMode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />} {darkMode ? "Clair" : "Sombre"}
                    </button>
                </div>
            </nav>

            {/* --- NOUVEAU : MENU MOBILE (OVERLAY) --- */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay fade-in-up">
                    <div className="mobile-menu-header">
                        <h3>Menu & Paramètres</h3>
                        <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                            <X size={28} />
                        </button>
                    </div>

                    <div className="mobile-menu-content">
                        {/* 1. PROFILS */}
                        <div className="bento-card" style={{ marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '15px' }}>Mon Profil Santé</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => toggleProfile('sensitive')} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: userProfile.sensitive ? '2px solid #ef4444' : '1px solid var(--glass-border)', background: userProfile.sensitive ? 'rgba(239, 68, 68, 0.1)' : 'var(--card-bg)', color: userProfile.sensitive ? '#ef4444' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <HeartPulse size={24} /> Sensible
                                </button>
                                <button onClick={() => toggleProfile('sporty')} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: userProfile.sporty ? '2px solid #3b82f6' : '1px solid var(--glass-border)', background: userProfile.sporty ? 'rgba(59, 130, 246, 0.1)' : 'var(--card-bg)', color: userProfile.sporty ? '#3b82f6' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <UserCheck size={24} /> Sportif
                                </button>
                            </div>
                        </div>

                        {/* 2. FAVORIS */}
                        <div className="bento-card" style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                            <h4 style={{ marginBottom: '15px' }}>Mes Favoris</h4>
                            {favorites.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucun favori enregistré.</p>
                            ) : (
                                favorites.map((city, idx) => (
                                    <button key={idx} onClick={() => { onFavoriteClick(city); setIsMobileMenuOpen(false); }} style={{ width: '100%', padding: '15px', marginBottom: '10px', background: 'var(--input-bg)', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                        <Heart size={20} fill="#ef4444" color="#ef4444" />
                                        {city.name}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* 3. MODE SOMBRE */}
                        <button onClick={toggleDarkMode} style={{ width: '100%', padding: '20px', borderRadius: '18px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                            {darkMode ? "Passer en Mode Clair" : "Passer en Mode Sombre"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;