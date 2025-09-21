# Générateur de Notes de Frais - Arbitres Hockey 🏒

Un générateur de notes de frais en ligne spécialement conçu pour les arbitres de hockey sur glace français. Cette **Progressive Web App (PWA)** permet de créer facilement des PDFs professionnels pour les remboursements de frais d'arbitrage, avec installation possible sur mobile pour une expérience native.

## 🔒 Confidentialité et Sécurité

**IMPORTANT : Toutes vos données restent dans votre navigateur !**

- ✅ **Aucune donnée n'est envoyée vers un serveur**
- ✅ **Fonctionnement 100% hors ligne** après le premier chargement (PWA)
- ✅ **Stockage local sécurisé** avec fallbacks iOS Safari
- ✅ **Pas de cookies de tracking**
- ✅ **Pas de collecte de données personnelles**
- ✅ **Code source ouvert et transparent**
- ✅ **Compatible iOS Safari mode privé**

Vos informations personnelles, coordonnées bancaires et signatures restent privées et sécurisées sur votre appareil.

## ✨ Fonctionnalités

### � Progressive Web App (PWA)

- **Installation mobile** : Ajout à l'écran d'accueil comme une vraie app
- **Fonctionnement hors ligne** : Génération de PDF même sans internet
- **Expérience native** : Interface optimisée pour mobile et tablette
- **Mise à jour automatique** : Nouvelles fonctionnalités transparentes

### 📋 Formulaire Complet

- **Informations du match** : Date, heure, lieu, équipes, catégorie, position
- **Données arbitre** : Nom, prénom, licence, adresse, email
- **Indemnités** : Match et grand déplacement avec choix du payeur
- **Coordonnées bancaires** : IBAN, BIC, RIB
- **Signature** : Upload d'image ou espace pour signature manuscrite

### 🏒 Répertoire des Équipes

- **Base de données complète** : Liste des équipes françaises avec contacts officiels et catégories
- **Recherche en temps réel** : Recherche par nom d'équipe, catégorie ou adresse email
- **Filtrage par catégorie** : Sélection par division (Division 1, 2, 3), niveau (U20, U18)
- **Interface dédiée** : Page séparée avec tableau searchable, filtres et statistiques
- **Autocomplete intelligent** : Suggestions automatiques lors de la saisie
- **Affichage conditionnel** : Contacts automatiquement affichés pour les équipes connues
- **Fonctionnement hors ligne** : Accès complet aux données même sans connexion

### 💰 Gestion des Indemnités Intelligente

- **Indemnité de match** : Toujours payée par le club
- **Indemnité de grand déplacement** :
  - Saisie du montant uniquement si payée par le club
  - Aucun choix ou option de payeur, la FFHG n'est pas gérée
- **Calcul automatique** du total

### 📱 Interface Adaptative

- **Design responsive** : Optimisé pour mobile, tablette et desktop
- **Navigation intuitive** : Liens vers le répertoire des équipes et retour
- **Capture photo** : Utilisation de l'appareil photo pour la signature sur mobile
- **Validation en temps réel** : Vérification des champs obligatoires
- **Formatage automatique** : IBAN avec espaces, dates au format français
- **Affichage contextuel** : Contacts d'équipes affichés automatiquement lors de la saisie

### 💾 Sauvegarde Intelligente

- **Sauvegarde automatique** des données persistantes (arbitre, banque)
- **Stockage multi-plateforme** : Compatible iOS Safari, mode privé
- **Pré-remplissage intelligent** : "Fait à" se remplit automatiquement avec le lieu du match
- **Données temporaires** : Match et indemnités ne sont pas sauvegardées (pour éviter les erreurs)
- **Détection automatique** : Alertes si le stockage n'est pas disponible

### 📄 Génération PDF Professionnelle

- **Format A4** avec marges optimisées
- **Alignement parfait** des valeurs
- **Formatage français** : Dates, monnaie, mise en page
- **Gestion des signatures** : Images ou espace pour signature manuscrite
- **Nom de fichier descriptif** : `NoteDeFrais_DateMatch_Division_EquipeDomicile_vs_EquipeVisiteuse_NomPrenom.pdf`
- **Messages informatifs** : Double feedback pour le processus de génération

