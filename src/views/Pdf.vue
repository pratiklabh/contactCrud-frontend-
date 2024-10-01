<template>
  <div class="table-container">
    <h2>Sales Details</h2>

    <DataTable :value="salesDetails" tableStyle="min-width: 50rem">
      <Column field="date" header="Date" />
      <Column field="total" header="Total" />
      <Column field="customerName" header="Customer Name" />
      <Column field="paymentMode" header="Payment Mode" />
      <Column header="Actions">
        <template #body="slotProps">
          <Button label="Print Preview" @click="printPreview(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const salesDetails = ref([]);

const fetchSalesData = async () => {
  try {
    const response = await axios.get('sbs-api/sales');
    if (response.data.success === 'true') {
      salesDetails.value = response.data.result || [];
    } else {
      console.error('Error:', response.data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const printPreview = async (salesDetail) => {
  const salesId = salesDetail.id;
  const response = await axios.get(`sbs-api/sales/details/${salesId}`);

  if (response.data.success === "true") {
    const details = response.data.result;
    let printContent = `
      <h2>Sales Detail</h2>
      <p><strong>Customer Name:</strong> ${salesDetail.customerName}</p>
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
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html><head><title>Sales Invoice</title><style>
      @media print {
        @page { margin: 10% 5%; }
        body { margin: 0; font-family: Arial, sans-serif; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
      }
      </style></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } else {
    console.error('Error:', response.data.message);
  }
};

onMounted(() => {
  fetchSalesData();
});
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 2.5rem;
  padding: 1.5rem;
}

.table-container {
  margin: 0 auto;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
}
</style>
