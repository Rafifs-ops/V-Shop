import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuth";

export const useFetchCart = defineStore('fetchCart', () => {
    const itemInCart = ref([]);
    const { user } = useAuthStore();

    async function fetchCart() {
        const result = ref([]);
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/user/${user.id}`).then(e => e.json()).then(data => result.value = data);
        itemInCart.value = result.value.cart_items;
    }

    async function removeCart() {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/deleteAll/user`, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ id: user.id })
        }).then(e => e.json()).then(msg => console.log(msg.message));
    }

    // MENGHITUNG TOTAL HARGA DI CART
    const totalAmount = computed(() => {
        return itemInCart.value.reduce((total, item) => {
            const price = item.product.price
            return total + Number(price * item.qty);
        }, 0);
    })
    // AKHIR MENGHITUNG TOTAL HARGA DI CART

    // MENGHITUNG TOTAL QTY DI CART
    const totalQuantity = computed(() => {
        return itemInCart.value.reduce((total, item) => {
            return total + Number(item.qty);
        }, 0)
    })
    // AKHIR MENGHITUNG TOTAL QTY DI CART

    return { itemInCart, fetchCart, removeCart, totalAmount, totalQuantity }
}) 