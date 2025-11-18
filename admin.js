// ========================================
// VARIABLES GLOBALES
// ========================================
let currentUser = null;
let editingItemId = null;
let currentPhotoURL = null;

// ========================================
// AUTHENTIFICATION
// ========================================

// Observer l'état d'authentification
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        showDashboard(user);
    } else {
        currentUser = null;
        showLogin();
    }
});

// Gérer la connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    try {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading"></span> Connexion...';

        await auth.signInWithEmailAndPassword(email, password);
        showToast('Connexion réussie !', 'success');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showToast('Erreur de connexion: ' + error.message, 'error');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Se connecter';
    }
});

// Gérer la déconnexion
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await auth.signOut();
        showToast('Déconnexion réussie', 'success');
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        showToast('Erreur de déconnexion', 'error');
    }
});

// Afficher le dashboard
function showDashboard(user) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('userEmail').textContent = user.email;

    // Charger toutes les données
    loadMenu();
    loadServices();
    loadApropos();
    loadSettings();
}

// Afficher la page de connexion
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// ========================================
// GESTION DES TABS
// ========================================

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Retirer la classe active de tous les tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Ajouter la classe active au tab cliqué
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab');
        document.querySelector(`[data-content="${tabName}"]`).classList.add('active');
    });
});

// ========================================
// CLOUDINARY UPLOAD
// ========================================

function uploadImage(callback) {
    const widget = cloudinary.createUploadWidget({
        cloudName: cloudinaryConfig.cloudName,
        uploadPreset: cloudinaryConfig.uploadPreset,
        folder: 'restaurant-photos',
        sources: ['local', 'url'],
        multiple: false,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp']
    }, (error, result) => {
        if (!error && result.event === 'success') {
            callback(result.info.secure_url);
        }
    });
    widget.open();
}

// Gestionnaire d'upload
document.getElementById('uploadBtn').addEventListener('click', () => {
    uploadImage((url) => {
        currentPhotoURL = url;
        document.getElementById('currentPhotoURL').value = url;
        const preview = document.getElementById('imagePreview');
        preview.src = url;
        preview.style.display = 'block';
        showToast('Image uploadée avec succès !', 'success');
    });
});

// ========================================
// MENU CRUD
// ========================================

