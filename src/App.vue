<template>
  <div id="app">
    <ProjectWisdom/>
  </div>
</template>

<script>
import ProjectWisdom from './components/ProjectWisdom'

export default {
  name: 'App',
  components: {
    ProjectWisdom
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
