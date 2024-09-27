<template>
  <h2>Transaction Information Form</h2>

  <Form @submit="handleSubmit" class="transaction-form"  v-slot="{resetForm, setFieldValue}">
    <DataTable :value="transactions" tableStyle="min-width: 50rem">
      <!-- Payment Mode Dropdown Column -->
      <Column header="Payment Mode">
        <template #body="{ data }">
          <Field name="paymentMode" rules="required" v-slot="{ field }">
            <Select
                v-model="data.paymentMode"
                v-bind="field"
                :options="paymentModes"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Payment Mode"
                class="w-full"
                @change="resetBankField(data,setFieldValue)"
            />
            <ErrorMessage name="paymentMode" class="error" />
          </Field>
        </template>
      </Column>

      <!-- Bank Name Dropdown Column -->
      <Column header="Bank Name">
        <template #body="{ data }">
          <Field name="bank" v-slot="{ field }" :rules="requiredIfOnlineBanking(data.paymentMode)">
            <Select
                v-model="data.bank"
                v-bind="field"
                :options="banks"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Bank"
                class="w-full"
                :disabled="data.paymentMode !== 'Online Banking'"
            />
            <ErrorMessage name="bank" class="error" />
          </Field>
        </template>
      </Column>
    </DataTable>

    <Button type="submit" class="submit-button">
      Submit
    </Button>
  </Form>
</template>

<script setup>
import {reactive, ref} from 'vue';
import { ErrorMessage, Field, Form, useForm} from 'vee-validate';
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

defineRule('required', required);

const data = reactive({
  paymentMode: '',
  bank: '',
});

// to determine required rule for bank field
const requiredIfOnlineBanking = (paymentMode) => {
  return paymentMode === 'Online Banking' ? 'required' : '';
};

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

// to reset bank field when payment mode changes
const resetBankField = (data,setFieldValue) => {
  if (data.paymentMode !== 'Online Banking') {
    data.bank = ''; // Clear the bank field
    setFieldValue(`bank`,'')
  }
};

// Form submission handler
const handleSubmit = (values, {resetForm}) => {
  alert('Form submitted successfully!');
  console.log('Submitted Data:', JSON.stringify(transactions.value, null, 2));
  resetForm();
};
</script>

<style scoped>
h2 {
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

.submit-button {
  margin: 1rem;
  text-align: center;
}
.error {
  color: red;
  font-size: 1rem;
}
</style>
