
/* =========================================
   SHOEASE - E-COMMERCE APPLICATION
   ========================================= */

// API URL
const API_URL = "https://fakestoreapi.com/products";

// Get HTML elements
const productGrid = document.getElementById("productGrid");
const loadingMessage = document.getElementById("loadingMessage");
const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");

const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const shippingElement = document.getElementById("shipping");
const totalElement = document.getElementById("total");

const checkoutButton = document.getElementById("checkoutButton");

const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const continueShopping = document.getElementById("continueShopping");

// Application data
let products = [];

let cart = JSON.parse(localStorage.getItem("shopeaseCart")) || [];

let selectedCategory = "all";

// Currency formatter
const formatPrice = (price) => {
    return "₹" + (price * 83).toFixed(2);
};

// =========================================
// 1. FETCH PRODUCTS FROM FAKESTORE API
// =========================================

async function fetchProducts() {

    try {

        loadingMessage.textContent = "Loading products...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        loadingMessage.style.display = "none";

        displayProducts(products);

    } catch (error) {

        loadingMessage.style.display = "block";

        loadingMessage.textContent =
            "Unable to load products. Please refresh the page.";

        console.error("API Error:", error);

    }

}

// =========================================
// 2. DISPLAY PRODUCT CARDS
// =========================================

function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p class="empty-message">
                No products found. Try another search.
            </p>
        `;

        return;
    }

    productList.forEach(product => {

        let badge = "";

        if (product.rating.rate >= 4.5) {
            badge = "Popular";
        } else if (product.rating.count > 200) {
            badge = "Featured";
        } else if (product.price < 30) {
            badge = "Sale";
        }

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image-container">

                ${badge ? `<span class="product-badge">${badge}</span>` : ""}

                <img
                    src="${product.image}"
                    alt="${product.title}"
                    class="product-image"
                >

            </div>

            <div class="product-details">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <div class="product-rating">
                    ★ ${product.rating.rate}
                    <span>(${product.rating.count} reviews)</span>
                </div>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <button
                    class="add-to-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        `;

        productGrid.appendChild(card);

    });

}

// =========================================
// 3. SEARCH PRODUCTS
// =========================================

function searchProducts() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            getCategoryGroup(product.category) === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);

}

// =========================================
// 4. CATEGORY FILTERING
// =========================================

function getCategoryGroup(category) {

    if (category === "electronics") {
        return "electronics";
    }

    if (category === "jewelery") {
        return "jewelery";
    }

    return "clothing";

}

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        searchProducts();

    });

});

// Search event
searchInput.addEventListener("input", searchProducts);

// =========================================
// 5. ADD TO CART
// =========================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    renderCart();

}

// =========================================
// 6. REMOVE FROM CART
// =========================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    renderCart();

}

// =========================================
// 7. UPDATE PRODUCT QUANTITY
// =========================================

function updateQuantity(productId, change) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(productId);

    } else {

        saveCart();

        renderCart();

    }

}

// =========================================
// 8. SAVE CART IN LOCAL STORAGE
// =========================================

function saveCart() {

    localStorage.setItem(
        "shopeaseCart",
        JSON.stringify(cart)
    );

}

// =========================================
// 9. CART TOTAL CALCULATIONS
// =========================================

function calculateSubtotal() {

    return cart.reduce((sum, item) => {

        return sum + (item.price * item.quantity);

    }, 0);

}

function calculateTax() {

    return calculateSubtotal() * 0.05;

}

function calculateShipping() {

    if (cart.length === 0) {
        return 0;
    }

    return calculateSubtotal() >= 5000 ? 0 : 100;

}

function calculateTotal() {

    return calculateSubtotal() +
        calculateTax() +
        calculateShipping();

}

// =========================================
// 10. DISPLAY CART ITEMS
// =========================================

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="cart-empty">
                Your shopping cart is empty.
            </p>
        `;

    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.title}"
                class="cart-item-image"
            >

            <div class="cart-item-details">

                <h4 class="cart-item-title">
                    ${item.title}
                </h4>

                <p class="cart-item-price">
                    ${formatPrice(item.price)}
                </p>

                <div class="quantity-controls">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                    >−</button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                    >+</button>

                    <button
                        class="remove-btn"
                        data-action="remove"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });

    // Update cart count
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    cartCount.textContent = totalItems;

    // Update price calculations
    subtotalElement.textContent =
        formatPrice(calculateSubtotal());

    taxElement.textContent =
        formatPrice(calculateTax());

    shippingElement.textContent =
        formatPrice(calculateShipping());

    totalElement.textContent =
        formatPrice(calculateTotal());

    checkoutButton.disabled = cart.length === 0;

}

// =========================================
// 11. PRODUCT AND CART BUTTON EVENTS
// =========================================

productGrid.addEventListener("click", event => {

    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);

    button.textContent = "Added ✓";

    setTimeout(() => {
        button.textContent = "Add to Cart";
    }, 1000);

});

cartItems.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    if (action === "increase") {
        updateQuantity(productId, 1);
    }

    if (action === "decrease") {
        updateQuantity(productId, -1);
    }

    if (action === "remove") {
        removeFromCart(productId);
    }

});

// =========================================
// 12. OPEN AND CLOSE CART DRAWER
// =========================================

function openCartDrawer() {

    cartDrawer.classList.add("active");

    overlay.classList.add("active");

}

function closeCartDrawer() {

    cartDrawer.classList.remove("active");

    overlay.classList.remove("active");

}

cartButton.addEventListener("click", openCartDrawer);

closeCart.addEventListener("click", closeCartDrawer);

overlay.addEventListener("click", closeCartDrawer);

// =========================================
// 13. CHECKOUT
// =========================================

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) return;

    cart = [];

    saveCart();

    renderCart();

    closeCartDrawer();

    checkoutModal.classList.add("active");

});

function closeCheckoutModal() {

    checkoutModal.classList.remove("active");

}

closeModal.addEventListener("click", closeCheckoutModal);

continueShopping.addEventListener(
    "click",
    closeCheckoutModal
);

// =========================================
// 14. INITIALIZE APPLICATION
// =========================================

fetchProducts();

renderCart();
