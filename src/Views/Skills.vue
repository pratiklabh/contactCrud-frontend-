<template>
  <div class="skills">
    <h2>Skills</h2>
    <div class="skills-list">
      <div v-for="skill in skills" :key="skill.name" class="skill-item">
        <img :src="getImage(skill.icon)" :alt="skill.name" class="skill-icon"/>
        <p>{{ skill.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

// Function to return image path
const getImage = (imageName) => {
  return new URL(`../assets/icons/${imageName}`, import.meta.url).href;
};

const skills = ref([
  {name: 'Java', icon: 'java.jpg'},
  {name: 'C', icon: 'c.jpg'},
  {name: 'C++', icon: 'cpp.webp'},
  {name: 'HTML', icon: 'html.jpg'},
  {name: 'CSS', icon: 'css.png'},
  {name: 'Spring Boot', icon: 'springboot.png'},
  {name: 'MySQL', icon: 'dbms.jpg'},
  {name: 'Git', icon: 'github.webp'},
  {name: 'RestApi', icon: 'restapi.png'},
]);
</script>

<style scoped>
.skills {
  padding-top: 6rem;
  padding-bottom: 6rem;
  font-family: 'Playfair Display', serif;
  font-size: 4.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  background-color: #869aaf;
  text-align: center;
}

.skills-list {
  padding-top: 5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6rem;
  max-width: 100rem;
  margin: 0 auto;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: #dddeee;
  border-radius: 3rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.skill-item:hover {
  background-color: #007bff;
  color: white;
}

.skill-item img {
  height: 10rem;
  width: 10rem;
  border-radius: 50%;
}

.skill-item p {
  margin: 0.6rem 0 0;
  font-size: 1rem;
}

.skill-icon {
  width: 3rem;
  height: 3rem;
}
.skills h2 {
  font-size: 5rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 1.5rem;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .skills-list {
    gap: 4rem;
  }

  .skill-item {
    padding: 0.8rem 1rem;
  }

  .skill-item img {
    height: 8rem;
    width: 8rem;
  }

  .skill-item p {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .skills {
    font-size: 3rem;
  }

  .skills-list {
    gap: 3rem;
  }

  .skill-item {
    padding: 0.7rem 0.9rem;
  }

  .skill-item img {
    height: 7rem;
    width: 7rem;
  }

  .skill-item p {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .skills {
    font-size: 2.5rem;
    padding: 2rem 1rem;
  }

  .skills-list {
    padding-top: 3rem;
    gap: 2rem;
  }

  .skill-item {
    padding: 0.5rem 0.75rem;
  }

  .skill-item img {
    height: 5rem;
    width: 5rem;
  }
  .skills h2 {
    padding-top: 4rem  ;
    font-size: 2rem;
  }
  .skill-item p {
    font-size: 0.75rem;
  }
}
</style>
