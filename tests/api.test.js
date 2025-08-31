const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const chai = require('chai');
const expect = chai.expect;

require('dotenv').config({ path: '.env.test' });

describe('API Port Russell', function() {
  let token;

  before(async function() {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  beforeEach(async function() {
    await mongoose.connection.db.dropDatabase();

    // Crée un utilisateur de test et récupère le token à chaque test
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Testeur',
        email: 'test@example.com',
        password: 'test1234'
      });
    token = res.body.token;
  });

  // ==== Catways ====
  it('Créer un catway', async function() {
    const res = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 101, type: 'long', catwayState: 'Libre' });
    expect(res.status).to.equal(201);
    expect(res.body.catwayNumber).to.equal(101);
  });

  it('Lister tous les catways', async function() {
    // Crée un catway d'abord
    await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 101, type: 'long', catwayState: 'Libre' });

    const res = await request(app).get('/api/catways').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Récupérer un catway par ID', async function() {
    // Crée un catway d'abord
    const createRes = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 101, type: 'long', catwayState: 'Libre' });
    const catwayId = createRes.body._id;

    const res = await request(app).get(`/api/catways/${catwayId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(catwayId);
  });

  it('Modifier un catway', async function() {
    // Crée un catway d'abord
    const createRes = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 101, type: 'long', catwayState: 'Libre' });
    const catwayId = createRes.body._id;

    const res = await request(app)
      .patch(`/api/catways/${catwayId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayState: 'Occupé' });
    expect(res.status).to.equal(200);
    expect(res.body.catwayState).to.equal('Occupé');
  });

  it('Supprimer un catway', async function() {
    // Crée un catway d'abord
    const createRes = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 101, type: 'long', catwayState: 'Libre' });
    const catwayId = createRes.body._id;

    const res = await request(app).delete(`/api/catways/${catwayId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });

  // ==== Réservations ====
  it('Créer une réservation', async function() {
    // Crée un catway pour la réservation
    await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 102, type: 'short', catwayState: 'Libre' });

    const res = await request(app)
      .post(`/api/catways/102/reservations`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientName: 'Mario',
        boatName: 'Sea Breeze',
        checkIn: '2025-09-01',
        checkOut: '2025-09-05'
      });
    expect(res.status).to.equal(201);
  });

  it('Lister toutes les réservations d’un catway', async function() {
    // Crée un catway et une réservation d'abord
    await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 102, type: 'short', catwayState: 'Libre' });

    await request(app)
      .post(`/api/catways/102/reservations`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientName: 'Mario',
        boatName: 'Sea Breeze',
        checkIn: '2025-09-01',
        checkOut: '2025-09-05'
      });

    const res = await request(app).get('/api/catways/102/reservations').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Récupérer une réservation par ID', async function() {
    // Crée un catway et une réservation d'abord
    await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 102, type: 'short', catwayState: 'Libre' });

    const createRes = await request(app)
      .post(`/api/catways/102/reservations`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientName: 'Mario',
        boatName: 'Sea Breeze',
        checkIn: '2025-09-01',
        checkOut: '2025-09-05'
      });
    const reservationId = createRes.body._id;

    const res = await request(app).get(`/api/catways/102/reservations/${reservationId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(reservationId);
  });

  it('Supprimer une réservation', async function() {
    // Crée un catway et une réservation d'abord
    await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 102, type: 'short', catwayState: 'Libre' });

    const createRes = await request(app)
      .post(`/api/catways/102/reservations`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientName: 'Mario',
        boatName: 'Sea Breeze',
        checkIn: '2025-09-01',
        checkOut: '2025-09-05'
      });
    const reservationId = createRes.body._id;

    const res = await request(app).delete(`/api/catways/102/reservations/${reservationId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });

});