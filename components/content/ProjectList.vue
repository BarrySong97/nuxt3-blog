<script lang="ts" setup>
import Police from '@/assets/icons/Police.vue'
import Elevate from '@/assets/icons/Elevate.vue';
import Butter from '~/assets/icons/Butter.vue';
const projects = [
    {
        name: 'Elevate',
        // englishName: 'Elevate',
        icon: Elevate,
        description: '次时代的英语学习平台',
        link: 'https://www.barrysong4real.cc/aichat'
    },
    {
        name: 'Case Police',
        icon: Police,
        // englishName: 'Case Police',
        description: '检查你的简历是否有名词大小写错误',
        link: 'https://case-police-linter.vercel.app/'
    },
    {

        name: 'Breeze',
        icon: Butter,
        img: '/imgs/qrcode.png',
        // englishName: 'Case Police',
        description: '一个简洁的习惯追踪器',
        link: '/what-is-breeze'
    }
]
</script>
<template >
    <div class="grid grid-cols-2 gap-4 ">
        <a :href="item.link" target="_blank" class="project px-3 py-3" v-for="item in projects" :key="item.name">
            <div class="mr-3 icon">
                <component :is="item.icon" />

            </div>
            <div>
                <div class="text-lg">
                    {{ item.name }}
                </div>
                <div class="text-xs text-gray-400">
                    {{ item.description }}
                </div>
            </div>
        </a>
    </div>
</template>
<style >
.project {
    display: flex;
    align-items: center;
    cursor: pointer;
    --un-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--un-bg-opacity));
    border-radius: 8px;
}

.dark .project {
    --elements-backdrop-filter: saturate(200%) blur(20px);
    --elements-backdrop-background: #0c0d0ccc;
    backdrop-filter: var(--elements-backdrop-filter);
    background: var(--elements-backdrop-background);
}

.project:hover {

    background-color: rgb(240, 241, 241);
}

.dark .project:hover {
    --tw-text-opacity: 1;
    color: rgb(255 255 255/var(--tw-text-opacity));
    --un-bg-opacity: 1;
    background-color: rgba(24, 24, 27, var(--un-bg-opacity));
}

.icon {
    font-size: 28px;
}
</style>