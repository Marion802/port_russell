const router = require('express').Router();

/**
 * @module Routes
 * @description Point d'entrée pour les routes de l'API
 */

// 🔹 Routes pour les catways
router.use('/catways', require('./catways'));

module.exports = router;
