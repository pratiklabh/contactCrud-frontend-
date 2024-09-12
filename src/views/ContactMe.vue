<template>
  <section class="contact-me">
    <!-- Heading Section -->
    <h2>Contact Me</h2>

    <!-- Contact Form Section -->
    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <InputText id="name" v-model="formData.name" placeholder="Your Name" />
        <div v-if="formErrors.name" class="error">{{ formErrors.name }}</div>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <InputText id="email" v-model="formData.email" placeholder="Your Email" type="email" />
        <div v-if="formErrors.email" class="error">{{ formErrors.email }}</div>
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <InputText id="subject" v-model="formData.subject" placeholder="Subject" />
        <div v-if="formErrors.subject" class="error">{{ formErrors.subject }}</div>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea
            id="message"
            v-model="formData.message"
            placeholder="Your Message"
            rows="5"
        ></textarea>
        <div v-if="formErrors.message" class="error">{{ formErrors.message }}</div>
      </div>
      <Button type="submit" class="view-contact-button">
        Send Message
      </Button>
    </form>

    <!-- Button to Route to Contact List -->
    <Button @click="navigateToViewContact" class="view-contact-button">
      View Contact
    </Button>
  </section>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

// Reactive form data
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// Reactive object to hold form errors
const formErrors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// Yup schema for form validation
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
})

const validateForm = async () => {
  try {
    // Resetting form errors before validation
    Object.keys(formErrors).forEach(key => (formErrors[key] = ''))

    // Validate form data against Yup schema
    await schema.validate(formData, { abortEarly: false })
    return true
  } catch (err) {
    // Set form errors for each field
    if (err instanceof yup.ValidationError) {
      err.inner.forEach(validationError => {
        formErrors[validationError.path] = validationError.message
      })
    }
    return false
  }
}

const handleSubmit = async () => {
  const isValid = await validateForm()
  if (isValid) {
    try {
      // Submitting form data to the backend
      const response = await axios.post('/api/contacts', formData)
      console.log('Response:', response.data)
      alert(`Thank you, ${formData.name}! Your message has been sent.`)

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
}

// Router for navigating to the contact list
const router = useRouter()
const navigateToViewContact = () => {
  router.push({ name: 'contactList' })
}
</script>

<style scoped>
.contact-me {
  font-family: 'Playfair Display', serif;
  text-align: center;
}

.contact-me h2 {
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
  background-color: #f0f0f0;
  font-size: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 2rem;
}
</style>
