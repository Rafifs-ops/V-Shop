<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import NavVue from '@/components/Nav.vue';
import { useAuthStore } from '@/stores/useAuth'

const router = useRouter();

// MEMERIKSA STATUS LOGIN
const { isAuthenticated } = useAuthStore();
if (!isAuthenticated) {[
  router.push({name: 'login'})
]}
// AKHIR MEMERIKSA STATUS LOGIN

// MENERIMA PARAMS(ID) DARI URL DAN DICOCOKAN DENGAN ID PRODUK DARI DATA DIATAS
const route = useRoute();
const productId = route.params.id;
// AKHIR MENERIMA PARAMS(ID) DARI URL DAN DICOCOKAN DENGAN ID PRODUK DARI DATA DIATAS

// MENGAMBIL DATA PRODUK DARI API
const product = ref(null);
onMounted(() => {
  const id = productId
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`).then((e) => e.json()).then((data) => { product.value = data });
});
// AKHIR MENGAMBIL DATA PRODUK DARI API
</script>

<template>
  <main>
    <NavVue />
    <div class="product-page-container">
      <div class="product-card" v-if="product">
        <div class="product-image-container">
          <img class="product-image" :src="`http://localhost:8080${product.imageUrl}`" :alt="product.name">
        </div>
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <h3 class="product-price">$ {{ product.price }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <RouterLink to="/" class="back-button">Kembali ke Beranda</RouterLink>
        </div>
      </div>

      <div class="loading-container" v-else>
        <div class="spinner"></div>
        <h1 class="loading-text">Memuat data produk...</h1>
        <RouterLink to="/" class="back-button">Kembali ke Beranda</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Menambahkan font modern dari Google Fonts (opsional, tambahkan link di index.html) */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* --- Container Utama --- */
.product-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f9;
  /* Latar belakang abu-abu lembut */
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

/* --- Card Style --- */
.product-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Dua kolom: gambar dan info */
  max-width: 960px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* Agar gambar tidak keluar dari border-radius */
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* --- Gambar Produk --- */
.product-image-container {
  width: 100%;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Memastikan gambar mengisi area tanpa distorsi */
}

/* --- Info Produk --- */
.product-info {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 2.25rem;
  /* 36px */
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.product-price {
  font-size: 1.75rem;
  /* 28px */
  font-weight: 600;
  color: #2c5282;
  /* Warna biru yang elegan */
  margin: 0 0 1.5rem 0;
}

.product-description {
  font-size: 1rem;
  /* 16px */
  color: #4a5568;
  line-height: 1.7;
  flex-grow: 1;
  /* Mendorong tombol ke bawah */
}

/* --- Tombol Kembali --- */
.back-button {
  display: inline-block;
  text-align: center;
  margin-top: 2rem;
  padding: 14px 28px;
  background-color: #3182ce;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  background-color: #2b6cb0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
}

/* --- Loading State --- */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #4a5568;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- Desain Responsif untuk Mobile --- */
@media (max-width: 768px) {
  .product-page-container {
    padding: 1rem;
  }

  .product-card {
    grid-template-columns: 1fr;
    /* Ubah menjadi satu kolom */
  }

  .product-info {
    padding: 1.5rem;
  }

  .product-name {
    font-size: 1.75rem;
    /* Ukuran font lebih kecil */
  }

  .product-price {
    font-size: 1.5rem;
  }
}
</style>
