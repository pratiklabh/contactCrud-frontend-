<template>
  <div class="canvas-container">
    <canvas ref="canvas" class="canvas" width="800" height="1000"></canvas>
    <InputText
        v-model="membershipNo"
        placeholder="Enter Membership Number"
        class="input-field"
        @input="filterByMembershipNo"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';

const canvas = ref(null);
const allData = ref([]); // Store all fetched data
const membershipNo = ref(''); // Store the input value for filtering

// Function to draw data on the canvas
const drawDataOnCanvas = (item) => {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear the canvas before drawing

  // Load static image
  const staticImage = new Image();
  staticImage.src = '/static-image.jpg'; // Path to your static image

  staticImage.onload = () => {
    // Draw the static image on the canvas
    ctx.drawImage(staticImage, 0, 0, canvas.value.width, canvas.value.height); // Adjust size and position as needed

    if (!item) return; // If no item, do not draw anything

    // Draw headers and data one per line
    ctx.font = '18px Arial';
    ctx.fillStyle = 'black';

    // Draw Membership No
    ctx.fillText(item.membership_no, 200, 745);

    // Draw Nepali Name
    ctx.fillText('Nepali Name:', 70,520);
    ctx.fillText(item.nepali_name, 190, 520);

    // Draw Name
    ctx.fillText('Name:', 430,520);
    ctx.fillText(item.name, 500,520);

    // // Draw Mobile No
    ctx.fillText('Mobile No:', 70,550);
    ctx.fillText(item.mobile_no,190,550 );

    // // Draw Email
    ctx.fillText('Email:', 430,550);
    ctx.fillText(item.email,500,550);

    // Draw Gender
    ctx.fillText('Gender:',70,580);
    ctx.fillText(item.gender, 190,580);

    // // Draw Post
    ctx.fillText('Post:', 430,580);
    ctx.fillText(item.post,500,580);

    // Draw Municipality
    ctx.fillText('Municipality:',70,610);
    ctx.fillText(item.municipality, 190,610);

    // // Draw District
    ctx.fillText('District:', 430,610);
    ctx.fillText(item.district,500,610);

    // // Draw Ward No
    ctx.fillText('Ward No:', 70,640);
    ctx.fillText(item.ward_no, 190,640);

    // // Draw Saccos Union
    ctx.fillText('Saccos Union:', 70,670);
    ctx.fillText(item.saccos_union, 190, 670);

  };
};

// Function to filter data by membership number
const filterByMembershipNo = () => {
  const codeToFind = membershipNo.value.trim(); // Remove extra spaces
  const item = allData.value.find(item => {
    // Ensure item.membership_no is a string and match it with the entered value
    return String(item.membership_no) === codeToFind;
  });
  drawDataOnCanvas(item);
};

onMounted(() => {
  fetch('/AgmFormData.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        const headers = jsonData[0];
        const nameIndex = headers.indexOf('Name');
        const nepaliNameIndex = headers.indexOf('Nepali Name');
        const genderIndex = headers.indexOf('Gender');
        const saccosUnionIndex = headers.indexOf('Saccos Union');
        const postIndex = headers.indexOf('Post');
        const emailIndex = headers.indexOf('Email');
        const districtIndex = headers.indexOf('District');
        const municipalityIndex = headers.indexOf('Municipality');
        const wardNoIndex = headers.indexOf('Ward No');
        const mobileNoIndex = headers.indexOf('Mobile No');
        const membershipNoIndex = headers.indexOf('Membership No');

        // Extract relevant data from each row using column indices
        allData.value = jsonData.slice(1).map(row => ({
          name: row[nameIndex] || '',
          nepali_name: row[nepaliNameIndex] || '',
          gender: row[genderIndex] || '',
          saccos_union: row[saccosUnionIndex] || '',
          post: row[postIndex] || '',
          email: row[emailIndex] || '',
          district: row[districtIndex] || '',
          municipality: row[municipalityIndex] || '',
          ward_no: row[wardNoIndex] || '',
          mobile_no: row[mobileNoIndex] || '',
          membership_no: row[membershipNoIndex] || '',
        })).filter(row => row.name && row.nepali_name && row.gender && row.saccos_union &&
            row.post && row.email && row.district && row.municipality &&
            row.ward_no && row.mobile_no
        );
        console.log(allData.value);
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

.input-field {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
