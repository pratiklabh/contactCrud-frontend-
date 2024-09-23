<template>
  <h2>Month Dropdown</h2>
  <Form>
    <div class="card flex justify-center">
      <div class="dropdown-container">
        <Select
            v-model="selectedMonth"
            :options="months" filter
            optionLabel="label"
            placeholder="Select a Month"
            class="w-full md:w-56"
            :virtualScrollerOptions="{
            lazy: true,
            itemSize: 50,
            delay: 20,
            onLazyLoad: onLazyLoad
          }"
            @filter="onFilter"
        />
      </div>
    </div>
  </Form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Select from 'primevue/select';
import { Form } from 'vee-validate';

const selectedMonth = ref(null);
const months = ref([]);
const totalMonths = ref(0); // Total number of months, update as needed
const first = ref(0); // Start index for lazy loading
const filterValue = ref(''); // Store the filter value separately

// Function to fetch months from the API
const fetchMonths = async (start, end, filter = '') => {
  let loading = false;
  try {
    loading = true; // Set loading to true while fetching
    console.log('filter =', filter);
    console.log(`/month/lazy?first=${start}&rows=${end - start}&filters[monthName.name][value]=${filter}&filters[monthName.name][matchMode]=contains`);

    const response = await axios.get(`/month/lazy?first=${start}&rows=${end - start}&filters[monthName.name][value]=${filter}&filters[monthName.name][matchMode]=contains`);
    const data = response.data;

    if (data.success === true && Array.isArray(data.result)) {
      const newMonths = data.result.map(month => ({
        label: `${month.id} - ${month.monthName.name}-${month.endDate}`,
        value: month.id
      }));

      totalMonths.value = data.totalCount;

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
    loading = false;
  }
};

// Function to handle lazy loading triggered by scrolling
const onLazyLoad = (event) => {
  const { first: eventFirst, last } = event;

  // Only load more if all the data is not fetched yet, and it's not currently loading
  if (last >= months.value.length && months.value.length < totalMonths.value) {
    const end = first.value + 20; // Calculate the end index for the next batch

    console.log(`Fetching months from ${first.value} to ${end}`);

    // Fetch the next batch of months with the current filter value
    fetchMonths(first.value, end, filterValue.value);
  }
};

// Function to handle filtering
const onFilter = (event) => {
  filterValue.value = event.value; // Store the filter value
  first.value = 0;
  months.value = [];

  console.log(`Fetching filtered months from ${first.value} to ${first.value + 20}, filter = ${filterValue.value}`);

  fetchMonths(first.value, first.value + 20, filterValue.value);
};

onMounted( ()=>{
  fetchMonths(0,20);
});
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
  width: 50rem;
  margin: 0 auto;
}

.dropdown-container {
  position: relative;
  width: 100%;
}
</style>
