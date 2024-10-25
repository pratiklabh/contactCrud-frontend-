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

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const drawDataOnCanvas = async (item) => {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  try {
    const staticImage = await loadImage('/background-image.jpg');
    ctx.drawImage(staticImage, 0, 0, canvas.value.width, canvas.value.height);

    if (!item) return;

    // Load and draw the signature and QR images after the background image
    const sign = await loadImage('/sign.jpg');
    const qr = await loadImage('/Id_qr.png');

    //opacity = 50% (for positioning only)
    // ctx.globalAlpha = 0.7;

    // Draw the signature and QR images
    ctx.drawImage(sign, 85, 243, 226, 226);
    ctx.drawImage(qr, 590, 758, 145, 145);

    // Draw text details
    ctx.font = ' bold 26px  Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    ctx.fillText(item.membership_no, 395, 810);
    ctx.fillText(item.name, 405, 540);

    let address = item.district + "- " + item.ward_no + ", " + item.municipality;
    ctx.fillText(address, 405, 620);

    ctx.fillStyle = 'green';
    ctx.font = 'bold 25px Arial';
    ctx.fillText(item.saccos_union, 405, 580);

  } catch (error) {
    console.error('Error loading images:', error);
  }
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
  margin: 0 auto;
}

.canvas {
  border: 1px solid black;

}

.input-field {
  width: 100%;
}
</style>
