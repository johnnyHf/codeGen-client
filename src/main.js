import { createApp } from 'vue'
import App from './App.vue'
import Layui from '@layui/layui-vue'
import '@layui/layui-vue/lib/index.css'
import {store} from './store/store'
createApp(App).use(Layui).use(store).mount('#app')