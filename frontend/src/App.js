import React from 'react';
import './App.css'; // Garder l'import du CSS

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <h1>Application de suivi de la qualité de l'air</h1>
        
        <p className="subtitle">
          Projet tutoré ESIEE PARIS
        </p>

        <div className="content-section">
          <h2>Contexte et Problématique</h2>
          <p>
            La qualité de l'air est un enjeu environnemental et sanitaire majeur. Le grand public a peu d'accès à une information claire, centralisée et actualisée sur la qualité de l'air dans sa région, malgré l'existence de nombreuses données ouvertes (open data).
          </p>
        </div>

        <div className="content-section">
          <h2>Objectifs du Projet</h2>
          <p>
            Ce projet vise à concevoir une application web complète permettant d'afficher, filtrer et visualiser les données sur la qualité de l'air en France ou à l'international.
          </p>
          <ul>
            <li>Informer les utilisateurs sur la qualité de l'air en temps réel dans leur ville ou région.</li>
            <li>Présenter les informations de manière visuelle et interactive (graphiques, cartes, tableaux clairs).</li>
            <li>Sensibiliser les citoyens à l'impact de la pollution atmosphérique sur la santé.</li>
          </ul>
        </div>
        
        <p>
          **Statut actuel :** Développement en cours. Données en temps réel non fonctionnelles pour l'instant.
        </p>
        
      </header>
    </div>
  );
}

export default App;