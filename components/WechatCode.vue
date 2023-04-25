<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
    title?: string
}>()

const emit = defineEmits<{
    (e: 'confirm'): void
}>()
</script>

<template>
    <VueFinalModal swipeToClose="down" background="non-interactive" overlay-transition="vfm-slide-down"
        contentTransition="vfm-slide-right" class="flex justify-center items-center"
        content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2">
        <img src="~/assets/imgs/wechatcode.jpg" />
    </VueFinalModal>
</template>
