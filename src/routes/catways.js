const router = require('express').Router();
const Catway = require('../models/Catway');
const protect = require('../middleware/auth');
const reservationRoutes = require('./reservations');

/**
 * @route GET /api/catways
 * @description Récupère la liste de tous les catways
 * @returns {Array<Catway>} catways - Tableau de catways
 */
router.get('/', async (req, res, next) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/catways/:id
 * @description Récupère les détails d’un catway par ID
 * @param {string} req.params.id - ID du catway
 * @returns {Catway} catway
 * @throws 404 - Si le catway n'est pas trouvé
 */
router.get('/:id', async (req, res, next) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/catways
 * @description Crée un nouveau catway
 * @param {Object} req.body - Données du catway
 * @param {number} req.body.catwayNumber
 * @param {string} req.body.type
 * @param {string} [req.body.catwayState]
 * @returns {Catway} catway créé
 */
router.post('/', async (req, res, next) => {
  try {
    const catway = await Catway.create(req.body);
    res.status(201).json(catway);
  } catch (err) {
    next(err);
  }
});

/**
 * @route PUT /api/catways/:id
 * @description Remplace complètement un catway existant
 * @param {string} req.params.id - ID du catway
 * @param {Object} req.body - Données complètes du catway
 * @returns {Catway} catway mis à jour
 * @throws 404 - Si le catway n'est pas trouvé
 */
router.put('/:id', async (req, res, next) => {
  try {
    const catway = await Catway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    next(err);
  }
});

/**
 * @route PATCH /api/catways/:id
 * @description Met à jour partiellement un catway existant
 * @param {string} req.params.id - ID du catway
 * @param {Object} req.body - Données à mettre à jour
 * @returns {Catway} catway mis à jour
 * @throws 404 - Si le catway n'est pas trouvé
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const catway = await Catway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    next(err);
  }
});

/**
 * @route DELETE /api/catways/:id
 * @description Supprime un catway existant
 * @param {string} req.params.id - ID du catway
 * @returns {Object} message de confirmation
 * @throws 404 - Si le catway n'est pas trouvé
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.json({ message: 'Catway deleted' });
  } catch (err) {
    next(err);
  }
});

// Routes imbriquées pour les réservations d'un catway
router.use('/:id/reservations', reservationRoutes);

// Middleware de protection des routes (authentification)
router.use(protect);

module.exports = router;
