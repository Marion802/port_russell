const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} User
 * @property {string} name - Nom complet de l'utilisateur.
 * @property {string} email - Email unique de l'utilisateur.
 * @property {string} password - Mot de passe hashé.
 * @property {Date} createdAt - Date de création de l'utilisateur.
 * @property {Date} updatedAt - Date de dernière modification.
 */

/**
 * Schéma Mongoose pour un utilisateur
 * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

/**
 * Middleware Mongoose : hash du mot de passe avant sauvegarde
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Méthode pour comparer un mot de passe fourni avec le mot de passe hashé
 * @param {string} candidate - Mot de passe à comparer
 * @returns {Promise<boolean>} true si le mot de passe correspond
 */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Modèle Mongoose pour les utilisateurs
 * @type {mongoose.Model<User>}
 */
module.exports = mongoose.model('User', userSchema);
