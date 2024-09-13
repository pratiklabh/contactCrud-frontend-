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
        <InputText id="name" v-model="editedContact.name" class="flex-auto ml-2" autocomplete="off" required />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" v-model="editedContact.email" class="flex-auto ml-2" autocomplete="off" required />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="subject" class="font-semibold w-24">Subject</label>
        <InputText id="subject" v-model="editedContact.subject" class="flex-auto ml-2" autocomplete="off" required />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="message" class="font-semibold w-24">Message</label>
        <textarea id="message" v-model="editedContact.message" class="flex-auto" required></textarea>
      </div>
      <div class="flex justify-content-center gap-3">
        <Button type="button" label="Cancel" severity="secondary"
                @click="closeEditDialog"></Button>
        <Button type="button" label="Save" @click="updateContact"></Button>
      </div>
    </Dialog>

    <div v-if="updateSuccess" class="success-message">{{ updateSuccess }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

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


</style>
