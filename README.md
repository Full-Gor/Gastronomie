# 🍽️ Site Restaurant Gastronomique - DÉLICES & SAVEURS

Site web moderne avec effets parallaxe et interface d'administration complète.

## ✨ Fonctionnalités

- **5 pages HTML** avec effets parallaxe avancés
- **Interface admin CRUD** pour gérer tout le contenu sans coder
- **Upload d'images** via Cloudinary (gratuit)
- **Base de données** Firebase Firestore (gratuit)
- **Authentification** sécurisée pour l'admin
- **Design responsive** (mobile, tablette, desktop)

---

## 📁 Structure du projet

```
Gastronomie/
├── index.html          # Page d'accueil avec parallaxe
├── menu.html           # Slider horizontal des plats
├── apropos.html        # Slideshow À propos
├── contact.html        # Formulaire avec carte 3D flip
├── services.html       # Galerie des services
├── admin.html          # 🔐 Interface d'administration
├── admin.js            # Logique CRUD
├── app.js              # Chargement des données Firestore
├── firebase-config.js  # Configuration Firebase/Cloudinary
├── firebase.json       # Config Firebase Hosting
├── firestore.rules     # Règles de sécurité Firestore
└── README.md           # Ce fichier
```

---

## 🚀 Installation rapide

### Étape 1️⃣ : Créer un projet Firebase

1. Allez sur https://console.firebase.google.com
2. Cliquez sur **"Ajouter un projet"**
3. Nom du projet : `restaurant-gastronomie` (ou autre)
4. Désactivez Google Analytics (pas nécessaire)
5. Cliquez sur **"Créer le projet"**

### Étape 2️⃣ : Activer Firestore Database

1. Dans le menu latéral, allez dans **"Firestore Database"**
2. Cliquez sur **"Créer une base de données"**
3. **Mode production** (les règles sont déjà configurées)
4. Région : **europe-west** (ou votre région)
5. Cliquez sur **"Activer"**

### Étape 3️⃣ : Activer Authentication

1. Dans le menu latéral, allez dans **"Authentication"**
2. Cliquez sur **"Commencer"**
3. Dans l'onglet **"Sign-in method"**, activez **"E-mail/Mot de passe"**
4. Sauvegardez

### Étape 4️⃣ : Créer un compte administrateur

