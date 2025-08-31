const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ➡️ POST /api/auth/register → créer un nouvel utilisateur
router.post('/register', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
});

// ➡️ POST /api/auth/login → connexion
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
