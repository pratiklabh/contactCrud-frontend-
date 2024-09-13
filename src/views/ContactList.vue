<template>
  <div>
    <h2>Contact Data</h2>

    <!-- Display loading message while data is being fetched -->
    <div v-if="loading">Loading...</div>

    <!-- Display error message if there is an issue fetching data -->
    <div v-if="error">{{ error }}</div>

    <!-- Display table only if data is loaded and no errors occurred -->
    <DataTable v-if="!loading && !error" :value="contacts" showGridlines tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="subject" header="Subject"></Column>
      <Column field="message" header="Message"></Column>
      <Column header="Action">
        <template #body="slotProps">
          <!-- Button to open the edit dialog for a contact -->
          <Button @click="openEditDialog(slotProps.data)" class="mr-3">Edit</Button>

          <!-- Button to delete a contact -->
          <Button @click="deleteContact(slotProps.data.id)">Delete</Button>
        </template>
      </Column>
    </DataTable>

    <!-- Edit Dialog using PrimeVue Dialog component -->
    <Dialog v-model:visible="showEditDialog" header="Edit Contact" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Update contact information.</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-24">Name</label>
        <InputText id="name" v-model="editedContact.name" class="flex-auto ml-2" autocomplete="off" />
        <div v-if="formErrors.name" class="error">{{ formErrors.name }}</div>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" v-model="editedContact.email" class="flex-auto ml-2" autocomplete="off" />
        <div v-if="formErrors.email" class="error">{{ formErrors.email }}</div>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="subject" class="font-semibold w-24">Subject</label>
        <InputText id="subject" v-model="editedContact.subject" class="flex-auto ml-2" autocomplete="off" />
        <div v-if="formErrors.subject" class="error">{{ formErrors.subject }}</div>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="message" class="font-semibold w-24">Message</label>
        <textarea id="message" v-model="editedContact.message" class="flex-auto"></textarea>
        <div v-if="formErrors.message" class="error">{{ formErrors.message }}</div>
      </div>
      <div class="flex justify-content-center gap-3">
        <Button type="button" label="Cancel" severity="secondary" @click="closeEditDialog"></Button>
        <Button type="button" label="Save" @click="updateContact"></Button>
      </div>
    </Dialog>

    <div v-if="updateSuccess" class="success-message">{{ updateSuccess }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import * as yup from 'yup';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contacts = ref<Contact[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showEditDialog = ref(false);
const editedContact = ref<Contact | null>(null);
const updateSuccess = ref<string | null>(null);
const formErrors = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

// Yup schema for validation
const schema = yup.object().shape({
  name: yup.string().min('2').required('Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
})

const validateField = async (field: keyof Contact) => {
  try {
    if (editedContact.value) {
      await schema.validateAt(field, editedContact.value);
      formErrors.value[field] = '';
    }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      formErrors.value[field] = err.message;
    }
  }
};

const validateForm = async () => {
  try {
    // Resetting form errors before validation
    Object.keys(formErrors.value).forEach(key => (formErrors.value[key] = ''));

    // Validate form data against Yup schema
    if (editedContact.value) {
      await schema.validate(editedContact.value, { abortEarly: false });
      return true;
    }
    return false;
  } catch (err) {
    // Set form errors for each field
    if (err instanceof yup.ValidationError) {
      err.inner.forEach(validationError => {
        formErrors.value[validationError.path] = validationError.message;
      });
    }
    return false;
  }
};

// Watchers for individual fields
watch(() => editedContact.value?.name, () => validateField('name'));
watch(() => editedContact.value?.email, () => validateField('email'));
watch(() => editedContact.value?.subject, () => validateField('subject'));
watch(() => editedContact.value?.message, () => validateField('message'));

onMounted(async () => {
  try {
    const response = await axios.get('/api/contacts');
    contacts.value = response.data.result;
  } catch (err) {
    error.value = 'Failed to load contacts.';
  } finally {
    loading.value = false;
  }
});

const openEditDialog = (contact: Contact) => {
  editedContact.value = { ...contact };
  showEditDialog.value = true;
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  editedContact.value = null;
  updateSuccess.value = null;
};

const updateContact = async () => {
  if (editedContact.value) {
    const isValid = await validateForm();
    if (isValid) {
      try {
        await axios.put(`/api/contacts/${editedContact.value.id}`, editedContact.value);
        contacts.value = contacts.value.map(contact =>
            contact.id === editedContact.value!.id ? editedContact.value! : contact
        );
        updateSuccess.value = 'Contact updated successfully!';
      } catch (err) {
        error.value = 'Failed to update contact.';
      } finally {
        closeEditDialog();
      }
    }
  }
};

const deleteContact = async (id: number) => {
  try {
    await axios.delete(`/api/contacts/${id}`);
    contacts.value = contacts.value.filter(contact => contact.id !== id);
  } catch (err) {
    error.value = 'Failed to delete contact.';
  }
};
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
