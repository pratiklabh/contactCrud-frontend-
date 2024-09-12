<template>
  <section class="contact-me">
    <!-- Heading Section -->
    <h2>Contact Me</h2>

    <!-- Contact Form Section -->
    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <InputText id="name" v-model="formData.name" placeholder="Your Name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <InputText id="email" v-model="formData.email" placeholder="Your Email" type="email" required />
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <InputText id="subject" v-model="formData.subject" placeholder="Subject" required />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea
            id="message"
            v-model="formData.message"
            placeholder="Your Message"
            required
            rows="5"
        ></textarea>
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
import { reactive, toRaw } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/contacts', toRaw(formData))
    console.log('Response:', response.data)
    alert(`Thank you, ${formData.name}! Your message has been sent.`)
    formData.name = ''
    formData.email = ''
    formData.subject = ''
    formData.message = ''
  } catch (error) {
    console.error('Error sending message:', error)
    alert('An error occurred while sending your message. Please try again.')
  }
}

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

button {
  background-color: #f0f0f0;
  font-size: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 2rem;
}


</style>
