<template>
  <div class="canvas-container">
    <canvas ref="canvas" class="canvas" width="800" height="1000"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const canvas = ref(null);

const drawImageWithDate = () => {
  const ctx = canvas.value.getContext('2d');

  // Load the static image
  const staticImage = new Image();
  staticImage.src = '/static-image.jpg'; // Path to the static image

  // Load the signature image
  const signatureImage = new Image();
  signatureImage.src = '/sign.jpg'; // Path to the signature image

  // Ensure both images are loaded before drawing
  staticImage.onload = () => {
    console.log("Static image loaded");

    // Draw the static image on the canvas
    ctx.drawImage(staticImage, 0, 0, 800, 1000);

    // Once static image is drawn, load the signature image
    signatureImage.onload = () => {
      console.log("Signature image loaded");

      // Draw the signature image above the static image
      ctx.drawImage(signatureImage, 100, 280, 150, 150);

      // Add the date overlay
      const currentDate = new Date().toLocaleDateString();
      ctx.font = '24px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`Date: ${currentDate}`, 100, 750); // Position the date near the bottom
    };
  };
};

onMounted(() => {
  drawImageWithDate();
});
</script>

<style scoped>
.canvas-container {
  width: 1122px;
  height: 1535px;
}

.canvas {
  border: 1px solid black;
}
</style>
