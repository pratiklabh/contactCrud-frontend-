<template>
  <section class="number-form">
    <h2>Numbers Form</h2>
    <Form @submit="handleSubmit" class="num-form">
      <div class="card flex flex-column gap-4">
        <!-- Age Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="age" class="font-bold block mb-2">Age</label>
          <Field name="age" rules="required" v-slot="{ field, errorMessage }">
            <InputNumber
                v-model="formData.age"
                v-bind="{ ...field, value: undefined }"
                :min="0"
                :max="120"
                placeholder="Enter age"
                fluid
            />
            <ErrorMessage name="age" class="error"/>
          </Field>
        </div>

        <!-- Decimal Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="decimal" class="font-bold block mb-2">Decimal</label>
          <Field name="decimal" rules="required" v-slot="{ field, errorMessage }">
            <InputNumber
                id="decimal"
                v-model="formData.decimal"
                inputId="locale-us"
                locale="en-US"
                :minFractionDigits="2"
                fluid
                :placeholder="'Enter decimal value'"
                @input="field.onInput"
                @blur="field.onBlur"
            />
            <ErrorMessage name="decimal" class="error" />
          </Field>
        </div>

        <!-- Currency Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="currency-us" class="font-bold block mb-2">United States</label>
          <Field name="currency" rules="required" v-slot="{ field, errorMessage }">
            <InputNumber
                v-model="formData.currency"
                v-bind="{ ...field, value: undefined }"
                id="currency"
                inputId="currency-us"
                mode="currency"
                currency="USD"
                locale="en-US"
                fluid
                :placeholder="'Enter amount'"
            />
            <ErrorMessage name="currency" class="error"/>
          </Field>
        </div>

        <!-- Prefix Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="prefix" class="font-bold block mb-2">Prefix</label>
          <Field name="prefix" rules="required" v-slot="{ field, errorMessage }">
            <InputNumber
                v-model="formData.prefix"
                v-bind="{ ...field, value: undefined }"
                id="prefix"
                inputId="percent"
                prefix="%"
                fluid
                :placeholder="'Enter percentage'"
            />
            <ErrorMessage name="prefix" class="error"/>
          </Field>
        </div>

        <!-- Suffix Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="suffix" class="font-bold block mb-2">Suffix</label>
          <Field name="suffix" rules="required" v-slot="{ field, errorMessage }">
            <InputNumber
                v-model="formData.suffix"
                v-bind="{ ...field, value: undefined }"
                id="suffix"
                inputId="mile"
                suffix="mile"
                fluid
                :placeholder="'Enter distance'"
            />
            <ErrorMessage name="suffix" class="error"/>
          </Field>
        </div>


        <!-- Button Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="button" class="font-bold block mb-2">Button</label>
          <Field name="button" rules="required" v-slot="{ field, errorMessage }">
            <InputNumber
                v-model="formData.button"
                v-bind="{ ...field, value: undefined }"
                id="button"
                showButtons
                buttonLayout="horizontal"
                :step="1"
                mode="currency"
                currency="EUR"
                fluid
                :placeholder="'Enter value'"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus"/>
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus"/>
              </template>
            </InputNumber>
            <ErrorMessage name="button" class="error"/>
          </Field>
        </div>


      </div>

      <Button type="submit" class="submit-button">
        Submit
      </Button>
    </Form>
  </section>
</template>

<script setup>
import {reactive} from 'vue';
import {Form, Field, ErrorMessage, configure} from 'vee-validate';
import {required, min_value, max_value} from '@vee-validate/rules';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import axios from 'axios';
import {defineRule} from "vee-validate";

const formData = reactive({
  age: null,
  decimal: null,
  currency: null,
  prefix: null,
  suffix: null,
  button: null,
});

configure({

  validateOnInput:true

});

defineRule('required', required);
defineRule('min_value', min_value);
defineRule('max_value', max_value);

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/numbers', formData);
    console.log('Form data:', formData);
    alert('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred. Please try again.');
  }
};
</script>

<style scoped>
h2 {
  padding: 2rem;
  font-size: 3rem;
  text-align: center;
}

form {
  margin: 0 auto;
  background-color: #f0f0f0;
  max-width: 400px;
  padding: 3rem;
  border-radius: 1rem;
}

.submit-button {
  display: block;
  margin: 0 auto;
}

.error {
  color: red;
  font-size: 0.875rem;
}
</style>
