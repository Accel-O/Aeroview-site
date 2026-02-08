import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, onSelect, placeholder }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Fermer la liste si on clique ailleurs
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Fonction pour récupérer les suggestions
    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`);
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Erreur autocomplete:", error);
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(e); // Mise à jour du parent
        fetchSuggestions(val); // Appel API
    };

    const handleSelect = (place) => {
        // On construit le nom : Ville, Pays
        const name = place.address.city || place.address.town || place.address.village || place.display_name.split(',')[0];
        onSelect(place.lat, place.lon, name); // On renvoie les infos au parent
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.5)',
                padding: '8px 15px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.8)',
                width: '100%'
            }}>
                <Search size={18} color="#64748b" style={{ marginRight: '10px' }} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    // On garde onKeyDown pour "Entrée" si l'utilisateur ne clique pas
                    onKeyDown={(e) => { if (e.key === 'Enter') setShowSuggestions(false); }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        color: '#1e293b',
                        fontWeight: '500'
                    }}
                />
            </div>

            {/* LISTE DES SUGGESTIONS */}
            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                }}>
                    {suggestions.map((place, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(place)}
                            style={{
                                padding: '12px 15px',
                                cursor: 'pointer',
                                borderBottom: index !== suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                                fontSize: '0.9rem',
                                color: '#334155',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                            <strong>{place.address.city || place.address.town || place.display_name.split(',')[0]}</strong>
                            <br />
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{place.display_name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchInput;