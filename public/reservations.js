/**
 * @file reservations.js
 * @description Chargement et affichage de la liste des réservations dans un tableau HTML.
 */

const token = localStorage.getItem('token');

/**
 * Charge toutes les réservations depuis l'API et les affiche dans le tableau HTML.
 * Chaque réservation est affichée avec son ID, numéro de catway, nom du client,
 * nom du bateau, date de check-in et date de check-out.
 */
async function loadReservations() {
  try {
    const res = await fetch('/api/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const reservations = await res.json();

    const tbody = document.querySelector('#table-reservations tbody');
    tbody.innerHTML = '';

    reservations.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r._id}</td>
        <td>${r.catwayNumber}</td>
        <td>${r.clientName}</td>
        <td>${r.boatName}</td>
        <td>${r.checkIn?.slice(0,10)}</td>
        <td>${r.checkOut?.slice(0,10)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

// Appel initial pour charger les réservations au chargement de la page
loadReservations();
