/**
 * @file app.js
 * @description Configuration de l'application Express pour l'API Port de Plaisance Russell.
 * Gestion des middlewares, routes, erreurs et page d'accueil.
 */

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes'); // Importation des routes principales

const app = express();

// -------------------------
// Middlewares généraux
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Routes de l'API
// -------------------------
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/catways', require('./src/routes/catways'));
app.use('/api/reservations', require('./src/routes/reservations'));

// Dossier public pour les fichiers statiques (front-end)
app.use(express.static('./public'));

// -------------------------
// Route d'accueil simple
// -------------------------
/**
 * GET /
 * @description Page d'accueil de l'API
 * @returns {Object} Informations sur l'application et lien vers la documentation
 */
app.get('/', (req, res) => {
  res.status(200).send({
    app: 'Port de Plaisance Russell API',
    docs: '/docs',
    status: 'OK'
  });
});

// -------------------------
// Préfixe pour les routes principales
// -------------------------
app.use('/api', routes);

// -------------------------
// Middleware de gestion d'erreurs
// -------------------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// -------------------------
// Middleware 404
// -------------------------
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
