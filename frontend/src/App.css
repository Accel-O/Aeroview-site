/* =========================================
   1. FONTS & VARIABLES
   ========================================= */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap');

:root {
  /* Scrollbar Colors */
  --scrollbar-track: rgba(255, 255, 255, 0.3);
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);

  /* Glassmorphism */
  --glass-panel: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.8);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);

  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;

  --card-bg: rgba(255, 255, 255, 0.9);
  --sidebar-bg: rgba(255, 255, 255, 0.5);
  --input-bg: rgba(255, 255, 255, 0.5);

  --radius: 24px;
}

body.dark-mode {
  --scrollbar-track: rgba(0, 0, 0, 0.3);
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --glass-panel: rgba(15, 23, 42, 0.85);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);

  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --card-bg: rgba(30, 41, 59, 0.8);
  --sidebar-bg: rgba(15, 23, 42, 0.5);
  --input-bg: rgba(255, 255, 255, 0.1);
}

/* --- SCROLLBAR PERSONNALISÉE --- */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Outfit', sans-serif;
}

body,
html {
  height: 100%;
  overflow-x: hidden;
  color: var(--text-primary);
}

/* --- BACKGROUNDS DYNAMIQUES (AQI) --- */
.app-wrapper {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 1s ease;
}

/* 0-50: Vert */
.aqi-good {
  background: linear-gradient(120deg, #dcfce7 0%, #22c55e 100%);
}

body.dark-mode .aqi-good {
  background: linear-gradient(120deg, #064e3b 0%, #14532d 100%);
}

/* 51-100: Orange */
.aqi-moderate {
  background: linear-gradient(120deg, #ffedd5 0%, #f97316 100%);
}

body.dark-mode .aqi-moderate {
  background: linear-gradient(120deg, #7c2d12 0%, #ea580c 100%);
}

/* 101-150: Rouge */
.aqi-bad {
  background: linear-gradient(120deg, #fee2e2 0%, #ef4444 100%);
}

body.dark-mode .aqi-bad {
  background: linear-gradient(120deg, #7f1d1d 0%, #b91c1c 100%);
}

/* 151-200: Violet */
.aqi-very-bad {
  background: linear-gradient(120deg, #f3e8ff 0%, #a855f7 100%);
}

body.dark-mode .aqi-very-bad {
  background: linear-gradient(120deg, #581c87 0%, #7e22ce 100%);
}

/* 201+: Marron */
.aqi-hazardous {
  background: linear-gradient(120deg, #fef3c7 0%, #78350f 100%);
}

body.dark-mode .aqi-hazardous {
  background: linear-gradient(120deg, #451a03 0%, #92400e 100%);
}


/* =========================================
   2. LAYOUT BUREAU (LE CADRE EN VERRE)
   ========================================= */
.glass-dashboard {
  background: var(--glass-panel);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--glass-shadow);
  width: 100%;
  max-width: 1400px;
  height: 92vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  overflow: hidden;
}

/* --- SIDEBAR --- */
.sidebar {
  padding: 30px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  background: var(--sidebar-bg);
  z-index: 10;
  height: 100%;
}

.sidebar .scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  margin: 20px 0;
}

.brand {
  font-size: 1.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 12px 15px;
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.menu-btn.active {
  background: var(--text-primary);
  color: var(--glass-panel);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* --- CONTENU & FIX OVERFLOW --- */
.main-content {
  padding: 40px;
  overflow-y: auto;
  position: relative;
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fix: Empêche les éléments de sortir de leur carte */
.bento-card {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--glass-border);
  transition: transform 0.3s ease;
  overflow: hidden;
  /* COUPE CE QUI DÉPASSE */
  min-width: 0;
  /* Important pour les grids */
}

.bento-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.bento-card:hover {
  transform: translateY(-2px);
}

/* Fix Tables & Graphs */
.recharts-responsive-container {
  min-width: 0;
}

table {
  width: 100%;
  table-layout: fixed;
}

td,
th {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.bento-card.map-container {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  padding: 0;
  overflow: hidden;
  height: 500px;
  position: relative;
}

.leaflet-container {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.score-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.big-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 10px;
  margin-top: 20px;
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: var(--card-bg);
  width: 600px;
  max-width: 90%;
  border-radius: 24px;
  padding: 40px;
  position: relative;
  color: var(--text-primary);
}

.close-modal {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--input-bg);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-primary);
}

/* Loader Animation pour la recherche */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.spin-animation {
  animation: spin 1s linear infinite;
}

/* =========================================
   3. GESTION DES ÉLÉMENTS MOBILES/DESKTOP
   ========================================= */

/* Par défaut (PC), on cache les trucs mobiles */
.mobile-only-btn {
  display: none !important;
}

.mobile-menu-overlay {
  display: none;
}

/* =========================================
   4. RESPONSIVE MOBILE (< 768px)
   ========================================= */
@media (max-width: 768px) {

  .app-wrapper {
    padding: 0;
    align-items: flex-start;
  }

  .glass-dashboard {
    height: 100vh;
    border-radius: 0;
    border: none;
    display: flex;
    flex-direction: column;
  }

  /* --- SIDEBAR (Barre du bas) --- */
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px !important;
    background: var(--card-bg);
    border-top: 1px solid var(--glass-border);
    padding: 0;
    margin: 0;
    z-index: 9999;
    flex-direction: row;
    justify-content: center;
  }

  /* On cache le Logo, le Footer, et le contenu Desktop dans la barre du bas */
  .brand {
    display: none !important;
  }

  .desktop-footer {
    display: none !important;
  }

  .desktop-only-content {
    display: none !important;
  }

  /* Reset du conteneur scrollable pour qu'il prenne toute la largeur */
  .sidebar .scrollable-content {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Menu horizontal */
  .menu {
    flex-direction: row !important;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    gap: 0;
  }

  /* Boutons du menu : Icônes seules */
  .menu-btn {
    flex-direction: column;
    padding: 10px;
    font-size: 0;
    gap: 0;
    border-radius: 50%;
    background: transparent !important;
    color: var(--text-muted);
    width: auto;
    height: auto;
  }

  .menu-btn.active {
    color: #2563eb;
    transform: translateY(-3px);
  }

  .menu-btn.active::after {
    content: '';
    display: block;
    width: 4px;
    height: 4px;
    background: #2563eb;
    border-radius: 50%;
    margin-top: 4px;
  }

  .menu-btn svg {
    width: 24px;
    height: 24px;
  }

  /* Affiche le bouton Menu Hamburger */
  .mobile-only-btn {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  /* --- CONTENU --- */
  .main-content {
    flex: 1;
    padding: 15px;
    padding-bottom: 90px;
    overflow-y: auto;
  }

  /* Header Mobile */
  .header-section {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }

  .header-section>div:first-child {
    width: 100% !important;
    max-width: 100% !important;
  }

  .big-title {
    font-size: 2.5rem;
    text-align: left;
  }

  /* Grilles 1 colonne */
  .bento-grid {
    grid-template-columns: 1fr;
  }

  .pollutant-grid {
    grid-template-columns: 1fr !important;
  }

  .bento-card.map-container {
    height: 250px;
    grid-column: auto;
  }

  /* --- OVERLAY MENU MOBILE (Le menu qui s'ouvre) --- */
  /* --- OVERLAY MENU MOBILE (Le menu qui s'ouvre) --- */
  .mobile-menu-overlay {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    /* MODIFICATION ICI : Fond "Compact" (Verre opaque) au lieu du gradient */
    background: var(--glass-panel);
    backdrop-filter: blur(50px);
    /* Gros flou pour cacher le fond */
    -webkit-backdrop-filter: blur(50px);

    z-index: 10000;
    padding: 20px;
    padding-bottom: 90px;
    overflow-y: auto;
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .mobile-menu-header h3 {
    font-size: 1.8rem;
    font-weight: 900;
  }

  .mobile-menu-content {
    animation: fadeInUp 0.4s ease-out;
  }
}