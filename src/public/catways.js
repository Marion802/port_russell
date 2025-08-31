const token = localStorage.getItem('token'); // token JWT

async function loadCatways() {
  try {
    const res = await fetch('/api/catways', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const catways = await res.json();

    const tbody = document.querySelector('#table-catways tbody');
    tbody.innerHTML = '';

    catways.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c._id}</td>
        <td>${c.catwayNumber}</td>
        <td>${c.type}</td>
        <td>${c.catwayState}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

loadCatways();
