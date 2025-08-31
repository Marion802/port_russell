const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

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
      // Stocker le token JWT et rediriger vers le dashboard
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
