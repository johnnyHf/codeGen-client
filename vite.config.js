import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {LayuiVueResolver} from 'unplugin-vue-components/resolvers'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
        plugins: [
            vue(),
            AutoImport({
                resolvers: [LayuiVueResolver()],
            }),
            // 自动解析 layui-vue 组件
            Components({
                resolvers: [LayuiVueResolver()],
            }),
        ],
        proxy:{
            '/table':{
                // 跨域的服务器地址
                target: 'http://127.0.0.1:8899',
                // 是否允许跨域
                changeOrigin: true,
                // 替换掉请求路径的/table为“”
                pathRewrite:{'^/table': ""}
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
)
