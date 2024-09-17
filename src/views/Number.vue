<template>
  <section class="number-form">
    <h2>Numbers Form</h2>
    <Form @submit="handleSubmit" class="num-form">
      <div class="card flex flex-column gap-4">
        <!-- Age Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="age" class="font-bold block mb-2">Age</label>
          <InputNumber
              id="age"
              v-model="formData.age"
              inputId="integeronly"
              fluid
              :min="0"
              :max="120"
              :placeholder="'Enter age'"
          />
        </div>

        <!-- Decimal Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="decimal" class="font-bold block mb-2">Decimal</label>
          <InputNumber
              id="decimal"
              v-model="formData.decimal"
              inputId="locale-us"
              locale="en-US"
              :minFractionDigits="2"
              fluid
              :placeholder="'Enter decimal value'"
          />
        </div>

        <!-- Currency Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="currency-us" class="font-bold block mb-2">United States</label>
          <InputNumber
              id="currency"
              v-model="formData.currency"
              inputId="currency-us"
              mode="currency"
              currency="USD"
              locale="en-US"
              fluid
              :placeholder="'Enter amount'"
          />
        </div>

        <!-- Prefix Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="prefix" class="font-bold block mb-2">Prefix</label>
          <InputNumber
              id="prefix"
              v-model="formData.prefix"
              inputId="percent"
              prefix="%"
              fluid
              :placeholder="'Enter percentage'"
          />
        </div>

        <!-- Suffix Field -->
        <div class="flex-column font-bold block mb-2">
          <label for="suffix" class="font-bold block mb-2">Suffix</label>
          <InputNumber
              id="suffix"
              v-model="formData.suffix"
              inputId="mile"
              suffix="mile"
              fluid
              :placeholder="'Enter distance'"
          />
        </div>

        <div class="flex-column font-bold block mb-2">
          <label for="button" class="font-bold block mb-2">Button</label>
          <InputNumber
              id="button"
              v-model="formData.button"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              mode="currency"
              currency="EUR"
              fluid
              :placeholder="'Enter value'">

            <template #incrementbuttonicon>
              <span class="pi pi-plus"/>
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus"/>
            </template>
          </InputNumber>
        </div>

      </div>

      <Button type="submit" class="submit-button">
        Submit
      </Button>
    </Form>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { Form } from 'vee-validate';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const formData = reactive({
  age: null,
  decimal: null,
  currency: null,
  prefix: null,  // Ensure these fields are initialized as null
  suffix: null,
  button: null,
});

const handleSubmit = () => {
  console.log('Form data:', formData);
  console.log('Button:',formData.button);
  alert('Form submitted successfully!');
};
</script>

<style scoped>
h2{
  padding: 2rem;
  font-size: 3rem;
  text-align: center;
}
form{
  margin: 0 auto;
  background-color: #f0f0f0;
  max-width: 400px;
  padding: 3rem ;
  border-radius: 1rem;
}
.submit-button {
  display: block;
  margin: 0 auto;
}
</style>
