<template>
  <div class="canvas-container">
    <InputText
        v-model="membershipNo"
        placeholder="Enter Membership Number"
        class="input-field"
        @input="filterByMembershipNo"
    />
    <canvas ref="canvas" class="canvas" width="800" height="1000"></canvas>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import * as XLSX from 'xlsx';

const canvas = ref(null);
const allData = ref([]);
const membershipNo = ref('');

const drawDataOnCanvas = (item) => {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const staticImage = new Image();
  staticImage.src = '/static-image.jpg';

  staticImage.onload = () => {
    ctx.drawImage(staticImage, 0, 0, canvas.value.width, canvas.value.height);

    if (!item) return;

    ctx.font = '18px Arial';
    ctx.fillStyle = 'black';

    ctx.fillText(item.membership_no, 200, 745);
    ctx.fillText('Nepali Name:', 70, 520);
    ctx.fillText(item.nepali_name, 190, 520);
    ctx.fillText('Name:', 430, 520);
    ctx.fillText(item.name, 500, 520);
    ctx.fillText('Mobile No:', 70, 550);
    ctx.fillText(item.mobile_no, 190, 550);
    ctx.fillText('Email:', 430, 550);
    ctx.fillText(item.email, 500, 550);
    ctx.fillText('Gender:', 70, 580);
    ctx.fillText(item.gender, 190, 580);
    ctx.fillText('Post:', 430, 580);
    ctx.fillText(item.post, 500, 580);
    ctx.fillText('Municipality:', 70, 610);
    ctx.fillText(item.municipality, 190, 610);
    ctx.fillText('District:', 430, 610);
    ctx.fillText(item.district, 500, 610);
    ctx.fillText('Ward No:', 70, 640);
    ctx.fillText(item.ward_no, 190, 640);
    ctx.fillText('Saccos Union:', 70, 670);
    ctx.fillText(item.saccos_union, 190, 670);
  };
};

const filterByMembershipNo = () => {
  const codeToFind = membershipNo.value.trim(); // Remove extra spaces
  const item = allData.value.find(item => {
    return String(item.membership_no) === codeToFind;
  });

  if (item) {
    drawDataOnCanvas(item);  // Draw the image only if there's a match
  } else {
    const ctx = canvas.value.getContext('2d');
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear the canvas if no match is found
  }
};


onMounted(() => {
  fetch('/AgmFormData.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        const headers = jsonData[0];

        allData.value = jsonData.slice(1).map(row => ({
          name: row[headers.indexOf('Name')] || '',
          nepali_name: row[headers.indexOf('Nepali Name')] || '',
          gender: row[headers.indexOf('Gender')] || '',
          saccos_union: row[headers.indexOf('Saccos Union')] || '',
          post: row[headers.indexOf('Post')] || '',
          email: row[headers.indexOf('Email')] || '',
          district: row[headers.indexOf('District')] || '',
          municipality: row[headers.indexOf('Municipality')] || '',
          ward_no: row[headers.indexOf('Ward No')] || '',
          mobile_no: row[headers.indexOf('Mobile No')] || '',
          membership_no: row[headers.indexOf('Membership No')] || '',
        })).filter(row => row.name && row.nepali_name && row.gender && row.saccos_union && row.post &&
                   row.email && row.district && row.municipality && row.ward_no && row.mobile_no);
        console.log(allData.value);
      })
      .catch((error) => console.error('Error loading the Excel file:', error));
});
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
}

.canvas {
  border: 1px solid black;
}

.input-field {
  width: 100%;
}
</style>
