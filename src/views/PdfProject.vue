<template>
  <div>
    <Button class="m-8" label="Print" @click="openPrintSizeDialog"/>

    <Dialog v-model:visible="printSizeDialogVisible" header="Select Paper Size" :modal="true" :closable="true"
            style="width: 30vw">
      <div>
        <p>Select the paper size for the PDF:</p>
        <Select v-model="selectedPaperSize" :options="paperSizes" optionLabel="label"
                optionValue="value" placeholder="Select Paper Size"/>

        <p style="margin-top: 1rem;">Select the font for the PDF:</p>
        <Select v-model="selectedFont" :options="fonts" optionLabel="label"
                optionValue="value" placeholder="Select Font" />

        <div style="margin-top: 1rem;">
          <Button label="Confirm" @click="confirmPrint"/>
        </div>
      </div>
    </Dialog>
  </div>

</template>

<script setup>

import Button from "primevue/button";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import {ref} from "vue";
import axios from "axios";
import Mustache from "mustache";
import html2pdf from "html2pdf.js";

const paperSizes = ref([
  {label: 'A4', value: 'a4'},
  {label: 'A5', value: 'a5'},
  {label: '80 mm', value: [80, 230]},
  {label: '72 mm', value: [72, 230]},
]);
const fonts = ref([
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Verdana', value: 'Verdana' },
]);

const printSizeDialogVisible = ref(false);
const selectedPaperSize = ref(null);
const selectedFont = ref(null);

const openPrintSizeDialog = () => {
  printSizeDialogVisible.value = true;
};

const confirmPrint = async () => {
  printSizeDialogVisible.value = false;
  await generatePdf();
};

const generatePdf = async () => {
  try {
    const response = await axios.get('/templates/projectTemplate.html');
    let htmlTemplate = response.data;

    const salesResponse = await axios.get('/templates/response');
    const data = salesResponse.data.result;

    data.salesInvoiceDetails.forEach((item, index) => {
      item.serialNo = index + 1;
    });

    data.selectedFont = selectedFont.value || 'Arial'; // Default to Arial if no font is selected

    let filledHtml = Mustache.render(htmlTemplate, data);

    // Create a new div and set the font style based on the selected font
    const element = document.createElement('div');
    element.innerHTML = filledHtml;

    // Append the element to the body
    document.body.appendChild(element);

    // Set up PDF options and generate
    const opt = {
      margin: [2, 2],
      filename: `sales-detail.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: selectedPaperSize.value || 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).toPdf().get('pdf').then(pdf => {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    });

    document.body.removeChild(element);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

</script>

<style scoped>

</style>