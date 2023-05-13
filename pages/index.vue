<template >
    <div class=" home m-auto font-serif h-screen linear-gradient ">
        <div class=" flex justify-center pb-6">
            <div class="flex-1 px-24 pt-10">
                <div class="flex mb-6 ">
                    <img class="avatar mr-4" src="https://files.catbox.moe/0unbct.jpg" />
                    <div class="flex flex-col justify-between">

                        <div class="dark:text-white font-600 text-2xl">
                            Barry Song
                        </div>
                        <div class="dark:text-white">
                            全栈工程师 / 四川成都
                        </div>
                        <div class="mb-1 dark:text-white">
                            1997.10.17
                        </div>
                        <div class="dark:text-white">
                            <ContactList />
                        </div>
                    </div>
                </div>
                <div class="dark:text-white">
                    <ContentDoc path="/about" />
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.home {
    width: 50vw;
}
</style>