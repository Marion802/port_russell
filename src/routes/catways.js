const router = require('express').Router();
const Catway = require('../models/Catway');
const protect = require('../middleware/auth');

// ➡️ GET /api/catways → liste de tous les catways
router.get('/', async (req, res, next) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    next(err);
  }
});

// ➡️ GET /api/catways/:id → détails d’un catway
router.get('/:id', async (req, res, next) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    next(err);
  }
});

// ➡️ POST /api/catways → créer un catway
router.post('/', async (req, res, next) => {
  try {
    const catway = await Catway.create(req.body);
    res.status(201).json(catway);
  } catch (err) {
    next(err);
  }
});

// ➡️ PUT /api/catways/:id → remplacer complètement un catway
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

// ➡️ PATCH /api/catways/:id → mettre à jour partiellement
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

// ➡️ DELETE /api/catways/:id → supprimer un catway
router.delete('/:id', async (req, res, next) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway not found' });
    res.json({ message: 'Catway deleted' });
  } catch (err) {
    next(err);
  }
});

const reservationRoutes = require('./reservations');
router.use('/:id/reservations', reservationRoutes);


module.exports = router;
router.use(protect);