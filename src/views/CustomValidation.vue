<template>
  <section class="custom-form">
    <!-- Heading Section -->
    <h2>Personal Information Form</h2>

    <!-- Personal Information Form Section -->
    <Form @submit="handleSubmit" v-slot="{ errors }" class="info-form">
      <!-- Name Field -->
      <div class="form-group">
        <label for="name">Name</label>
        <Field name="name" rules="required|min:2" v-slot="{ field, errorMessage }">
          <InputText
              id="name"
              v-bind="field"
              v-model="formData.name"
              placeholder="Your Name"
          />
          <ErrorMessage name="name" class="error" />
        </Field>
      </div>

      <!-- Marital Status Select -->
      <div class="form-group">
        <label for="maritalStatus">Marital Status</label>
        <Field name="maritalStatus" rules="required" v-slot="{ field, errorMessage }">
          <Select
              id="maritalStatus"
              v-bind="field"
              v-model="formData.maritalStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Marital Status"
          />
          <ErrorMessage name="maritalStatus" class="error" />
        </Field>
      </div>

      <!-- Spouse Name Field -->
      <div class="form-group" v-if="formData.maritalStatus === 'Married'">
        <label for="spouseName">Spouse Name</label>
        <Field name="spouseName" rules="required_if:maritalStatus,Married" v-slot="{ field, errorMessage }">
          <InputText
              id="spouseName"
              v-bind="field"
              v-model="formData.spouseName"
              placeholder="Spouse Name"
          />
          <ErrorMessage name="spouseName" class="error" />
        </Field>
      </div>

      <!-- Submit Button -->
      <Button type="submit" class="submit-button">
        Submit
      </Button>
    </Form>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, min } from '@vee-validate/rules';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select'; // Updated import
import axios from 'axios';

// Register validation rules
defineRule('required', required);
defineRule('min', min);
defineRule('required_if', (value, [condition, compareValue]) => {
  if (condition === 'Married' && compareValue === 'Married') {
    return !!value;
  }
  return true;
});

// Configure VeeValidate
configure({
  validateOnInput: true,
});

// Reactive form data
const formData = reactive({
  name: '',
  maritalStatus: '',
  spouseName: 'null',
});

// Select options
const statusOptions = ref([
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
]);

// Handle form submission
const handleSubmit = async (values) => {
  try {
    const response = await axios.post('/api/users', values);
    console.log('Response:', response.data);
    alert(`Thank you, ${values.name}! Your information has been submitted.`);
    // Reset form
    formData.name = '';
    formData.maritalStatus = '';
    formData.spouseName = '';
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred while submitting your information. Please try again.');
  }
}
</script>

<style scoped>
.custom-form {
  font-family: 'Playfair Display', serif;
  text-align: center;
}

.custom-form h2 {
  font-size: 4rem;
  letter-spacing: 0.25rem;
  padding: 2rem;
}

.info-form {
  background: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 40rem;
  margin: 0 auto;
  font-size: 1.5rem;
  padding: 1rem;
  border-radius: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.form-group input,
.form-group .p-select {
  padding: 1rem;
  border: 0.1rem solid #ddd;
  border-radius: 0.25rem;
  background: white;
}

.error {
  color: red;
  font-size: 1rem;
  margin-top: 0.5rem;
}

button {
  font-size: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 2rem;
}
</style>
