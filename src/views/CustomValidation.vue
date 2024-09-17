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
      <!--      v-if="formData.maritalStatus === 'Married'":
      This directive conditionally renders the Spouse Name field only if the maritalStatus is "Married".
      If the user selects any other marital status, this field is not displayed.-->
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
// ref creates reactive references for individual values,
// while reactive creates reactive objects for handling state.
import { ref, reactive } from 'vue';

// They help create forms, fields, display error messages,
// define custom validation rules, and configure global validation settings.
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';

// Validation rules from VeeValidate that ensure fields are filled (required)
// and validate against minimum values (min).
import { required, min } from '@vee-validate/rules';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import axios from 'axios';

// defineRule: Register validation rules
// Registers the required rule, making it available for validation.
defineRule('required', required);

// Registers the min rule,
// allowing you to validate fields that must meet a minimum value or length.
defineRule('min', min);

// Custom rule required_if is created.
// value: The value of the field being validated (spouseName). This is the value being checked to see if it's required or not.
// [compareField, compareValue]: An array containing two values passed to the rule:
// compareField: The name of the field to compare (in this case, maritalStatus).
// compareValue: The value to compare against (e.g., 'Married').
// ctx: The context object, which contains information about the form and other fields.
// This includes ctx.form, which gives access to the entire form's data.
defineRule('required_if', (value, [compareField, compareValue], ctx) => {
  if (ctx.form[compareField] === compareValue) {
    // !!value: This converts the value to a boolean (true if there is a value, false if it's empty or undefined).
    return !!value || 'This field is required when married.';
  }
  return true;
});

// Configure VeeValidate
// This function allows global configuration of VeeValidate behavior.
// Here, it enables validation as users type, so feedback is immediate.
configure({
  validateOnInput: true, // Enables validation while typing
});

// Reactive form data
// A reactive object holding form fields name, maritalStatus, and spouseName.
// reactive allows changes to be automatically tracked and updated in the template.
const formData = reactive({
  name: '',
  maritalStatus: '',
  spouseName: '', // Ensure the initial value is an empty string
});

// Select options
// Holds the options for the marital status dropdown (Single, Married, Divorced, and Widowed).
// It's wrapped in ref to make the array reactive.
const statusOptions = ref([
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
]);

// Handle form submission
const handleSubmit = async (values) => {
  // Prepare the data to be sent, excluding 'spouseName' if the user is not married
  // payload: An object is prepared containing name and maritalStatus.
  // If the marital status is "Married",
  // the spouseName field is also added to the payload.
  const payload = {
    name: formData.name,
    maritalStatus: formData.maritalStatus,
  };

  // Only add spouseName if the marital status is "Married"
  if (formData.maritalStatus === 'Married') {
    // This is a logical OR (||) operation that checks if formData.spouseName has a value.
    // If formData.spouseName is falsy (such as undefined, null, or an empty string),
    // it assigns an empty string '' as a fallback.
    payload.spouseName = formData.spouseName || '';
  }

  try {
    const response = await axios.post('/api/users', payload);
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
};

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
