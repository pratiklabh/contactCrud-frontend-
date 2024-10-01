<template>
  <h2>Alignment Test For Address</h2>
  <Form @submit="handleSubmit">
    <!-- Province Field -->
    <div class="form-container">
      <div class="form-field">
        <label for="province">Provinceaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa Name:</label>
        <Field name="province" rules="required" v-slot="{ field }">
          <InputText id="province" v-bind="field" placeholder="Province Name" />
        </Field>
        <ErrorMessage name="province" class="error"/>
      </div>

      <!-- Zone Field -->
      <div class="form-field">
        <label for="zone">Zone Name:</label>
        <Field name="zone" rules="required" v-slot="{ field }">
          <InputText id="zone" v-bind="field" placeholder="Zone Name" />
        </Field>
        <ErrorMessage name="zone" class="error"/>
      </div>

      <!-- District Field -->
      <div class="form-field">
        <label for="district">District Name:</label>
        <Field name="district" rules="required" v-slot="{ field }">
          <InputText id="district" v-bind="field" placeholder="District Name" />
        </Field>
        <ErrorMessage name="district" class="error"/>
      </div>

      <!-- Submit Button -->
      <Button type="submit" class="submit-button">
        Submit
      </Button>
    </div>
  </Form>
</template>

<script setup>
import {ErrorMessage, Field, Form} from 'vee-validate';
import {required} from '@vee-validate/rules';
import {defineRule} from 'vee-validate';

defineRule('required', required);

const handleSubmit = () => {
  console.log('Form Submitted');
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-field {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

label {
  min-width: 150px;
}

.error {
  color: red;
  font-size: 12px;
}
.submit-button {
  margin: 1rem;
  width: 10rem;
}
</style>
