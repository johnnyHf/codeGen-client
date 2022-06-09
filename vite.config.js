import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {LayuiVueResolver} from 'unplugin-vue-components/resolvers'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
        transpileDependencies: true,
        //更改默认端口
        devServer: {
            open: false, // 自动打开浏览器
            port: 8081,
        },
        server: {
            port: 5000
        },
        //设置是否在开发环境下每次保存代码时都启用 eslint验证
        lintOnSave: false,
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
        proxy: {
            '/table': {
                // 跨域的服务器地址
                target: 'http://127.0.0.1:8899',
                // 是否允许跨域
                changeOrigin: true,
                // 替换掉请求路径的/table为“”
                pathRewrite: {'^/table': ""}
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {},
                    javascriptEnabled: true,
                },
            },
        },
    },
)
