<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p :key="JSON.stringify(assignment)" v-for="assignment in assignments">
      {{ assignment }}
    </p>
    <p :key="JSON.stringify(course)" v-for="course in courses">
      {{ course }}
    </p>
    <p :key="JSON.stringify(mod)" v-for="mod in modules">
      {{ mod }}
    </p>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { fetchToCsv } from "./utils"

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      assignments: [],
      courses: [],
      modules: []
    }
  },
  created() {
    fetchToCsv("/assignments.csv", output => {
      this.assignments = output
    });
    fetchToCsv("/courses.csv", output => {
      this.courses = output
    });
    fetchToCsv("/modules.csv", output => {
      this.modules = output
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
