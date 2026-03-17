<script setup>
import { onMounted, ref, computed } from 'vue';
import NavVue from '@/components/Nav.vue';
import { useFetchHistory } from '@/stores/useHistory';
import { useAuthStore } from '@/stores/useAuth'
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const api = ref(`${import.meta.env.VITE_API_BASE_URL}`);

// MEMERIKSA STATUS LOGIN
const { isAuthenticated, user } = useAuthStore();
if (!isAuthenticated) {
    router.push({ name: 'login' })
}
// AKHIR MEMERIKSA STATUS LOGIN

const store = useFetchHistory();
onMounted(async () => {
    isLoading.value = true;
    await store.fetchHistory();
    isLoading.value = false;
})

const reversedHistory = computed(() => {
    // Membuat salinan array terlebih dahulu menggunakan sprea operartor(menyalin seluruh nilai) sebelum direverse
    // Agar tidak terjadi looping function (fungsi yang berulang terus-menerus)
    return [...store.itemInHistory].reverse();
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
    // Hasil: 15 Oktober 2023
}

async function handleDeleteItem(itemId, productName) {
    await store.deleteHistoryItem(user.id, itemId);
    alert(`Item ${productName} berhasil dihapus!`)
}
</script>

<template>
    <main>
        <NavVue />
        <div class="checkout-page">
            <header class="checkout-header">
                <h1>Riwayat Pesanan</h1>
                <p>Pesanan yang telah Anda beli</p>
            </header>

            <main v-if="!isLoading" class="checkout-layout">

                <div v-if="store.itemInHistory.length == 0">
                    <h1>Anda belum membeli apapun !!!</h1>
                </div>

                <div v-else class="item-list">
                    <div v-for="(item, index) in reversedHistory" :key="index" class="cart-item">
                        <div class="item-details">
                            <img :src="`${api}${item.product.imageUrl}`" alt="Product Image" class="product-image">
                            <div>
                                <h2 class="product-name">{{ item.product.name }}</h2>
                                <p class="product-quantity">Jumlah: {{ item.qty }}</p>
                                <p class="product-price-each">Rp {{ item.product.price.toLocaleString() }}</p>
                                <p>Date: {{ formatDate(item.date) }}</p>
                            </div>
                        </div>
                        <div class="item-subtotal">
                            <p>Rp {{ item.product.price * item.qty }}</p>
                            <button class="delete-btn" @click="handleDeleteItem(item._id, item.product.name)"><i
                                    class="bi bi-trash-fill"></i></button>
                        </div>
                    </div>
                </div>

            </main>

            <div v-else class="loading"></div>
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
    background: linear-gradient(135deg, #2c3e50, #4a69bd);
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

.delete-btn {
    background-color: red;
    border-radius: 15px;
    border: none;
    padding: 2px 10px;
}

.delete-btn:hover {
    transform: scale(1.5);
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

@media (min-width: 992px) {
    .checkout-layout {
        /* 2fr untuk list item */
        grid-template-columns: 2fr;
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
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 20%;
        /* Pindahkan subtotal ke kanan bawah */
    }
}
</style>