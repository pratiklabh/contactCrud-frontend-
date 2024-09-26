<template>
  <h2>Month Autocomplete</h2>
  <Field name="supplier" v-slot="{ supplier, field, errorMessage, handleChange }">
    <div class="flex flex-column flex-wrap row-gap-1 align-items-start">
      <label for="supplier">Supplier</label>
      <AutoComplete @update:modelValue="handleChange"
                    :complete-on-focus="true"
                    placeholder="Select Supplier"
                    v-bind="supplier"
                    v-model="selected.supplier"
                    :suggestions="supplierList"
                    @complete="onFilterSupplier" forceSelection
                    :minLength="2"
                    :virtualScrollerOptions="{
                      lazy: true,
                      onLazyLoad: onLazyLoadSupplier,
                      itemSize: 40,
                      showLoader: false,
                      delay: 150,
                      autoSize: true,
                      appendOnly: true
                    }"
                    dropdown :optionLabel="x => (x.id + ' - ' + x.name)"
                    aria-describedby="supplierHelp"/>
      <ErrorMessage name="supplier" id="supplierHelp" class="p-error"/>

    </div>
  </Field>
</template>

<script setup>
import {Field, ErrorMessage} from "vee-validate";
import axios from "axios";
import {ref} from 'vue';
import AutoComplete from "primevue/autocomplete";
import _, {debounce} from "lodash";

const totalSupplier = ref(0);
const loading = ref(false);
const supplierLazyParams = ref({});
const supplierList = ref([]);
const selected = ref({});

const onLazyLoadSupplier = debounce(async (event) => {
  const {first, last} = event;

  console.log("lazy load", first, last)

  // console.log(first, last, supplierList.value.length, totalSupplier.value, last >= supplierList.value.length, supplierList.value.length <= totalSupplier.value)
  supplierLazyParams.value['first'] = first;
  supplierLazyParams.value['rows'] = 10;
  if (last >= supplierList.value.length && supplierList.value.length <= totalSupplier.value) {
    supplierLazyParams.value['rows'] = last;
    await loadSupplierlist();
  }
}, 300);

const onFilterSupplier = debounce(async (event) => {
  console.log("filter")
  const {query} = event;
  if (query !== '') {
    supplierList.value = [];
    supplierLazyParams.value['first'] = 0;
    supplierLazyParams.value['rows'] = 10;
    supplierLazyParams.value['filters[name][operator]'] = 'OR'
    supplierLazyParams.value['filters[name][matchMode]'] = 'contains'
    supplierLazyParams.value['filters[name][value]'] = query
    supplierLazyParams.value['filters[phoneNo][operator]'] = 'OR'
    supplierLazyParams.value['filters[phoneNo][matchMode]'] = 'contains'
    supplierLazyParams.value['filters[phoneNo][value]'] = query
    supplierLazyParams.value['filters[panNo][operator]'] = 'OR'
    supplierLazyParams.value['filters[panNo][matchMode]'] = 'contains'
    supplierLazyParams.value['filters[panNo][value]'] = query
  }
  await loadSupplierlist();
}, 300);

const loadSupplierlist = async () => {
  console.log("list supplier")
  loading.value = true;
  supplierLazyParams.value['filters[branch.organization.code][matchMode]'] = 'equals'
  supplierLazyParams.value['filters[branch.organization.code][value]'] = '001'
  console.log(supplierLazyParams.value)

  try {
    const token = await fetchToken();
    const response = await axios({
      method: "get",
      url: "https://invtest.mfinplus.com/supplier/lazy",
      params: supplierLazyParams.value,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    if (data.success === true && Array.isArray(data.result)) {
      // Append new suppliers to the existing list
      // const uniqueSuppliers = data.result.filter(
      //     (supplier) => !supplierList.value.some((existingSupplier) => existingSupplier.id === supplier.id)
      // );
      // supplierList.value = [...supplierList.value, ...uniqueSuppliers];

      // let first = supplierLazyParams.value.first ?? 0
      //
      // supplierList.value = supplierList.value.length === 0 ? [...supplierList.value, ...data.result] : supplierList.value.splice(first, data.result.length, ...data.result);

      // for (let d =0 ; d< data.result.length ; d++){
      //   supplierList.value[first] = data.result[d]
      //   console.log( d , supplierList.value[first])
      //   first ++;
      // }

      //  supplierList.value = [...supplierList.value, ...data.result];
      supplierList.value = _.uniqBy([...supplierList.value, ...data.result], 'id');


      // const first = supplierLazyParams.value.first ?? 0;

      //1. using splice
      //supplierList.value.splice(first, data.result.length, ...data.result);
      // supplierList.value = [...supplierList.value];


      //2. direct replacing and force recognition
      // for (let i = 0; i < data.result.length; i++) {
      //   supplierList.value[first + i] = data.result[i];
      // }
      // // Force Vue to recognize the change
      // supplierList.value = [...supplierList.value]; // Create a new array reference



      //3. cloning and replacing and updating
      // const newSupplierList = [...supplierList.value];  // Clone the current list
      //
      // // Replace the segment from the current "first" index with new data
      // for (let i = 0; i < data.result.length; i++) {
      //   newSupplierList[first + i] = data.result[i];
      // }
      // supplierList.value = newSupplierList;  // Assign the updated array back




      totalSupplier.value = data.totalCount;
      console.log("total supplier", totalSupplier.value, supplierList.value.length)
    } else {
      console.error("Unexpected API response:", data);
    }
  } catch (error) {
    console.error("API request failed:", error);
  }

  loading.value = false;
};

async function fetchToken() {
  try {
    const response = await fetch('https://invtest.mfinplus.com/login/user-login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: 'pratik', password: 'Nepal@123'}),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    return data.result.token;
  } catch (error) {
    console.error('Error:', error);
  }
}

</script>


<style scoped>

</style>