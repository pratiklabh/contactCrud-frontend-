<template>
  <div class="info-form">
    <h2> Information Form </h2>
    <Button icon="pi pi-plus" class="p-button-success" @click="addRow"/>

    <Form @submit="handleSubmit" v-slot="{resetForm}">
      <DataTable :value="info" :dataKey="'id'">
        <Column header="Name">
          <template #body="{ data }">
            <Field :name="`name-${data.id}`" rules="required" v-slot="{field}">
              <InputText
                  :id="`name-${data.id}`"
                  v-bind="field"
                  v-model="data.name"
              />
              <ErrorMessage :name="`name-${data.id}`" class="error"/>
            </Field>
          </template>
        </Column>

        <Column header="Phone">
          <template #body="{ data }">
            <Field :name="`phone-${data.id}`" rules="required" v-slot="{field}">
              <InputText
                  :id="`phone-${data.id}`"
                  v-bind="field"
                  v-model="data.phone"
              />
              <ErrorMessage :name="`phone-${data.id}`" class="error"/>
            </Field>
          </template>
        </Column>

        <Column header="Address">
          <template #body="{data}">
            <Field :name="`address-${data.id}`" rules="required" v-slot="{field}">
              <InputText

                  :id="`address-${data.id}`"
                  v-bind="field"
                  v-model="data.address"
              />
              <ErrorMessage :name="`address-${data.id}`" class="error"/>
            </Field>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{data}">
            <Button icon="pi pi-trash" class="p-button-danger" @click="removeRow(data.id)"/>
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
import {defineRule, ErrorMessage, Field} from "vee-validate";
import {required} from "@vee-validate/rules";

defineRule('required', required);

const info = ref([
  {id: '1', name: '', phone: '', address: ''},
]);

const addRow = () => {
  const newId = info.value.length + 1;
  info.value.push({id: newId.toString(), name: '', phone: '', address: ''});
}

const removeRow = (id) => {
  info.value = info.value.filter(row => row.id !== id);
}

const handleSubmit = (values, {resetForm}) => {
  alert('Form Submitted !!!');
  console.log('submitted', values);
  resetForm();
};
</script>

<style scoped>
.info-form {
  margin: 0 auto;
}

.p-button-success {
  margin: 1rem;
}

.submit-button {
  margin: 1rem;
  text-align: center;
}

.error {
  color: red;
  padding: 0.5rem;
}
</style>
