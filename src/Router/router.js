import { createRouter, createWebHistory } from 'vue-router';

const ContactMe = () => import('../views/ContactMe.vue');
const ContactList = () => import('../views/ContactList.vue');
const ContactVee = () => import('../views/ContactUsingVeeValidate.vue');

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'contactMe', // Adding a name for ContactMe route (optional)
            component: ContactMe,
        },
        {
            path: '/contactList',
            name: 'contactList', // Adding the missing name property
            component: ContactList,
        },
        {
            path: '/contactVee',
            name: 'contactVee', // Adding a name for ContactMe route (optional)
            component: ContactVee,
        },
    ],
})

export default router;
