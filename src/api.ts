// src/api.js
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = {
  // Поиск книг
  async searchBooks(query: string) {
    const url = `${BASE_URL}/search/${encodeURIComponent(query)}`;
    const startTime = performance.now();

    const response = await fetch(url);
    const data = await response.json();
    const time = Math.round(performance.now() - startTime);

    return {
      data,
      log: {
        method: "GET",
        url: url.replace(BASE_URL, ""),
        status: response.status,
        time,
      },
    };
  },

  // Проверка эндпоинта /test
  async checkTest() {
    const url = `${BASE_URL}/test`;
    const startTime = performance.now();

    const response = await fetch(url);
    const time = Math.round(performance.now() - startTime);

    return {
      ok: response.ok,
      log: {
        method: "GET",
        url: "/test",
        status: response.status,
        time,
      },
    };
  },
};
