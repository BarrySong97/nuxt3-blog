<template >
    <div class="flex">
        <a v-for="item in contactList" class="flex cursor-pointer items-center" :href="item.url || item.email"
            target="_blank" @click="item.onClick">
            <component :is="item.icon" class="icon" />
        </a>
    </div>
</template>
<script setup lang="ts">
import Bilibili from '@/assets/icons/Bilibili.vue'
import Twitter from '@/assets/icons/Twitter.vue';
import Wechat from '@/assets/icons/Wechat.vue';
import Email from '@/assets/icons/Email.vue';
import Weibo from '@/assets/icons/Weibo.vue';
import WechatCode from '@/components/WechatCode.vue';
import { useModal } from 'vue-final-modal'

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
        class: 'weibo',
        url: 'https://weibo.com/u/2670904663'
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
    font-size: 16px;
    margin-right: 16px;
    color: gray;
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
    cursor: pointer;
}
</style>