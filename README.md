### 基于nomo repo的 vite micro app 微前端demo
* 主应用 vite + Vue3 + ts
* 子用于 vite + Vue3 + ts
* 包管理工具 pnpm
### 实现步骤
### 主应用
#### 1.安装 micro app
````
pnpm add @micro-zoe/micro-app --filter main
````
#### 2.入口文件 main.ts中添加代码
````
import microApp from '@micro-zoe/micro-app'
microApp.start({
    plugins: {
        modules: {
            // vite-child 即应用的name值
            'vite-child': [{
                loader(code) {
                    if (process.env.NODE_ENV === 'development') {
                        // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
                        code = code.replace(/(from|import)(\s*['"])(\/child\/vite\/)/g, all => {
                            return all.replace('/child/vite/', 'http://localhost:3013/child/vite/')
                        })
                    }
                    return code
                }
            }]
        }
    }
})
````
**注意：**
* /child/vite/ 必须与子应用的vite.config.ts中 base 一致
* modules 中 vite-child 即应用的name值 必须步骤3与基座组件name一致
#### 3.创建基座组件 test.vue
````
<template>
  <micro-app name='vite-child'
             inline
             disableSandbox
             url='http://localhost:3013/child/vite/'></micro-app>
</template>

<script>
export default {
  name: "test" // baseroute='/vite-child'
}
</script>

<style scoped>

</style>
````
#### 4.设置路由
````

const routes = [
    {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/test/:page*',
        name: 'test',
        component: test,
    },
]
export const router = createRouter({
    // micro app vite基座必须使用history模式
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})
````

### 子应用
#### 修改 index.html根元素 id app =》 XXX，并在main.ts中挂载位置相应修改
#### 在vite.config.ts中编写插件并设置base属性
````
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import { writeFileSync } from 'fs'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    (function () {
      let basePath = ''
      return {
        name: "vite:micro-app",
        apply: 'build',
        configResolved(config) {
          basePath = `${config.base}${config.build.assetsDir}/`
        },
        // writeBundle 钩子可以拿到完整处理后的文件，但已经无法修改
        writeBundle (options, bundle) {
          for (const chunkName in bundle) {
            if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
              const chunk = bundle[chunkName]
              if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
                  return all.replace($3, new URL($3, basePath))
                })
                const fullPath = join(options.dir, chunk.fileName)
                writeFileSync(fullPath, chunk.code)
              }
            }
          }
        },
       
      }
    })() as any,
  ],
  server: {
    // hostname: '0.0.0.0',
    host: "localhost",
    port: 3013,

  },
  base: `${process.env.NODE_ENV === 'production' ? 'http://www.micro-zoe.com' : ''}/child/vite/`,
})

````