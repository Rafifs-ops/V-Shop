import { ref, toRaw } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuth";
import { useFetchCart } from "./useFetchCart";

export const useFetchHistory = defineStore('fetchHistory', () => {
    const itemInHistory = ref([]);
    const { user } = useAuthStore();
    const store = useFetchCart();

    async function fetchHistory() {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history/getHistories/${user.id}`);
        const result = await response.json();

        if (result.message === "User belum beli apapun") {
            itemInHistory.value = [];
        } else {
            itemInHistory.value = result.history_items;
        }
    }

    // MENAMBAHKAN HISTORY KE SERVER DB
    async function addHistory() {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history/addHistory/${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toRaw(store.itemInCart))
        })
        const message = await response.json();
        console.log(message.message)
    }
    // AKHIR MENAMBAHKAN HISTORY KE SERVER DB

    async function deleteHistoryItem(userId, historyId) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history/deleteHistory`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                historyId
            })
        })

        const message = await response.json();

        if (!response.ok) {
            console.log(message.message)
            return 
        }

        fetchHistory();
        console.log(message.message);
    }

    return { itemInHistory, fetchHistory, addHistory, deleteHistoryItem }
}) 