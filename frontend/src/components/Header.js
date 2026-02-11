/* =========================================
   COMPOSANT : HEADER
   =========================================
   Rôle : Barre supérieure de l'application.
   Elle regroupe la navigation principale : recherche de ville, 
   géolocalisation GPS et gestion des favoris.
   Elle affiche aussi le statut global de la ville (Bon/Mauvais).
   ========================================= */

import React from 'react';
// On utilise 'lucide-react' pour des icônes vectorielles légères et modernes
import { Locate, Heart } from 'lucide-react';
import SearchInput from './SearchInput';

const Header = ({
    currentCity, searchText, setSearchText, handleSearch, handleLocateMe, onCitySelect,
    toggleFavorite, isFavorite
}) => {
    // Ce composant est "stateless" (sans état interne complexe), 
    // il reçoit toutes les données et fonctions depuis App.js via les props.

    return (
        <header className="header-section fade-in-up">

            {/* --- BLOC GAUCHE : RECHERCHE & ACTIONS --- */}
            {/* On utilise Flexbox en colonne pour empiler la barre de recherche au-dessus du titre de la ville */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '500px' }}>

                {/* LIGNE DE NAVIGATION : Input + Boutons GPS/Favoris alignés horizontalement */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>

                    {/* 1. BARRE DE RECHERCHE */}
                    {/* On lui donne 'flex: 1' pour qu'elle prenne tout l'espace disponible restant */}
                    <div style={{ flex: 1, position: 'relative', zIndex: 100 }}>
                        <SearchInput
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSelect={onCitySelect}
                            placeholder="Ville (France)..." // Par défaut on guide l'utilisateur vers la France
                        />
                    </div>

                    {/* 2. BOUTON GÉOLOCALISATION */}
                    {/* Appelle l'API navigateur navigator.geolocation via la fonction handleLocateMe */}
                    <button
                        onClick={handleLocateMe}
                        title="Me localiser"
                        style={{
                            background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%',
                            width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#2563eb', flexShrink: 0
                        }}
                    >
                        <Locate size={20} />
                    </button>

                    {/* 3. BOUTON FAVORIS */}
                    {/* L'icône change (remplie/vide) et la couleur passe au rouge si la ville est déjà en favori */}
                    <button
                        onClick={toggleFavorite}
                        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        style={{
                            background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%',
                            width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: isFavorite ? '#ef4444' : 'var(--text-muted)', flexShrink: 0
                        }}
                    >
                        <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} />
                    </button>
                </div>

                {/* TITRE DE LA VILLE & DATE */}
                <div>
                    <h1 className="big-title">{currentCity.name}</h1>
                    <p className="subtitle">Données en temps réel • {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* --- BLOC DROIT : BADGE DE QUALITÉ (AQI) --- */}
            {/* Affichage visuel rapide du statut (Bon, Moyen, Mauvais...) */}
            <div className="aqi-badge" style={{
                background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '50px', fontWeight: '800', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                // Logique conditionnelle pour changer la couleur du texte selon la pollution
                color: currentCity.aqi > 100 ? '#ef4444' : currentCity.aqi > 50 ? '#f59e0b' : '#10b981',
                alignSelf: 'flex-start', marginTop: '10px'
            }}>
                {currentCity.status.toUpperCase()}
            </div>
        </header>
    );
};

export default Header;