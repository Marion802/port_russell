const token = localStorage.getItem('token');

async function loadReservations() {
  try {
    const res = await fetch('/api/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const reservations = await res.json();

    const tbody = document.querySelector('#table-reservations tbody');
    tbody.innerHTML = '';

    reservations.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r._id}</td>
        <td>${r.catwayNumber}</td>
        <td>${r.clientName}</td>
        <td>${r.boatName}</td>
        <td>${r.checkIn?.slice(0,10)}</td>
        <td>${r.checkOut?.slice(0,10)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

loadReservations();
