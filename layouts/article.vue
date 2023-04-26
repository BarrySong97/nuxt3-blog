<template>
    <div class="articleContent m-auto">
        <h1 class="mt-8 mb-6 font-extrabold text-4xl dark:text-white">{{ page.title }}</h1>
        <div class="text-sm text-gray-400 mb-5">{{ date }}</div>
        <div class="dark:text-white">
            <slot />
        </div>
        <div class="mb-6">
            <NuxtLink to="/blogs/coding" class="text-gray-400 hover:text-gray-500 dark:text-white">← 返回</NuxtLink>
        </div>
        <PageToc />
    </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
const content = useContent()

const page = content.page
const date = dayjs(page.value.date).format('YYYY-MM-DD HH:mm')


</script>
<style scoped>
a {
    font-family: var(--typography-font-body);
    font-weight: var(--prose-a-fontWeight);
    -webkit-text-decoration: var(--prose-a-textDecoration);
    text-decoration: var(--prose-a-textDecoration);
    border-bottom-width: var(--prose-a-border-width);
    border-bottom-style: var(--prose-a-border-style-static);
    border-bottom-color: var(--prose-a-border-color-static);
    padding-bottom: var(--prose-a-border-distance);
    color: var(--prose-a-color-static);
}

a:hover {
    /* color: var(--prose-a-color-hover); */
    border-color: var(--prose-a-border-color-hover);
    border-style: var(--prose-a-border-style-hover);
}

.articleContent {
    max-width: 65ch;

}
</style>