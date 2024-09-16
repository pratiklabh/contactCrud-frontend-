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

    <!-- Edit Dialog using PrimeVue Dialog component with vee-validate integration -->
    <Dialog v-model:visible="showEditDialog" header="Edit Contact" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Update contact information.</span>

      <Form @submit="updateContact" v-slot="{ errors }">
        <div class="flex items-center gap-4 mb-4">
          <label for="name" class="font-semibold w-24">Name</label>
          <Field name="name" v-model="fields.name" rules="required">
            <InputText id="name" v-model="fields.name" class="flex-auto ml-2" />
          </Field>
          <ErrorMessage name="name" class="error" />
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="email" class="font-semibold w-24">Email</label>
          <Field name="email" v-model="fields.email" rules="required|email">
            <InputText id="email" v-model="fields.email" class="flex-auto ml-2" />
          </Field>
          <ErrorMessage name="email" class="error" />
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="subject" class="font-semibold w-24">Subject</label>
          <Field name="subject" v-model="fields.subject" rules="required">
            <InputText id="subject" v-model="fields.subject" class="flex-auto ml-2" />
          </Field>
          <ErrorMessage name="subject" class="error" />
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="message" class="font-semibold w-24">Message</label>
          <Field name="message" v-model="fields.message" rules="required">
            <textarea id="message" v-model="fields.message" class="flex-auto"></textarea>
          </Field>
          <ErrorMessage name="message" class="error" />
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

// onMounted: A Vue lifecycle hook that runs when the component is mounted, typically used to fetch data from APIs.
import { ref, onMounted } from 'vue';

// Vee-validate components to handle form validation and error messages.
import { Form, Field, ErrorMessage } from 'vee-validate';

// Vee-validate validation rules for required fields and email format validation.
import { required, email } from '@vee-validate/rules';

// defineRule: Registers the validation rules for use in the form.
import { defineRule } from 'vee-validate';

import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

// Define validation rules
// defineRule is used to register global validation rules for Vee-validate.
// In this case, the required rule ensures that fields are not left empty,
// and the email rule ensures the email field contains a valid email format.
defineRule('required', required);
defineRule('email', email);


// The Contact interface defines the structure for a contact object with properties
// like id, name, email, subject, and message. This is useful for type safety in TypeScript.
interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
}

// contacts: A reactive array to hold the list of contacts fetched from the server.
const contacts = ref<Contact[]>([]);

// loading: A reactive boolean indicating whether data is being loaded.
const loading = ref(true);

// error: A reactive string that stores error messages in case something goes wrong with the data fetching.
const error = ref<string | null>(null);

// showEditDialog: A reactive boolean that determines whether the "Edit Contact" dialog is shown.
const showEditDialog = ref(false);

// updateSuccess: A reactive string to store a success message when a contact is updated successfully.
const updateSuccess = ref<string | null>(null);

// editedContact: Stores the contact that is currently being edited.
const editedContact = ref<Contact | null>(null);

// fields: An object holding form fields for editing a contact.
const fields = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});


// openEditDialog: Opens the edit dialog and pre-fills the form fields with the selected contact's data.
// This function copies the contact data into the fields and editedContact references, making it ready for editing.
const openEditDialog = (contact: Contact) => {
  editedContact.value = { ...contact };
  fields.value.name = contact.name;
  fields.value.email = contact.email;
  fields.value.subject = contact.subject;
  fields.value.message = contact.message;
  showEditDialog.value = true;
};

// closeEditDialog: Closes the edit dialog and resets the updateSuccess message.
const closeEditDialog = () => {
  showEditDialog.value = false;
  updateSuccess.value = null;
};
// updateContact: This function is called when the user submits the "Edit Contact" form.
// It sends a PUT request to update the contact in the backend using the editedContact data.
const updateContact = async () => {
  if (editedContact.value) {
    try {
      // If successful, the contacts array is updated with the new data, and a success message is shown.
      await axios.put(`/api/contacts/${editedContact.value.id}`, {
        name: fields.value.name,
        email: fields.value.email,
        subject: fields.value.subject,
        message: fields.value.message
      });
      contacts.value = contacts.value.map(contact =>
          contact.id === editedContact.value!.id ? { ...editedContact.value, ...fields.value } : contact
      );
      updateSuccess.value = 'Contact updated successfully!';
      closeEditDialog(); // Close dialog on success
    } catch (err) {
      error.value = 'Failed to update contact.';
    }
  }
};

// deleteContact: This function is triggered when the user clicks the "Delete" button.
// It sends a DELETE request to the server to remove the contact.
const deleteContact = async (id: number) => {
  try {
    // If successful, the contact is removed from the contacts array.
    await axios.delete(`/api/contacts/${id}`);
    contacts.value = contacts.value.filter(contact => contact.id !== id);
  } catch (err) {
    // if it fails, an error message is displayed.
    error.value = 'Failed to delete contact.';
  }
};

// onMounted: This lifecycle hook is used to fetch contact data from the server when the component is mounted.
onMounted(async () => {
  try {
    // If the request is successful, the data is stored in the contacts array.
    const response = await axios.get('/api/contacts');
    contacts.value = response.data.result;
  } catch (err) {
    // If it fails, an error message is displayed.
    error.value = 'Failed to load contacts.';
  } finally {
    // loading is set to false once the data has been fetched or an error has occurred.
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
