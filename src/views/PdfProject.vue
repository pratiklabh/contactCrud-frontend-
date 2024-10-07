<template>
  <div>
    <Button class="m-8" label="Print" @click="openPrintSizeDialog"/>

    <Dialog v-model:visible="printSizeDialogVisible" header="Select Paper Size" :modal="true" :closable="true"
            style="width: 30vw">
      <div>
        <p>Select the paper size for the PDF:</p>
        <Select v-model="selectedPaperSize" :options="paperSizes" optionLabel="label" optionValue="value"
                placeholder="Select Paper Size"/>

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


const printSizeDialogVisible = ref(false);
const selectedPaperSize = ref(null);

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

    // Assuming the API call to get the sales invoice data
    const salesResponse = await axios.get('/templates/response');
    console.log(salesResponse);
    const data = salesResponse.data.result;

    // Populate the template with data from the response
    let templateData = {
      customerName: data.customer.name,
      customerAddress: data.customer.address,
      customerPhone: data.customer.phoneNo,
      customerPan: data.customer.panNo,
      paymentMode: data.paymentMode,
      invoiceNo: data.invoiceNo,
      transactionDate: data.createdAt,
      invoiceDate: data.invoiceDate,
      invoiceMiti: data.invoiceDate,
      amountInWords: data.amountInWords,
      discount: data.amountDetails.discountAmount,
      vat: data.amountDetails.vatAmount,
      total: data.amountDetails.totalAmount,
      grandSubtotal: data.amountDetails.subTotal,
      schemeDiscount: 100,
      taxable: 0,
      nonTaxable: 0,
      createdBy: data.createdBy.firstName,
      items: data.salesInvoiceDetails.map((item, index) => ({
        serialNo: index + 1,
        itemName: item.product.name,
        qty: item.quantity,
        rate: item.unitRate,
        subtotal: item.amountDetails.subTotal
      })),
    };

    // Render the template using Mustache
      let filledHtml = Mustache.render(htmlTemplate, templateData);
      const element = document.createElement('div');
      element.innerHTML = filledHtml;
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