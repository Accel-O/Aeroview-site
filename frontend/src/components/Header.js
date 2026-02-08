import React from 'react';
import { Locate, Heart } from 'lucide-react'; // On importe le cœur
import SearchInput from './SearchInput';

const Header = ({
    currentCity, searchText, setSearchText, handleSearch, handleLocateMe, onCitySelect,
    toggleFavorite, isFavorite // <-- Nouveaux props
}) => {
    return (
        <header className="header-section fade-in-up">
            <div>
                <div style={{ maxWidth: '300px', marginBottom: '15px', position: 'relative', zIndex: 100 }}>
                    <SearchInput
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSelect={onCitySelect}
                        placeholder="Ville + Entrée..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button
                        onClick={handleLocateMe}
                        className="locate-btn"
                        title="Me localiser"
                        style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', color: '#2563eb' }}
                    >
                        <Locate size={20} />
                    </button>

                    {/* --- BOUTON FAVORIS --- */}
                    <button
                        onClick={toggleFavorite}
                        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        style={{
                            background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            color: isFavorite ? '#ef4444' : '#94a3b8', // Rouge si actif, gris sinon
                            transition: 'all 0.2s'
                        }}
                    >
                        <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} />
                    </button>
                </div>

                <h1 className="big-title">{currentCity.name}</h1>
                <p className="subtitle">Données en temps réel • {new Date().toLocaleDateString()}</p>
            </div>

            <div className="aqi-badge" style={{
                background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '50px', fontWeight: '800', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                color: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981'
            }}>
                {currentCity.status.toUpperCase()}
            </div>
        </header>
    );
};

export default Header;