## 🚀 Utilisation

### 📱 Installation PWA (Recommandée)

**Sur Mobile :**

1. **Ouvrez l'application** dans votre navigateur
2. **Recherchez l'option "Installer"** ou "Ajouter à l'écran d'accueil"
3. **Confirmez l'installation** pour une expérience native
4. **Lancez l'app** directement depuis votre écran d'accueil

**Sur Desktop :**

- **Chrome/Edge** : Icône d'installation dans la barre d'adresse
- **Safari** : Partage → Ajouter au Dock

### Première Utilisation

1. **Remplissez vos informations personnelles** (arbitre + banque)
2. **Cliquez sur "Sauvegarder les données"** pour les conserver
3. **Ajoutez une photo de signature** (optionnel, supporte JPG, PNG)

### Pour Chaque Match

1. **Remplissez les informations du match**
2. **Choisissez l'équipe locale** (autocomplete avec contacts automatiques)
3. **Saisissez les indemnités**
4. **Vérifiez le lieu** (se remplit automatiquement dans "Fait à")
5. **Consultez les contacts** affichés pour l'équipe si disponibles
6. **Cliquez sur "Générer PDF"**

### Consultation du Répertoire des Équipes

1. **Cliquez sur "Voir toutes les équipes et contacts"** en bas de la page principale
2. **Utilisez la barre de recherche** pour filtrer par nom d'équipe, catégorie ou email
3. **Sélectionnez une catégorie** dans le menu déroulant pour filtrer par division ou niveau
4. **Consultez les statistiques** en temps réel (équipes, contacts, résultats)
5. **Visualisez les catégories** sous forme de badges colorés pour chaque équipe
6. **Cliquez sur les emails** pour envoyer un message directement

**Types de catégories disponibles** :

- **Divisions** : Division 1, Division 2, Division 3, ...
- **Filtrage combiné** : Recherche textuelle + filtre catégorie

### Indemnité de Grand Déplacement

L'indemnité de grand déplacement ne doit être saisie que si elle est payée par le club. La FFHG n'est pas gérée par cette application.

### 🔗 Pré-remplissage par URL (Paramètres de requête)

L'application supporte le pré-remplissage des champs via des paramètres d'URL, pratique pour l'intégration avec d'autres systèmes ou sites de clubs.

#### Paramètres supportés :

**Informations du match :**

| Nom complet     | Alias | Description                                                      |
| --------------- | ----- | ---------------------------------------------------------------- |
| `matchDate`     | `a`   | Date du match (format : YYYY-MM-DD)                              |
| `matchTime`     | `b`   | Heure du match (format : HH:MM)                                  |
| `matchLocation` | `c`   | Lieu du match (texte libre)                                      |
| `homeTeam`      | `d`   | Équipe locale (texte libre)                                      |
| `awayTeam`      | `e`   | Équipe visiteuse (texte libre)                                   |
| `category`      | `f`   | Catégorie (doit correspondre exactement aux options disponibles) |
| `position`      | `g`   | Position (doit correspondre exactement aux options disponibles)  |

**Indemnités :**

| Nom complet       | Alias | Description                                                                          |
| ----------------- | ----- | ------------------------------------------------------------------------------------ |
| `matchIndemnity`  | `h`   | Montant de l'indemnité de match (en euros)                                           |
| `travelIndemnity` | `i`   | Montant de l'indemnité de grand déplacement (en euros, payée par le club uniquement) |

#### Exemple d'URL :

#### Exemple d'URL :

```
https://www.tchekda.fr/hockey-ref-expense-report/?matchDate=2025-08-24&matchTime=20:30&matchLocation=Rouen&homeTeam=Dragons&awayTeam=Lions&category=Division%201&position=Arbitre%20Principal&matchIndemnity=45&travelIndemnity=25
```

#### Notes importantes :

- Les paramètres d'URL ont la **priorité** sur les valeurs par défaut
- Les **données personnelles** et bancaires sont toujours chargées depuis le stockage local
- Les valeurs de `category` et `position` doivent **correspondre exactement** aux options du formulaire
- Si `travelIndemnity` > 0, le toggle de choix du payeur s'affiche automatiquement

