<script setup>
import { onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useFetchCart } from '@/stores/useFetchCart';
import { useAuthStore } from '@/stores/useAuth';

const router = useRouter();
const { logout, user } = useAuthStore();
function handleLogout() {
    logout();
    router.push({name: 'login'})
}

const store = useFetchCart()
onMounted(() => {
    store.fetchCart()
})

async function deleteItems(cartId) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/delete/user/${user.id}/product`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cart_id: cartId })
        })
        if (response.ok) {
            console.log('Data berhasil dihapus');
            // Panggil fetchProduct hanya jika berhasil
            await store.fetchCart();
            alert("Produk berhasil dihapus");
        } else {
            // Mengambil pesan error dari server jika ada
            const errorData = await response.json();
            console.error('Gagal menghapus data:', errorData.message || response.statusText);
            alert("Gagal menghapus produk: " + (errorData.message || "Terjadi kesalahan"));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
</script>

<template>
    <nav>
        <RouterLink to="/" class="nav-brand">V-Shop</RouterLink>
        <div class="left-menu">
            <div class="cart-container">
                <button><i class="bi bi-cart-fill"></i> : {{ store.totalQuantity }}</button>

                <div class="cart-dropdown">
                    <div v-if="store.itemInCart.length === 0" class="cart-item empty">
                        Keranjang masih kosong.
                    </div>
                    <div v-for="item in store.itemInCart" :key="item._id" class="cart-item">
                        <div>
                            <h3>{{ item.product.name }}</h3>
                            <p>qty: {{ item.qty }}</p>
                        </div>
                        <div>
                            <button @click="deleteItems(item._id)" class="delete-btn">Delete</button>
                            <p>$ {{ item.product.price * item.qty }}</p>
                        </div>
                    </div>
                    <RouterLink to="/checkout" class="btn-primary">Checkout</RouterLink>
                    <h3 class="total-price">Total: $ {{ store.totalAmount }}</h3>
                </div>
            </div>
            <button class="btn-logout" @click="handleLogout">Logout</button>
        </div>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* Warna & Spacing */
    background-color: white;
    padding: 1rem 5%;
    /* Padding lebih besar dan responsif */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    /* Shadow halus untuk kedalaman */

    /* Positioning */
    position: sticky;
    top: 0;
    z-index: 999;
    width: 100%;
    box-sizing: border-box;
    /* Agar padding tidak mengubah lebar total */
    transition: background-color 0.3s ease;
}

/* Styling untuk Logo */
nav .nav-brand {
    margin: 0;
    /* Menghapus margin default dari h1 */
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    cursor: pointer;
    text-decoration: none;
}

/* Memberi warna pada huruf pertama logo menggunakan pseudo-element */
nav .nav-brand::first-letter {
    color: #4a69bd;
}

/* Styling untuk ikon keranjang */
nav div i {
    font-size: 1.6rem;
    color: #2c3e50;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

/* Efek hover pada ikon keranjang */
nav div i:hover {
    transform: scale(1.1);
    color: #4a69bd;
}

/* Styling untuk pembungkus tombol dan dropdown */
.cart-container {
    position: relative;
    /* Diperlukan agar dropdown bisa diposisikan relatif terhadap kontainer ini */
    display: inline-block;
}

/* Style utama untuk panel dropdown */
.cart-dropdown {
    /* Sembunyikan dropdown secara default */
    display: none;
    position: absolute;
    /* Membuat dropdown "melayang" di atas konten lain */
    right: 0;
    /* Posisikan di sebelah kanan kontainer */
    background-color: #ffffff;
    min-width: 250px;
    /* Lebar minimum dropdown */
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    /* Efek bayangan agar menonjol */
    border-radius: 8px;
    /* Sudut yang sedikit melengkung */
    z-index: 1;
    /* Pastikan dropdown muncul di atas elemen lain */
    border: 1px solid #ddd;
    padding-top: 10px;
    padding-bottom: 10px;
}

/* Tampilkan dropdown saat container di-hover */
.cart-container:hover .cart-dropdown {
    display: block;
    /* Ubah menjadi 'block' agar terlihat */
}

/* Style untuk setiap item di dalam dropdown */
.cart-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    /* Garis pemisah antar item */
    color: #333;
    display: flex;
    justify-content: space-between;
}

/* Hapus garis pemisah pada item terakhir */
.cart-item:last-child {
    border-bottom: none;
}

/* Style untuk pesan "keranjang kosong" */
.cart-item.empty {
    color: #888;
    font-style: italic;
    text-align: center;
}

/* Styling untuk teks di dalam item */
.cart-item h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 600;
}

.cart-item p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

.total-price {
    margin: 15px;
}

.delete-btn {
    margin-bottom: 5px;
}

.btn-primary {
    /* Tampilan & Ukuran */
    display: inline-block;
    /* Agar padding dan margin berfungsi */
    padding: 8px;
    margin-left: 15px;
    margin-top: 15px;
    border-radius: 8px;
    /* Sudut melengkung */
    border: none;
    /* Tanpa border */
    cursor: pointer;
    /* Mengubah kursor menjadi tangan saat di-hover */

    /* Warna & Font */
    background-color: #007bff;
    /* Warna biru primer */
    color: #ffffff;
    /* Warna teks putih */
    text-decoration: none;
    /* Menghilangkan garis bawah dari link */
    font-family: 'Poppins', sans-serif;
    /* Sesuaikan dengan font Anda */
    font-weight: 600;
    /* Teks agak tebal */
    text-align: center;

    /* Efek & Transisi */
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-logout {
    display: inline-block;
    padding: 8px;
    margin: 0 5px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background-color: #e60319;
    color: #ffffff;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    text-align: center;
}

/* Efek saat kursor berada di atas tombol */
.btn-primary:hover {
    background-color: #0056b3;
    /* Warna biru lebih gelap */
    transform: translateY(-2px);
    /* Sedikit terangkat ke atas */
}

/* Efek saat tombol sedang ditekan */
.btn-primary:active {
    transform: translateY(0);
    /* Kembali ke posisi semula */
}

.left-menu {
    display: flex;
    justify-content: center;
    gap: 3;
}

@media screen and (max-width: 758px) {
    .left-menu {
        display: flex;
        flex-direction: column;
    }

    .btn-logout {
        margin: 5px 0;
    }
}
</style>