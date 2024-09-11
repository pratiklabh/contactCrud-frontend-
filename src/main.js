import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import './assets/global.css';
import 'primeicons/primeicons.css';
import Aura from '@primevue/themes/aura';

import Router from "./Router/router.js";

import Menubar from 'primevue/menubar';

const app = createApp(App);

app.use(Router);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

// Register components globally
app.component('Menubar', Menubar);

app.mount('#app');
