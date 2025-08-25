# Générateur de Notes de Frais - Arbitres Hockey 🏒

Un générateur de notes de frais en ligne spécialement conçu pour les arbitres de hockey sur glace français. Cette application web permet de créer facilement des PDFs professionnels pour les remboursements de frais d'arbitrage.

## 🔒 Confidentialité et Sécurité

**IMPORTANT : Toutes vos données restent dans votre navigateur !**

- ✅ **Aucune donnée n'est envoyée vers un serveur**
- ✅ **Fonctionnement 100% hors ligne** après le premier chargement
- ✅ **Stockage local uniquement** (localStorage de votre navigateur)
- ✅ **Pas de cookies de tracking**
- ✅ **Pas de collecte de données personnelles**
- ✅ **Code source ouvert et transparent**

Vos informations personnelles, coordonnées bancaires et signatures restent privées et sécurisées sur votre appareil.

## ✨ Fonctionnalités

### 📋 Formulaire Complet

- **Informations du match** : Date, heure, lieu, équipes, catégorie, position
- **Données arbitre** : Nom, prénom, licence, adresse, email
- **Indemnités** : Match et grand déplacement avec choix du payeur
- **Coordonnées bancaires** : IBAN, BIC, RIB
- **Signature** : Upload d'image ou espace pour signature manuscrite

### 💰 Gestion des Indemnités Intelligente

- **Indemnité de match** : Toujours payée par le club
- **Indemnité de grand déplacement** :
  - Choix entre "FFHG" ou "Club" selon le contexte
  - Toggle automatique qui apparaît seulement si un montant > 0 est saisi
- **Calcul automatique** du total

### 📱 Interface Adaptative

- **Design responsive** : Optimisé pour mobile, tablette et desktop
- **Capture photo** : Utilisation de l'appareil photo pour la signature sur mobile
- **Validation en temps réel** : Vérification des champs obligatoires
- **Formatage automatique** : IBAN avec espaces, dates au format français

### 💾 Sauvegarde Intelligente

- **Sauvegarde automatique** des données persistantes (arbitre, banque)
- **Pré-remplissage intelligent** : "Fait à" se remplit automatiquement avec le lieu du match
- **Données temporaires** : Match et indemnités ne sont pas sauvegardées (pour éviter les erreurs)

### 📄 Génération PDF Professionnelle

- **Format A4** avec marges optimisées
- **Alignement parfait** des valeurs
- **Formatage français** : Dates, monnaie, mise en page
- **Gestion des signatures** : Images ou espace pour signature manuscrite
- **Nom de fichier automatique** : `NoteDeFrais_YYYY-MM-DD_NomArbitre.pdf`

## 🚀 Utilisation

### Première Utilisation

1. **Remplissez vos informations personnelles** (arbitre + banque)
2. **Cliquez sur "Sauvegarder les données"** pour les conserver
3. **Ajoutez une photo de signature** (optionnel)

### Pour Chaque Match

1. **Remplissez les informations du match**
2. **Saisissez les indemnités**
3. **Vérifiez le lieu** (se remplit automatiquement dans "Fait à")
4. **Cliquez sur "Générer PDF"**

### Indemnité de Grand Déplacement

- Si vous saisissez un montant > 0, des options apparaissent
- **FFHG** : Remboursement par la Fédération (par défaut)
- **Club** : Remboursement par le club receveur

### 🔗 Pré-remplissage par URL (Paramètres de requête)

L'application supporte le pré-remplissage des champs via des paramètres d'URL, pratique pour l'intégration avec d'autres systèmes ou sites de clubs.

#### Paramètres supportés :

**Informations du match :**

- `matchDate` - Date du match (format : YYYY-MM-DD)
- `matchTime` - Heure du match (format : HH:MM)
- `matchLocation` - Lieu du match (texte libre)
- `homeTeam` - Équipe locale (texte libre)
- `awayTeam` - Équipe visiteuse (texte libre)
- `category` - Catégorie (doit correspondre exactement aux options disponibles)
- `position` - Position (doit correspondre exactement aux options disponibles)

**Indemnités :**

- `matchIndemnity` - Montant de l'indemnité de match (en euros)
- `travelIndemnity` - Montant de l'indemnité de grand déplacement (en euros)
- `travelPayment` - Payeur du grand déplacement ("FFHG" ou "Club")

#### Exemple d'URL :

```
https://votre-site.com/?matchDate=2025-08-24&matchTime=20:30&homeTeam=Dragons&awayTeam=Lions&category=Division%201&position=Arbitre%20Principal&matchIndemnity=45&travelIndemnity=25&travelPayment=FFHG
```

#### Notes importantes :

- Les paramètres d'URL ont la **priorité** sur les valeurs par défaut
- Les **données personnelles** et bancaires sont toujours chargées depuis le stockage local
- Les valeurs de `category` et `position` doivent **correspondre exactement** aux options du formulaire
- Si `travelIndemnity` > 0, le toggle de choix du payeur s'affiche automatiquement

## 🛠️ Aspect Technique

### Technologies Utilisées

- **HTML5/CSS3/JavaScript** : Technologies web standards
- **jsPDF** : Génération de PDFs côté client
- **LocalStorage** : Stockage local des données
- **Responsive Design** : Adaptation automatique à tous les écrans

### Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ iOS Safari, Chrome Mobile, Samsung Internet
- ✅ Fonctionne hors ligne après le premier chargement

### Structure du Projet

```
├── index.html              # Interface utilisateur
├── css/
│   └── styles.css          # Styles responsive
├── js/
│   ├── app.js              # Initialisation
│   ├── form-handler.js     # Gestion du formulaire
│   ├── pdf-generator.js    # Génération PDF
│   └── storage.js          # Stockage local
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
