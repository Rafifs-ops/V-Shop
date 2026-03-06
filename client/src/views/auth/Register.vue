<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuth';

const router = useRouter(); // Mendapatkan fungsi router untuk pindah halaman
const authStore = useAuthStore(); // Mendapatkan beberapa variable dan function dari auth store pinia

// VALIDASI STATUS LOGIN
const statusLogin = authStore.isAuthenticated; // Mendapatkan data statusLogin
if (statusLogin) { // Jika status login bernilai true
    router.push({ name: "home" }) // Mengarahkan ke Home page
}
// AKHIR VALIDASI STATUS LOGIN

const username = ref(''); // Tempat penampungan data username dari form Register
const email = ref(''); // Tempat penampungan data email dari form Register
const password = ref(''); // Tempat penampungan data password dari form Register
const isLoading = ref(false); // State untuk loading

async function register() {

    const api = `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`
    const dataRegister = {
        username: username.value,
        password: password.value,
        email: email.value,
    }

    // PROSES MENAMBAHKAN DATA KE DATABASE
    try {
        isLoading.value = true // Mengaktifkan tampilan loading

        const response = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataRegister)
        }); // Proses mengirim data ke backend

        const result = await response.json(); // Mendapatkan respon backend

        if (!response.ok) {
            // Jika backend return error (misal email duplikat)
            alert(result.msg || "Registrasi gagal");
            return; // Stop, jangan pindah halaman
        }

        // Jika sukses
        router.push({ name: "login" }); // Mengarahkan ke Login page

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan");
    } finally {
        isLoading.value = false; // Menonaktifkan tampilan loading
    }
    // AKHIR PROSES MENAMBAHKAN DATA KE DATABASE
}
</script>

<template>
    <div class="form-wrapper">
        <div class="glass-card">
            <div class="card-header">
                <h1 class="card-title">Register</h1>
            </div>

            <form @submit.prevent="register" class="register-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" v-model="username" placeholder="New username..." required />
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="email" placeholder="Your email..." required />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" v-model="password" placeholder="Create password..."
                            required />
                    </div>
                </div>

                <div class="form-actions">
                    <button v-if="isLoading" type="button" class="btn-glow loading" disabled>
                        <span class="spinner"></span>
                    </button>
                    <button v-else type="submit" class="btn-glow">Register</button>
                </div>

                <div class="form-footer">
                    <p>
                        Already have a profile?
                        <RouterLink to="/" class="link">Login Here</RouterLink>
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
    background: #0f172a;
    font-family: sans-serif;
}

/* Kartu Glassmorphism */
.glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 600px;
    /* Lebih lebar dari login karena ada grid */
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    color: white;
}

.card-header {
    text-align: center;
    margin-bottom: 30px;
}

.card-title {
    font-size: 2rem;
    margin: 0;
}

.card-subtitle {
    color: #94a3b8;
    margin-top: 5px;
}

/* Grid System untuk Form */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Default 2 Kolom */
    gap: 20px;
    margin-bottom: 30px;
}

/* Responsif: Menjadi 1 kolom di layar HP */
@media (max-width: 580px) {
    .form-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 0.85rem;
    color: #cbd5e1;
}

/* Input, Select, & Textarea */
.form-group input,
.form-group select {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    outline: none;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #22c55e;
    background: rgba(255, 255, 255, 0.1);
}

/* Custom Select Arrow (Optional) */
select option {
    background: #1e293b;
    color: white;
}

/* Button & Animations */
.btn-glow {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    background: #22c55e;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-glow:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
    transform: translateY(-2px);
}

/* Spinner */
.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Footer Link */
.form-footer {
    text-align: center;
    margin-top: 25px;
    font-size: 0.9rem;
}

.link {
    color: #22c55e;
    text-decoration: none;
    font-weight: bold;
}

.link:hover {
    text-decoration: underline;
}
</style>
