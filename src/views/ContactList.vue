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
// ref creates reactive variables.
// onMounted is a lifecycle hook that runs code when the component is mounted.
// watch watches for changes to reactive data and triggers functions.
import { ref, onMounted, watch } from 'vue';

// for making HTTP requests
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
// contacts: A reactive array to store the list of contacts fetched from the server.
const contacts = ref<Contact[]>([]);

// loading: A boolean that tracks whether the data is still loading.
const loading = ref(true);

// error: Holds an error message in case data fetching fails.
const error = ref<string | null>(null);

// showEditDialog: Boolean that controls the visibility of the edit contact dialog.
const showEditDialog = ref(false);

// editedContact: Stores the contact that is being edited in the dialog.
const editedContact = ref<Contact | null>(null);

// updateSuccess: Stores a success message when a contact is updated successfully.
const updateSuccess = ref<string | null>(null);

// formErrors: An object to store form validation errors for name, email, subject, and message.
const formErrors = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

// Yup schema for validation
// schema: Defines validation rules using yup for each form field.
const schema = yup.object().shape({
  name: yup.string().min('2').required('Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
})

// validateField: Validates a single field in the form using yup
// This defines an async function named validateField
// The type keyof Contact ensures that field must be
// one of the keys of the Contact object (for example, name, email, etc.).
const validateField = async (field: keyof Contact) => {
  try {
    if (editedContact.value) {
      // The Yup validateAt method validates a specific field in the editedContact.
      // value object according to the validation schema (schema).
      // The await keyword ensures that the validation runs asynchronously
      // and the function waits until the validation completes before continuing.
      await schema.validateAt(field, editedContact.value);

      // If validation passes, the error for that field is cleared.
      formErrors.value[field] = '';
    }
  } catch (err) {
    // This checks whether the caught error is an instance of Yup’s ValidationError.
    // If it is, the error is specifically related to form validation.
    if (err instanceof yup.ValidationError) {

      // If validation fails, the corresponding error message is set in formErrors.
      formErrors.value[field] = err.message;
    }
  }
};


// validateForm: Validates the entire form by checking all fields.
// Defines an async function validateForm that validates the entire form data using Yup.
const validateForm = async () => {
  try {
    // Resetting form errors before validation
    // Before starting validation, this line clears all existing form errors
    // by looping through each key (field name) in formErrors.
    // value and resetting the value to an empty string.
    // This ensures previous error messages are cleared before revalidation.
    Object.keys(formErrors.value).forEach(key => (formErrors.value[key] = ''));

    // Validate form data against Yup schema
    if (editedContact.value) {
      // Uses Yup’s validate method to validate
      // the entire editedContact.value object against the defined schema.
      // { abortEarly: false } tells Yup to continue validating all fields even if one field fails.
      // This ensures you catch all validation errors instead of stopping at the first one.

      await schema.validate(editedContact.value, { abortEarly: false });
      // If the form data is valid, true is returned, indicating the form is valid.

      return true;
    }
    return false;
  } catch (err) {
    // Set form errors for each field
    // This checks if the caught error is a Yup ValidationError.
    // If it is, the error is specific to validation.
    if (err instanceof yup.ValidationError) {
      // err.inner contains all the validation errors if abortEarly is set to false.
      // This loop processes each individual validationError.
      // validationError.path: Refers to the field name (path) where the validation failed.
      // validationError.message: Holds the error message for that field.
      err.inner.forEach(validationError => {
        // Sets the error message for each field in the formErrors object,
        // making it available for displaying in the form’s UI.
        formErrors.value[validationError.path] = validationError.message;
      });
    }
    return false;
  }
};

// Watchers for individual fields
// Each field in editedContact is being watched for changes.
// When a change occurs, the corresponding field is validated using validateField.
watch(() => editedContact.value?.name, () => validateField('name'));
watch(() => editedContact.value?.email, () => validateField('email'));
watch(() => editedContact.value?.subject, () => validateField('subject'));
watch(() => editedContact.value?.message, () => validateField('message'));


// onMounted: Fetches the contact data from the API when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get('/api/contacts');

    //If successful, the contact data is stored in contacts.
    contacts.value = response.data.result;
  } catch (err) {

    // If there's an error, the error variable is set.
    error.value = 'Failed to load contacts.';
  } finally {

    // After the request, loading is set to false.
    loading.value = false;
  }
});

// openEditDialog: Opens the dialog to edit a contact.
// It sets editedContact to the selected contact's data.
const openEditDialog = (contact: Contact) => {
  editedContact.value = { ...contact };
  showEditDialog.value = true;
};


// closeEditDialog: Closes the edit dialog and resets the editedContact and success message.
const closeEditDialog = () => {
  showEditDialog.value = false;
  editedContact.value = null;
  updateSuccess.value = null;
};

// updateContact: Updates the contact details if the form is valid.
const updateContact = async () => {
  if (editedContact.value) {
    const isValid = await validateForm();
    if (isValid) {
      try {

        // If successful, it updates the contact in the contacts array and displays a success message.
        await axios.put(`/api/contacts/${editedContact.value.id}`, editedContact.value);
        contacts.value = contacts.value.map(contact =>
            contact.id === editedContact.value!.id ? editedContact.value! : contact
        );
        updateSuccess.value = 'Contact updated successfully!';
      } catch (err) {

        // If there's an error, it sets the error variable.
        error.value = 'Failed to update contact.';
      } finally {
        closeEditDialog();
      }
    }
  }
};

// deleteContact: Deletes a contact by sending a DELETE request to the server.
const deleteContact = async (id: number) => {
  try {

    // If successful, it removes the contact from the contacts array.
    await axios.delete(`/api/contacts/${id}`);
    contacts.value = contacts.value.filter(contact => contact.id !== id);
  } catch (err) {
    // If there's an error, it sets the error variable.
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
