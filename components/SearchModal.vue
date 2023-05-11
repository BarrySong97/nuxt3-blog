
<script setup lang="ts">
import Lightnining from '@/assets/icons/Lightning.vue'
import { MarkdownNode } from '@nuxt/content/dist/runtime/types'
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
    title?: string
}>()

const emit = defineEmits<{
    (e: 'confirm'): void
}>()
const inputValue = ref('');
const searchData = ref<{
    path?: string
    title?: string
    content: SearchResult[]
}[]>();
interface SearchResult {
    titleNode: MarkdownNode | null;
    textNode: MarkdownNode;
    matchedSegments: string[];
}

function findTextNodes(tree: MarkdownNode, searchString: string): SearchResult[] {
    const result: SearchResult[] = [];
    const lowerCaseSearchString = searchString.toLowerCase();
    let currentTitleNode: MarkdownNode | null = null;

    function dfs(node: MarkdownNode, parentNode: MarkdownNode | null = null) {
        if (node.type === 'element' && node.tag && /^h[2-5]$/.test(node.tag)) {
            currentTitleNode = node;
        }
        if (node.type === 'text' && node.value && node.value.toLowerCase().includes(lowerCaseSearchString)
            &&
            (!parentNode || (parentNode?.type === 'element' && !/^h[2-5]$/.test(parentNode?.tag ?? '')))
        ) {
            if (currentTitleNode?.value !== node.value) {

                const regex = new RegExp(searchString, 'gi');
                const matched = node.value.match(regex);
                const matchedSegments = node.value.split(regex);
                const length = matchedSegments.length;
                if (matched?.[0]) {

                    for (let i = 1; i < length; i += 2) {
                        matchedSegments.splice(i, 0, matched?.[0]);
                    }
                }
                result.push({ titleNode: currentTitleNode, textNode: node, matchedSegments })
            }
        }

        if (node.children) {
            for (const child of node.children) {
                dfs(child, node);
            }
        }
    }

    dfs(tree);

    return result;
}
function debounce(fn: (...args: any[]) => void, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// 将原有的函数包装成一个防抖函数
const debouncedSearch = debounce(async () => {
    if (inputValue.value) {
        const data = (await queryContent('/').find()).filter(v => v.title !== 'About');

        const result = data.map(v => {
            const searchedItem = findTextNodes(v.body, inputValue.value);
            return {
                path: v._path,
                title: v.title,
                content: searchedItem,
            };
        }).filter(v => !!v.content.length);

        searchData.value = result;
    } else {
        searchData.value = undefined;
    }
}, 300); // 300毫秒的延迟


const isEqual = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
watch(inputValue, () => {
    debouncedSearch();
})
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
    inputRef.value?.focus()
})

</script>

<template>
    <VueFinalModal swipeToClose="down" background="non-interactive" overlay-transition="vfm-slide-down"
        contentTransition="vfm-slide-right" class="flex justify-center items-start "
        content-class="flex flex-col  mx-4 p-4 bg-white dark:bg-gray-900 mt-40 border dark:border-gray-700 rounded-lg space-y-2">
        <div class="container">
            <div class="semi-input-wrapper mb-16px  semi-input-wrapper-default ">
                <input ref="inputRef" v-model="inputValue" class="semi-input semi-input-default" type="text"
                    placeholder="搜索文章">
            </div>
            <div v-if="searchData" class="mt-3 overflow-auto searchList">
                <div v-for="searchItem in searchData" :key="searchItem.path">
                    <a :href="`${searchItem.path}`" target="_blank" class="flex items-center articleTitle p-3 rounded-md">
                        <Lightnining class="mr-1" /> {{ searchItem.title }}
                    </a>
                    <div>
                        <div class="searchContent cursor-pointer pl-8 py-2 rounded-md" v-for="content in searchItem.content"
                            :key="content.textNode.value">
                            <a :href="`${searchItem.path}#${content.titleNode?.props?.id ?? ''}`" target="_blank"
                                class="dark:text-white">
                                <span v-for="text in content.matchedSegments" :key="text"
                                    :class="{ markedText: isEqual(text, inputValue) }">
                                    {{ text }}
                                </span>
                                <div class="subTitle">
                                    in {{ content.titleNode?.children?.[0].value ?? content.titleNode?.props?.id ??
                                        searchItem.title }}
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="searchList empty  flex items-center justify-center">
                没有数据
            </div>
        </div>
    </VueFinalModal>
</template>
<style scoped>
.searchList {
    min-height: 200px;
    max-height: 400px;
}

.container {

    width: 35vw;
}

.semi-input-wrapper-clearable,
.semi-input-wrapper-modebtn {
    display: inline-flex;
    align-items: center;
}

.semi-input {
    border: none;
    outline: none;
    width: 100%;
    color: inherit;
    padding-left: 12px;
    padding-right: 12px;
    background-color: transparent;
    box-sizing: border-box;
}

.semi-input-wrapper-default {
    height: 32px;
    font-size: 14px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    line-height: 30px;
}

.semi-input-wrapper {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-shadow: none;
    font-size: 14px;
    line-height: 20px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    background-color: var(--semi-color-fill-0);
    border: 1px transparent solid;
    border-radius: var(--semi-border-radius-small);
    width: 100%;
    outline: none;
    cursor: text;
    box-sizing: border-box;
    color: var(--semi-color-text-0);
    transition: background-color var(--semi-transition_duration-none) var(--semi-transition_function-easeIn) var(--semi-transition_delay-none), border var(--semi-transition_duration-none) var(--semi-transition_function-easeIn) var(--semi-transition_delay-none);
    transform: scale(var(--semi-transform_scale-none));
}

.semi-input-default {
    height: 30px;
    font-size: 14px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    line-height: 30px;
}

.articleTitle {
    font-size: 16px;
    font-weight: 600;
    color: var(--semi-color-text-0);
    cursor: pointer;
}

.articleTitle:hover {
    background-color: var(--semi-color-fill-0);
}

.subTitle {

    font-size: 14px;
    color: var(--semi-color-text-2);
}

.searchContent:hover {
    background-color: var(--semi-color-fill-0);
}

.markedText {
    font-style: normal;
    font-weight: 600;
    color: var(--semi-color-primary);
}

.empty {

    font-size: 14px;
    color: var(--semi-color-text-2);
}
</style>
