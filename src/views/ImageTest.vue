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

  const qr = new Image();
  qr.src = '/qr.jpg';

  // Ensure both images are loaded before drawing
  staticImage.onload = () => {
    console.log("Static image loaded");

    // Calculate the aspect ratio of the static image
    const aspectRatio = staticImage.height / staticImage.width;

    // Determine the new height based on canvas width and aspect ratio
    const canvasWidth = 800; // Width of the canvas
    const canvasHeight = 1000; // Height of the canvas
    let newHeight = canvasWidth * aspectRatio;

    // Adjust the new height if it exceeds the canvas height
    if (newHeight > canvasHeight) {
      newHeight = canvasHeight;
    }

    // Center the image vertically if it's shorter than the canvas height
    const offsetY = (canvasHeight - newHeight) / 2;

    // Draw the static image on the canvas to cover full width while maintaining aspect ratio
    ctx.drawImage(staticImage, 0, offsetY, canvasWidth, newHeight);

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
      ctx.fillText(`21212121221`, 500, 750); // Position the date near the bottom
    };

    // Load and draw the QR code image
    qr.onload = () => {
      ctx.drawImage(qr, 50, 770, 150, 150);
      ctx.drawImage(qr, 600, 770, 150, 150);
    };
  };
};

onMounted(() => {
  drawImageWithDate();
});
</script>

<style scoped>
.canvas-container {
  width: 800px; /* Maintain the width to match canvas width */
  height: 1000px; /* Adjust height as needed */
}

.canvas {
  border: 1px solid black;
}
</style>
