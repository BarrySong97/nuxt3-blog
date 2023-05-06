<template>
    <div class="sticky top-0 bg-white grid grid-cols-3 p-4  items-center header">
        <h1 class="tracking-wider font-600 text-2xl self-center dark:text-white">ByLittle</h1>
        <nav class="justify-self-center ">
            <NuxtLink activeClass="activeLink " to="/" class="mr-4 link dark:text-white">Home</NuxtLink>
            <NuxtLink :class="{ 'activeLink': isPost }" to="/blogs/coding" class="link dark:text-white">Blog</NuxtLink>
        </nav>
        <div class="flex place-self-end  items-center">
            <div @click="open()" style="padding: 10px 13px; margin-right: 12px; font-size: 14px; line-height: 20px;"
                class="dark:text-white rounded-full bg-semi-color-fill-0 cursor-pointer flex items-center text-semi-color-text-2 w-fit focus-visible:outline-2 focus-visible:outline-[#98CDFD]">
                <div class="mx-1.5 font-semibold">搜索</div>
                <div class="ml-4px">⌘ K</div>
            </div>
            <a class=" flex" :href="githubUrl" target="_blank">
                <div>
                    <Github class="icon dark:text-white" />
                </div>
            </a>
        </div>
    </div>
</template>
<script setup lang="ts">
import Github from "@/assets/icons/Github.vue"
const route = useRoute();
const isPost = computed(() => route.path.includes('/blogs'));
const githubUrl = 'https://github.com/BarrySong97/nuxt3-blog'
import { useModal } from 'vue-final-modal';
import SearchModal from '@/components/SearchModal.vue';
const { open, close } = useModal({
    component: SearchModal,
    attrs: {
        title: '搜索',
        onConfirm() {
            close()
        },
    },
})

    // 在这里执行你想要的操作
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

.bg-semi-color-fill-0 {
    background-color: #f4f4f5;
}
</style>