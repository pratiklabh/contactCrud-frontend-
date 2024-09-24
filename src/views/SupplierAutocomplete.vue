
<template>
  <h2>Month Autocomplete</h2>
  <Field name="supplier" v-slot="{ supplier, field, errorMessage, handleChange }">
    <div class="flex flex-column flex-wrap row-gap-1 align-items-start">
      <label for="supplier">Supplier</label>
      <AutoComplete @update:modelValue="handleChange" :complete-on-focus="true"
                    placeholder="Select Supplier" v-bind="supplier" v-model="selected.supplier"
                    :suggestions="supplierList" @complete="onFilterSupplier" forceSelection
                     :minLength="2"
                    :virtualScrollerOptions="{ lazy: true, onLazyLoad: onLazyLoadSupplier, itemSize: 40, showLoader: false, delay: 150, autoSize: true, appendOnly: true }"
                    dropdown :optionLabel="x => (x.id + ' - ' + x.name)"
                    aria-describedby="supplierHelp" />
      <ErrorMessage name="supplier" id="supplierHelp" class="p-error" />

    </div>
  </Field>
</template>

<script setup>
import {Field, ErrorMessage} from "vee-validate";
import axios from "axios";
import {ref} from 'vue';
import AutoComplete from "primevue/autocomplete";


const totalSupplier = ref(0);
const loading = ref(false);
const supplierLazyParams = ref({});
const supplierList = ref([]);
const selected = ref({});

const onLazyLoadSupplier = async (event) => {
  console.log("lazy load")
  const {first, last} = event;
  console.log(first, last, supplierList.value.length, totalSupplier.value, last >= supplierList.value.length, supplierList.value.length <= totalSupplier.value)
  supplierLazyParams.value['first'] = first;
  supplierLazyParams.value['rows'] = 10;
  if (last >= supplierList.value.length && supplierList.value.length <= totalSupplier.value) {
    supplierLazyParams.value['rows'] = last;
    await loadSupplierlist(); // Pass the current filter value
  }
};

const onFilterSupplier = async (event) => {
  console.log("filter")
  const {query} = event;
  if (query !== '') {
    supplierList.value = []
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
};

const loadSupplierlist = async () => {
  console.log("list supplier")
  loading.value = true;
  supplierLazyParams.value['filters[branch.organization.code][matchMode]'] = 'equals'
  supplierLazyParams.value['filters[branch.organization.code][value]'] = '001'
  console.log(supplierLazyParams.value)

  try {
    let token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5zeW5lcmd5dGVjaHNvZnQuY29tIiwic3ViIjoicHJhdGlrIiwidXBuIjoicHJhdGlrIiwiaWF0IjoxNzI3MTU3MzM0LCJleHAiOjE3MjcxNTc5MzQsImlzQWNjZXNzVG9rZW4iOnRydWUsInN1cGVyVXNlciI6ZmFsc2UsImJyYW5jaElkIjoxLCJicmFuY2hDb2RlIjoiMDAxIiwib3JnSWQiOjEsIm9yZ0NvZGUiOiIwMDEiLCJjdXJyZW50RGF0ZSI6IjIwMjQtMDktMjQiLCJzdWJzY3JpcHRpb25Db2RlIjoiU0lHLUVudGVycHJpc2UiLCJzdWJzY3JpcHRpb25FeHBpcnlBdCI6MTcyNzE1NzkzNCwic3Vic2NyaXB0aW9uR3JhY2VFeHBpcnlBdCI6MTcyNzE1NzkzNCwidHJpYWxTdWJzY3JpcHRpb24iOmZhbHNlLCJqdGkiOiJlMmQ1YTk3ZS01MTJhLTRkZjgtYjRlYS0yZDQ4Yzg4MDY5MTgifQ.XW8uFVjdELHF9J14ECjKhfwtImB1fFNkB3QRtVuCW5WCK9JLhIVnq-swnwFKpxhnjqqPqErVkOMIiOZV6al9H8rIi3rDFeOupVTcZxN5NQq8DbmPP5ixpWdnY9JgEsigeQZzxmgq41LKvc9sMsqc3FhW-G0n91Kz6e-h3vVyG1JAyWim0HBIq2V7ssXIUxyrHxAo_SjgCIxrLoqvsLe22lasxAHUa2SSbGgmaORg1-f1_94eLjk9tMBkOF5H0E1BTgrOQv2by2EEI-r5Gt7A9Jhx20oVwqHiiZipuFyRKwbhf6ACvgfockvAWItQb0tNGTwPALOq9EAluOP0XiZOFA';
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
      supplierList.value = [...supplierList.value, ...data.result];
      totalSupplier.value = data.totalCount;
      console.log("total supplier", totalSupplier.value)
    } else {
      console.error("Unexpected API response:", data);
    }
  } catch (error) {
    console.error("API request failed:", error);
  }

  loading.value = false;
};
</script>


<style scoped>

</style>