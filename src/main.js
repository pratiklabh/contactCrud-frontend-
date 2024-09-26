import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import {Form, Field} from "vee-validate";
import Column from "primevue/column";
import Router from "./Router/router.js";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Menubar from 'primevue/menubar';
import Aura from '@primevue/themes/nora';
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Button from "primevue/button";


const app = createApp(App);

app.use(Router);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});


// Register components globally
app.component('Menubar', Menubar);
app.component('Form', Form);
app.component('Field', Field);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('InputText', InputText);
app.component('Button', Button);


app.mount('#app');
