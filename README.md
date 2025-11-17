📍 ParkSpot Paris

**Trouver une place de stationnement libre, fiable et en temps réel — partout en Île-de-France**

ParkSpot Paris est une application innovante permettant aux conducteurs de localiser rapidement les places de stationnement **gratuites ou payantes** disponibles autour d’eux, jusqu’à **20 km** de rayon, avec :

* disponibilité en **temps réel**,
* **guidage GPS** jusqu’au parking choisi,
* **précision de localisation élevée**,
* **mise à jour automatique** avant l’arrivée pour éviter les mauvaises surprises (place occupée avant d’arriver),
* visualisation sur **carte interactive** (satellite / standard).

Ce projet vise à simplifier la vie des automobilistes en zone dense en combinant **géolocalisation**, **sources de données dynamiques**, **prédiction**, et **mise à jour automatique** via un système fiable de suivi.


## 🚀 Fonctionnalités principales

✔️ Recherche de places disponibles en temps réel

* Filtre par **gratuit / payant**, zone, arrondissement.
* Recherche autour de soi ou le long d’un **itinéraire**.
* Rayon réglable jusqu’à **20 km**.
* Score de fiabilité indiquant la probabilité que la place soit réellement libre.

✔️ Guidage GPS

* Une fois la place sélectionnée :
  → lancement du **guidage** vers la place (via moteur interne ou Google Maps/Apple Plans/Mapbox).
  → estimation du temps d’arrivée.

✔️ Précision de localisation

* Utilisation de la géolocalisation GPS avec **haute précision**.
* Correction automatique (snap to road) pour rues étroites.

✔️ Vérification dynamique avant d’arriver

* Actualisation automatique quelques minutes avant votre arrivée.
* Si la place est occupée, des **alternatives immédiates** sont proposées.

✔️ Visualisation avancée

* Vue carte (OSM ou Satellite).
* Indicateurs couleurs : vert (dispo), orange (faible), rouge (saturé).
* Mise à jour en live sans rechargement.

---

🧱 Technologies utilisées

Frontend

  **React + TypeScript**
  **Vite** (perf & dev rapide)
  **TailwindCSS**
  **Leaflet / Mapbox / OpenLayers** pour la carte
  **API navigateur GPS** pour la localisation précise

Backend / Données

**Supabase** (PostgreSQL + Realtime)
**PostGIS** pour les requêtes géospatiales
**WebSockets** pour le temps réel
**Redis (optionnel)** pour gestion des réservations / holds
* Scripts d’ingestion Open Data Paris (selon sources publiques disponibles)



📦 Installation & démarrage

1. Cloner le projet


git clone https://github.com/KalelDAMBA/parkspot-paris.git
cd parkspot-paris


2. Configurer l’environnement

Crée un fichier `.env` ou `.env.local` à la racine du frontend :


VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé publique>


3. Installer les dépendances

bash
npm install


4. Démarrer en mode développement

bash
npm run dev

➡️ Le projet s’ouvre généralement sur :
[http://localhost:5173/](http://localhost:5173/)



🔍 Structure du projet


parkspot-paris/
│
├── src/
│   ├── components/       # Cartes, UI, panneaux de filtre
│   ├── hooks/            # useParkingSpots, géolocalisation, filtres
│   ├── lib/              # Supabase, config map, services
│   └── pages/
│
├── public/               # Assets statiques
├── supabase/             # Migrations SQL et configuration
└── README.md



🛠️ Roadmap (Prochaines évolutions)

  🔵 *Réservation courte ("Hold") d’une place* pour éviter de la perdre avant d’arriver
  🔵 Filtrage intelligent (heure, probabilité, zone)
  🔵 Amélioration du moteur de prédiction
  🔵 Mode itinéraire : parkings disponibles sur le trajet
  🔵 Dashboard admin : gestion et validation des données
  🔵 Intégration officielle Open Data Paris / capteurs



🤝 Contribution

Les contributions sont les bienvenues !

* Forkez le repo
* Créez une branche `feature/ma-feature`
* Ouvrez une Pull Request

Voir **CONTRIBUTING.md** pour les règles complètes.



📄 Licence

Ce projet est sous licence **MIT**.
Utilisation libre et ouverte pour tous.

