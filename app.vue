
<template >
    <div class="bg-white dark:bg-black">
        <LayoutHeader />
        <div class="content ">
            <NuxtPage />
        </div>
    </div>
</template>
<style>
.content {
    height: calc(100vh - 65px);
    overflow: auto;
}
</style>