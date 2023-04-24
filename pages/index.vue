<template >
    <div class="home font-serif h-screen linear-gradient">
        <div class="flex">
            <div class="flex-1 px-24 pt-10">
                <div class="flex mb-6">
                    <img class="avatar mr-4" src="https://files.catbox.moe/0unbct.jpg" />

                    <div>
                        <div class="font-600 text-2xl">
                            Barry Song - 宋天健
                        </div>
                        <div>
                            全栈工程师 / 四川成都
                        </div>
                        <div class="mb-1">
                            1997.10.17
                        </div>
                        <div class="text-gray-500 text-sm">
                            分享我的感悟和技术，积极健身；
                            热爱一切故事，电影/漫画/动漫/电视剧/小说
                        </div>
                    </div>
                </div>
                <div class="pl-4 ">
                    <ContentDoc path="/about" />
                </div>
            </div>
            <div class="flex-1 p-24 pt-10">
                <ProjectList />
            </div>
        </div>
    </div>
</template>