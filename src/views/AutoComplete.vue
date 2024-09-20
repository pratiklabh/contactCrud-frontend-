<template>
  <h2>Month Autocomplete</h2>
  <Form>
    <div class="card flex justify-center">
      <div class="dropdown-container">
        <AutoComplete
            v-model="selectedMonth"
            :suggestions="filteredMonths"
            @complete="onFilter"
            :virtualScrollerOptions="{
            lazy: true,
            itemSize: 50,
            delay: 20,
            onLazyLoad: onLazyLoad
          }"
            optionLabel="label"
            placeholder="Select a Month"
            class="w-full md:w-56"
            dropdown
        />
      </div>
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import AutoComplete from 'primevue/autocomplete';
import { Form } from 'vee-validate';

const selectedMonth = ref(null);
const filteredMonths = ref([]);
const months = ref([]);
const totalMonths = ref(144);  // Total number of months, update as needed
const first = ref(0);  // Start index for lazy loading
const loading = ref(false);  // To track the loading state
const currentFilter = ref(''); // Reactive reference for the current filter

// Function to fetch months from the API
const fetchMonths = async (start, end, filter = '') => {
  try {
    loading.value = true;  // Set loading to true while fetching
    console.log('filter = ', filter);
    console.log(`/month/lazy?first=${start}&rows=${end - start}&filters[monthName.name][value]=${filter}&filters[monthName.name][matchMode]=contains`);

    const response = await axios.get(`/month/lazy?first=${start}&rows=${end - start}&filters[monthName.name][value]=${filter}&filters[monthName.name][matchMode]=contains`);
    const data = response.data;

    if (data.success === true && Array.isArray(data.result)) {
      const newMonths = data.result.map(month => ({
        label: `${month.id} - ${month.monthName.name}-${month.endDate}`,
        value: month.id
      }));

      // Append new months to the existing list
      months.value = [...months.value, ...newMonths];
      filteredMonths.value = months.value;

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
  const { first: eventFirst, last } = event;

  // Only load more if all the data is not fetched yet, and it's not currently loading
  if (!loading.value && last >= months.value.length && months.value.length < totalMonths.value) {
    const end = first.value + 20;  // Calculate the end index for the next batch
    console.log(`Fetching months from ${first.value} to ${end}`);
    fetchMonths(first.value, end, currentFilter.value); // Pass the current filter value
  }
};

// Function for filtering
const onFilter = (event) => {
  console.log(event)
  currentFilter.value = event.query;
  first.value = 0;
  months.value = [];
  console.log(`Fetching filtered months from ${first.value} to ${first.value + 20} filter = ${currentFilter.value}`);
  fetchMonths(first.value, first.value + 20, currentFilter.value);
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
</style>
