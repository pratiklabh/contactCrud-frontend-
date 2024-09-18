<template>
  <h2> Lazy dropdown test</h2>
  <Form>
    <div class="card flex justify-center">
      <Select
          v-model="selectedContact"
          :options="contacts"
          optionLabel="label"
          placeholder="Select a Contact"
          class="w-full md:w-56"
          :loading="loading"
          @filter="onFilter"
      />
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Select from 'primevue/select';
import {Form} from 'vee-validate';

const selectedContact = ref(null);  // To store the selected contact
const contacts = ref([]);          // To store the list of contacts
const loading = ref(false);        // To show loading indicator

// Function to fetch contacts from the API
const fetchContacts = async () => {
  try {
    const response = await axios.get('/api/contacts?page=0&size=10');
    const data = response.data;

    if (data.success === 'true' && Array.isArray(data.result)) {
      return data.result.map(contact => ({
        id: contact.id,
        label: `${contact.name} - ${contact.email}`
      }));
    } else {
      console.error("Unexpected API response:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};


// Function to handle filtering in the dropdown
const onFilter = async (event) => {
  loading.value = true;
  const newContacts = await fetchContacts();
  contacts.value = newContacts;
  loading.value = false;
};

// Initial load of contacts
onFilter();
</script>

<style scoped>
form {
  margin: 0 auto;
  max-width: 75rem;
  padding: 2rem;
  background-color: #f2f2f2;

}
h2{
  text-align: center;
  padding: 1rem;
  font-size: 2rem;
}
</style>
