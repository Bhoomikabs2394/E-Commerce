async function fetchProducts(){
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

const CART = [];

function renderProducts(products){
  const root = document.getElementById('products');
  root.innerHTML = '<h2>Available Products</h2>';
  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div>₹${p.price.toFixed(2)}</div>
      <div style="margin-top:8px">
        <button class="add" data-id="${p.id}">Add to Cart</button>
      </div>`;
    root.appendChild(el);
  });
  root.querySelectorAll('button.add').forEach(btn =>
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id,10),1))
  );
}

function addToCart(id, qty){
  const item = CART.find(x=>x.id===id);
  if(item) item.qty += qty; else CART.push({id, qty});
  renderCart();
}

function renderCart(){
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  if(CART.length===0){ list.innerHTML = '<li>No items added yet</li>'; return; }
  CART.forEach(item => {
    const prodEl = document.querySelector(`[data-id="${item.id}"]`);
    const name = prodEl ? prodEl.closest('.product').querySelector('h3').textContent : `Product ${item.id}`;
    const li = document.createElement('li');
    li.textContent = `${name} × ${item.qty}`;
    list.appendChild(li);
  });
}

async function checkout(){
  const coupon = document.getElementById('coupon').value.trim();
  const out = document.getElementById('result');
  if(CART.length===0){ out.textContent = 'Cart is empty.'; return; }
  try{
    const res = await fetch('/api/checkout', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({cart:CART, coupon})
    });
    const data = await res.json();
    if(res.ok){
      out.innerHTML = `<strong>Subtotal:</strong> ₹${data.subtotal}<br><strong>Total:</strong> ₹${data.total}`;
    } else {
      out.textContent = 'Error: ' + (data.error||JSON.stringify(data));
    }
  } catch(e){
    console.error(e);
    out.textContent = 'Checkout failed (see console)';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  renderProducts(products);
  document.getElementById('checkout').addEventListener('click', checkout);
});
