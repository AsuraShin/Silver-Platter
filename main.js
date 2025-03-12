document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('.cart-icon span');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon'); 
    const sidebar = document.getElementById('sidebar');
    const checkoutButton = document.querySelector('.Checkout-btn');
    const checkoutForm = document.getElementById('checkoutForm');
    const confirmButton = document.getElementById('confirmPurchase');
    const cancelCheckoutButton = document.getElementById('cancelCheckout');
    const nameInput = document.getElementById('customerName');
    const addressInput = document.getElementById('customerAddress');
    const contactInput = document.getElementById('customerContact');
    const searchInput = document.querySelector('.search--box input'); // Search input
    const menuItems = document.querySelectorAll('.card'); // Target menu items
    const scrollUpButton = document.createElement('button'); // Scroll-up button

    let cartItems = [];
    let totalAmount = 0;

    checkoutForm.style.display = 'none';

    // 🔼 Scroll-Up Button Setup
    scrollUpButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollUpButton.classList.add('scroll-up-btn');
    document.body.appendChild(scrollUpButton);

    scrollUpButton.style.position = 'fixed';
    scrollUpButton.style.bottom = '20px';
    scrollUpButton.style.right = '20px';
    scrollUpButton.style.padding = '10px 15px';
    scrollUpButton.style.fontSize = '18px';
    scrollUpButton.style.background = '#ff4500';
    scrollUpButton.style.color = '#fff';
    scrollUpButton.style.border = 'none';
    scrollUpButton.style.borderRadius = '5px';
    scrollUpButton.style.cursor = 'pointer';
    scrollUpButton.style.display = 'none'; // Initially hidden

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollUpButton.style.display = 'block';
        } else {
            scrollUpButton.style.display = 'none';
        }
    });

    scrollUpButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const item = {
                name: document.querySelectorAll('.card .card--title')[index].textContent,
                price: parseFloat(document.querySelectorAll('.price')[index].textContent),
                quantity: 1,
            };

            const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }

            totalAmount += item.price;
            updateCartUI();
        });
    });

    function updateCartUI() {
        updateCartItemCount(cartItems.length);
        updateCartItemList();
        updateCartTotal();
    }

    function updateCartItemCount(count) {
        cartItemCount.textContent = count;
    }

    function updateCartItemList() {
        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');
            cartItem.innerHTML = `
                <span> (${item.quantity}x) ${item.name}</span>
                <span class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" data-index="${index}">
                    <i class="fa-solid fa-times"></i>
                </button>
            `;

            cartItemsList.append(cartItem);
        });

        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                removeItemFromCart(index);
            });
        });
    }

    function removeItemFromCart(index) {
        const removedItem = cartItems.splice(index, 1)[0];
        totalAmount -= removedItem.price * removedItem.quantity;
        updateCartUI();
    }

    function updateCartTotal() {
        cartTotal.textContent = `₱${totalAmount.toFixed(2)}`;
    }

    cartIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    const closeButton = document.querySelector('.sidebar-close');
    closeButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Checkout Feature
    checkoutButton.addEventListener('click', () => {
        if (cartItems.length > 0) {
            checkoutForm.style.display = 'flex';
            validateCheckoutForm();
        } else {
            alert('Your cart is empty! Please add items before checking out.');
        }
    });

    cancelCheckoutButton.addEventListener('click', () => {
        checkoutForm.style.display = 'none';
    });

    function validateCheckoutForm() {
        if (
            nameInput.value.trim() !== '' &&
            addressInput.value.trim() !== '' &&
            contactInput.value.trim() !== '' &&
            cartItems.length > 0
        ) {
            confirmButton.disabled = false;
        } else {
            confirmButton.disabled = true;
        }
    }

    [nameInput, addressInput, contactInput].forEach(input => {
        input.addEventListener('input', validateCheckoutForm);
    });

    confirmButton.addEventListener('click', () => {
        alert('We will Contact you for order confirmation. Delivery will be on the way after confirmation!');
        checkoutForm.style.display = 'none';

        // Clear Cart
        cartItems = [];
        totalAmount = 0;
        updateCartUI();
    });

    // 🔍 SEARCH FUNCTIONALITY
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase().trim();

        menuItems.forEach(item => {
            const itemName = item.querySelector('.card--title').textContent.toLowerCase();
            
            if (itemName.includes(searchText)) {
                item.style.display = 'flex'; // Show matching items
            } else {
                item.style.display = 'none'; // Hide non-matching items
            }
        });
    });

});