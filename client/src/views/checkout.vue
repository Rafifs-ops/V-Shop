<script setup>
import { onMounted, ref } from 'vue';
import NavVue from '@/components/Nav.vue';
import { useFetchCart } from '@/stores/useFetchCart';
import { useAuthStore } from '@/stores/useAuth';
import { useFetchHistory } from '@/stores/useHistory';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const api = ref(`${import.meta.env.VITE_API_BASE_URL}`);
const store = useFetchCart();
const historyStore = useFetchHistory();

// MEMERIKSA STATUS LOGIN
const { isAuthenticated, user } = useAuthStore();
if (!isAuthenticated) {
    router.push({ name: 'login' })
}
// AKHIR MEMERIKSA STATUS LOGIN

onMounted(() => {
    isLoading.value = true
    store.fetchCart()
    isLoading.value = false
})

// ----- PAYMENT GATEWAY ----
// Fungsi untuk menangani proses payment
async function handlePayment() {
    isLoading.value = true; // Mengaktifkan loading
    try {
        // 1. Panggil backend untuk membuat token transaksi
        const response = await fetch(`${api.value}/api/payment/getPay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                totalPrice: store.totalAmount,
                qty: store.totalQuantity
            })
        });

        if (!response.ok) { throw new Error('Gagal membuat transaksi'); } // jika fetch gagal, makan akan melempar error

        const transactionData = await response.json(); // Mendapatkan respon dari backend + konversi json -> kode js, output: objek
        const transactionToken = transactionData.token; // Mengakses nilai dari properti objek token (key)

        // 2. Panggil Midtrans Snap
        window.snap.pay(transactionToken, {
            onSuccess: async (result) => {
                /* Pembayaran berhasil! */
                console.log('Payment Success:', result);
                alert('Pembayaran berhasil !!!');
                historyStore.addHistory();
                store.removeCart();
                window.location.reload();
            },
            onPending: (result) => {
                /* Pembayaran pending */
                console.log('Payment Pending:', result);
                alert('Menunggu pembayaran Anda...');
                isLoading.value = false;
            },
            onError: (result) => {
                /* Pembayaran gagal */
                console.error('Payment Error:', result);
                alert('Pembayaran gagal. Silakan coba lagi.');
                isLoading.value = false;
            },
            onClose: () => {
                /* Popup ditutup tanpa transaksi */
                alert('Anda menutup popup pembayaran.');
                isLoading.value = false;
            }
        });

    } catch (error) {
        console.error('Error upgrading to premium:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
        isLoading.value = false;
    }
}
// ----- AKHIR PAYMENT GATEWAY ----
</script>

<template>
    <main>
        <NavVue />
        <div class="checkout-page">
            <header class="checkout-header">
                <h1>Ringkasan Pesanan</h1>
                <p>Silakan periksa kembali pesanan Anda sebelum melanjutkan.</p>
            </header>

            <main>
                <div v-if="!isLoading">
                    <div v-if="store.itemInCart.length === 0" class="empty-cart">
                        <h1>Keranjang Anda Masih Kosong nih !</h1>
                    </div>

                    <div v-else class="checkout-layout">
                        <div class="item-list">
                            <div v-for="(item, index) in store.itemInCart" :key="index" class="cart-item">
                                <div class="item-details">
                                    <img :src="`${api}${item.product.imageUrl}`" alt="Product Image"
                                        class="product-image">
                                    <div>
                                        <h2 class="product-name">{{ item.product.name }}</h2>
                                        <p class="product-quantity">Jumlah: {{ item.qty }}</p>
                                        <p class="product-price-each">${{ item.product.price.toLocaleString() }}</p>
                                    </div>
                                </div>
                                <div class="item-subtotal">
                                    <p>${{ item.product.price.toLocaleString() * item.qty }}</p>
                                </div>
                            </div>
                        </div>

                        <aside class="order-summary">
                            <div class="summary-row total">
                                <h2>Total Belanja</h2>
                                <span>$ {{ store.totalAmount }}</span>
                            </div>
                            <button v-if="!isLoading" class="checkout-btn" v-on:click="handlePayment">Checkout</button>
                            <button v-else class="checkout-btn" disabled>Loading...</button>
                        </aside>
                    </div>
                </div>
                <div v-else class="loading"></div>
            </main>
        </div>
    </main>
</template>


<style scoped>
/* Import font dari Google Fonts (opsional, tapi disarankan) */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Variabel warna untuk konsistensi */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --background-color: #f8f9fa;
    --surface-color: #ffffff;
    --text-color: #212529;
    --border-color: #dee2e6;
}

.checkout-page {
    font-family: 'Poppins', sans-serif;
    background-color: var(--background-color);
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.checkout-header {
    text-align: center;
    margin-bottom: 40px;
}

.checkout-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 8px;
}

.checkout-header p {
    font-size: 1.1rem;
    color: var(--secondary-color);
}

/* --- Layout Utama (Grid untuk responsif) --- */
.checkout-layout {
    display: grid;
    grid-template-columns: 1fr;
    /* Default 1 kolom untuk mobile */
    gap: 30px;
}

/* --- Daftar Item --- */
.item-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--surface-color);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    transition: box-shadow 0.3s ease;
}

.cart-item:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.item-details {
    display: flex;
    align-items: center;
    gap: 20px;
}

.product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.product-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: var(--text-color);
}

.product-quantity,
.product-price-each {
    font-size: 0.9rem;
    color: var(--secondary-color);
    margin: 0;
}

.item-subtotal {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-color);
}


/* --- Ringkasan Pesanan (Order Summary) --- */
.order-summary {
    background-color: var(--surface-color);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    /* `position: sticky` membuat ringkasan tetap terlihat saat scroll di desktop */
    position: sticky;
    top: 20px;
}

.order-summary h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 25px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 15px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    margin-bottom: 15px;
    color: var(--secondary-color);
}

.summary-row.total {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-color);
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
}

.checkout-btn {
    width: 100%;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    background-color: #0056b3;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 20px;
}

.checkout-btn:hover {
    transform: translateY(-2px);
}

.empty-cart {
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading {
    margin: 0 auto;
    width: 80px;
    height: 80px;
    border: 10px solid black;
    border-top: 10px solid #007bff;
    border-radius: 50%;
    animation-name: loading;
    animation-iteration-count: infinite;
    animation-duration: 1s;
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* --- Breakpoint untuk Responsif (Tablet dan Desktop) --- */
/* Tampilan 2 kolom untuk layar yang lebih besar dari 992px */
@media (min-width: 992px) {
    .checkout-layout {
        /* 2fr untuk list item, 1fr untuk summary */
        grid-template-columns: 2fr 1fr;
    }
}

/* Sedikit penyesuaian untuk layar mobile yang lebih kecil */
@media (max-width: 480px) {
    .checkout-page {
        padding: 10px;
    }

    .checkout-header h1 {
        font-size: 2rem;
    }

    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .item-subtotal {
        align-self: flex-end;
        /* Pindahkan subtotal ke kanan bawah */
    }
}
</style>