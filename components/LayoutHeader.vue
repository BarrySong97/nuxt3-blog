<template>
    <div class="sticky top-0 bg-white grid grid-cols-3 p-4  items-center header">
        <h1 class="tracking-wider font-600 text-2xl self-center">ByLittle</h1>
        <nav class="justify-self-center self-end">
            <NuxtLink activeClass="activeLink " to="/" class="mr-4 link">Home</NuxtLink>
            <NuxtLink :class="{ 'activeLink': isPost }" to="/blogs/coding" class="link">Blog</NuxtLink>
        </nav>
        <a class="place-self-end " :href="githubUrl" target="_blank">
            <Github class="icon" />
        </a>
    </div>
</template>
<script setup lang="ts">
import Github from "@/assets/icons/Github.vue"
const route = useRoute();
const isPost = computed(() => route.path.includes('/blogs'));
const githubUrl = 'https://github.com/BarrySong97'
</script>

<style scoped>
.link {
    color: #71717a;
    padding: 8px 16px;
    font-weight: 600;
}

.activeLink {
    --tw-text-opacity: 1;
    color: rgb(24 24 27/var(--tw-text-opacity));
    background-color: #f4f4f5;
    font-weight: 600;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding: 8px 16px;
    border-radius: 8px;
}

.header {
    z-index: 100;
    border-bottom: 1px solid #eaeaea;
}

.icon {
    font-size: 24px;
}
</style>