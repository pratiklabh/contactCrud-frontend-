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
//reactive: to create a reactive object that can store and track changes in form data and form errors.
//watch: to observe changes in a specific property and execute a function when that property changes.
import { reactive, watch } from 'vue'

//to send HTTP requests
import axios from 'axios'

// allows programmatic navigation to other routes (e.g., navigating to the contact list page).
import { useRouter } from 'vue-router'

//a schema validation library used for validating form data
import * as yup from 'yup'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

// Reactive form data
//Creates a reactive object called formData to store the form’s input values
//initially all fields are set empty
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
  name: yup.string().min('2').required('Name is required')
                    .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
})

// Function to validate individual fields
//This function validates an individual form field (e.g., name, email) based on the Yup schema:
const validateField = async (field: keyof typeof formData) => {
  try {
    //validateAt method of Yup checks if the specific field passes validation.
    await schema.validateAt(field, formData)

    //If valid, the error for that field is cleared.
    formErrors[field] = ''
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      //If invalid, an error message is stored in formErrors[field].
      formErrors[field] = err.message
    }
  }
}

// Watchers for individual fields
// Watches for changes to formData.name.
// When the name changes, it triggers the validateField function for the name field.(same for others)
watch(() => formData.name, () => validateField('name'))
watch(() => formData.email, () => validateField('email'))
watch(() => formData.subject, () => validateField('subject'))
watch(() => formData.message, () => validateField('message'))

// Function to validate the entire form
const validateForm = async () => {
  try {
    // Resetting form errors before validation
    Object.keys(formErrors).forEach(key => (formErrors[key] = ''))

    // Validate form data against Yup schema
    // The validate method of Yup checks the entire formData object against the schema.
    await schema.validate(formData, { abortEarly: false })
    
    return true
  } catch (err) {
    // Set form errors for each field
    if (err instanceof yup.ValidationError) {
      // If invalid, it updates formErrors for each invalid field with the corresponding error message and returns false.
      err.inner.forEach(validationError => {
        formErrors[validationError.path] = validationError.message
      })
    }
    return false
  }
}

// Form submission handler that runs when the form is submitted
const handleSubmit = async () => {
  // It calls validateForm to ensure all fields are valid.
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
// Initializes the router so you can programmatically navigate to different routes.
const router = useRouter()
// Defines a function that navigates to the contactList route when called
// (i.e. when the "View Contact" button is clicked)
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
  font-size: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 2rem;
}
</style>
