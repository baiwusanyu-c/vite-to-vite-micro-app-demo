import {createRouter, createWebHashHistory,createWebHistory} from 'vue-router'
import test from '../src/test.vue'

const routes = [
    {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/test/:page*',
        name: 'test',
        component: test,
    },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
    // micro app 基座必须使用history模式
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})
