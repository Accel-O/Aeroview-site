import React from 'react';
import { Activity, MapPin, ShieldCheck } from 'lucide-react';

// --- SEUILS AQI ---
export const AQI_SCALE = [
    { range: "0 - 50", level: "Bon", color: "#10b981", desc: "Qualité de l'air satisfaisante, peu ou pas de risque." },
    { range: "51 - 100", level: "Modéré", color: "#f59e0b", desc: "Qualité acceptable ; risque modéré pour les personnes sensibles." },
    { range: "101 - 150", level: "Mauvais", color: "#ef4444", desc: "Les groupes sensibles peuvent ressentir des effets sur la santé." },
    { range: "151 - 200", level: "Très Mauvais", color: "#9333ea", desc: "Tout le monde peut ressentir des effets sur la santé." },
    { range: "201+", level: "Dangereux", color: "#7f1d1d", desc: "Alerte sanitaire : les risques sont sérieux pour tous." }
];

// --- DONNÉES POLLUANTS ---
export const POLLUTANTS_DATA = [
    {
        name: "PM2.5 (Particules fines)",
        form: "Minuscules particules solides ou liquides en suspension dans l'air (diamètre < 2.5 µm).",
        source: "Combustion industrielle et domestique (chauffage au bois, charbon), trafic routier (pneus, freins) et feux de forêt.",
        effects: "Pénètrent profondément dans les poumons et la circulation sanguine. Provoquent des problèmes respiratoires (asthme, bronchite), cardiovasculaires et augmentent le risque de cancer du poumon.",
        wikiLink: "https://fr.wikipedia.org/wiki/Particules_en_suspension"
    },
    {
        name: "PM10 (Grosses particules)",
        form: "Particules solides ou liquides en suspension (diamètre < 10 µm).",
        source: "Poussières du désert, construction, agriculture, et émissions industrielles ou du trafic routier moins fines.",
        effects: "Peuvent atteindre les voies respiratoires supérieures. Provoquent irritation des yeux, du nez, de la gorge et exacerbation des symptômes chez les asthmatiques.",
        wikiLink: "https://fr.wikipedia.org/wiki/Particules_en_suspension"
    },
    {
        name: "NO2 (Dioxyde d'azote)",
        form: "Gaz irritant de couleur rouge-brun. Principalement émis par la combustion de carburants fossiles.",
        source: "Trafic routier (moteurs diesel et essence), centrales électriques et installations industrielles.",
        effects: "Réduit la fonction pulmonaire, augmente la réactivité bronchique et la sensibilité aux infections respiratoires, en particulier chez les enfants et les personnes asthmatiques.",
        wikiLink: "https://fr.wikipedia.org/wiki/Dioxyde_d%27azote"
    },
    {
        name: "O3 (Ozone)",
        form: "Gaz incolore et inodore, formé par réaction chimique des polluants en présence de soleil et de chaleur.",
        source: "Pollluant secondaire. Formé à partir de précurseurs (NOx et COV) émis par l'industrie, le trafic routier et les solvants.",
        effects: "Irritant pour les voies respiratoires. Peut provoquer toux, douleurs thoraciques, essoufflement, et aggravation de l'asthme et des maladies pulmonaires chroniques.",
        wikiLink: "https://fr.wikipedia.org/wiki/Ozone"
    }
];

// --- CONSEILS PRÉVENTION ---
export const PREVENTION_TIPS = {
    conducteurs: {
        title: "Conducteurs",
        icon: <Activity size={24} />,
        color: "#3b82f6",
        tips: [
            "Privilégiez le recyclage de l'air intérieur dans les tunnels ou les bouchons.",
            "Vérifiez et remplacez régulièrement votre filtre d'habitacle (filtre à pollen/charbon actif).",
            "Adoptez l'éco-conduite pour réduire vos propres émissions de NO2.",
            "Évitez de laisser tourner le moteur à l'arrêt, surtout devant les écoles."
        ]
    },
    pietons: {
        title: "Piétons & Sportifs",
        icon: <MapPin size={24} />,
        color: "#10b981",
        tips: [
            "Privilégiez les rues peu circulées et les parcs pour vos trajets à pied.",
            "En cas de pic de pollution, évitez les activités sportives intenses en extérieur.",
            "Le matin tôt est souvent le moment où l'air est le plus sain en ville (hors hiver).",
            "Éloignez-vous du bord de la chaussée : la concentration de polluants y est maximale."
        ]
    },
    autres: {
        title: "Habitation & Santé",
        icon: <ShieldCheck size={24} />,
        color: "#f59e0b",
        tips: [
            "Aérez votre logement au moins 10 min par jour, de préférence avant 8h ou après 20h.",
            "Évitez les bougies, l'encens et les produits d'entretien chimiques lors des alertes.",
            "Les personnes vulnérables (enfants, seniors) doivent limiter les sorties prolongées.",
            "Maintenez une hydratation régulière pour aider vos muqueuses respiratoires."
        ]
    }
};

// --- DONNÉES VILLES PAR DÉFAUT ---
export const WORLD_DATA = {
    France: {
        center: [46.603354, 1.888334],
        zoom: 6,
        cities: [
            { name: 'Paris', lat: 48.8566, lng: 2.3522, aqi: 42, pm25: 12, pm10: 33, no2: 25, o3: 30, status: 'Bon' },
            { name: 'Lyon', lat: 45.7640, lng: 4.8357, aqi: 85, pm25: 35, pm10: 15, no2: 40, o3: 45, status: 'Modéré' },
            { name: 'Marseille', lat: 43.2965, lng: 5.3698, aqi: 110, pm25: 55, pm10: 19, no2: 50, o3: 60, status: 'Mauvais' }
        ]
    },
    Chine: {
        center: [35.8617, 104.1954],
        zoom: 4,
        cities: [
            { name: 'Beijing', lat: 39.9042, lng: 116.4074, aqi: 165, pm25: 120, no2: 80, o3: 50, status: 'Dangereux' },
            { name: 'Shanghai', lat: 31.2304, lng: 121.4737, aqi: 140, pm25: 90, no2: 70, o3: 40, status: 'Mauvais' }
        ]
    },
    USA: {
        center: [37.0902, -95.7129],
        zoom: 4,
        cities: [
            { name: 'New York', lat: 40.7128, lng: -74.0060, aqi: 35, pm25: 8, no2: 20, o3: 25, status: 'Bon' },
            { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, aqi: 95, pm25: 40, no2: 55, o3: 60, status: 'Modéré' }
        ]
    }
};