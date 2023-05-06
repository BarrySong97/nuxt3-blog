<template >
    <div v-for="item in contactList" class="flex items-center mb-2" :key="item.name">
        <a class="flex cursor-pointer items-center" :href="item.url || item.email" target="_blank" @click="item.onClick">
            <component :is="item.icon" class="icon" :class="item.class" />
            <span class="ml-2">{{ item.name === 'Wechat' || item.name === 'Email' ? '' : '@' }}{{ item.username }}</span>

            <!-- {{ item.name }} -->
        </a>
        <!-- <span class="block" v-else="!item.url">{{ item.name }}</span> -->
    </div>
</template>
<script setup lang="ts">
import Bilibili from '@/assets/icons/Bilibili.vue'
import Twitter from '@/assets/icons/Twitter.vue';
import Wechat from '@/assets/icons/Wechat.vue';
import Email from '@/assets/icons/Email.vue';
import Weibo from '@/assets/icons/Weibo.vue';
import WechatCode from '@/components/WechatCode.vue';
import { ModalsContainer, useModal } from 'vue-final-modal'

const { open, close } = useModal({
    component: WechatCode,
    attrs: {
        title: 'Hello World!',
        onConfirm() {
            close()
        },
    },
})
const contactList = [
    {
        name: 'Weibo',
        username: 'BarrySong4Real',
        icon: Weibo,
        class: 'weibo'
    },
    {
        name: 'Bilibili',
        username: 'BarrySong4Real',
        url: 'https://space.bilibili.com/868586?spm_id_from=333.1007.0.0',
        icon: Bilibili,
        class: 'bili'
    },
    {
        name: 'Twitter',
        username: 'BarrySong4Real',
        url: 'https://twitter.com/BarrySong97',
        icon: Twitter,
        class: 'twitter'
    },
    {
        name: 'Wechat',
        username: 'BarrySong97',
        icon: Wechat,
        class: 'wechat',
        onClick() {
            open()
        }
    },
    {
        name: 'Email',
        email: 'mailto:BarrySong97@gmail.com',
        username: 'BarrySong97@gmail.com',
        icon: Email,
        class: 'email'
    }
]
</script>
<style scoped>
.icon {
    font-size: 28px;
    margin-right: 8px;
}

a:hover {
    /* color: var(--prose-a-color-hover); */
    border-color: var(--prose-a-border-color-hover);
    border-style: var(--prose-a-border-style-hover);
}

.bili {
    color: #0aa4d7
}

.twitter {
    color: #1d9bf0
}

.wechat {
    color: #07c160
}

.email {
    color: #f44336
}

.weibo {
    color: #e32428
}


a {
    font-family: var(--typography-font-body);
    font-weight: var(--prose-a-fontWeight);
    -webkit-text-decoration: var(--prose-a-textDecoration);
    text-decoration: var(--prose-a-textDecoration);
    border-bottom-width: var(--prose-a-border-width);
    border-bottom-style: var(--prose-a-border-style-static);
    border-bottom-color: var(--prose-a-border-color-static);
    padding-bottom: var(--prose-a-border-distance);
    color: var(--prose-a-color-static);
}
</style>