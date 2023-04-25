<template >
    <div class="flex justify-center mt-4">
        <NuxtLink class="categoryItem" activeClass="categoryItemActive" to="/blogs/coding">编程</NuxtLink>
        <NuxtLink class="categoryItem" activeClass="categoryItemActive" to="/blogs/casual">随笔</NuxtLink>
    </div>
    <div :class="postClass">
        <a class="post relative p-4" :class="postItemClass" v-for="item in  data " :key="item._id" :href="item._path"
            :style="backgroundImageStyle(item.cover)">
            <div class=" font-semibold mb-1 title">
                {{ item.title }}
            </div>
            <div class="font-semibold text-sm text-gray-400">
                {{ item.date }}
            </div>
            <div class="absolute startOfYear font-bold text-2xl">
                {{ item.startOfYear }}
            </div>
        </a>
    </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const route = useRoute();
interface MyCustomParsedContent extends ParsedContent {
    date: string;
    description: string
    tags: string[]
    cover: string;
    category: string;
    startOfYear: string
}
const { data } = await useAsyncData(`/`, async () => {
    const dataList = await queryContent<MyCustomParsedContent>('/').find();
    const dateList = dataList
        .filter(v => v.title !== 'About')
        .filter(V => V.category === route.params.category ?? 'coding')
        .map(v => ({ ...v, date: dayjs(v.date).format('YYYY-MM-DD HH:mm') }))
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

    const yearList = dateList
        .map((v, i) => {
            const currentYear = dayjs(v.date).year();
            const nextYear = dayjs(dateList[i + 1]?.date).year();
            const isLastElement = i === dateList.length - 1;

            if (currentYear !== nextYear || isLastElement) {
                return { ...v, startOfYear: dayjs(v.date).format('YYYY'), date: dayjs(v.date).format('MM 月 DD 日') };
            }
            return { ...v, date: dayjs(v.date).format('MM 月 DD 日') }
        })


    return yearList?.reverse()
})
const postClass = data.value?.[0].category === 'coding' ? 'flex flex-col items-center w-full py-8 pt-4' : 'grid py-8 px-8 pt-4 gap-2 grid-cols-4';
const postItemClass = data.value?.[0].category === 'coding' ? 'blogItem' : 'card';

const backgroundImageStyle = (imageUrl?: string) => (imageUrl ? {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
} : {});
</script>
<style>
.categoryItem {
    --tw-text-opacity: 1;
    cursor: pointer;
    color: rgb(113 113 122/var(--tw-text-opacity));
    font-weight: 500;
    margin-right: 16px;
}


.categoryItemActive {
    font-weight: 600;
    color: rgb(24 24 27/var(--tw-text-opacity))
}

.title {
    color: #3f3f46
}

.post {
    width: 70ch;
    margin: auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

@media (min-width: 1536px) {

    /* Your CSS rules */
    .card {
        width: 430px;
        height: 250px;
    }

}

@media screen and (min-width: 1366px) and (max-width: 1536px) {

    /* Your CSS rules */
    .card {
        width: 340px;
        height: 170px;
    }
}

.blogItem {

    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.blogItem:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

.card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

/* Large devices (desktops, 992px and up) */

/* Extra large devices (large desktops, 1200px and up) */

.startOfYear {
    right: 16px;
    color: #555;
    opacity: 0.3;
    font-style: italic;
    bottom: 16px;
}
</style>