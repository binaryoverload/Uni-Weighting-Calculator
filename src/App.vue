<template>
  <div id="app">
    <select name="institution" id="" v-model="selectedInstitution">
      <option value="" disabled>Select an institution</option>
      <option :value="i" :key="i" v-for="i in institutions">{{i}}</option>
    </select>
    <select name="course" id="" v-model="selectedCourse" v-show="selectedInstitution !== null">
      <option value="" disabled>Select a course</option>
      <option :value="course.id" :key="course.id" v-for="course in availableCourses">{{ course.name }}</option>
    </select>
    <select name="year" id="" v-model="selectedYear" v-show="selectedCourse !== null">
      <option value="" disabled>Select a year</option>
      <option :value="year" :key="year" v-for="year in availableYears">Year {{ year }}</option>
    </select>
    <hr class="my-2">
    <Module :key="mod.id" :mod="mod" :assignments="getAssignmentsForModule(mod)" v-for="mod in availableModules" />
  </div>
</template>

<script>
import { fetchToCsv } from "./utils"
import Module from "./components/Module.vue"

export default {
  name: 'App',
  components: {
    Module
  },
  data() {
    return {
      assignments: [],
      courses: [],
      modules: [],
      selectedInstitution: null,
      selectedCourse: null,
      selectedYear: null
    }
  },
  computed: {
    institutions: function () {
      return new Set(this.courses.map(course => course.institution))
    },
    availableCourses: function () {
      return this.courses.filter(course => course.institution === this.selectedInstitution)
    },
    availableYears: function() {
      return new Set(this.modules.filter(mod => mod.course.includes(this.selectedCourse)).map(mod => mod.year))
    },
    availableModules: function() {
      return this.modules.filter(mod => {
        return mod.course.includes(this.selectedCourse) && mod.year === this.selectedYear
      })
    }
  },
  methods: {
    getAssignmentsForModule(module) {
      return this.assignments.filter(assignment => assignment.module_id === module.id)
    }
  },
  created() {
    fetchToCsv("assignments.csv", output => {
      this.assignments = output
    });
    fetchToCsv("courses.csv", output => {
      this.courses = output
    });
    fetchToCsv("modules.csv", output => {
      this.modules = output
    })
  }
}
</script>

<style>
</style>
