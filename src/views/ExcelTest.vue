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

  data.forEach((item, index) => {
    // Draw text: name, code, rate
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    const yOffset = 100 + (index * 150); // Adjust vertical position for each item
    ctx.fillText(`Name: ${item.name}`, 50, yOffset);
    ctx.fillText(`Code: ${item.code}`, 50, yOffset + 30);
    ctx.fillText(`Rate: ${item.rate}`, 50, yOffset + 60);

    // Load and draw image
    const image = new Image();
    image.src = item.image_path; // from excel column image_path
    image.onload = () => {
      ctx.drawImage(image, 400, yOffset - 40, 100, 100);
    };
  });
};

// load the Excel file from the public directory
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
