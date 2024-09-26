import { createRouter, createWebHistory } from 'vue-router';

const ContactMe = () => import('../views/ContactMe.vue');
const ContactList = () => import('../views/ContactList.vue');
const ContactVee = () => import('../views/ContactUsingVeeValidate.vue');
const ContactVeeList = () => import('../views/ContactVeeList.vue');
const CustomValidation = () => import('../views/CustomValidation.vue');
// const CustomValidationList = () => import('../views/CustomValidationList.vue');
const Number = () => import('../views/Number.vue')
const NumberList = () => import('../views/NumberList.vue')
const Lazy = () => import('../views/Lazy.vue')
const LazySecond = () => import('../views/LazySecond.vue')
const Autocomplete = () => import ('../views/LazySecond.vue')
const LazyProject = () => import('../views/LazyProject.vue')
const AutoComplete = () => import('../views/AutoComplete.vue')
const PanelTest = () => import ('../views/PanelTest.vue')
const DatatableTest = () => import ('../views/DatatableTest.vue')
const SupplierAutocomplete = () => import ('../views/SupplierAutocomplete.vue')
const Information = () => import('../views/Information.vue')
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'contactMe',
            component: ContactMe,
        },
        {
            path: '/contactList',
            name: 'contactList',
            component: ContactList,
        },
        {
            path: '/contactVee',
            name: 'contactVee',
            component: ContactVee,
        },
        {
            path: '/contactVeeList',
            name: 'contactVeeList',
            component: ContactVeeList,
        },
        {
            path: '/customValidation',
            name: 'customValidation',
            component: CustomValidation,
        },
        {
            path: '/number',
            name:'/number',
            component: Number,
        },
        {
            path:'/numberList',
            name: NumberList,
            component: NumberList,
        },
        {
          path: '/lazy',
          name:Lazy,
          component: Lazy,
        },
        {
            path: '/lazySecond',
            name:LazySecond,
            component: LazySecond,
        },
        {
            path: '/lazyProject',
            name:LazyProject,
            component: LazyProject,
        },
        {
            path: '/autocomplete',
            name: AutoComplete,
            component: AutoComplete
        },
        {
            path: '/panel',
            name: PanelTest,
            component: PanelTest

        },
        {
            path: '/datatable',
            name: DatatableTest,
            component: DatatableTest,
        },
        {
            path: '/info',
            name: Information,
            component: Information,
        },
        {
            path:'/supplier',
            name: SupplierAutocomplete,
            component: SupplierAutocomplete,
        }
    ],
})

export default router;
