const mongoose = require('mongoose');

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro unique du catway.
 * @property {('long'|'short')} type - Type de catway.
 * @property {string} [catwayState='disponible'] - État du catway.
 * @property {Date} createdAt - Date de création.
 * @property {Date} updatedAt - Date de dernière modification.
 */

/**
 * Schéma Mongoose pour un catway
 * @type {mongoose.Schema<Catway>}
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  type: { type: String, enum: ['long', 'short'], required: true },
  catwayState: { type: String, default: 'disponible' }
}, { timestamps: true });

/**
 * Modèle Mongoose pour les catways
 * @type {mongoose.Model<Catway>}
 */
module.exports = mongoose.model('Catway', catwaySchema);
