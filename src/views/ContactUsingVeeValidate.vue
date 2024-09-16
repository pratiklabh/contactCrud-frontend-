<template>
  <section class="contact-vee">
    <!-- Heading Section -->
    <h2>Contact Me</h2>

    <!-- Contact Form Section -->
    <Form @submit="handleSubmit" v-slot="{ errors }" class="contact-form">
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

      <div class="form-group">
        <label for="email">Email</label>
        <Field name="email" rules="required|email" v-slot="{ field, errorMessage }">
          <InputText
              id="email"
              v-bind="field"
              v-model="formData.email"
              placeholder="Your Email"
          />
          <ErrorMessage name="email" class="error" />
        </Field>
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <Field name="subject" rules="required|min:3" v-slot="{ field, errorMessage }">
          <InputText
              id="subject"
              v-bind="field"
              v-model="formData.subject"
              placeholder="Subject"
          />
          <ErrorMessage name="subject" class="error" />
        </Field>
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <Field name="message" rules="required|min:10" v-slot="{ field, errorMessage }">
          <InputText
              id="message"
              v-bind="field"
              v-model="formData.message"
              placeholder="Your Message"
              type="textarea"
              rows="5"
          />
          <ErrorMessage name="message" class="error" />
        </Field>
      </div>

      <Button type="submit" class="view-contact-button">
        Send Message
      </Button>
    </Form>

    <!-- Button to Route to Contact List -->
    <Button @click="navigateToViewContact" class="view-contact-button">
      View Contact
    </Button>
  </section>
</template>

<script lang="ts" setup>

// reactive: A Vue 3 Composition API function that creates a reactive object,
// allowing automatic updates when the object changes.
import {reactive} from 'vue'

// Form, Field, ErrorMessage: Components from vee-validate, a validation library for Vue.js,
// used to validate form fields and display errors.
import {Form, Field, ErrorMessage} from 'vee-validate'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

// required, email, min: Validation rules from vee-validate that enforce mandatory fields,
// valid email formats, and minimum input lengths.
import {required, email, min} from '@vee-validate/rules'

// defineRule: Registers the validation rules globally so they can be used in the form.
import {defineRule, configure} from 'vee-validate'

// to make HTTP requests
import axios from 'axios'

// useRouter: Vue Router's useRouter function is used for programmatic navigation.
import {useRouter} from 'vue-router'

// defineRule registers the validation rules
// (required, email, and min) with vee-validate for later use in the form fields.
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)

// Reactive form data
// reactive object that holds the data for the form fields
// Any changes made in the form inputs will automatically update this object.
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})


configure({

  // ro ensure that form validation occurs as soon as the user types in the fields,
  // rather than waiting until they submit the form.
  validateOnInput: true
})

// handleSubmit is an asynchronous function triggered when the form is submitted.
const handleSubmit = async (values: typeof formData) => {
  try {
    // Submitting form data to the backend
    // It sends the form data to the server using axios.post to the /api/contacts endpoint.
    const response = await axios.post('/api/contacts', values)
    console.log('Response:', response.data)
    alert(`Thank you, ${values.name}! Your message has been sent.`)

    // Resetting the form
    formData.name = ''
    formData.email = ''
    formData.subject = ''
    formData.message = ''
  } catch (error) {
    console.error('Error sending message:', error)
    alert('An error occurred while sending your message. Please try again.')
  }
}

// Router for navigating to the contact list
// useRouter is used to get access to Vue Router, allowing programmatic navigation.
const router = useRouter()

// navigates the user to the contactList route (presumably a page that lists contact information)
// when the "View Contact" button is clicked.
const navigateToViewContact = () => {
  router.push({name: 'contactList'})
}
</script>


<style scoped>
.contact-vee {
  font-family: 'Playfair Display', serif;
  text-align: center;
}

.contact-vee h2 {
  font-size: 4.5rem;
  letter-spacing: 0.25rem;
  padding: 2rem;
}

.contact-form {
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

.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 0.1rem solid #ddd;
  border-radius: 0.25rem;
  background: white;
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
