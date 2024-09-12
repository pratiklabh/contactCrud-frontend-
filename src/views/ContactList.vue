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
          <Button @click="openEditDialog(slotProps.data)" > Edit </Button>

          <!-- Button to delete a contact -->
          <Button @click="deleteContact(slotProps.data.id)">Delete</Button>
        </template>
      </Column>
    </DataTable>

    <!-- Edit Dialog -->
    <div v-if="showEditDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h3>Edit Contact</h3>
        <!-- Form to update contact details -->
        <form @submit.prevent="updateContact">
          <label>Name:</label>
          <InputText v-model="editedContact.name" required />

          <label>Email:</label>
          <InputText v-model="editedContact.email" required />

          <label>Subject:</label>
          <InputText v-model="editedContact.subject" required />

          <label>Message:</label>
          <textarea v-model="editedContact.message" required></textarea>

          <!-- Button to submit the form and update the contact -->
          <Button type="submit">Update</Button>

          <!-- Button to close the dialog without making changes -->
          <Button @click="closeEditDialog">Cancel</Button>
        </form>
        <div v-if="updateSuccess" class="success-message">{{ updateSuccess }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

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
table {
  width: 100%;
  border-collapse: collapse;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

.dialog-content form {
  display: flex;
  flex-direction: column;
}


.dialog-content input,
.dialog-content textarea {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}


</style>