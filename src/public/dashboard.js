const token = localStorage.getItem('token');

// ----------------- Helper -----------------
function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.color = isError ? 'red' : 'green';
  setTimeout(() => el.textContent = '', 4000);
}

// ----------------- Listes -----------------
async function loadCatways() {
  try {
    const res = await fetch('/api/catways', { headers: { 'Authorization': `Bearer ${token}` }});
    const data = await res.json();
    const tbody = document.querySelector('#table-catways tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    data.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c._id}</td><td>${c.catwayNumber}</td><td>${c.type}</td><td>${c.catwayState}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}
loadCatways();

async function loadReservations() {
  try {
    const res = await fetch('/api/reservations', { headers: { 'Authorization': `Bearer ${token}` }});
    const data = await res.json();
    const tbody = document.querySelector('#table-reservations tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    data.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r._id}</td><td>${r.catwayNumber}</td><td>${r.clientName}</td><td>${r.boatName}</td><td>${r.checkIn?.slice(0,10)}</td><td>${r.checkOut?.slice(0,10)}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}
loadReservations();

// ----------------- Fonction générique pour formulaires -----------------
async function submitForm(formId, method, urlBuilder, fields) {
  const form = document.getElementById(formId);
  if(!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('form-message','');
    showMessage('form-error','');

    // Construire le body
    const body = {};
    fields.forEach(f => {
      const el = document.getElementById(f);
      if(el && el.value) body[f] = el.value;
    });

    // Construire URL
    const url = typeof urlBuilder === 'function' ? urlBuilder(body) : urlBuilder;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if(res.ok) {
        showMessage('form-message','Action réussie !', false);
        // Rafraîchir listes
        if(formId.includes('catway')) loadCatways();
        if(formId.includes('reservation')) loadReservations();
      } else {
        showMessage('form-error', data.error || 'Erreur', true);
      }
    } catch (err) {
      console.error(err);
      showMessage('form-error','Erreur serveur', true);
    }
  });
}

// ----------------- Utilisateurs -----------------
submitForm('create-user-form', 'POST', '/api/auth/register', ['user-name','user-email','user-password']);
submitForm('update-user-form', 'PUT', b => `/api/auth/${b['update-user-id']}`, ['update-user-id','update-user-name','update-user-email','update-user-password']);
submitForm('delete-user-form', 'DELETE', b => `/api/auth/${b['delete-user-id']}`, ['delete-user-id']);

// ----------------- Catways -----------------
submitForm('create-catway-form', 'POST', '/api/catways', ['catwayNumber','type','catwayState']);
submitForm('update-catway-form', 'PATCH', b => `/api/catways/${b['update-catway-id']}`, ['update-catway-id','update-catway-state']);
submitForm('delete-catway-form', 'DELETE', b => `/api/catways/${b['delete-catway-id']}`, ['delete-catway-id']);
submitForm('get-catway-form', 'GET', b => `/api/catways/${b['get-catway-id']}`, ['get-catway-id']);

// ----------------- Réservations -----------------
submitForm('create-reservation-form', 'POST', b => `/api/catways/${b['reservation-catway']}/reservations`, ['reservation-catway','reservation-client','reservation-boat','reservation-checkin','reservation-checkout']);
submitForm('delete-reservation-form', 'DELETE', b => `/api/catways/${b['delete-reservation-id']}/reservations/${b['delete-reservation-id']}`, ['delete-reservation-id']);
submitForm('get-reservation-form', 'GET', b => `/api/catways/${b['get-reservation-id']}/reservations/${b['get-reservation-id']}`, ['get-reservation-id']);
