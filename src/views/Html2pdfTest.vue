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
        <h3 :style="{ textAlign: clientPreferences.customer_name_align }">Customer Name: {{ selectedSalesDetail.customerName }}</h3>
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

    <!-- Dialog for Print Size Selection -->
    <Dialog v-model:visible="printSizeDialogVisible" header="Select Client and Paper Size" :modal="true" :closable="true" style="width: 30vw">
      <div>
        <p>Select the client and paper size for the PDF:</p>

        <!-- Select Client Dropdown -->
        <Select v-model="selectedClientId" :options="clients" optionLabel="client_name" optionValue="client_id" placeholder="Select Client" @change="fetchClientPreferences"/>

        <!-- Select Paper Size Dropdown -->
        <Select v-model="selectedPaperSize" :options="paperSizes" optionLabel="label" optionValue="value" placeholder="Select Paper Size"/>

        <div style="margin-top: 1rem;">
          <Button label="Confirm" @click="confirmPrint"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import html2pdf from 'html2pdf.js'; // Import html2pdf.js

const salesDetails = ref([]);
const dialogVisible = ref(false);
const printSizeDialogVisible = ref(false);
const selectedSalesDetail = ref(null);
const grandTotal = ref(0);
const selectedPaperSize = ref(null); // Holds the selected paper size
const selectedClientId = ref(null); // Holds the selected client ID
const clients = ref([]); // Holds the list of clients
const paperSizes = ref([
  { label: 'A4', value: 'a4' },
  { label: 'A5', value: 'a5' },
  { label: '80 mm', value: [80, 230] },
  { label: '72 mm', value: [72, 230] },
  { label: '58 mm', value: [58, 230] },
]);

// Store client preferences
const clientPreferences = ref({});

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

// Fetch client data for the dropdown
const fetchClients = async () => {
  try {
    const response = await axios.get('sbs-api/sales/preferences');
    if (response.data.success === 'true') {
      clients.value = response.data.result || [];
    } else {
      console.error('Error fetching clients:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
};

// Fetch client preferences when client is selected
const fetchClientPreferences = async () => {
  if (selectedClientId.value) {
    try {
      const response = await axios.get(`sbs-api/sales/preferences/${selectedClientId.value}`);
      if (response.data.success === 'true') {
        clientPreferences.value = response.data.result;
      } else {
        console.error('Error fetching client preferences:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching client preferences:', error);
    }
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
const confirmPrint = () => {
  printSizeDialogVisible.value = false; // Close size dialog
  printPreview(selectedSalesDetail.value);
};


const printPreview = async (salesDetail) => {
  const salesId = salesDetail.id;

  try {
    const salesResponse = await axios.get(`sbs-api/sales/details/${salesId}`);
    const preferencesResponse = await axios.get(`sbs-api/sales/preferences/${selectedClientId.value}`);

    if (salesResponse.data.success === "true" && preferencesResponse.data.success === "true") {
      const details = salesResponse.data.result;
      const preferences = preferencesResponse.data.result;

      if (!preferences) {
        console.error('Preferences not found for the given client');
        return;
      }

      // Prepare print content
      let printContent = `
        <div style="text-align: ${preferences.company_name_align};">
          <h2>Sales Invoice</h2>
          <p><strong>${preferences.client_name}</strong></p>
          <p>Kathmandu, Nepal</p>
          <p><strong>Customer Name: ${salesDetail.customerName}</strong></p>
          <p style="text-align: ${preferences.date_align};"><strong>Date: ${salesDetail.date}</strong></p>
          <table style="width: 100%; border-collapse: collapse; text-align: ${preferences.table_align};">
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
      `;

      let grandTotal = 0;
      details.forEach(item => {
        const total = (item.rate - item.discount) * item.quantity;
        grandTotal += total;
        printContent += `
          <tr>
            <td style="border: 1px solid #000;">${item.productName}</td>
            <td style="border: 1px solid #000;">${item.rate}</td>
            <td style="border: 1px solid #000;">${item.quantity}</td>
            <td style="border: 1px solid #000;">${item.discount}</td>
            <td style="border: 1px solid #000;">${total}</td>
          </tr>
        `;
      });

      printContent += `
            </tbody>
          </table>
          <h3 style="text-align: ${preferences.grand_total_align};">Grand Total: ${grandTotal}</h3>
        </div>
      `;

      const printElement = document.createElement('div');
      printElement.innerHTML = printContent;
      document.body.appendChild(printElement);

      // Set scaling based on paper size
      let scale = 2;
      if (selectedPaperSize.value === '58mm' || selectedPaperSize.value === '72mm' || selectedPaperSize.value === '80mm') {
        scale = 4; // Increase scale for smaller sizes
      }

      const options = {
        margin: 0.5,
        filename: `SalesDetail_${salesId}.pdf`,
        html2canvas: { scale: scale },  // Adjust scale
        jsPDF: { unit: 'mm', format: selectedPaperSize.value, orientation: 'portrait' },
      };

      html2pdf().from(printElement).set(options).toPdf().get('pdf').then(function (pdf) {
        window.open(pdf.output('bloburl'), '_blank');
        pdf.autoPrint(); // Trigger print dialog
      }).catch(error => {
        console.error('Error generating PDF:', error);
      });

      document.body.removeChild(printElement);

    } else {
      console.error('Error fetching sales details or preferences:', salesResponse.data.message, preferencesResponse.data.message);
    }

  } catch (error) {
    console.error('Error during print preview:', error);
  }
};





onMounted(() => {
  fetchSalesData();
  fetchClients();
});
</script>

<style scoped>
.table-container {
  margin: 20px;
}
</style>
