/**
 * @file reservation.js
 * @description Chargement et affichage des détails d'une réservation spécifique.
 */

const token = localStorage.getItem('token');

/**
 * Récupère l'ID de la réservation depuis l'URL, ex : reservation.html?id=123456
 * @type {string | null}
 */
const params = new URLSearchParams(window.location.search);
const reservationId = params.get('id');

/**
 * Charge les détails de la réservation depuis l'API et les affiche dans le DOM.
 * Si une erreur est renvoyée par l'API, un alert s'affiche.
 */
async function loadReservation() {
  try {
    const res = await fetch(`/api/reservations/${reservationId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const r = await res.json();

    if (r.error) {
      alert(r.error);
      return;
    }

    document.getElementById('reservation-id').textContent = r._id;
    document.getElementById('reservation-catway').textContent = r.catwayNumber;
    document.getElementById('reservation-client').textContent = r.clientName;
    document.getElementById('reservation-boat').textContent = r.boatName;
    document.getElementById('reservation-checkin').textContent = r.checkIn?.slice(0, 10);
    document.getElementById('reservation-checkout').textContent = r.checkOut?.slice(0, 10);
  } catch (err) {
    console.error(err);
  }
}

// Appel initial pour charger la réservation au chargement de la page
loadReservation();
