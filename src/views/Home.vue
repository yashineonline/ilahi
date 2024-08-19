<template>
  <div>
    <h1>Welcome to Ilahi App</h1>
    <p>Explore our collection of sacred songs</p>
    <router-link to="/songs">View Song List</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home'
})
</script>
