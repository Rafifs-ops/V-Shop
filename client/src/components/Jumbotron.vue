<script setup>
import { useAuthStore } from '@/stores/useAuth';

const store = useAuthStore();
</script>

<template>
    <div class="jumbotron">
        <h1>Welcome to V-Shop, {{ store.user.username }}</h1>
        <p>Temukan barang-barang yang bermanfaat dan murah</p>
    </div>
</template>

<style scoped>
.jumbotron {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 5rem 2rem;
    /* Padding lebih besar untuk ruang napas */
    margin: 20px;
    border-radius: 25px;
    /* Sedikit lebih melengkung */
    color: white;
    /* Warna teks putih agar kontras */

    /* Latar belakang gradien yang elegan */
    background: linear-gradient(135deg, #2c3e50, #4a69bd);

    /* Bayangan untuk efek 'mengangkat' komponen */
    box-shadow: 0 10px 30px rgba(42, 63, 88, 0.4);

    /* Transisi untuk animasi hover yang halus */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Efek interaktif saat mouse hover */
.jumbotron:hover {
    transform: translateY(-10px);
    /* Sedikit terangkat */
    box-shadow: 0 15px 40px rgba(42, 63, 88, 0.5);
}

.jumbotron h1 {
    margin: 0;
    font-size: 2.8rem;
    /* Ukuran font lebih besar dan responsif */
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* Bayangan teks agar lebih terbaca */
}

.jumbotron p {
    margin: 0.5rem 0 0;
    font-size: 1.2rem;
    font-weight: 300;
    /* Font lebih tipis untuk sub-judul */
    opacity: 0.9;
    /* Sedikit transparan agar tidak terlalu dominan */
}
</style>