async function loadMenu() {
    try {
        const menuGrid = document.getElementById('menuGrid');
        menuGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading" style="border-color: #667eea; border-top-color: transparent; width: 40px; height: 40px; margin: 0 auto;"></div></div>';

        const snapshot = await db.collection('menu').orderBy('ordre', 'asc').get();

        if (snapshot.empty) {
            menuGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <p>Aucun plat dans le menu. Cliquez sur "Ajouter un plat" pour commencer.</p>
                </div>
            `;
            return;
        }

        menuGrid.innerHTML = '';
        snapshot.forEach(doc => {
            const item = doc.data();
            const card = createMenuCard(doc.id, item);
            menuGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
        showToast('Erreur lors du chargement du menu', 'error');
    }
}

function createMenuCard(id, item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.photoURL || 'https://via.placeholder.com/300x180?text=Pas+d\'image'}" alt="${item.titre}">
        <span class="category-badge">${item.categorie || 'Non catégorisé'}</span>
        <h3>${item.titre}</h3>
        ${item.prix ? `<div class="price">${item.prix}</div>` : ''}
        <div class="description">${item.description}</div>
        <div class="actions">
            <button class="btn-icon btn-edit" onclick="editMenuItem('${id}')">
                <i class="fas fa-edit"></i> Modifier
            </button>
            <button class="btn-icon btn-delete" onclick="deleteMenuItem('${id}')">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
    `;
    return card;
}

async function addMenuItem(data) {
    try {
        const menuCount = await db.collection('menu').get();
        await db.collection('menu').add({
            ...data,
            ordre: menuCount.size + 1,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Plat ajouté avec succès !', 'success');
        loadMenu();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du plat:', error);
        showToast('Erreur lors de l\'ajout du plat', 'error');
    }
}

async function updateMenuItem(id, data) {
    try {
        await db.collection('menu').doc(id).update(data);
        showToast('Plat modifié avec succès !', 'success');
        loadMenu();
    } catch (error) {
        console.error('Erreur lors de la modification du plat:', error);
        showToast('Erreur lors de la modification du plat', 'error');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
        return;
    }

    try {
        await db.collection('menu').doc(id).delete();
        showToast('Plat supprimé avec succès !', 'success');
        loadMenu();
    } catch (error) {
        console.error('Erreur lors de la suppression du plat:', error);
        showToast('Erreur lors de la suppression du plat', 'error');
    }
}

function editMenuItem(id) {
    db.collection('menu').doc(id).get().then(doc => {
        if (doc.exists) {
            const item = doc.data();
            openModal('menu', 'Modifier le plat', id, item);
        }
    });
}

// ========================================
// SERVICES CRUD
// ========================================

async function loadServices() {
    try {
        const servicesGrid = document.getElementById('servicesGrid');
        servicesGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading" style="border-color: #667eea; border-top-color: transparent; width: 40px; height: 40px; margin: 0 auto;"></div></div>';

        const snapshot = await db.collection('services').orderBy('ordre', 'asc').get();

        if (snapshot.empty) {
            servicesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-concierge-bell"></i>
                    <p>Aucun service disponible. Cliquez sur "Ajouter un service" pour commencer.</p>
                </div>
            `;
            return;
        }

        servicesGrid.innerHTML = '';
        snapshot.forEach(doc => {
            const item = doc.data();
            const card = createServiceCard(doc.id, item);
            servicesGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        showToast('Erreur lors du chargement des services', 'error');
    }
}

function createServiceCard(id, item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.photoURL || 'https://via.placeholder.com/300x180?text=Pas+d\'image'}" alt="${item.nom}">
        <h3>${item.nom}</h3>
        <div class="description">${item.description}</div>
        <div class="actions">
            <button class="btn-icon btn-edit" onclick="editService('${id}')">
                <i class="fas fa-edit"></i> Modifier
            </button>
            <button class="btn-icon btn-delete" onclick="deleteService('${id}')">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
    `;
    return card;
}

async function addService(data) {
    try {
        const servicesCount = await db.collection('services').get();
        await db.collection('services').add({
            ...data,
            ordre: servicesCount.size + 1,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Service ajouté avec succès !', 'success');
        loadServices();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du service:', error);
        showToast('Erreur lors de l\'ajout du service', 'error');
    }
}

async function updateService(id, data) {
    try {
        await db.collection('services').doc(id).update(data);
        showToast('Service modifié avec succès !', 'success');
        loadServices();
    } catch (error) {
        console.error('Erreur lors de la modification du service:', error);
        showToast('Erreur lors de la modification du service', 'error');
    }
}

async function deleteService(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        return;
    }

    try {
        await db.collection('services').doc(id).delete();
        showToast('Service supprimé avec succès !', 'success');
        loadServices();
    } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
        showToast('Erreur lors de la suppression du service', 'error');
    }
}

function editService(id) {
    db.collection('services').doc(id).get().then(doc => {
        if (doc.exists) {
            const item = doc.data();
            openModal('services', 'Modifier le service', id, item);
        }
    });
}

// ========================================
// À PROPOS CRUD
// ========================================

async function loadApropos() {
    try {
        const aproposGrid = document.getElementById('aproposGrid');
        aproposGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading" style="border-color: #667eea; border-top-color: transparent; width: 40px; height: 40px; margin: 0 auto;"></div></div>';

        const snapshot = await db.collection('apropos').orderBy('slideNumber', 'asc').get();

        aproposGrid.innerHTML = '';

        // Créer 3 slides (1, 2, 3)
        for (let i = 1; i <= 3; i++) {
            const doc = snapshot.docs.find(d => d.data().slideNumber === i);
            let card;

            if (doc) {
                const item = doc.data();
                card = createAproposCard(doc.id, item);
            } else {
                // Créer une carte vide pour ce slide
                card = createEmptyAproposCard(i);
            }

            aproposGrid.appendChild(card);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des slides:', error);
        showToast('Erreur lors du chargement des slides', 'error');
    }
}

function createAproposCard(id, item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="${item.photoURL || 'https://via.placeholder.com/300x180?text=Slide+' + item.slideNumber}" alt="Slide ${item.slideNumber}">
        <span class="category-badge">Slide ${item.slideNumber}</span>
        <h3>${item.titre}</h3>
        <div class="description">${item.description}</div>
        <div class="actions">
            <button class="btn-icon btn-edit" onclick="editApropos('${id}')">
                <i class="fas fa-edit"></i> Modifier
            </button>
        </div>
    `;
    return card;
}

function createEmptyAproposCard(slideNumber) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <img src="https://via.placeholder.com/300x180?text=Slide+${slideNumber}" alt="Slide ${slideNumber}">
        <span class="category-badge">Slide ${slideNumber}</span>
        <h3>Slide ${slideNumber} - Non configuré</h3>
        <div class="description">Cliquez sur "Ajouter" pour configurer ce slide.</div>
        <div class="actions">
            <button class="btn-icon btn-edit" onclick="addAproposSlide(${slideNumber})">
                <i class="fas fa-plus"></i> Ajouter
            </button>
        </div>
    `;
    return card;
}

async function addApropos(data) {
    try {
        await db.collection('apropos').add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Slide ajouté avec succès !', 'success');
        loadApropos();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du slide:', error);
        showToast('Erreur lors de l\'ajout du slide', 'error');
    }
}

async function updateApropos(id, data) {
    try {
        await db.collection('apropos').doc(id).update(data);
        showToast('Slide modifié avec succès !', 'success');
        loadApropos();
    } catch (error) {
        console.error('Erreur lors de la modification du slide:', error);
        showToast('Erreur lors de la modification du slide', 'error');
    }
}

function editApropos(id) {
    db.collection('apropos').doc(id).get().then(doc => {
        if (doc.exists) {
            const item = doc.data();
            openModal('apropos', 'Modifier le slide', id, item);
        }
    });
}

function addAproposSlide(slideNumber) {
    openModal('apropos', 'Ajouter le slide ' + slideNumber, null, { slideNumber });
}

// ========================================
// PARAMÈTRES
// ========================================

async function loadSettings() {
    try {
        const doc = await db.collection('settings').doc('general').get();

        if (doc.exists) {
            const settings = doc.data();
            document.getElementById('heroTitre').value = settings.heroTitre || '';
            document.getElementById('heroSousTitre').value = settings.heroSousTitre || '';
            document.getElementById('contactEmail').value = settings.contactEmail || '';
            document.getElementById('contactTel').value = settings.contactTel || '';
            document.getElementById('logoText').value = settings.logoText || '';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        showToast('Erreur lors du chargement des paramètres', 'error');
    }
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const settings = {
        heroTitre: document.getElementById('heroTitre').value,
        heroSousTitre: document.getElementById('heroSousTitre').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactTel: document.getElementById('contactTel').value,
        logoText: document.getElementById('logoText').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('settings').doc('general').set(settings, { merge: true });
        showToast('Paramètres enregistrés avec succès !', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des paramètres:', error);
        showToast('Erreur lors de l\'enregistrement des paramètres', 'error');
    }
});

// ========================================
// GESTION DES MODALS
// ========================================

function openModal(type, title, id = null, data = {}) {
    editingItemId = id;
    currentPhotoURL = data.photoURL || null;

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('itemType').value = type;
    document.getElementById('itemId').value = id || '';
    document.getElementById('itemTitre').value = data.titre || data.nom || '';
    document.getElementById('itemDescription').value = data.description || '';

    // Afficher/cacher les champs selon le type
    if (type === 'menu') {
        document.getElementById('categorieRow').style.display = 'block';
        document.getElementById('prixRow').style.display = 'block';
        document.getElementById('itemCategorie').value = data.categorie || 'entrees';
        document.getElementById('itemPrix').value = data.prix || '';
    } else {
        document.getElementById('categorieRow').style.display = 'none';
        document.getElementById('prixRow').style.display = 'none';
    }

    // Afficher l'aperçu de l'image si disponible
    if (currentPhotoURL) {
        document.getElementById('imagePreview').src = currentPhotoURL;
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('currentPhotoURL').value = currentPhotoURL;
    } else {
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('currentPhotoURL').value = '';
    }

    // Afficher le modal
    document.getElementById('itemModal').classList.add('active');
}

function closeModal() {
    document.getElementById('itemModal').classList.remove('active');
    document.getElementById('itemForm').reset();
    editingItemId = null;
    currentPhotoURL = null;
}

// Boutons de modal
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

// Fermer le modal en cliquant à l'extérieur
document.getElementById('itemModal').addEventListener('click', (e) => {
    if (e.target.id === 'itemModal') {
        closeModal();
    }
});

// ========================================
// GESTION DU FORMULAIRE MODAL
// ========================================

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('itemType').value;
    const id = document.getElementById('itemId').value;
    const titre = document.getElementById('itemTitre').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const photoURL = document.getElementById('currentPhotoURL').value;

    // Validation
    if (!titre || !description) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    if (!photoURL) {
        showToast('Veuillez ajouter une photo', 'error');
        return;
    }

    let data = {
        titre: titre,
        description: description,
        photoURL: photoURL
    };

    // Données spécifiques selon le type
    if (type === 'menu') {
        const prix = document.getElementById('itemPrix').value.trim();
        const categorie = document.getElementById('itemCategorie').value;

        data = {
            ...data,
            prix: prix,
            categorie: categorie
        };
    } else if (type === 'services') {
        data.nom = data.titre;
        delete data.titre;
    } else if (type === 'apropos') {
        const slideNumber = parseInt(document.getElementById('itemTitre').value) || 1;
        data.slideNumber = slideNumber;
    }

    try {
        if (id) {
            // Modification
            if (type === 'menu') {
                await updateMenuItem(id, data);
            } else if (type === 'services') {
                await updateService(id, data);
            } else if (type === 'apropos') {
                await updateApropos(id, data);
            }
        } else {
            // Ajout
            if (type === 'menu') {
                await addMenuItem(data);
            } else if (type === 'services') {
                await addService(data);
            } else if (type === 'apropos') {
                await addApropos(data);
            }
        }

        closeModal();
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
    }
});

// ========================================
// BOUTONS D'AJOUT
// ========================================

document.getElementById('addMenuBtn').addEventListener('click', () => {
    openModal('menu', 'Ajouter un plat');
});

document.getElementById('addServiceBtn').addEventListener('click', () => {
    openModal('services', 'Ajouter un service');
});

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    toastMessage.textContent = message;
    toast.className = `toast ${type}`;

    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else {
        icon.className = 'fas fa-exclamation-circle';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// RENDRE LES FONCTIONS GLOBALES
// ========================================

window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.editService = editService;
window.deleteService = deleteService;
window.editApropos = editApropos;
window.addAproposSlide = addAproposSlide;
