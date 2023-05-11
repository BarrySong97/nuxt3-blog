<script setup lang="ts">
const { toc } = useContent();

</script>

<template>
    <div class="toc" v-if="toc.links.length">

        <div class="mb-1">目录</div>
        <ul v-if="toc && toc.links">
            <li v-for="link in toc.links" :key="link.text">
                <a :href="`#${link.id}`" class="dark:text-white">
                    {{ link.text }}
                </a>
                <ul class="ml-2" v-if="link && link.children">
                    <li v-for="sublink in link.children" :key="sublink.text">
                        <a :href="`#${sublink.id}`" class="dark:text-white">
                            {{ sublink.text }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.toc {
    position: fixed;
    top: 110px;
    left: 80px;
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
    display: inline-block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

a:hover {
    color: var(--prose-a-color-hover);
    border-color: var(--prose-a-border-color-hover);
    border-style: var(--prose-a-border-style-hover);
}
</style>