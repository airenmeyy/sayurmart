document.addEventListener('DOMContentLoaded', () => {

    // ===== DATA DUMMY =====
    const products = [
        { id: 1, name: 'Bayam Segar', price: 5000, image: 'https://placehold.co/300x300/22c55e/ffffff?text=Bayam', isNew: true, category: 'Sayuran' },
        { id: 2, name: 'Kangkung Organik', price: 4500, image: 'https://placehold.co/300x300/16a34a/ffffff?text=Kangkung', isNew: false, category: 'Sayuran' },
        { id: 3, name: 'Wortel Impor', price: 8000, image: 'https://placehold.co/300x300/f97316/ffffff?text=Wortel', isNew: true, category: 'Sayuran' },
        { id: 4, name: 'Tomat Ceri', price: 7500, image: 'https://placehold.co/300x300/ef4444/ffffff?text=Tomat', isNew: false, category: 'Buah' },
        { id: 5, name: 'Timun Baby', price: 6000, image: 'https://placehold.co/300x300/84cc16/ffffff?text=Timun', isNew: true, category: 'Sayuran' },
        { id: 6, name: 'Brokoli Hidroponik', price: 12000, image: 'https://placehold.co/300x300/4d7c0f/ffffff?text=Brokoli', isNew: false, category: 'Sayuran' },
        { id: 7, name: 'Cabai Merah Keriting', price: 15000, image: 'https://placehold.co/300x300/dc2626/ffffff?text=Cabai', isNew: true, category: 'Bumbu' },
        { id: 8, name: 'Bawang Putih Kupas', price: 3000, image: 'https://placehold.co/300x300/d1d5db/000000?text=Bawang', isNew: false, category: 'Bumbu' },
    ];

    // ===== STATE APLIKASI =====
    let cart = [];

    // ===== ELEMEN DOM =====
    const productsGrid = document.getElementById('products-grid');
    const cartCount = document.getElementById('cart-count');
    const toast = document.getElementById('toast');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const cartButton = document.getElementById('cart-button');
    const backToShopButton = document.getElementById('back-to-shop-button');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    const totalPriceEl = document.getElementById('total-price');
    const shopNowBtn = document.getElementById('shop-now-btn');
    const productsSection = document.getElementById('products-section');

    // ===== FUNGSI-FUNGSI =====

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    const renderProducts = () => {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const newBadge = product.isNew ? '<span class="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">BARU</span>' : '';
            const productCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden group relative border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    ${newBadge}
                    <div class="h-56 overflow-hidden">
                         <img src="${product.image}" alt="[Gambar ${product.name}]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="p-4 text-center">
                        <h4 class="text-lg font-semibold text-gray-800 truncate">${product.name}</h4>
                        <p class="text-xl font-bold text-green-600 mt-1">${formatRupiah(product.price)}</p>
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                         <button data-product-id="${product.id}" class="add-to-cart-btn bg-white text-green-600 font-bold py-2 px-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        showToast();
    };

    const updateCartUI = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    };

    const showToast = () => {
        toast.classList.remove('hidden');
        toast.classList.add('toast-notification');
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.remove('toast-notification');
        }, 3000);
    };
    
    const showCheckout = () => {
        if (cart.length === 0) {
            alert("Keranjang Anda kosong. Silakan belanja dulu!");
            return;
        }
        renderCheckoutSummary();
        checkoutOverlay.classList.remove('hidden');
    };

    const hideCheckout = () => {
        checkoutOverlay.classList.add('hidden');
    };
    
    const renderCheckoutSummary = () => {
        orderSummary.innerHTML = '';
        let totalPrice = 0;
        if (cart.length === 0) {
            orderSummary.innerHTML = '<p class="text-gray-500">Tidak ada item di keranjang.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                const summaryItem = `
                    <div class="flex justify-between items-center text-sm">
                        <div>
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-gray-600">${formatRupiah(item.price)} x ${item.quantity}</p>
                        </div>
                        <p class="font-semibold">${formatRupiah(itemTotal)}</p>
                    </div>
                `;
                orderSummary.innerHTML += summaryItem;
            });
        }
        totalPriceEl.textContent = formatRupiah(totalPrice);
    };
    
    const handleOrderSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(checkoutForm);
        const name = formData.get('name');
        const address = formData.get('address');
        let whatsappNumber = formData.get('whatsapp');

        if (!/^[0-9]{10,15}$/.test(whatsappNumber)) {
            alert("Mohon masukkan nomor WhatsApp yang valid.");
            return;
        }
        
        if (whatsappNumber.startsWith('0')) {
            whatsappNumber = '62' + whatsappNumber.substring(1);
        }

        let message = `Halo SayurMart, saya mau pesan:\n\n`;
        let totalPrice = 0;
        cart.forEach(item => {
            message += `*${item.name}* - ${item.quantity} x ${formatRupiah(item.price)}\n`;
            totalPrice += item.price * item.quantity;
        });
        message += `\n*Total Pesanan: ${formatRupiah(totalPrice)}*\n\n`;
        message += `Berikut data pengiriman saya:\n`;
        message += `Nama: *${name}*\n`;
        message += `Alamat: *${address}*\n`;
        message += `No. WA: *${formData.get('whatsapp')}*\n\n`;
        message += `Terima kasih!`;

        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    // ===== EVENT LISTENERS =====
    productsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.dataset.productId);
            addToCart(productId);
        }
    });
    
    cartButton.addEventListener('click', showCheckout);
    closeCheckoutBtn.addEventListener('click', hideCheckout);
    backToShopButton.addEventListener('click', hideCheckout);
    checkoutForm.addEventListener('submit', handleOrderSubmit);
    shopNowBtn.addEventListener('click', () => {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // ===== INISIALISASI APLIKASI =====
    renderProducts();
});