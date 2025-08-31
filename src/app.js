const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // ⚠️ tu sembles avoir un index.js dans routes ?

const app = express();
app.use(cors());
app.use(express.json());

// ✅ chemins corrigés
app.use('/api/auth', require('./routes/auth'));
app.use('/api/catways', require('./routes/catways'));
app.use(express.static('src/public'));


// middleware erreur
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// page d'accueil très simple 
app.get('/', (req, res) => {
  res.status(200).send({
    app: 'Port de Plaisance Russell API',
    docs: '/docs',
    status: 'OK'
  });
});

// futur préfixe pour l’API (si tu utilises un index.js dans routes/)
app.use('/api', routes);

// 404 + handler d’erreurs
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

module.exports = app;
