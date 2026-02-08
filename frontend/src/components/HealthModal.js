import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

const HealthModal = ({ showHealthModal, setShowHealthModal, currentCity }) => {
    if (!showHealthModal) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowHealthModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setShowHealthModal(false)}>
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <ShieldCheck size={50} color="#2563eb" />
                    <h2 style={{ color: '#1e293b' }}>Impact Santé & Détails</h2>
                </div>

                <h3>Quels sont les risques ?</h3>
                <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                    L'exposition aux particules fines (PM2.5) peut causer des inflammations respiratoires.
                </p>

                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
                    <h4>Recommandation Actuelle ({currentCity.status})</h4>
                    <p>{currentCity.aqi < 50 ? "Profitez de l'extérieur !" : "Réduisez l'intensité de vos activités."}</p>
                </div>
            </div>
        </div>
    );
};

// VERIFIE BIEN CETTE LIGNE
export default HealthModal;