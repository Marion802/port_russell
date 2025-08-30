const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// page d'accueil très simple (on fera la vraie plus tard)
app.get('/', (req, res) => {
  res.status(200).send({
    app: 'Port de Plaisance Russell API',
    docs: '/docs',
    status: 'OK'
  });
});

// futur préfixe pour l’API
app.use('/api', routes);

// 404 + handler d’erreurs
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
