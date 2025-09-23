/**
 * @file login.js
 * @description Gestion de la connexion de l'utilisateur pour accéder au dashboard.
 */

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

/**
 * Événement de soumission du formulaire de connexion.
 * Récupère l'email et le mot de passe, effectue la requête POST sur /api/auth/login,
 * et stocke le token JWT dans le localStorage si la connexion réussit.
 */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      /**
       * Stockage du token JWT pour authentification sur les autres requêtes.
       * Redirection vers le dashboard.
       */
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      loginError.textContent = data.error || 'Erreur lors de la connexion';
    }
  } catch (err) {
    console.error(err);
    loginError.textContent = 'Erreur serveur';
  }
});
