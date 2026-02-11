/* =========================================
   COMPOSANT : MODALE SANTÉ (POP-UP)
   =========================================
   Ce composant est une fenêtre superposée (overlay) qui affiche
   les détails de l'impact sanitaire et les conseils de prévention.
   Elle s'ouvre par-dessus le reste de l'application.
   ========================================= */

import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

const HealthModal = ({ showHealthModal, setShowHealthModal, currentCity }) => {
    // 1. RENDU CONDITIONNEL
    // Si la modale est demandée "fermée" (false), on ne retourne RIEN (null).
    // Cela évite de charger des éléments inutiles dans le DOM.
    if (!showHealthModal) return null;

    return (
        // L'OVERLAY (FOND SOMBRE)
        // On place un écouteur 'onClick' sur le fond : si l'utilisateur clique
        // à côté de la fenêtre, on ferme la modale (UX standard).
        <div className="modal-overlay" onClick={() => setShowHealthModal(false)}>

            {/* LA BOÎTE DE CONTENU (BLANCHE) */}
            {/* IMPORTANT : e.stopPropagation() empêche le "Bubbling".
                Sans ça, un clic DANS la fenêtre serait détecté comme un clic SUR le fond,
                et la fenêtre se fermerait toute seule dès qu'on touche au texte. */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* Bouton de fermeture (Croix) en haut à droite */}
                <button className="close-modal" onClick={() => setShowHealthModal(false)}>
                    <X size={20} />
                </button>

                {/* En-tête avec Icône de bouclier */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <ShieldCheck size={50} color="#2563eb" />
                    <h2 style={{ color: '#1e293b' }}>Impact Santé & Détails</h2>
                </div>

                <h3>Quels sont les risques ?</h3>
                <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                    L'exposition aux particules fines (PM2.5) peut causer des inflammations respiratoires.
                </p>

                {/* BLOC DE RECOMMANDATION DYNAMIQUE */}
                {/* La couleur de la bordure et le texte changent selon le statut de la ville */}
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
                    <h4>Recommandation Actuelle ({currentCity.status})</h4>
                    {/* Opérateur ternaire pour adapter le conseil selon le score AQI */}
                    <p>{currentCity.aqi < 50 ? "Profitez de l'extérieur !" : "Réduisez l'intensité de vos activités."}</p>
                </div>
            </div>
        </div>
    );
};

export default HealthModal;