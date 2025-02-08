<template>
  <div class="navbar">
    <router-link to="/input" class="nav-link">Input</router-link>
    <router-link to="/analyze" class="nav-link">Analyze</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 30px 30px;
  height: auto;
}

.nav-link {
  margin-bottom: 10px;
  color: #005757;
  text-decoration: none;
  padding: 10px 0;
  border-radius: 4px;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #007f7f; 
  font-weight: bold;
  transform: scale(1.05);
}

.nav-link:active {
  text-decoration: underline;
}

.nav-link:last-child {
  margin-bottom: 0;
}
</style>