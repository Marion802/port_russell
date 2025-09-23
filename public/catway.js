/**
 * @file catway.js
 * @description Script pour afficher les détails d'un catway spécifique sur la page catway.html.
 */

const token = localStorage.getItem('token');

// Récupération de l'ID du catway depuis l'URL, ex : catway.html?id=123456
const params = new URLSearchParams(window.location.search);
const catwayId = params.get('id');

/**
 * Charge les informations d'un catway depuis l'API et les affiche sur la page.
 * @async
 * @function loadCatway
 * @returns {Promise<void>} Affiche les détails du catway ou une alerte en cas d'erreur.
 */
async function loadCatway() {
  try {
    const res = await fetch(`/api/catways/${catwayId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const c = await res.json();

    if (c.error) {
      alert(c.error);
      return;
    }

    document.getElementById('catway-id').textContent = c._id;
    document.getElementById('catway-number').textContent = c.catwayNumber;
    document.getElementById('catway-type').textContent = c.type;
    document.getElementById('catway-state').textContent = c.catwayState;
  } catch (err) {
    console.error(err);
  }
}

// Exécution de la fonction pour afficher le catway
loadCatway();
