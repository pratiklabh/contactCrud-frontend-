<template>
  <div class="table-container">
    <h2>Sales Details</h2>

    <DataTable :value="salesDetails" tableStyle="min-width: 50rem">
      <Column field="date" header="Date"/>
      <Column field="total" header="Total"/>
      <Column field="customerName" header="Customer Name"/>
      <Column field="paymentMode" header="Payment Mode"/>
      <Column header="Actions">
        <template #body="slotProps">
          <Button label="View Details" @click="viewDetails(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" header="Sales Details" :modal="true" :closable="true" style="width: 50vw">
      <template v-if="selectedSalesDetail">
        <h3>Customer Name: {{ selectedSalesDetail.customerName }}</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <thead>
          <tr>
            <th style="border: 1px solid #000;">Product Name</th>
            <th style="border: 1px solid #000;">Rate</th>
            <th style="border: 1px solid #000;">Quantity</th>
            <th style="border: 1px solid #000;">Discount</th>
            <th style="border: 1px solid #000;">Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in selectedSalesDetail.items" :key="item.productName">
            <td style="border: 1px solid #000;">{{ item.productName }}</td>
            <td style="border: 1px solid #000;">{{ item.rate }}</td>
            <td style="border: 1px solid #000;">{{ item.quantity }}</td>
            <td style="border: 1px solid #000;">{{ item.discount }}</td>
            <td style="border: 1px solid #000;">{{ (item.rate - item.discount) * item.quantity }}</td>
          </tr>
          </tbody>
        </table>
        <h3>Grand Total: {{ grandTotal }}</h3>
        <Button label="Print" @click="openPrintSizeDialog"/>
      </template>
    </Dialog>

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
import {ref, onMounted} from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import html2pdf from 'html2pdf.js';
import Mustache from 'mustache';

const salesDetails = ref([]);
const dialogVisible = ref(false);
const printSizeDialogVisible = ref(false);
const selectedSalesDetail = ref(null);
const grandTotal = ref(0);
const selectedPaperSize = ref(null);

const paperSizes = ref([
  {label: 'A4', value: 'a4'},
  {label: 'A5', value: 'a5'},
  {label: '58 mm', value: [58, 230]},
  {label: '72 mm', value: [72, 230]},
  {label: '80 mm', value: [80, 230]},
]);

// Fetch sales data from the API
const fetchSalesData = async () => {
  try {
    const response = await axios.get('sbs-api/sales');
    if (response.data.success === 'true') {
      salesDetails.value = response.data.result || [];
    } else {
      console.error('Error fetching sales data:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
};
// View Details function to show dialog with selected sales detail
const viewDetails = async (salesDetail) => {
  const salesId = salesDetail.id;
  const response = await axios.get(`sbs-api/sales/details/${salesId}`);
  if (response.data.success === "true") {
    selectedSalesDetail.value = {
      ...salesDetail,
      items: response.data.result
    };
    // Calculate grand total
    grandTotal.value = selectedSalesDetail.value.items.reduce((total, item) => {
      return total + (item.rate - item.discount) * item.quantity;
    }, 0);
    dialogVisible.value = true; // Open the dialog
  } else {
    console.error('Error fetching sales details:', response.data.message);
  }
};

// Open the print size dialog
const openPrintSizeDialog = () => {
  printSizeDialogVisible.value = true;
};

// Confirm print size selection and generate PDF
const confirmPrint = async () => {
  printSizeDialogVisible.value = false; // Close size dialog
  await generatePdf(selectedSalesDetail.value);
};

// Fetch HTML template from API and generate PDF
const generatePdf = async (salesDetail) => {
  try {
    const response = await axios.get(`/sbs-api/sales/template/1`);
    if (response.data.success === 'true') {
      let htmlTemplate = response.data.result.template;

      // Log salesDetail to debug
      console.log('Sales Detail:', salesDetail);

      let templateData = {
        customerName: salesDetail.customerName,
        grandTotal: salesDetail.total,
        details: salesDetail.items.map(item => ({
          productName: item.productName,
          rate: item.rate,
          quantity: item.quantity,
          discount: item.discount,
          total: (item.rate - item.discount) * item.quantity
        }))
      };

      let filledHtml = Mustache.render(htmlTemplate, templateData);

      const element = document.createElement('div');
      element.innerHTML = filledHtml;
      document.body.appendChild(element);

      const opt = {
        margin: [2, 2],
        filename: `sales-detail-${salesDetail.id}.pdf`,
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'mm', format: selectedPaperSize.value || 'a4', orientation: 'portrait'}
      };
      html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank');
      });

      document.body.removeChild(element);
    } else {
      console.error('Error fetching template:', response.data.message);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

onMounted(fetchSalesData);
</script>

<style scoped>
.table-container {
  padding: 2rem;
}
</style>