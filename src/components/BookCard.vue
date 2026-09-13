<template>
    <div class="book-card">
        <div class="book-cover">
            <img
                v-if="coverId"
                :src="`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`"
                alt="Обложка"
            />
            <div v-else class="no-cover">📖<br />Обложки нет</div>
        </div>

        <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>

            <p v-if="book.series_name && book.series_name[0]" class="series">
                {{ book.series_name[0] }}
                <span v-if="book.series_position && book.series_position[0]">
                    · часть {{ book.series_position[0] }}
                </span>
            </p>

            <p class="authors">
                {{
                    book.author_name
                        ? book.author_name.join(", ")
                        : "Неизвестный автор"
                }}
            </p>

            <div class="meta">
                <span v-if="book.first_publish_year" class="year">{{
                    book.first_publish_year
                }}</span>
                <span v-if="book.first_publish_year && book.edition_count">
                    ·
                </span>
                <span v-if="book.edition_count" class="editions">
                    {{ book.edition_count }}
                    {{ editionWord(book.edition_count) }}
                </span>
            </div>

            <div class="languages" v-if="book.language && book.language.length">
                <span
                    v-for="(lang, idx) in book.language.slice(0, 4)"
                    :key="idx"
                    class="lang-badge"
                >
                    {{ lang.toUpperCase() }}
                </span>
                <span v-if="book.language.length > 4" class="lang-more"
                    >+{{ book.language.length - 4 }}</span
                >
            </div>

            <div class="actions">
                <span v-if="book.ebook_access" class="ebook-badge">{{
                    ebookLabel(book.ebook_access)
                }}</span>
                <a
                    v-if="book.ia"
                    :href="`https://archive.org/details/${book.ia}`"
                    target="_blank"
                    class="btn-archive"
                >
                    📥 Читать на Archive.org
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    book: { type: Object, required: true },
});

const coverId = computed(() => {
    return (
        props.book.cover_i ||
        (props.book.cover_edition_key
            ? props.book.cover_edition_key.replace("/books/", "")
            : null)
    );
});

const editionWord = (n) => {
    const abs = Math.abs(n) % 100;
    const n1 = abs % 10;
    if (abs > 10 && abs < 20) return "изданий";
    if (n1 > 1 && n1 < 5) return "издания";
    if (n1 === 1) return "издание";
    return "изданий";
};

const ebookLabel = (access) => {
    return access === "public" ? "📄 Fulltext (PDF)" : "🔒 Ограниченный доступ";
};
</script>
