<template>
  <Menubar :model="items" class="menubar"></Menubar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css';

const router = useRouter();

// Define navigation items with icons
const items = [
  { label: 'Home', icon: 'pi pi-fw pi-home', command: () => router.push('/') },
  { label: 'About', icon: 'pi pi-fw pi-info-circle', command: () => router.push('/about-me') },
  { label: 'Projects', icon: 'pi pi-fw pi-folder', command: () => router.push('/projects') },
  { label: 'Skills', icon: 'pi pi-fw pi-star', command: () => router.push('/skills') },
  { label: 'Experience', icon: 'pi pi-fw pi-briefcase', command: () => router.push('/experience') },
  { label: 'Contact Me', icon: 'pi pi-fw pi-phone', command: () => router.push('/contact-me') }
];
</script>

<style scoped>
.menubar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensures the menubar stays on top */
  font-size: 1rem;
  background-color: #000000;
  padding: 0.5rem 1rem;
}
.p-menubar {
  border: none; /* Remove border if unwanted */
}
</style>
