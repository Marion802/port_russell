/**
 * @file hash.js
 * @description Script utilitaire pour générer un hash bcrypt d'un mot de passe.
 */

const bcrypt = require('bcryptjs');

/**
 * Génère un hash bcrypt pour un mot de passe donné.
 * @async
 * @function run
 * @returns {Promise<void>} Affiche le hash du mot de passe dans la console.
 */
async function run() {
  const password = 'motdepasse123'; // mot de passe à hasher
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

// Exécution du script
run();
