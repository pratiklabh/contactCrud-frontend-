import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

import Router from "./Router/router.js";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Menubar from 'primevue/menubar';
import Aura from '@primevue/themes/nora';
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
