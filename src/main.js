import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

import Router from "./Router/router.js";

import Menubar from 'primevue/menubar';

const app = createApp(App);

app.use(Router);

app.use(PrimeVue);


// Register components globally
app.component('Menubar', Menubar);

app.mount('#app');
