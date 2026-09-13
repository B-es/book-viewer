<template>
    <div class="log-container">
        <button class="log-toggle" @click="isOpen = !isOpen">
            <span>📋 Журнал запросов ({{ logs.length }})</span>
            <span class="arrow" :class="{ rotated: isOpen }">▼</span>
        </button>

        <Transition name="fade-slide">
            <table v-if="isOpen" class="log-table">
                <thead>
                    <tr>
                        <th>Метод</th>
                        <th>URL</th>
                        <th>Статус</th>
                        <th>Время</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(log, index) in logs"
                        :key="index"
                        :class="`status-${log.status}`"
                    >
                        <td>{{ log.method }}</td>
                        <td class="url-cell">{{ log.url }}</td>
                        <td>{{ log.status }}</td>
                        <td>{{ log.time }} мс</td>
                    </tr>
                </tbody>
            </table>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    logs: { type: Array, default: () => [] },
});

// По умолчанию журнал свернут, если запросов еще не было
const isOpen = ref(props.logs.length > 0);

// Автоматически разворачивать при появлении новых логов
watch(
    () => props.logs.length,
    (newLen) => {
        if (newLen > 0) isOpen.value = true;
    },
);
</script>
