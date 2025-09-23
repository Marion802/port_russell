/**
 * @file catways.js
 * @description Script pour afficher la liste des catways sur la page catways.html.
 */

const token = localStorage.getItem('token'); // token JWT

/**
 * Charge tous les catways depuis l'API et les affiche dans le tableau HTML.
 * @async
 * @function loadCatways
 * @returns {Promise<void>} Remplit le tableau avec les données des catways.
 */
async function loadCatways() {
  try {
    const res = await fetch('/api/catways', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const catways = await res.json();

    const tbody = document.querySelector('#table-catways tbody');
    tbody.innerHTML = '';

    catways.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c._id}</td>
        <td>${c.catwayNumber}</td>
        <td>${c.type}</td>
        <td>${c.catwayState}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

// Exécution de la fonction pour afficher la liste des catways
loadCatways();

