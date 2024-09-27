<template>
  <h2 style="margin: 2px">Alignment Test For Address</h2>
  <Form @submit="handleSubmit" class="p-fluid m-2">

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="province" class="fixed-label">Province Name:</label>
      <InputText id="province" placeholder="Province Name"/>
    </div>

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="zone" class="fixed-label">Zone Name:</label>
      <InputText id="zone" placeholder="Zone Name"/>
    </div>

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="district" class="fixed-label">District Name:</label>
      <InputText id="district" placeholder="District Name"/>
    </div>

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="municipality" class="fixed-label">Municipality Name:</label>
      <InputText id="municipality" placeholder="Municipality Name"/>
    </div>

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="village" class="fixed-label">Village Name:</label>
      <InputText id="village" placeholder="Village name"/>
    </div>

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="wardNumber" class="fixed-label">Ward Number:</label>
      <InputText id="wardNumber" placeholder="Ward Number"/>
    </div>

    <div class="field col-12 md:col-6 flex align-items-center">
      <label for="tole" class="fixed-label">Tole Number:</label>
      <InputText id="tole" placeholder="Tole name"/>
    </div>

  </Form>
</template>

<script setup>
const handleSubmit = () => {

};
</script>

<style scoped>
.fixed-label {
  display: inline-block;
  min-width: 10rem;
  max-width: 50rem;
  text-align: left;
}
</style>