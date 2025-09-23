const mongoose = require('mongoose');

/**
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Numéro du catway réservé.
 * @property {string} clientName - Nom du client ayant réservé.
 * @property {string} boatName - Nom du bateau.
 * @property {Date} checkIn - Date d'arrivée.
 * @property {Date} checkOut - Date de départ.
 * @property {Date} createdAt - Date de création de la réservation.
 * @property {Date} updatedAt - Date de dernière modification.
 */

/**
 * Schéma Mongoose pour une réservation
 * @type {mongoose.Schema<Reservation>}
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true },
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true }
}, { timestamps: true });

/**
 * Modèle Mongoose pour les réservations
 * @type {mongoose.Model<Reservation>}
 */
module.exports = mongoose.model('Reservation', reservationSchema);
