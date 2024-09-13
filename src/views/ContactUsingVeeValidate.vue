<template>
  <section class="contact-vee">
    <!-- Heading Section -->
    <h2>Contact Me</h2>

    <!-- Contact Form Section -->
    <Form @submit="handleSubmit" v-slot="{ errors }" class="contact-form">
      <div class="form-group">
        <label for="name">Name</label>
        <Field
            name="name"
            as="input"
            type="text"
            id="name"
            v-model="formData.name"
            rules="required|min:3"
            placeholder="Your Name"
        />
        <ErrorMessage name="name" class="error" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <Field
            name="email"
            as="input"
            type="email"
            id="email"
            v-model="formData.email"
            rules="required|email"
            placeholder="Your Email"
        />
        <ErrorMessage name="email" class="error" />
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <Field
            name="subject"
            as="input"
            id="subject"
            v-model="formData.subject"
            rules="required|min:3"
            placeholder="Subject"
        />
        <ErrorMessage name="subject" class="error" />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <Field
            name="message"
            as="textarea"
            id="message"
            v-model="formData.message"
            rules="required|min:10"
            placeholder="Your Message"
            rows="5"
        />
        <ErrorMessage name="message" class="error" />
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
import { reactive } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Button from 'primevue/button'
import { required, email, min } from '@vee-validate/rules'
import { defineRule, configure } from 'vee-validate'
import axios from 'axios'
import { useRouter } from 'vue-router'

// Register the validation rules
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)

// Reactive form data
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// Form submission handler
const handleSubmit = async (values: typeof formData) => {
  try {
    // Submitting form data to the backend
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
const router = useRouter()
const navigateToViewContact = () => {
  router.push({ name: 'contactList' })
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