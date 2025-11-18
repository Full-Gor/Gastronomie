// ⚠️ CONFIGURATION FIREBASE
// Remplacez ces valeurs par celles de votre projet Firebase
// Pour obtenir ces valeurs :
// 1. Allez sur https://console.firebase.google.com
// 2. Sélectionnez votre projet
// 3. Allez dans Paramètres du projet (icône engrenage) > Général
// 4. Scrollez jusqu'à "Vos applications" > SDK configuration
// 5. Copiez les valeurs ci-dessous

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// ⚠️ CONFIGURATION CLOUDINARY
// Pour obtenir ces valeurs :
// 1. Créez un compte gratuit sur https://cloudinary.com
// 2. Allez dans Dashboard
// 3. Copiez votre "Cloud Name" et "Upload Preset"
// 4. Pour créer un Upload Preset :
//    - Allez dans Settings > Upload
//    - Cliquez sur "Add upload preset"
//    - Mode: Unsigned
//    - Folder: restaurant-photos
//    - Sauvegardez et copiez le nom du preset

const cloudinaryConfig = {
  cloudName: "VOTRE_CLOUD_NAME",
  uploadPreset: "VOTRE_UPLOAD_PRESET"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
