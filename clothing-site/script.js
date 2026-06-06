let selectedSize = null;

// =========================
// SIZE SELECTION (PRODUCT PAGE)
// =========================
function selectSize(size, btn) {
  selectedSize = size;

  document.querySelectorAll(".size-btn").forEach(b => {
    b.classList.remove("active");
  });

  btn.classList.add("active");

  document.getElementById("buyBtn").disabled = false;
  document.getElementById("addCartBtn").disabled = false;
}

// =========================
// ADD TO CART
// reads name + price from the page dynamically
// =========================
function addToCart() {
  if (!selectedSize) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const nameEl  = document.getElementById("product-name");
  const priceEl = document.querySelector(".product-info p");

  const name  = nameEl  ? nameEl.innerText  : "Product";
  const price = priceEl ? parseInt(priceEl.innerText.replace("$", "")) : 0;

  const product = {
    id: Date.now(),
    name: name,
    price: price,
    size: selectedSize,
    selected: true
  };

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  showCartPopup();
}

// =========================
// BUY NOW (PRODUCT PAGE)
// =========================
function buyNow() {
  if (!selectedSize) return;

  const nameEl = document.getElementById("product-name");
  const name   = nameEl ? nameEl.innerText : "Product";

  alert(`Buying ${name} (Size ${selectedSize})`);
}

// =========================
// TOGGLE SELECT
// =========================
function toggleSelect(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.map(item => {
    if (item.id === id) {
      return { ...item, selected: !item.selected };
    }
    return item;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
}

// =========================
// REMOVE ITEM
// =========================
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =========================
// CART POPUP / PANEL
// =========================
function showCartPopup() {
  if (typeof openCart === "function") {
    openCart();
    return;
  }

  let cart  = JSON.parse(localStorage.getItem("cart")) || [];
  let popup = document.getElementById("cartPopup");
  if (!popup) return;

  let total = 0;
  popup.innerHTML = "<h3>Cart</h3>";

  cart.forEach(item => {
    if (item.selected) total += item.price;
    popup.innerHTML += `
      <div style="margin-bottom:10px;">
        <p>${item.name} - Size ${item.size} - $${item.price}</p>
      </div>
    `;
  });

  popup.innerHTML += `
    <hr>
    <strong>Total: $${total}</strong>
    <br><br>
    <button onclick="buySelected()">Buy Selected</button>
  `;

  popup.style.display = "block";

  setTimeout(() => popup.classList.add("fade-out"), 5000);
  setTimeout(() => {
    popup.style.display = "none";
    popup.classList.remove("fade-out");
  }, 6500);
}

// =========================
// BUY SELECTED
// =========================
function buySelected() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let selectedItems = cart.filter(item => item.selected);

  if (selectedItems.length === 0) {
    alert("No items selected");
    return;
  }

  let total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  alert(
    "Buying:\n\n" +
    selectedItems.map(i => `${i.name} (Size ${i.size})`).join("\n") +
    "\n\nTotal: $" + total
  );
}

// =========================
// CART PAGE RENDER
// =========================
function renderCartPage() {
  let cart      = JSON.parse(localStorage.getItem("cart")) || [];
  let container = document.getElementById("cartContainer");
  let totalEl   = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  let total = 0;
  container.innerHTML = "";

  cart.forEach(item => {
    if (item.selected) total += item.price;

    container.innerHTML += `
      <div class="cart-item">
        <div
          class="select-btn ${item.selected ? "selected" : ""}"
          onclick="toggleSelect(${item.id}); renderCartPage();"
        ></div>
        <div class="item-info">
          <p class="item-name"><strong>${item.name}, ${item.size}</strong></p>
        </div>
        <div class="right-side">
          <span class="price">$${item.price}</span>
          <span class="remove-x" onclick="removeFromCart(${item.id}); renderCartPage();">✕</span>
        </div>
      </div>
    `;
  });

  totalEl.innerText = "Total: $" + total;
}

// =========================
// BUY NOW (CART PAGE)
// =========================
function buyNowCart() {
  let cart          = JSON.parse(localStorage.getItem("cart")) || [];
  let selectedItems = cart.filter(item => item.selected);

  if (selectedItems.length === 0) {
    alert("No items selected");
    return;
  }

  let total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  alert(
    "Checkout Ready:\n\n" +
    selectedItems.map(i => `${i.name} (Size ${i.size})`).join("\n") +
    "\n\nTotal: $" + total +
    "\n\n(Stripe will be added next)"
  );
}