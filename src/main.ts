import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { create } from 'naive-ui';
import VueApexCharts from 'vue3-apexcharts';
import App from './App.vue';
import '@/assets/styles/main.css';

const naive = create({});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(naive);
app.component('apexchart', VueApexCharts);

app.mount('#app');
