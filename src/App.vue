<template>
    <div class="app-container">
        <header class="app-header">
            <h1>📚 Books API</h1>
            <p>
                Демонстрация клиент-серверного взаимодействия:<br />
                <code>Vue 3</code> → <code>FastAPI</code> →
                <code>OpenLibrary API</code>
            </p>
        </header>

        <form class="search-form" @submit.prevent="searchBooks">
            <input
                v-model="query"
                type="text"
                class="search-input"
                placeholder="Введите название книги или автора..."
            />
            <div class="search-actions">
                <button type="submit" class="search-btn" :disabled="loading">
                    {{ loading ? "⏳ Поиск..." : "Найти" }}
                </button>
                <button
                    type="button"
                    class="test-btn"
                    @click="testEndpoint"
                    :disabled="loading"
                >
                    Проверить эндпоинт /test
                </button>
            </div>
        </form>

        <div v-if="loading" class="status-message loading">⏳ Загрузка...</div>
        <div v-else-if="error" class="status-message error">⚠️ {{ error }}</div>
        <div
            v-if="testResult !== null"
            class="status-message test-result"
            :class="testResult ? 'success' : 'fail'"
        >
            {{
                testResult
                    ? "✅ Эндпоинт /test отвечает"
                    : "❌ Эндпоинт /test не отвечает"
            }}
        </div>

        <RequestLog :logs="logs" />

        <div v-if="books.length" class="results-info">
            <span
                >Найдено книг: <strong>{{ total }}</strong></span
            >
        </div>

        <div v-else-if="searched && !loading" class="no-results">
            Ничего не найдено. Попробуйте другой запрос.
        </div>

        <div class="book-list">
            <BookCard v-for="book in books" :key="book.key" :book="book" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "./api.js";
import RequestLog from "./components/RequestLog.vue";
import BookCard from "./components/BookCard.vue";

// --- Состояние ---
const query = ref("");
const books = ref([]);
const total = ref(0);
const loading = ref(false);
const error = ref("");
const logs = ref([]);
const testResult = ref(null);
const searchAttempted = ref(false);

// --- Утилиты для логирования ---
const addLog = (log) => {
    logs.value.unshift(log);
    if (logs.value.length > 20) logs.value.pop();
};

// --- API Запросы ---
const searchBooks = async () => {
    if (!query.value.trim()) return;

    loading.value = true;
    error.value = "";
    searchAttempted.value = true;

    try {
        const { data, log } = await api.searchBooks(query.value);
        books.value = data.docs || [];
        total.value = data.numFound || 0;
        addLog(log);
    } catch (e) {
        error.value = "Ошибка сети или сервера";
        addLog({
            method: "GET",
            url: `/search/${query.value}`,
            status: "ERR",
            time: 0,
        });
    } finally {
        loading.value = false;
    }
};

const testEndpoint = async () => {
    try {
        const { ok, log } = await api.checkTest();
        testResult.value = ok;
        addLog(log);
    } catch (e) {
        testResult.value = false;
        addLog({
            method: "GET",
            url: "/test",
            status: "ERR",
            time: 0,
        });
    }
};
</script>
