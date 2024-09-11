<template>
  <div class="about-me">
    <div class="content">
      <img class="profile-pic" src="../assets/images/profile.png" alt="Profile Picture" />
      <div class="about-text">
        <h1>Pratik Kumar Labh</h1>
        <h3>Computer Engineer | Java Developer</h3>
        <p>
          I am eager to continually learn and grow in the field of software development.
          I am driven by a curiosity to tackle new challenges and improve my coding skills every day.
          I am looking forward to expanding my knowledge and gaining practical experience in
          developing applications in Java and other technologies to create innovative solutions that make a difference.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Ensure the html and body take up the full height */
html, body {
  height: 100%;
  margin: 0;
}

.about-me {
  width: 100%;
  min-height: 100vh; /* Ensures the container takes up the full viewport height */
  padding: 5rem;
  background-color: #869aaf;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-pic {
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 3px solid white;
}

.about-text {
  font-family: 'Playfair Display', serif;
  padding: 1rem;
}

/* Responsive Styles */
/* Targets devices like tablets or small laptops. */
@media (min-width: 768px) {
  .about-me {
    padding: 5rem;
  }

  .content {
    flex-direction: row;
    gap: 2rem;
  }

  .profile-pic {
    width: 20rem;
    height: 20rem;
  }

  .about-text {
    text-align: left;
    max-width: 600px;
  }
}

/* Targets larger screens like desktops. */
@media (min-width: 1024px) {
  .profile-pic {
    width: 21rem;
    height: 21rem;
  }

  .about-text {
    max-width: 700px;
  }
}
</style>
