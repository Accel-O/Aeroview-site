import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

const SearchInput = ({ value, onChange, onSelect, placeholder }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // --- LOGIQUE DE RECHERCHE ---
    useEffect(() => {
        if (value.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        // On garde le délai de 300ms (Debounce), c'est ça qui garde la recherche fluide !
        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                // MODIFICATION ICI : J'ai retiré "&countrycodes=fr"
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=10`,
                    { signal }
                );

                const data = await response.json();

                // FILTRE ANTI-DOUBLONS (Adapté pour le monde)
                // On vérifie le duo "Ville + Pays" pour ne pas supprimer Paris (USA) si on a déjà Paris (France)
                const uniqueCities = [];
                const seenNames = new Set();

                data.forEach((place) => {
                    const city = place.address.city || place.address.town || place.address.village || place.display_name.split(',')[0];
                    const country = place.address.country || "";

                    // On crée une clé unique "Ville-Pays"
                    const uniqueKey = `${city}-${country}`;

                    if (city && !seenNames.has(uniqueKey)) {
                        seenNames.add(uniqueKey);
                        uniqueCities.push(place);
                    }
                });

                setSuggestions(uniqueCities.slice(0, 5));
                setShowSuggestions(true);

            } catch (error) {
                if (error.name !== 'AbortError') console.error("Erreur:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [value]);

    const handleChange = (e) => onChange(e);

    const handleSelect = (place) => {
        const name = place.address.city || place.address.town || place.address.village || place.display_name.split(',')[0];
        onSelect(place.lat, place.lon, name);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{
                display: 'flex', alignItems: 'center', background: 'var(--input-bg)',
                padding: '8px 15px', borderRadius: '50px', border: '1px solid var(--glass-border)', width: '100%'
            }}>
                {isLoading ? (
                    <Loader2 size={18} className="spin-animation" color="var(--text-muted)" style={{ marginRight: '10px' }} />
                ) : (
                    <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                )}

                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={(e) => { if (e.key === 'Enter') setShowSuggestions(false); }}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-primary)', fontWeight: '500' }}
                />
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute', top: '110%', left: 0, right: 0,
                    background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    zIndex: 1000, overflow: 'hidden', border: '1px solid var(--glass-border)'
                }}>
                    {suggestions.map((place, index) => {
                        const displayName = place.address.city || place.address.town || place.address.village || place.display_name.split(',')[0];
                        // MODIFICATION ICI : On affiche le PAYS
                        const context = place.address.country || "";

                        return (
                            <div
                                key={index}
                                onClick={() => handleSelect(place)}
                                style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <strong>{displayName}</strong>
                                {/* Affichage du pays en petit à côté */}
                                {context && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '10px', fontStyle: 'italic' }}>{context}</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchInput;