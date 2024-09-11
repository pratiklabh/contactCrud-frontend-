<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">X</button>
      <h3>{{ project.name }}</h3>
      <img :src="getImage(project.image)" alt="Project Image" />
      <p>{{ project.description }}</p>
      <Button
          label="View on GitHub"
          :href="project.link"
          target="_blank"
          rel="noopener"
          class="p-button p-component p-button-outlined"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';

const props = defineProps({
  project: Object,
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

// Function to return image path
const getImage = (imageName) => {
  return new URL(`../assets/images/${imageName}`, import.meta.url).href;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

img {
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
}
</style>
