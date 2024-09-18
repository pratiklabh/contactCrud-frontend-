<template>
  <div>
    <h2>Number List</h2>

    <!-- Display loading message while data is being fetched -->
    <div v-if="loading">Loading...</div>

    <!-- Display error message if there is an issue fetching data -->
    <div v-if="error">{{ error }}</div>

    <!-- Display table only if data is loaded and no errors occurred -->
    <DataTable v-if="!loading && !error" :value="numbers" showGridlines tableStyle="min-width: 50rem">
      <Column field="age" header="Age"></Column>
      <Column field="decimal" header="Decimal"></Column>
      <Column field="currency" header="Currency"></Column>
      <Column field="prefix" header="Prefix"></Column>
      <Column field="suffix" header="Suffix"></Column>
      <Column header="Action">
        <template #body="slotProps">
          <!-- Button to open the edit dialog for a number -->
          <Button @click="openEditDialog(slotProps.data)" class="mr-3">Edit</Button>

          <!-- Button to delete a number -->
          <Button @click="deleteNumber(slotProps.data.id)">Delete</Button>
        </template>
      </Column>
    </DataTable>

    <!-- Edit Dialog using PrimeVue Dialog component -->
    <Dialog v-model:visible="showEditDialog" header="Edit Number" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Update number information.</span>

      <Form @submit="updateNumber" v-slot="{ errors }">
        <div v-for="field in fieldsList" :key="field.name" class="flex items-center gap-4 mb-4">
          <label :for="field.name" class="font-semibold w-24">{{ field.label }}</label>
          <Field :name="field.name" v-model="fields[field.name]" :rules="field.rules">
            <InputText :id="field.name" v-model="fields[field.name]" class="flex-auto ml-2" />
          </Field>
          <ErrorMessage :name="field.name" class="error" />
        </div>

        <div class="flex justify-content-center gap-3">
          <Button type="button" label="Cancel" severity="secondary" @click="closeEditDialog"></Button>
          <Button type="submit" label="Save"></Button>
        </div>
      </Form>
    </Dialog>

    <div v-if="updateSuccess" class="success-message">{{ updateSuccess }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { required, numeric } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

// Define validation rules
defineRule('required', required);
defineRule('numeric', numeric);

// Define the structure for a number object
interface NumberItem {
  id: number;
  age: number;
  decimal: number;
  currency: string;
  prefix: string;
  suffix: string;
}

// Reactive states for managing the list and dialog
const numbers = ref<NumberItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showEditDialog = ref(false);
const updateSuccess = ref<string | null>(null);
const editedNumber = ref<NumberItem | null>(null);
const fields = ref({
  age: '',
  decimal: '',
  currency: '',
  prefix: '',
  suffix: ''
});

// List of form fields with their properties
const fieldsList = [
  { name: 'age', label: 'Age', rules: 'required|numeric' },
  { name: 'decimal', label: 'Decimal', rules: 'required|numeric' },
  { name: 'currency', label: 'Currency', rules: 'required' },
  { name: 'prefix', label: 'Prefix', rules: 'required' },
  { name: 'suffix', label: 'Suffix', rules: 'required' }
];

// Function to open the edit dialog
const openEditDialog = (number: NumberItem) => {
  editedNumber.value = { ...number };
  for (const field of fieldsList) {
    fields.value[field.name] = number[field.name].toString();
  }
  showEditDialog.value = true;
};

// Function to close the edit dialog
const closeEditDialog = () => {
  showEditDialog.value = false;
  updateSuccess.value = null;
};

// Function to update a number
const updateNumber = async () => {
  if (editedNumber.value) {
    try {
      await axios.put(`/api/numbers/${editedNumber.value.id}`, fields.value);
      numbers.value = numbers.value.map(number =>
          number.id === editedNumber.value!.id ? { ...editedNumber.value, ...fields.value } : number
      );
      updateSuccess.value = 'Number updated successfully!';
      closeEditDialog();
    } catch (err) {
      error.value = 'Failed to update number.';
    }
  }
};

// Function to delete a number
const deleteNumber = async (id: number) => {
  try {
    await axios.delete(`/api/numbers/${id}`);
    numbers.value = numbers.value.filter(number => number.id !== id);
  } catch (err) {
    error.value = 'Failed to delete number.';
  }
};

// Fetch data when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get('/api/numbers');
    numbers.value = response.data.result;
  } catch (err) {
    error.value = 'Failed to load numbers.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.error {
  color: red;
  font-size: 1rem;
  margin-top: 0.5rem;
}
.success-message {
  color: green;
  font-size: 1rem;
  margin-top: 0.5rem;
}
</style>
