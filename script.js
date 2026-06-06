// Sample products - EDIT THESE TO ADD YOUR OWN ITEMS!
const products = [
    {
        id: 1,
        name: "Product 1",
        description: "Description of your product",
        price: 29.99,
        emoji: "📱"
    },
    {
        id: 2,
        name: "Product 2",
        description: "Description of your product",
        price: 39.99,
        emoji: "📷"
    },
    {
        id: 3,
        name: "Product 3",
        description: "Description of your product",
        price: 49.99,
        emoji: "🎧"
    },
    {
        id: 4,
        name: "Product 4",
        description: "Description of your product",
        price: 19.99,
        emoji: "🎮"
    },
    {
        id: 5,
        name: "Product 5",
        description: "Description of your product",
        price: 59.99,
        emoji: "⌚"
    },
    {
        id: 6,
        name: "Product 6",
        description: "Description of your product",
        price: 24.99,
        emoji: "📚"
    }
];

// Shopping cart
let cart = [];

// Initialize the shop
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCartFromStorage();
    updateCartCount();
});

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    saveCartToStorage();
    showNotification('Added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    if (modal.style.display === 'block') {
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartEmptyDiv = document.getElementById('cart-empty');
    const totalPriceSpan = document.getElementById('total-price');

    if (cart.length === 0) {
        cartItemsDiv.style.display = 'none';
        cartEmptyDiv.style.display = 'block';
        totalPriceSpan.textContent = '0.00';
        return;
    }

    cartItemsDiv.style.display = 'block';
    cartEmptyDiv.style.display = 'none';

    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    totalPriceSpan.textContent = total.toFixed(2);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order total: $${total.toFixed(2)}\n\nThank you for your purchase!\n\nThis is a demo shop. In a real scenario, you would process payment here.`);
    
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    toggleCart();
}

// Save cart to browser storage
function saveCartToStorage() {
    localStorage.setItem('novamart-cart', JSON.stringify(cart));
}

// Load cart from browser storage
function loadCartFromStorage() {
    const saved = localStorage.getItem('novamart-cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
