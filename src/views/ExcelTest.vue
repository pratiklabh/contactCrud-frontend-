<template>
  <div class="canvas-container">
    <canvas ref="canvas" class="canvas" width="800" height="1000"></canvas>
    <InputText
        v-model="productCode"
        placeholder="Enter product code"
        class="product-input"
        @input="filterProductByCode"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';

const canvas = ref(null);
const allData = ref([]); // Store all fetched data
const productCode = ref(''); // Store the input value for filtering

// Function to draw data on the canvas
const drawDataOnCanvas = (item) => {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear the canvas before drawing

  if (!item) return; // If no item, do not draw anything

  // Set starting position
  const startX = 50;  // X position for the first column
  const startY = 100; // Y position for the first row
  const rowHeight = 100; // Height for each row

  // Draw headers
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Code', startX, startY);
  ctx.fillText('Name', startX + 200, startY);
  ctx.fillText('Rate', startX + 400, startY);
  ctx.fillText('Image', startX + 600, startY);

  // Draw the selected item's data
  ctx.fillText(item.code, startX, startY + rowHeight);
  ctx.fillText(item.name, startX + 200, startY + rowHeight);
  ctx.fillText(item.rate, startX + 400, startY + rowHeight);

  // Load and draw image
  const image = new Image();
  image.src = item.image_path; // from excel column image_path
  image.onload = () => {
    ctx.drawImage(image, startX + 600, startY + rowHeight - 30, 100, 100); // Adjust Y position for the image
  };
};

// Function to filter product by code
const filterProductByCode = () => {
  const codeToFind = productCode.value.trim().toLowerCase(); // Trim whitespace and convert to lower case
  const item = allData.value.find(item => {
    // Ensure item.code is a string
    return String(item.code).toLowerCase() === codeToFind;
  });
  drawDataOnCanvas(item);
};

onMounted(() => {
  fetch('/data.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract relevant data from each row (name, code, image_path, rate)
        allData.value = jsonData.slice(1).map(row => ({
          name: row[1] || '',
          code: row[2] || '',
          image_path: row[3] || '',
          rate: row[4] || ''
        })).filter(row => row.name && row.code && row.image_path && row.rate);
      })
      .catch((error) => console.error('Error loading the Excel file:', error));
});
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 800px;
  height: 1000px;
}

.canvas {
  border: 1px solid black;
}

.product-input {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