## 🔄 Auto-Reload Feature

The app automatically checks for new versions using `version.json` whenever the window gains focus. If a new version is detected:

- If the main form is empty, the app reloads automatically.
- If the user is filling in the form, a notification banner appears at the top with a button to reload the app manually, preventing data loss.

## 🛠 Git Hook: Auto-update version.json

To ensure users always get the latest version, a git pre-commit hook updates `version.json` with the current date and commit hash before each commit. This keeps the app version in sync with your changes.

### Setup for Other Developers

1. Copy `.git/hooks/pre-commit` from the repo root to your local `.git/hooks/` directory if not already present.
2. Make it executable:
   ```sh
   chmod +x .git/hooks/pre-commit
   ```
3. Now, every commit will update `version.json` automatically.

## 🛠️ Aspect Technique

### Technologies Utilisées

- **Progressive Web App (PWA)** : Installation mobile, fonctionnement hors ligne
- **HTML5/CSS3/JavaScript** : Technologies web standards
- **jsPDF** : Génération de PDFs côté client
- **Service Worker** : Cache et fonctionnalités hors ligne
- **Stockage multi-couches** : localStorage → sessionStorage → mémoire (iOS Safari)
- **Responsive Design** : Adaptation automatique à tous les écrans

### Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ iOS Safari, Chrome Mobile, Samsung Internet
- ✅ **Mode privé iOS Safari** avec fallbacks de stockage
- ✅ Fonctionne hors ligne après installation PWA

### Structure du Projet

```
├── index.html              # Interface utilisateur PWA
├── teams.html              # Répertoire des équipes et contacts
├── manifest.json           # Manifest PWA (installation mobile)
├── sw.js                   # Service Worker (cache, hors ligne)
├── css/
│   ├── styles.css          # Styles responsive principal
│   └── teams.css           # Styles dédiés au répertoire des équipes
├── js/
│   ├── app.js              # Initialisation PWA
│   ├── form-handler.js     # Gestion formulaire et affichage contacts
│   ├── pdf-generator.js    # Génération PDF + signatures
│   ├── hockey-data.js      # Gestion des données équipes et autocomplete
│   ├── teams.js            # Fonctionnalités du répertoire des équipes
│   └── storage.js          # Stockage multi-plateforme
├── data/
│   └── hockey-teams.json   # Base de données des équipes françaises
├── img/
│   └── arbitre.png         # Logo/icône
└── README.md              # Cette documentation
```

## 🔧 Installation Locale

Si vous souhaitez utiliser l'application en local :

```bash
# Cloner le projet
git clone https://github.com/Tchekda/hockey-ref-expense-report.git

# Ouvrir le dossier
cd hockey-ref-expense-report

# Ouvrir index.html dans votre navigateur
# Ou utiliser un serveur local comme Live Server (VS Code)
```

## 📞 Support

### Problèmes Courants

- **PDF ne se génère pas** : Vérifiez que tous les champs obligatoires sont remplis
- **Données perdues** : Utilisez "Sauvegarder les données" pour les informations personnelles
- **Signature floue** : Utilisez une image de bonne qualité (recommandé : fond blanc, encre noire)
- **Stockage iOS Safari** : L'application détecte automatiquement les limitations et utilise des alternatives
- **Installation PWA** : Utilisez le bouton d'installation du navigateur (plus fiable)

### Contact

- **Issues GitHub** : Pour signaler des bugs ou demander des fonctionnalités
- **Discussions** : Pour des questions générales

## 📋 Conformité FFHG

Cette application génère des notes de frais conformes aux standards de la Fédération Française de Hockey sur Glace :

- ✅ **Format officiel** avec toutes les sections requises
- ✅ **Calculs automatiques** conformes aux barèmes
- ✅ **Mention du payeur** pour chaque type d'indemnité
- ✅ **Signature et informations légales**

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests
- Améliorer la documentation

## 📜 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

**Fait avec ❤️ pour la communauté des arbitres de hockey français**
