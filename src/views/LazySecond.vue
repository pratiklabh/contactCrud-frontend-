<template>
  <h2>Lazy dropdown test</h2>
  <Form>
    <div class="card flex justify-center">
      <div class="dropdown-container">
        <Select
            v-model="selectedContact"
            :options="contacts"
            optionLabel="label"
            placeholder="Select a Contact"
            class="w-full md:w-56"
            :virtualScrollerOptions="{
            lazy: true,
            itemSize: 50,
            delay: 20,
            onLazyLoad: onLazyLoad
          }"
        />
      </div>
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Select from 'primevue/select';
import { Form } from 'vee-validate';

const selectedContact = ref(null);
const contacts = ref([]);
const totalContacts = ref(94);  // Total number of contacts
const size = 20;  // Number of contacts to load per request
const first = ref(0);  // Start index for lazy loading
const loading = ref(false);  // To track the loading state

// Function to fetch contacts from the API
const fetchContacts = async (start, end) => {
  try {
    loading.value = true;  // Set loading to true while fetching
    console.log(start, end)
    const response = await axios.get(`/api/contacts?start=${start}&end=${end}`);
    const data = response.data;

    if (data.success === 'true' && Array.isArray(data.result)) {
      const newContacts = data.result.map(contact => ({
        label: `${contact.id} - ${contact.name} - ${contact.email}`,
        value: contact.id
      }));

      // Append new contacts to the existing list
      contacts.value = [...contacts.value, ...newContacts];

      // Update the start index for the next batch
      first.value = end;
    } else {
      console.error("Unexpected API response:", data);
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
  } finally {
    loading.value = false;  // Set loading to false after fetching
  }
};

// Function to handle lazy loading triggered by scrolling
const onLazyLoad = (event) => {
  const { first: eventFirst, last } = event;

  // Only load more if all the data is not fetched yet, and it's not currently loading
  if (!loading.value && last >= contacts.value.length && contacts.value.length < totalContacts.value) {
    let end = first.value + 20;  // Calculate the end index for the next batch

    // Ensure we don't exceed the total number of contacts
    // if (end > totalContacts.value) {
    //   end = totalContacts.value;  // Limit the end to the total number of contacts
    // }

    console.log(`Fetching contacts from ${first.value} to ${end}`);

    // Fetch the next batch of contacts
    fetchContacts(first.value, end);
  }
};

</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  align-items: center;
}
h2 {
  text-align: center;
  padding: 1rem;
}
Form {
  width: 75rem;
  margin: 0 auto;
}
.dropdown-container {
  position: relative;
  width: 100%;
}
.p-dropdown-panel {
  max-height: 200px; /* Adjust height as needed */
  overflow-y: auto;
  border: 1px solid #ccc;
}
</style>
