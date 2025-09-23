const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @route POST /api/auth/register
 * @description Crée un nouvel utilisateur et retourne un token JWT
 * @param {string} req.body.name - Nom de l'utilisateur
 * @param {string} req.body.email - Email unique de l'utilisateur
 * @param {string} req.body.password - Mot de passe
 * @returns {Object} user - Informations de l'utilisateur (name, email)
 * @returns {string} token - Token JWT valide pour 1 jour
 */
router.post('/register', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/auth/login
 * @description Connecte un utilisateur existant et retourne un token JWT
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe
 * @returns {Object} user - Informations de l'utilisateur (name, email)
 * @returns {string} token - Token JWT valide pour 1 jour
 * @throws 401 - Si l'utilisateur n'existe pas ou le mot de passe est incorrect
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

