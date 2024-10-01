<template>
  <div class="table-container">
    <h2>Sales Details</h2>

    <!-- PrimeVue DataTable -->
    <DataTable :value="salesDetails" tableStyle="min-width: 50rem">
      <Column field="date" header="Date" />
      <Column field="total" header="Total" />
      <Column field="customerName" header="Customer Name" />
      <Column field="paymentMode" header="Payment Mode" />
      <Column header="Actions">
        <template #body="slotProps">
          <Button label="View Details" @click="viewDetails(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog for Sales Details -->
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
        <Button label="Print" @click="printPreview(selectedSalesDetail)" />
      </template>
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
import html2pdf from 'html2pdf.js'; // Import html2pdf.js

const salesDetails = ref([]);
const dialogVisible = ref(false);
const selectedSalesDetail = ref(null);
const grandTotal = ref(0);

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


const printPreview = async (salesDetail) => {
  const salesId = salesDetail.id;
  const response = await axios.get(`sbs-api/sales/details/${salesId}`);

  if (response.data.success === "true") {
    const details = response.data.result;

    // Generate printable HTML content
    let printContent = `
      <div>
        <h2>Sales Detail</h2>
      <p><strong><span style="font-size: 10px;">Customer Name: ${salesDetail.customerName}</span></strong> </p>
        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.7rem">
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
        <h3>Grand Total: ${grandTotal}</h3>
      </div>
    `;

    // Create a temporary element to hold the HTML content
    const element = document.createElement('div');
    element.innerHTML = printContent;
    document.body.appendChild(element); // Append it to the body temporarily

    // Generate the PDF using html2pdf and trigger the print dialog
    const opt = {
      margin: [2, 2],
      filename: `sales-detail-${salesId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
      // Automatically trigger the print dialog
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank'); // Open the PDF in a new tab
    });

    // Remove the temporary element after generating the PDF
    document.body.removeChild(element);
  } else {
    console.error('Error fetching sales details:', response.data.message);
  }
};


// Fetch data on component mount
onMounted(() => {
  fetchSalesData();
});
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 1.5rem;
  padding: 1.5rem;
}

h3 {
  font-size: 1rem;
}

p {
  font-size: 0.5rem;
}

table {
  font-size: 0.9rem;
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th, td {
  border: 1px solid #000;
  padding: 0.5rem;
}

.table-container {
  margin: 0 auto;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
}

button {
  font-size: 0.9rem;
}
</style>

