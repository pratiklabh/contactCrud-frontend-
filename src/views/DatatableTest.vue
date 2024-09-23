<template>
    <h2>Transaction Information Form</h2>

    <Form @submit="handleSubmit" class="transaction-form">
      <DataTable :value="transactions" tableStyle="min-width: 50rem">
        <!-- Payment Mode Dropdown Column -->
        <Column header="Payment Mode">
          <template #body="{ data }">
            <Select
                v-model="data.paymentMode"
                :options="paymentModes"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Payment Mode"
                class="w-full"
            />
          </template>
        </Column>

        <!-- Bank Name Dropdown Column -->
        <Column header="Bank Name">
          <template #body="{ data }">
            <Select
                v-model="data.bank"
                :options="banks"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Bank"
                class="w-full"
                :disabled="data.paymentMode !== 'Online Banking'"
            />
          </template>
        </Column>
      </DataTable>

      <Button type="submit" class="submit-button">
        Submit
      </Button>
    </Form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {Form} from "vee-validate";
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// Transaction data
const transactions = ref([{ id: 1, paymentMode: '', bank: '' }]);


// Select options for payment modes and banks
const paymentModes = ref([
  { label: 'Cash', value: 'Cash' },
  { label: 'Online Banking', value: 'Online Banking' },
]);

const banks = ref([
  { label: 'Nabil', value: 'Nabil' },
  { label: 'NMB', value: 'NMB' },
  { label: 'NIC ASIA', value: 'NIC ASIA' },
]);

// Form submission handler
const handleSubmit = () => {
  alert('Form submitted successfully!');
  console.log('Submitted Data:', JSON.stringify(transactions.value, null, 2)); // Pretty-print the JSON
};

</script>

<style scoped>
h2{
  text-align: center;
  font-size: 3rem;
  padding: 2rem;
}
.transaction-form {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 1rem;
  max-width: 60rem;
  margin: 0 auto;
}
.submit-button{
  margin: 1rem;
  text-align: center;
  ;
}

</style>
