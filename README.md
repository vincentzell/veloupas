# Météo Vélotaf

Application web légère (Single Page Application) destinée à évaluer la faisabilité d'un trajet domicile-travail à vélo en fonction des conditions météorologiques et de préférences utilisateur configurables.

**Démo :** [https://vincentzell.github.io/veloupas/](https://vincentzell.github.io/veloupas/)

## Fonctionnalités

### Analyse Météorologique
L'application analyse les prévisions horaires sur deux plages de temps définies (matin et soir) et confronte les données aux seuils définis par l'utilisateur :
* **Température :** Vérification des seuils minimum et maximum.
* **Vent :** Vérification des rafales (km/h).
* **Précipitations :** Détection de la pluie et de la neige (codes WMO).
* **État de la chaussée :** Algorithme prédictif vérifiant les précipitations sur l'heure précédent le départ ($h-1$) pour signaler une route potentiellement mouillée sans pluie active.

### Interface & Expérience Utilisateur
* **Visualisation immédiate :** Code couleur binaire (Vert/Rouge) pour le statut global ("Go/No-Go").
* **Détails horaires :** Affichage des conditions bloquantes spécifiques par créneau.
* **Persistance :** Sauvegarde des préférences (ville, horaires, seuils) via `localStorage`.
* **Thèmes :** Support natif du mode sombre (Dark Mode) et clair.
* **Animations d'ambiance :** Moteur de particules canvas-less (DOM nodes) pour simuler la pluie, la neige, les nuages et le vent en arrière-plan.
* **Éphémérides :** Détection automatique des jours fériés et événements spéciaux (calcul de Pâques via l'algorithme de Meeus/Jones/Butcher).

## Architecture Technique

Le projet repose sur une architecture sans serveur (serverless), exécutée entièrement côté client (client-side).

* **Langages :** HTML5, CSS3, JavaScript (ES6+).
* **Dépendances :** Aucune librairie tierce (No jQuery, No React, No Framework).
* **PWA :** Compatible Progressive Web App (manifest.json et Service Worker basique inclus pour l'installation sur mobile).

### Structure des fichiers
* `index.html` : Contient la structure DOM, le CSS (in-line pour performance) et la logique JS.
* `manifest.json` : Métadonnées pour l'installation PWA.
* `sw.js` : Service Worker pour la mise en cache (optionnel).
* `icon.png` / `favicon.ico` : Ressources graphiques.

## API et Sources de Données

L'application utilise l'API Open-Meteo pour récupérer les données météorologiques. Aucune clé API n'est requise.

1.  **Géocodage :**
    * Endpoint : `https://geocoding-api.open-meteo.com/v1/search`
    * Utilisation : Conversion du nom de la ville en coordonnées GPS (latitude/longitude).

2.  **Prévisions Météo :**
    * Endpoint : `https://api.open-meteo.com/v1/forecast`
    * Modèle : `meteofrance_seamless` (Météo-France Arôme/Arpège via Open-Meteo).
    * Paramètres récupérés :
        * `temperature_2m`
        * `precipitation_probability`
        * `weathercode` (WMO)
        * `windspeed_10m`

## Algorithme de Décision

La fonction `analyze(data)` parcourt les tableaux horaires fournis par l'API.

1.  **Normalisation :** Ajustement des index horaires en fonction de l'heure actuelle et de la demande (jour J ou J+1).
2.  **Scan :** Boucle sur les créneaux horaires définis (ex: 08:00 -> 09:00).
3.  **Vérification Route Mouillée :**
    ```javascript
    // Si code météo à (StartHour - 1) indique pluie/neige
    // Alors flag "Route Mouillée" = true
    ```
4.  **Comparaison Seuils :**
    * Si $T° < T_{min}$ ou $T° > T_{max}$ : Rejet (Froid/Chaud).
    * Si $Vent > V_{max}$ : Rejet (Vent).
    * Si $WeatherCode \in [Pluie, Neige, Orage]$ : Rejet.
5.  **Verdict :** Si au moins un critère de rejet est rencontré sur l'un des trajets (aller ou retour), le statut global passe en "No-Go".

## Installation et Déploiement

### Local
1.  Cloner le dépôt.
2.  Ouvrir `index.html` dans n'importe quel navigateur moderne.

### Déploiement Static
Le projet est conçu pour être hébergé sur n'importe quel serveur statique (GitHub Pages, Vercel, Netlify, Apache/Nginx). Aucun build process (npm, webpack) n'est nécessaire.

## Licence

Ce projet est sous licence MIT. Vous êtes libre de le modifier et de le redistribuer.
