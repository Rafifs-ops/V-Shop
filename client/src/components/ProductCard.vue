<script setup>
import { useRouter } from 'vue-router';
import { defineProps, computed, ref } from 'vue';
import { useFetchCart } from '@/stores/useFetchCart';
import { useAuthStore } from '@/stores/useAuth';

const { user } = useAuthStore();
const api = ref(`${import.meta.env.VITE_API_BASE_URL}`);
const store = useFetchCart();

// KIRIM DATA PARAMS(ID) DI URL DAN PINDAH HALAMAN KE PRODUCT DETAIL
const router = useRouter();
function seeDetail(e) {
    router.push({ name: 'product', params: {id: e}})
}
// AKHIR KIRIM DATA PARAMS(ID) DI URL DAN PINDAH HALAMAN KE PRODUCT DETAIL

// MENGAMBIL DATA PROPS PRODUCT DAN ANGKA MAX PRICE UNTUK FILTER DISPLAY PRODUK SESUAI HARGA YANG DIFILTER
const props = defineProps(['products', 'maxPrice']);
const filteredProducts = computed(() => {
    // Jika tidak ada maxPrice atau nilainya tidak valid, tampilkan semua produk
    if (!props.maxPrice || Number(props.maxPrice) <= 0) {
        return props.products;
    }
    return props.products.filter(product => product.price <= Number(props.maxPrice)); 
});
// AKHIR MENGAMBIL DATA PROPS PRODUCT DAN ANGKA MAX PRICE UNTUK FILTER DISPLAY PRODUK SESUAI HARGA YANG DIFILTER

// MENGIRIM DATA PRODUK TO CART MELALUI API
async function addCart(id) {
    try {
        await fetch(`${api.value}/api/orders/update/user/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({product_id: id})
        });
        alert("produk berhasil ditambahkan");
        store.fetchCart();
    } catch(err) {
        console.log(err)
    }
}
// AKHIR MENGIRIM DATA PRODUK TO CART MELALUI API
</script>

<template>
    <div class="product-box">
        <div class="product-card" v-for="(product, index) in filteredProducts" :key="index">
            <img :src="`${api}${product.imageUrl}`" alt="" width="100" height="100">
            <div class="product-menu">
                <div class="product-spec">
                    <h3>{{ product.name }}</h3>
                    <h3>$ {{ product.price }}</h3>
                </div>
                <div class="product-feature">
                    <h3 v-on:click="addCart(product._id)"><i class="bi bi-cart-fill"></i></h3>
                    <h3 v-on:click="seeDetail(product._id)">Detail</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Wadah utama untuk semua kartu produk */
.product-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 30px; /* Memberi jarak yang konsisten antar kartu */
    padding: 20px;
}

/* Kartu produk individual */
.product-card {
    background-color: #ffffff; /* Latar belakang putih bersih */
    border-radius: 15px; /* Sudut yang lebih halus */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Bayangan untuk efek 'mengambang' */
    padding: 20px;
    width: 250px; /* Lebar tetap agar lebih rapi */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transisi halus untuk hover */
}

/* Efek saat kursor mouse di atas kartu */
.product-card:hover {
    transform: translateY(-8px); /* Sedikit mengangkat kartu */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); /* Bayangan lebih kuat saat hover */
}

/* Gaya untuk gambar produk */
.product-card img {
    width: 150px;
    height: 150px;
    object-fit: cover; /* Memastikan gambar tidak gepeng */
    border-radius: 10px;
    margin-bottom: 15px;
}

.product-menu {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center; /* Menyelaraskan item secara vertikal */
}

.product-spec,
.product-feature {
    display: flex;
    flex-direction: column;
}

.product-spec {
    align-items: flex-start; /* Teks rata kiri */
}

.product-feature {
    align-items: flex-end; /* Ikon dan tombol rata kanan */
    display: flex;
    flex-direction: row; /* Ubah menjadi baris */
    gap: 15px; /* Jarak antara ikon keranjang dan detail */
    align-items: center;
}

/* Menghilangkan margin default dari tag h3 */
.product-spec h3,
.product-feature h3 {
    margin: 0;
}

/* Gaya untuk nama produk */
.product-spec h3:first-child {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px; /* Jarak antara nama dan harga */
}

/* Gaya untuk harga produk */
.product-spec h3:last-child {
    font-size: 1rem;
    font-weight: 700;
    color: #007bff; /* Warna biru sebagai aksen */
}

/* Gaya untuk ikon keranjang */
.product-feature .bi-cart-fill {
    font-size: 1.5rem;
    color: #555;
    cursor: pointer;
    transition: color 0.3s ease;
}

.product-feature .bi-cart-fill:hover {
    color: #007bff; /* Warna berubah saat hover */
}

/* Gaya untuk tombol 'Detail' */
.product-feature h3:last-child {
    font-size: 0.9rem;
    font-weight: 500;
    background-color: #f0f0f0;
    color: #333;
    padding: 6px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.product-feature h3:last-child:hover {
    background-color: #007bff;
    color: #fff;
}
</style>