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
              onLazyLoad: onLazyLoad,
              itemSize: 50,
              delay: 20,
              steps: 10
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
const page = ref(0);
const size = 20;
const totalContacts = ref(100);

const fetchContacts = async (first, last) => {
  try {
    console.log(first, last, page.value, size)
    const response = await axios.get(`/api/contacts?page=${page.value}&size=${size}`);
    const data = response.data;

    console.log("size", data.result.length)

    if (data.success === 'true' && Array.isArray(data.result)) {
      const newContacts = data.result.map(contact => ({
        label: `${contact.id} - ${contact.name} - ${contact.email}`,
        value: contact.id
      }));

      // Only update contacts if new data is fetched
      if (newContacts.length > 0) {
        contacts.value = [...contacts.value, ...newContacts];
        page.value++;
      }
    } else {
      console.error("Unexpected API response:", data);
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
};

// Function to handle lazy loading when scrolling
const onLazyLoad = (event) => {
  const { first, last } = event;

  // Fetch more data
  if (last >= contacts.value.length - 1 && contacts.value.length < totalContacts.value) {
    console.log('last', last)
    fetchContacts(first, last);
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