1. Restez dans **Authentication** > onglet **"Users"**
2. Cliquez sur **"Ajouter un utilisateur"**
3. Email : `admin@votrerestaurant.fr` (ou autre)
4. Mot de passe : Choisissez un mot de passe sécurisé
5. Cliquez sur **"Ajouter un utilisateur"**
6. ⚠️ **Notez ces identifiants** (vous en aurez besoin pour vous connecter à l'admin)

### Étape 5️⃣ : Récupérer la configuration Firebase

1. Dans le menu latéral, cliquez sur **⚙️ Paramètres du projet**
2. Scrollez jusqu'à **"Vos applications"**
3. Cliquez sur l'icône **Web** `</>`
4. Nom de l'app : `Restaurant Web`
5. **NE cochez PAS** "Configurer Firebase Hosting" (on le fera après)
6. Cliquez sur **"Enregistrer l'application"**
7. Copiez les valeurs de `firebaseConfig`

### Étape 6️⃣ : Configurer firebase-config.js

Ouvrez le fichier `firebase-config.js` et remplacez les valeurs :

```javascript
const firebaseConfig = {
  apiKey: "COLLEZ_ICI_VOTRE_API_KEY",
  authDomain: "COLLEZ_ICI_VOTRE_AUTH_DOMAIN",
  projectId: "COLLEZ_ICI_VOTRE_PROJECT_ID",
  storageBucket: "COLLEZ_ICI_VOTRE_STORAGE_BUCKET",
  messagingSenderId: "COLLEZ_ICI_VOTRE_MESSAGING_SENDER_ID",
  appId: "COLLEZ_ICI_VOTRE_APP_ID"
};
```

### Étape 7️⃣ : Créer un compte Cloudinary (gratuit)

1. Allez sur https://cloudinary.com
2. Cliquez sur **"Sign Up for Free"**
3. Remplissez le formulaire (ou connectez-vous avec Google/GitHub)
4. Confirmez votre email

### Étape 8️⃣ : Configurer Cloudinary

1. Allez dans votre **Dashboard** Cloudinary
2. Notez votre **Cloud Name** (en haut)
3. Allez dans **Settings** (⚙️) > **Upload** (onglet)
4. Scrollez jusqu'à **"Upload presets"**
5. Cliquez sur **"Add upload preset"**
6. Configurez :
   - **Signing Mode** : `Unsigned`
   - **Upload preset name** : `restaurant-photos`
   - **Folder** : `restaurant-photos`
7. Cliquez sur **"Save"**

### Étape 9️⃣ : Configurer Cloudinary dans firebase-config.js

Dans `firebase-config.js`, remplacez aussi :

```javascript
const cloudinaryConfig = {
  cloudName: "VOTRE_CLOUD_NAME",  // Ex: "dlkjfhg32"
  uploadPreset: "restaurant-photos"
};
```

### Étape 🔟 : Déployer les règles Firestore

1. Installez Firebase CLI (si pas encore fait) :
```bash
npm install -g firebase-tools
```

2. Connectez-vous à Firebase :
```bash
firebase login
```

3. Initialisez le projet (dans le dossier Gastronomie) :
```bash
firebase init
```
   - Choisissez : **Firestore** et **Hosting**
   - Projet existant : Sélectionnez votre projet
   - Firestore rules : `firestore.rules` (déjà créé)
   - Firestore indexes : `firestore.indexes.json` (déjà créé)
   - Public directory : `.` (point)
   - Single-page app : **No**
   - Overwrite files : **No** (garder les fichiers existants)

4. Déployez les règles Firestore :
```bash
firebase deploy --only firestore:rules
```

5. (Optionnel) Déployez le site sur Firebase Hosting :
```bash
firebase deploy --only hosting
```

---

## 🎯 Utilisation de l'interface admin

### 1️⃣ Accéder à l'admin

- **Localement** : Ouvrez `admin.html` dans votre navigateur
- **En ligne** : `https://votre-projet.web.app/admin.html`

### 2️⃣ Se connecter

Utilisez les identifiants créés à l'étape 4 :
- Email : `admin@votrerestaurant.fr`
- Mot de passe : Votre mot de passe

### 3️⃣ Gérer le contenu

L'interface admin a **4 sections** :

#### 📋 **Menu** - Gérer les plats
- Cliquez sur **"+ Ajouter un Plat"**
- Uploadez une photo (cliquez sur "Choisir une image")
- Remplissez : Titre, Description, Prix, Catégorie
- Cliquez sur **"Enregistrer"**
- Pour modifier : Cliquez sur **"✏️ Modifier"** sur la carte
- Pour supprimer : Cliquez sur **"🗑️ Supprimer"** (confirmation demandée)

#### 🎨 **Services** - Gérer les services
- Même principe que le menu
- Champs : Photo, Nom, Description

#### 📖 **À Propos** - Gérer les 3 slides
- 3 slides fixes (slideshow)
- Modifiez chaque slide : Photo, Titre, Description
- Les slides apparaissent automatiquement sur `apropos.html`

#### ⚙️ **Paramètres** - Configuration générale
- **Section Hero** : Titre et sous-titre de la page d'accueil
- **Contact** : Email et téléphone (affichés sur toutes les pages)
- **Logo** : Texte du logo (navigation)
- Sauvegarde automatique après modification

### 4️⃣ Upload d'images

Lors de l'upload :
1. Cliquez sur **"Choisir une image"**
2. Widget Cloudinary s'ouvre
3. Options :
   - **Local** : Uploadez depuis votre ordinateur
   - **URL** : Collez une URL d'image
4. L'image est automatiquement uploadée sur Cloudinary
5. L'URL est sauvegardée dans Firestore

**Formats acceptés** : JPG, JPEG, PNG, WEBP
**Taille max** : 5 MB par image

---

## 🌐 Visualiser les changements

Les modifications apparaissent **instantanément** sur le site :

- **index.html** : Affiche les 4 premiers plats du menu + 4 premiers services
- **menu.html** : Tous les plats (slider horizontal)
- **apropos.html** : Les 3 slides personnalisés
- **services.html** : Tous les services (galerie)
- **contact.html** : Email et téléphone de contact

**Astuce** : Ouvrez le site dans un onglet et l'admin dans un autre, actualisez pour voir les changements !

---

## 🔒 Sécurité

### Règles Firestore (déjà configurées)

- ✅ **Lecture publique** : Tout le monde peut lire le contenu
- 🔐 **Écriture protégée** : Seul l'admin connecté peut modifier

### Créer d'autres comptes admin

1. Allez dans **Firebase Console** > **Authentication** > **Users**
2. Cliquez sur **"Ajouter un utilisateur"**
3. Créez un nouveau compte email/password

### Supprimer un compte admin

1. Firebase Console > Authentication > Users
2. Cliquez sur l'utilisateur > **"Supprimer"**

---

## 📊 Structure des données Firestore

### Collection : `menu`
```javascript
{
  titre: "Salade César",
  description: "Fraîche et croquante...",
  prix: "18€",
  photoURL: "https://res.cloudinary.com/...",
  categorie: "entrees", // ou "plats", "desserts"
  ordre: 1,
  createdAt: Timestamp
}
```

### Collection : `services`
```javascript
{
  nom: "Dîner",
  description: "Menu du soir...",
  photoURL: "https://...",
  ordre: 1,
  createdAt: Timestamp
}
```

### Collection : `apropos`
```javascript
{
  slideNumber: 1, // 1, 2, ou 3
  titre: "Notre Histoire",
  description: "...",
  photoURL: "https://...",
  createdAt: Timestamp
}
```

### Collection : `settings` (document unique : `general`)
```javascript
{
  heroTitre: "GASTRONOMIE",
  heroSousTitre: "Une expérience culinaire d'exception",
  contactEmail: "contact@delices-saveurs.fr",
  contactTel: "+33 1 23 45 67 89",
  logoText: "DÉLICES & SAVEURS",
  updatedAt: Timestamp
}
```

---

## 💰 Coûts (100% GRATUIT)

### Firebase (limites gratuites)
- ✅ **Firestore** : 1 GB stockage, 50k lectures/jour, 20k écritures/jour
- ✅ **Hosting** : 10 GB stockage, 360 MB transfert/jour
- ✅ **Authentication** : 10k authentifications/mois

### Cloudinary (gratuit)
- ✅ **Stockage** : 25 GB
- ✅ **Bande passante** : 25 GB/mois
- ✅ **Transformations** : 25k transformations/mois

**Pour un restaurant, c'est largement suffisant !** 🎉

---

## 🐛 Dépannage

### L'admin ne se connecte pas
- ✅ Vérifiez que Firebase Auth est activé
- ✅ Vérifiez les identifiants dans Firebase Console > Authentication
- ✅ Vérifiez `firebase-config.js` (bonnes valeurs)
- ✅ Ouvrez la console navigateur (F12) pour voir les erreurs

### Les images ne s'uploadent pas
- ✅ Vérifiez `cloudinaryConfig` dans `firebase-config.js`
- ✅ Vérifiez que l'upload preset est en mode "Unsigned"
- ✅ Vérifiez le nom du preset (exactement `restaurant-photos`)

### Les données ne s'affichent pas sur le site
- ✅ Vérifiez que `firebase-config.js` est bien configuré
- ✅ Vérifiez que les règles Firestore sont déployées
- ✅ Actualisez la page (Ctrl+F5 ou Cmd+Shift+R)
- ✅ Ouvrez la console (F12) pour voir les erreurs

### Erreur "Permission denied" dans Firestore
- ✅ Déployez les règles : `firebase deploy --only firestore:rules`
- ✅ Vérifiez que `firestore.rules` existe dans le projet

---

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation Firebase : https://firebase.google.com/docs
2. Documentation Cloudinary : https://cloudinary.com/documentation
3. Ouvrez la console navigateur (F12) pour diagnostiquer les erreurs

---

## 🎨 Personnalisation

### Changer les couleurs
Modifiez les fichiers HTML (sections `<style>`) :
- Couleur principale : `#000` (noir)
- Couleur secondaire : `#fff` (blanc)
- Accent : Variable selon les pages

### Ajouter des pages
1. Créez un nouveau fichier `.html`
2. Ajoutez les scripts Firebase avant `</body>`
3. Créez une nouvelle collection Firestore si besoin
4. Ajoutez la logique dans `app.js`

---

## 📝 Licence

Projet libre pour usage personnel ou commercial.

---

**🍽️ Bon appétit et bonne gestion de votre restaurant ! 🎉**
