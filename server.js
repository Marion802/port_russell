require('dotenv').config();
const { connectDB } = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
