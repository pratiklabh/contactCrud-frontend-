<template>
  <div class="info-form">
    <h2> Information Form </h2>
    <Form @submit="handleSubmit">
      <DataTable :value="info">
        <Column header="Name">
          <template #body="{ data }">
            <Field name="name" v-slot="{field}">
              <InputText
                  id="name"
                  v-bind="field"
                  v-model="data.name"
              />
            </Field>
          </template>
        </Column>

        <Column header="Phone">
          <template #body="{data}">
            <Field name="phone" v-slot="{field}">
              <InputText
                  id="phone"
                  v-bind="field"
                  v-model="data.phone"
              />
            </Field>
          </template>
        </Column>

        <Column header="Address">
          <template #body="{data}">
            <Field name="address" v-slot="{field}">
              <InputText
                  id="address"
                  v-bind="field"
                  v-model="data.address"
              />
            </Field>
          </template>
        </Column>
      </DataTable>

      <Button type="submit" class="submit-button">
        Submit
      </Button>

    </Form>
  </div>

</template>


<script setup>

import {ref} from "vue";
import { Field} from "vee-validate";


const info = ref([
  {name: '', phone: '', address: ''},
])


const handleSubmit = () => {

  alert('Form Submitted !!!')
  console.log('submitted')
}
</script>

<style scoped>
.info-form {
  margin: 0 auto;
}

.submit-button {
  margin: 1rem;
  text-align: center;
}


</style>