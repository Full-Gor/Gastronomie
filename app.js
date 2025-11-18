// app.js - Chargement des données depuis Firestore pour les pages publiques

// Fonction utilitaire pour afficher un loader pendant le chargement
function showLoader(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div style="text-align:center;padding:40px;"><div style="border:4px solid #f3f3f3;border-top:4px solid #000;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto;"></div></div>';
  }
}

// Animation pour le loader
const style = document.createElement('style');
style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
document.head.appendChild(style);

// ============================================
// CHARGEMENT DES PARAMÈTRES GÉNÉRAUX
// ============================================
async function loadGeneralSettings() {
  try {
    const doc = await db.collection('settings').doc('general').get();
    if (doc.exists) {
      const data = doc.data();

      // Mettre à jour le logo
      const logos = document.querySelectorAll('.logo');
      logos.forEach(logo => {
        if (data.logoText) logo.textContent = data.logoText;
      });

      // Mettre à jour le titre hero (page index)
      const heroTitle = document.querySelector('.hero-content h1');
      if (heroTitle && data.heroTitre) {
        heroTitle.textContent = data.heroTitre;
      }

      // Mettre à jour le sous-titre hero
      const heroSubtitle = document.querySelector('.hero-content p');
      if (heroSubtitle && data.heroSousTitre) {
        heroSubtitle.textContent = data.heroSousTitre;
      }

      // Mettre à jour les informations de contact
      const contactEmail = document.querySelector('a[href^="mailto:"]');
      if (contactEmail && data.contactEmail) {
        contactEmail.href = `mailto:${data.contactEmail}`;
        contactEmail.textContent = data.contactEmail;
      }

      const contactTel = document.querySelector('a[href^="tel:"]');
      if (contactTel && data.contactTel) {
        contactTel.href = `tel:${data.contactTel}`;
        contactTel.textContent = data.contactTel;
      }
    }
  } catch (error) {
    console.error('Erreur chargement paramètres:', error);
  }
}

// ============================================
// CHARGEMENT DU MENU (pour index.html)
// ============================================
async function loadMenuPreview() {
  const container = document.querySelector('.horizontal-scroll-wrapper');
  if (!container) return;

  try {
    showLoader('menu');
    const snapshot = await db.collection('menu')
      .orderBy('ordre')
      .limit(4)
      .get();

    if (snapshot.empty) {
      // Garder le contenu statique par défaut
      return;
    }

    container.innerHTML = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <img src="${item.photoURL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800'}" alt="${item.titre}">
        <div class="menu-overlay">
          <h3>${item.titre}</h3>
          <p>${item.description || ''}</p>
          ${item.prix ? `<p style="font-size:18px;font-weight:bold;margin-top:10px;">${item.prix}</p>` : ''}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erreur chargement menu:', error);
  }
}

// ============================================
// CHARGEMENT DES SERVICES (pour index.html)
// ============================================
async function loadServicesPreview() {
  const container = document.querySelector('.drinks-grid');
  if (!container) return;

  try {
    const snapshot = await db.collection('services')
      .orderBy('ordre')
      .limit(4)
      .get();

    if (snapshot.empty) {
      // Garder le contenu statique par défaut
      return;
    }

    container.innerHTML = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      const serviceDiv = document.createElement('div');
      serviceDiv.className = 'drink-item';
      serviceDiv.innerHTML = `
        <h3>${item.nom}</h3>
        <p>${item.description || ''}</p>
      `;
      container.appendChild(serviceDiv);
    });
  } catch (error) {
    console.error('Erreur chargement services:', error);
  }
}

// ============================================
// CHARGEMENT DU MENU COMPLET (pour menu.html)
// ============================================
async function loadFullMenu() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  try {
    const snapshot = await db.collection('menu')
      .orderBy('ordre')
      .get();

    if (snapshot.empty) {
      // Garder le contenu statique par défaut
      return;
    }

    // Note: menu.html utilise un slider complexe avec jQuery
    // On garde le système existant pour la compatibilité
    console.log('Menu chargé:', snapshot.size, 'plats');
  } catch (error) {
    console.error('Erreur chargement menu complet:', error);
  }
}

// ============================================
// CHARGEMENT DES SLIDES À PROPOS (pour apropos.html)
// ============================================
async function loadAproposSlides() {
  try {
    const snapshot = await db.collection('apropos')
      .orderBy('slideNumber')
      .get();

    if (snapshot.empty) {
      // Garder le contenu statique par défaut
      return;
    }

    snapshot.forEach(doc => {
      const slide = doc.data();
      const slideNum = slide.slideNumber;

      // Mettre à jour le titre du slide
      const titleElement = document.querySelector(`.slide[data-slide="${slideNum}"] .slideshow__slide-caption-title`);
      if (titleElement && slide.titre) {
        titleElement.textContent = slide.titre;
      }

      // Mettre à jour la description
      const descElement = document.querySelector(`.slide[data-slide="${slideNum}"] .slideshow__slide-caption-subtitle-label`);
      if (descElement && slide.description) {
        descElement.textContent = slide.description;
      }

      // Mettre à jour l'image de fond
      const imageElement = document.querySelector(`.slide[data-slide="${slideNum}"] .slideshow__slide-image`);
      if (imageElement && slide.photoURL) {
        imageElement.style.backgroundImage = `url('${slide.photoURL}')`;
      }

      // Mettre à jour l'image de la lettre
      const letterElement = document.querySelector(`.slide--${slideNum}__letter`);
      if (letterElement && slide.photoURL) {
        letterElement.style.backgroundImage = `url('${slide.photoURL}')`;
      }
    });
  } catch (error) {
    console.error('Erreur chargement slides à propos:', error);
  }
}

// ============================================
// CHARGEMENT DE TOUS LES SERVICES (pour services.html)
// ============================================
async function loadAllServices() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  try {
    const snapshot = await db.collection('services')
      .orderBy('ordre')
      .get();

    if (snapshot.empty) {
      // Garder le contenu statique par défaut
      return;
    }

    gallery.innerHTML = '';
    snapshot.forEach(doc => {
      const service = doc.data();
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <div class="gallery-card-inner">
          <img src="${service.photoURL || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'}"
               alt="${service.nom}"
               class="gallery-card-image">
          <div class="gallery-card-overlay">
            <div class="gallery-card-title">${service.nom}</div>
            <div class="gallery-card-description">${service.description || ''}</div>
          </div>
        </div>
      `;
      gallery.appendChild(card);
    });
  } catch (error) {
    console.error('Erreur chargement tous les services:', error);
  }
}

// ============================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  // Vérifier si Firebase est initialisé
  if (typeof firebase === 'undefined' || typeof db === 'undefined') {
    console.warn('Firebase non initialisé - contenu statique affiché');
    return;
  }

  // Charger les paramètres généraux sur toutes les pages
  await loadGeneralSettings();

  // Déterminer quelle page est affichée et charger le contenu approprié
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  switch (page) {
    case 'index.html':
    case '':
      await loadMenuPreview();
      await loadServicesPreview();
      break;

    case 'menu.html':
      await loadFullMenu();
      break;

    case 'apropos.html':
      await loadAproposSlides();
      break;

    case 'services.html':
      await loadAllServices();
      break;
  }
});
