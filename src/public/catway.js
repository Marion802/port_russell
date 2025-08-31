const token = localStorage.getItem('token');

// Récupérer l'id depuis l'URL, ex : catway.html?id=123456
const params = new URLSearchParams(window.location.search);
const catwayId = params.get('id');

async function loadCatway() {
  try {
    const res = await fetch(`/api/catways/${catwayId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const c = await res.json();

    if (c.error) {
      alert(c.error);
      return;
    }

    document.getElementById('catway-id').textContent = c._id;
    document.getElementById('catway-number').textContent = c.catwayNumber;
    document.getElementById('catway-type').textContent = c.type;
    document.getElementById('catway-state').textContent = c.catwayState;
  } catch (err) {
    console.error(err);
  }
}

loadCatway();
