import { createApp } from 'vue'
import App from './App.vue'
import {router} from '../router/router'
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
const app = createApp(App)
app.use(router)
app.mount('#app')
