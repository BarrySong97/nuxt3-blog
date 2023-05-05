<template>
    <div class="sticky top-0 bg-white grid grid-cols-3 p-4  items-center header">
        <h1 class="tracking-wider font-600 text-2xl self-center dark:text-white">ByLittle</h1>
        <nav class="justify-self-center self-end">
            <NuxtLink activeClass="activeLink " to="/" class="mr-4 link dark:text-white">Home</NuxtLink>
            <NuxtLink :class="{ 'activeLink': isPost }" to="/blogs/coding" class="link dark:text-white">Blog</NuxtLink>
        </nav>
        <div class="flex place-self-end">

            <UseDark v-slot="{ isDark, toggleDark }">
                <div @click="toggleDark()">
                    <Moon class="icon mr-2 dark:text-white" v-if="isDark" />

                    <!-- <Moon class="icon mr-3 dark:text-white" v-if="isDark" /> -->
                    <Sun class="icon mr-3 dark:text-white" v-else />
                </div>
            </UseDark>
            <a class=" flex" :href="githubUrl" target="_blank">
                <div>
                    <Github class="icon dark:text-white" />
                </div>
            </a>
        </div>
    </div>
</template>
<script setup lang="ts">
import Moon from "@/assets/icons/Moon.vue"
import Sun from "@/assets/icons/Sun.vue"
import Github from "@/assets/icons/Github.vue"
const route = useRoute();
const isPost = computed(() => route.path.includes('/blogs'));
const githubUrl = 'https://github.com/BarrySong97'
import { UseDark } from '@vueuse/components'
</script>

<style scoped>
.link {
    color: #71717a;
    padding: 8px 16px;
    font-weight: 600;
}

.dark .link {
    color: white;
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

.dark .activeLink {
    --tw-text-opacity: 1;
    color: rgb(255 255 255/var(--tw-text-opacity));
    --elements-backdrop-filter: saturate(200%) blur(20px);
    --elements-backdrop-background: #282a2ecc;
    backdrop-filter: var(--elements-backdrop-filter);
    background: var(--elements-backdrop-background);

}

.header {
    z-index: 100;
    border-bottom: 1px solid #eaeaea;
}

.dark .header {
    background-color: #0c0d0ccc;
    border-bottom: 1px solid #0c0d0ccc;
}

.icon {
    font-size: 24px;
    cursor: pointer;
}
</style>