<template>
  <div class="canvas-container">
    <canvas ref="canvas" class="canvas" width="800" height="1000"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';

const canvas = ref(null);

// Function to draw data on the canvas
const drawDataOnCanvas = (data) => {
  const ctx = canvas.value.getContext('2d');

  console.log('Extracted Data:', data);

  // Set starting position
  const startX = 50;  // X position for the first column
  const startY = 100; // Y position for the first row
  const rowHeight = 100; // Height for each row

  // Draw headers
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Name', startX, startY);
  ctx.fillText('Code', startX + 200, startY);
  ctx.fillText('Rate', startX + 400, startY);
  ctx.fillText('Image', startX + 600, startY);

  // Draw each item
  data.forEach((item, index) => {
    const yOffset = startY + (index + 1) * rowHeight;

    // Draw text: name, code, rate
    ctx.fillText(item.name, startX, yOffset);
    ctx.fillText(item.code, startX + 200, yOffset); // Align with "Code"
    ctx.fillText(item.rate, startX + 400, yOffset); // Align with "Rate"

    // Load and draw image
    const image = new Image();
    image.src = item.image_path; // from excel column image_path
    image.onload = () => {
      ctx.drawImage(image, startX + 600, yOffset - 30, 100, 100); // Adjust Y position for the image
    };
  });
};

// Load the Excel file from the public directory
const loadExcelFromPublic = () => {
  const fileUrl = '/data.xlsx'; // excel file path in the public folder
  fetch(fileUrl)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract relevant data from each row (name, code, image_path, rate)
        const extractedData = jsonData.slice(1).map(row => ({
          name: row[1] || '',
          code: row[2] || '',
          image_path: row[3] || '',
          rate: row[4] || ''
        })).filter(row => row.name && row.code && row.image_path && row.rate); // Keep only valid rows

        // Draw the extracted data on the canvas
        drawDataOnCanvas(extractedData);
      })
      .catch((error) => console.error('Error loading the Excel file:', error));
};

// Call the function after the component mounts
onMounted(() => {
  loadExcelFromPublic();
});
</script>

<style scoped>
.canvas-container {
  width: 800px;
  height: 1000px;
}
.canvas {
  border: 1px solid black;
}
</style>
