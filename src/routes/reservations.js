const router = require('express').Router({ mergeParams: true });
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const protect = require('../middleware/auth');

/**
 * @route GET /api/catways/:id/reservations
 * @description Récupère toutes les réservations pour un catway spécifique.
 *              Si aucun ID n'est fourni, récupère toutes les réservations.
 * @returns {Array<Reservation>} Liste des réservations
 */
router.get('/', async (req, res, next) => {
  try {
    if (req.params.id) {
      const reservations = await Reservation.find({ catwayNumber: req.params.id });
      return res.json(reservations);
    } else {
      const reservations = await Reservation.find();
      return res.json(reservations);
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/catways/:id/reservations/:reservationId
 * @description Récupère les détails d'une réservation par ID.
 * @param {string} reservationId - ID de la réservation
 * @returns {Reservation|404} Détails de la réservation ou erreur si non trouvé
 */
router.get('/:reservationId', async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/catways/:id/reservations
 * @description Crée une nouvelle réservation pour un catway spécifique.
 * @middleware protect - nécessite authentification
 * @body {number} catwayNumber - Numéro du catway
 * @body {string} clientName - Nom du client
 * @body {string} boatName - Nom du bateau
 * @body {Date} checkIn - Date d'arrivée
 * @body {Date} checkOut - Date de départ
 * @returns {Reservation} La réservation créée
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ error: 'Catway not found' });

    const { checkIn, checkOut } = req.body;

    const overlap = await Reservation.findOne({
      catwayNumber: catway.catwayNumber,
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
      ]
    });

    if (overlap) {
      return res.status(400).json({ error: 'Ce catway est déjà réservé sur cette période' });
    }

    const reservation = await Reservation.create({
      catwayNumber: catway.catwayNumber,
      ...req.body
    });

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});

/**
 * @route DELETE /api/catways/:id/reservations/:reservationId
 * @description Supprime une réservation par ID.
 * @middleware protect - nécessite authentification
 * @param {string} reservationId - ID de la réservation
 * @returns {object} Message de confirmation ou erreur
 */
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
