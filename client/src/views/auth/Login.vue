<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuth';

const authStore = useAuthStore(); // Mendapatkan beberapa variable dan function dari auth store pinia
const router = useRouter(); // Mengambil fungsi router untuk pindah halaman

// VALIDASI STATUS LOGIN
const statusLogin = authStore.isAuthenticated; // Mendapatkan data statusLogin
if (statusLogin) { // Jika status login bernilai true
    router.push({ name: "home" }) // Mengarahkan ke Home and Main page
}
// AKHIR VALIDASI STATUS LOGIN

const username = ref(''); // Tempat penampungan data username dari form login
const password = ref(''); // Tempat penampungan data password dari form login
const isLoading = ref(false); // State untuk loading

async function handleLogin() {
    try {
        isLoading.value = true // Mengaktifkan tampilan loading
        await authStore.login(username.value, password.value); // Memproses authentikasi ke backend
        router.push({ name: "home" }) // Mengarahkan ke Home page
    } catch (error) {
        alert("Username / password salah... Silahkan ulangi...");
    } finally {
        isLoading.value = false; // Menonaktifkan tampilan loading
    }
}
</script>

<template>
    <div class="form-wrapper">
        <div class="glass-card">
            <div class="card-header">
                <h1 class="card-title">Login</h1>
                <p class="card-subtitle">Get to know about your body</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" placeholder="Enter your username here"
                        required />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" placeholder="Enter your password"
                        required />
                </div>

                <div class="form-actions">
                    <button v-if="isLoading" type="button" class="btn-glow loading" disabled>
                        <span class="spinner"></span>
                    </button>
                    <button v-else type="submit" class="btn-glow">Login</button>
                </div>

                <div class="form-footer">
                    <p>
                        Don't have an account?
                        <RouterLink to="/register" class="link">Register Here</RouterLink>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Container Utama */
.form-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

/* Kartu Glassmorphism */
.glass-card {
    background: #0f172a;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    color: #ffffff;
}

/* Header */
.card-header {
    text-align: center;
    margin-bottom: 30px;
}

.card-title {
    font-size: 2rem;
    margin-bottom: 8px;
}

.card-subtitle {
    color: #94a3b8;
    font-size: 0.9rem;
}

/* Form Styling */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #cbd5e1;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    box-sizing: border-box;
    /* Pastikan padding tidak merusak lebar */
    transition: border 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #22c55e;
}

/* Button & Animasi Glow */
.btn-glow {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #22c55e;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-glow:hover {
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
    transform: translateY(-2px);
}

.btn-glow:active {
    transform: translateY(0);
}

/* Footer & Link */
.form-footer {
    margin-top: 25px;
    text-align: center;
    font-size: 0.85rem;
}

.link {
    color: #22c55e;
    text-decoration: none;
    font-weight: 600;
}

.link:hover {
    text-decoration: underline;
}

/* Loading Spinner */
.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    display: inline-block;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsif untuk layar sangat kecil */
@media (max-width: 480px) {
    .glass-card {
        padding: 25px;
    }
}
</style>
