<template>
  <h2 style="margin: 2px">Alignment Test For Address</h2>
  <Form @submit="handleSubmit" class="p-fluid m-2">
<!--    <div class="grid">-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="firstname">Firstname</label>-->
<!--        <Field name="firstname" rules="required" v-slot="{ field }">-->
<!--          <InputText id="firstname"-->
<!--                     v-bind="field"-->
<!--                     placeholder="First Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="first name" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Lastname Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="lastname">Lastname</label>-->
<!--        <Field name="lastname" rules="required" v-slot="{ field }">-->
<!--          <InputText id="lastname"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Last Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="lastname" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Province Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="province">Province Name</label>-->
<!--        <Field name="province" rules="required" v-slot="{ field }">-->
<!--          <InputText id="province"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Province Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="province" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Zone Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="zone">Zone Name</label>-->
<!--        <Field name="zone" rules="required" v-slot="{ field }">-->
<!--          <InputText id="zone"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Zone Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="zone" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; District Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="district">District Name</label>-->
<!--        <Field name="district" rules="required" v-slot="{ field }">-->
<!--          <InputText id="district"-->
<!--                     v-bind="field"-->
<!--                     placeholder="District Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="district" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Municipality Field (Select) &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="municipality">Municipality Name</label>-->
<!--        <Field name="municipality" rules="required" v-slot="{ field }">-->
<!--          <InputText id="municipality"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Municipality Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="municipality" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Village Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="village">Village Name</label>-->
<!--        <Field name="village" rules="required" v-slot="{ field }">-->
<!--          <InputText id="village"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Village Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="village" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Ward Number Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="wardNumber">Ward Number</label>-->
<!--        <Field name="wardNumber" rules="required" v-slot="{ field }">-->
<!--          <InputText id="wardNumber"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Ward Number"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="wardNumber" class="error"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Tole Field &ndash;&gt;-->
<!--      <div class="field col-12 md:col-4 mb-0">-->
<!--        <label for="tole">Tole Name</label>-->
<!--        <Field name="tole" rules="required" v-slot="{ field }">-->
<!--          <InputText id="tole"-->
<!--                     v-bind="field"-->
<!--                     placeholder="Tole Name"-->
<!--                     class="w-full"/>-->
<!--        </Field>-->
<!--        <ErrorMessage name="tole" class="error"/>-->
<!--      </div>-->

<!--      <Button type="submit" class="submit-button" @submit="handleSubmit">-->
<!--        Submit-->
<!--      </Button>-->
<!--    </div>-->


    <Dialog header="Your Form" visible v-model:visible="isDialogVisible" style="width: 40vw; max-width: 500px;">
      <div class="p-fluid">
        <div class="field col-12 mb-3">
          <label for="firstname">Firstname</label>
          <Field name="firstname" rules="required" v-slot="{ field }">
            <InputText id="firstname" v-bind="field" placeholder="First Name" class="w-full"/>
          </Field>
          <ErrorMessage name="firstname" class="error"/>
        </div>

        <div class="field col-12 mb-3">
          <label for="lastname">Lastname</label>
          <Field name="lastname" rules="required" v-slot="{ field }">
            <InputText id="lastname" v-bind="field" placeholder="Last Name" class="w-full"/>
          </Field>
          <ErrorMessage name="lastname" class="error"/>
        </div>

        <div class="field col-12 mb-3">
          <label for="province">Province Name</label>
          <Field name="province" rules="required" v-slot="{ field }">
            <InputText id="province" v-bind="field" placeholder="Province Name" class="w-full"/>
          </Field>
          <ErrorMessage name="province" class="error"/>
        </div>
      </div>
    </Dialog>

  </Form>
</template>

<script setup>
import {ErrorMessage, Field} from "vee-validate";
import {required} from "@vee-validate/rules";
import {defineRule} from "vee-validate";
import Dialog from "primevue/dialog";

defineRule("required", required);

const handleSubmit = () => {
  console.log('');
};
</script>

<style scoped>
.submit-button {
  margin: 1rem;
  text-align: center;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin: 2px;
}
</style>
