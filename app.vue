
<template >
    <div class=" dark:bg-black bg-white">
        <LayoutHeader />
        <div class="content ">
            <NuxtPage />
        </div>
        <ModalsContainer />
    </div>
</template>
<script lang="ts" setup>
import { ModalsContainer } from 'vue-final-modal'
import { onMounted, onBeforeUnmount } from 'vue';
import { useModal } from 'vue-final-modal';
import SearchModal from '@/components/SearchModal.vue';
function isMac(userAgent?: string): boolean {
    const macPlatformRegex = /Mac|iPod|iPhone|iPad/;

    if (typeof window !== 'undefined' && window.navigator) {
        // 客户端渲染
        return macPlatformRegex.test(window.navigator.platform);
    } else if (userAgent) {
        // 服务器端渲染
        return macPlatformRegex.test(userAgent);
    }

    return false;
}
const nuxtApp = useNuxtApp()
const userAgent = nuxtApp?.ssrContext?.event?.node.req.headers['user-agent'];
const isMacPlatform = isMac(userAgent);
function useGlobalKeyBindings(onCmdK: () => void): void {
    const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const cmdKey = isMacPlatform ? event.metaKey : event.ctrlKey;

        if (cmdKey && key === 'k') {
            event.preventDefault();
            onCmdK();
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });
}
const { open, close } = useModal({
    component: SearchModal,
    attrs: {
        title: '搜索',
        onConfirm() {
            close()
        },
    },
})
const onCmdK = () => {
    open()
    // 在这里执行你想要的操作
};
useGlobalKeyBindings(onCmdK);
</script>
<style>
.content {
    height: calc(100vh - 75px);
    overflow: auto;
}
</style>