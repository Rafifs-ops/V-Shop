<script setup>
import Jumbotron from '@/components/Jumbotron.vue';
import ProductCard from '@/components/ProductCard.vue';
import NavVue from '@/components/Nav.vue';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/useAuth'
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);

// MEMERIKSA STATUS LOGIN
const { isAuthenticated } = useAuthStore();
if (!isAuthenticated) {
  [
    router.push({ name: 'login' })
  ]
}
// AKHIR MEMERIKSA STATUS LOGIN

// MENDAPATKAN DATA PRODUK
const products = ref([]);
onMounted( async () => {
  isLoading.value = true
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`).then((e) => e.json()).then((data) => { products.value = data; isLoading.value = false });
});
// AKHIR MENDAPATKAN DATA PRODUK

// KONFIGURASI FILTER HARGA
const isFilterExist = ref(false);
const maxPrice = ref(0);
// AKHIR KONFIGURASI FILTER HARGA

</script>

<template>
  <main>
    <NavVue />
    <Jumbotron />
    <div v-if="!isLoading">
      <div class="max-price-filter">
        <button v-on:click="isFilterExist = !isFilterExist"><span v-if="!isFilterExist">Pilih Harga Maksimal</span><span
            v-else>Close</span></button>
        <div v-if="isFilterExist">
          <input type="number" v-model="maxPrice">
          <input type="range" min="0" max="200" v-model="maxPrice">
        </div>
      </div>
      <ProductCard :products="products" :maxPrice="maxPrice" />
      <RouterLink to="/history" class="elemen-terapung">
        <i class="bi bi-file-earmark-check-fill"></i> <i class="bi bi-clock-history"></i> History
      </RouterLink>
    </div>
    <div v-else class="loading"></div>
  </main>
</template>

<style scoped>
/* Impor font jika belum ada */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.max-price-filter {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.max-price-filter button {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.max-price-filter button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.max-price-filter>div {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Style untuk input angka */
.max-price-filter input[type="number"] {
  width: 80px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.max-price-filter input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* --- Style Custom untuk Range Slider --- */
.max-price-filter input[type="range"] {
  /* Menghapus style default */
  width: 100%;
  background: transparent;
  /* Pastikan background transparan */
}

/* Track / Garis Slider */
.max-price-filter input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: #dee2e6;
  border-radius: 5px;
}

/* Thumb / Tombol Geser */
.max-price-filter input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  margin-top: -6px;
  /* Posisi thumb agar center dengan track */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* Style untuk Firefox (opsional tapi sangat direkomendasikan) */
.max-price-filter input[type="range"]::-moz-range-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: #dee2e6;
  border-radius: 5px;
}

.max-price-filter input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.elemen-terapung {
  position: fixed;
  /* Membuat elemen mengambang dan tetap */
  bottom: 20px;
  /* Jarak 20px dari tepi bawah */
  right: 20px;
  /* Jarak 20px dari tepi kanan */
  z-index: 9999;
  /* Memastikan di atas elemen lain */

  /* Tambahan styling (opsional) */
  padding: 15px;
  background-color: #007bff;
  color: white;
  border-radius: 15px;
  /* Membuat lingkaran */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

a.elemen-terapung {
  text-decoration: none;
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
</style>