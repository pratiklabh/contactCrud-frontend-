<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/NavBar.vue';
</script>

<style >
* {
  padding: 0px;
  margin: 0px;
}
</style>