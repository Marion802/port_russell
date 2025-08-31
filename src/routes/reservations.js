const router = require('express').Router({ mergeParams: true });
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const protect = require('../middleware/auth');

// ➡️ GET /api/catways/:id/reservations → toutes les réservations pour un catway
router.get('/', async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

// ➡️ GET /api/catways/:id/reservations/:reservationId → détails d'une réservation
router.get('/:reservationId', async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
});

// ➡️ POST /api/catways/:id/reservations → créer une réservation
router.post('/', protect, async (req, res, next) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ error: 'Catway not found' });

    const { checkIn, checkOut } = req.body;

    // 🔍 Vérifier si une réservation existe déjà pour ces dates
    const overlap = await Reservation.findOne({
      catwayNumber: catway.catwayNumber,
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } } // chevauchement
      ]
    });

    if (overlap) {
      return res.status(400).json({ error: 'Ce catway est déjà réservé sur cette période' });
    }

    // ✅ Créer la réservation si pas de conflit
    const reservation = await Reservation.create({
      catwayNumber: catway.catwayNumber,
      ...req.body
    });

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});


// ➡️ DELETE /api/catways/:id/reservations/:reservationId → supprimer une réservation
router.delete('/:reservationId', protect, async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
