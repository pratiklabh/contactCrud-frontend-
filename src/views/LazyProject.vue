<template>
  <h2>Month Dropdown</h2>
  <Form>
    <div class="card flex justify-center">
      <div class="dropdown-container">
        <Select
            v-model="selectedMonth"
            :options="months"
            optionLabel="label"
            placeholder="Select a Month"
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

const selectedMonth = ref(null);
const months = ref([]);
const totalMonths = ref(143);  // Total number of months, update as needed
const size = 20;  // Number of months to load per request
const first = ref(0);  // Start index for lazy loading
const loading = ref(false);  // To track the loading state

// Function to fetch months from the API
const fetchMonths = async (start, end) => {
  try {
    loading.value = true;  // Set loading to true while fetching
    const response = await axios.get(`/month/lazy?first=${start}&rows=${end - start}`);
    const data = response.data;

    if (data.success === true && Array.isArray(data.result)) {
      const newMonths = data.result.map(month => ({
        label: `${month.id} - ${month.monthName.name}-${month.endDate}`,
        value: month.id
      }));

      // Append new months to the existing list
      months.value = [...months.value, ...newMonths];

      // Update the start index for the next batch
      first.value = end;
    } else {
      console.error("Unexpected API response:", data);
    }
  } catch (error) {
    console.error("Error fetching months:", error);
  } finally {
    loading.value = false;  // Set loading to false after fetching
  }
};

// Function to handle lazy loading triggered by scrolling
const onLazyLoad = (event) => {
  const { first: eventFirst, last} = event;

  // Only load more if all the data is not fetched yet, and it's not currently loading
  if (!loading.value && last >= months.value.length && months.value.length < totalMonths.value) {
    const end = first.value + size;  // Calculate the end index for the next batch

    console.log(`Fetching months from ${first.value} to ${end}`);

    // Fetch the next batch of months
    fetchMonths(first.value, end);
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
