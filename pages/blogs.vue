<template >
    <div class="flex justify-center mt-4">
        <NuxtLink active-class="categoryItemActive" href="/blogs?category=coding" class="categoryItem">编程</NuxtLink>
        <NuxtLink active-class="categoryItemActive" href="/blogs?category=casual" class="categoryItem">随笔</NuxtLink>
        <NuxtLink active-class="categoryItemActive" href="/blogs?category=screen" class="categoryItem">银幕相关</NuxtLink>
        <NuxtLink active-class="categoryItemActive" href="/blogs?category=books" class="categoryItem">读书相关</NuxtLink>
    </div>
    <div class=" flex flex-col items-center w-full py-8 pt-4">
        <a class="post " v-for="item in data" :key="item._id" :href="item._path">
            <div class="mb-2 text-xl font-600">
                <div class="font-semibold mb-1 title">
                    {{ item.title }}
                </div>
                <div class="font-semibold text-sm text-gray-400">
                    {{ item.date }}
                </div>
            </div>
            <div class="text-sm text-gray-500">
                {{ item.description }}
            </div>
        </a>
    </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import dayjs from 'dayjs';
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
const { query } = useRoute();
const category = ref(query.category)
console.log(category.value);

interface MyCustomParsedContent extends ParsedContent {
    date: string;
    description: string
    tags: string[]
}
const data = ref<MyCustomParsedContent[] | null>(null)
watchEffect(async () => {
    const response = await useAsyncData(`/`, async () => {
        const dataList = await queryContent<MyCustomParsedContent>('/').find();
        const dateList = dataList
            .filter(v => v.title !== 'About')
            .filter(V => V.category === category.value)
            .map(v => ({ ...v, date: dayjs(v.date).format('YYYY-MM-DD HH:mm') }))
        return dateList.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    })
    data.value = response.data.value as unknown as MyCustomParsedContent[]
})

</script>
<style>
.categoryItemActive {
    font-weight: 600;
    color: rgb(24 24 27/var(--tw-text-opacity))
}

.categoryItem {
    --tw-text-opacity: 1;
    cursor: pointer;
    color: rgb(113 113 122/var(--tw-text-opacity));
    font-weight: 500;
    margin-right: 16px;
}

.title {
    color: #3f3f46
}

.post {
    width: 50vw;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
}
</style>