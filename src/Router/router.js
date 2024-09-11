import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../Views/Home.vue');
const AboutMe = () => import('../Views/AboutMe.vue');
const Projects = () => import('../Views/Projects.vue');
const Skills = () => import('../Views/Skills.vue');
const Experience = () => import('../Views/Experience.vue');
const ContactMe = () => import('../Views/ContactMe.vue');

const routes = [
    { path: '/', component: Home },
    { path: '/about-me', component: AboutMe },
    { path: '/projects', component: Projects },
    { path: '/skills', component: Skills },
    { path: '/experience', component: Experience },
    { path: '/contact-me', component: ContactMe },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
