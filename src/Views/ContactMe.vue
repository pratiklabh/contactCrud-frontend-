<!-- src/views/ContactView.vue -->
<template>
  <section class="contact-me">
    <!-- Heading Section -->
    <h2>Contact Me</h2>

    <!-- Contact Form -->
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-group">
        <label for="name">Sender Name:</label>
        <input type="text" id="name" v-model="formData.name" required />
      </div>
      <div class="form-group">
        <label for="email">Sender Email:</label>
        <input type="email" id="email" v-model="formData.email" required />
      </div>
      <div class="form-group">
        <label for="subject">Subject:</label>
        <input type="text" id="subject" v-model="formData.subject" required />
      </div>
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" v-model="formData.message" rows="4" required></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
  </section>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import axios from 'axios';

// Define the form data as reactive
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// Handle form submission
const handleSubmit = async () => {
  try {
    // Send the form data to the backend API
    const response = await axios.post('/api/contacts', toRaw(formData.value));

    // Log response and alert user on success
    console.log('Response:', response.data);
    alert(`Thank you, ${formData.value.name}! Your message has been sent.`);

    // Reset form after submission
    formData.value.name = '';
    formData.value.email = '';
    formData.value.subject = '';
    formData.value.message = '';
  } catch (error) {
    console.error('Error sending message:', error);
    alert('An error occurred while sending your message. Please try again.');
  }
};
</script>


<style scoped>
.contact-me {
  font-family: 'Playfair Display', serif;
  background-color: #869aaf;
  color: white;
  padding: 2rem;
  text-align: center;
}

.contact-me a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
}

.contact-me a:hover {
  text-decoration: underline;
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

.form-group label {
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 0.1rem solid #ddd;
  border-radius: 0.25rem;
}

button {
  background-color: #2c3e50;
  color: white;
  border: none;
  font-size: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.contact-me p {
  padding-top: 1rem;
  font-size: 1.5rem;
  margin: 0 auto;
}

button:hover {
  background-color: #34495e;
}

</style>
