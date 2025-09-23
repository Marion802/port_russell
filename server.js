/**
 * @file server.js
 * @description Point d'entrée du serveur API Port de Plaisance Russell.
 * Configure la connexion à MongoDB et démarre le serveur Express.
 */

require('dotenv').config();
const { connectDB } = require('./src/config/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

/**
 * Démarre la connexion à la base de données et lance le serveur.
 */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
