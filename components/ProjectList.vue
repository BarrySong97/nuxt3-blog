<script lang="ts" setup>
import Police from '@/assets/icons/Police.vue'
import Elevate from '@/assets/icons/Elevate.vue';
const projects = [
    {
        name: '跃程',
        icon: Elevate,
        description: '次时代的英语学习平台',
        link: 'https://www.barrysong4real.cc/aichat'
    },
    {
        name: '大小写警察',
        icon: Police,
        description: '检查你的简历是否有大小写铭感',
        link: 'https://case-police-linter.vercel.app/'
    }
]
</script>
<template >
    <div class="pl-4">
        <h1 class="text-gray-500 font-600 text-2xl">我做了那些东西-工具</h1>
        <div class="grid grid-cols-2 mt-2">
            <a :href="item.link" target="_blank" class="project px-2 py-3" v-for="item in projects" :key="item.name">
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
    </div>
</template>
<style >
.project {
    display: flex;
    align-items: center;
    cursor: pointer;

    border-radius: 8px;
}

.project:hover {
    background-color: rgb(240, 240, 240);
}

.icon {
    font-size: 28px;
}
</style>