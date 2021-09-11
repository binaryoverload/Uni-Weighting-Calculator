<template>
  <div id="app" class="container mx-auto relative">
    <select name="institution" id="" v-model="selectedInstitution">
      <option value="" disabled>Select an institution</option>
      <option :value="i" :key="i" v-for="i in institutions">{{ i }}</option>
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
    <h1 class="bg-white md:right-1/4 md:fixed md:shadow text-lg font-bold px-4 py-2 mb-2">Overall total: {{ grandTotal }}%</h1>
    <div class="space-y-2">
      <Module :key="mod.id" :mod="mod" v-on:totalUpdate="updateModuleTotal(mod.id, $event)" :total="totals[mod.id]" :assignments="getAssignmentsForModule(mod)" v-for="mod in availableModules"/>
    </div>
  </div>
</template>

<script>
import { fetchToCsv, round} from "./utils"
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
      selectedYear: null,
      totals: {}
    }
  },
  computed: {
    institutions: function () {
      return new Set(this.courses.map(course => course.institution))
    },
    availableCourses: function () {
      return this.courses.filter(course => course.institution === this.selectedInstitution)
    },
    availableYears: function () {
      return new Set(this.modules.filter(mod => mod.course.includes(this.selectedCourse)).map(mod => mod.year))
    },
    availableModules: function () {
      return this.modules.filter(mod => {
        return mod.course.includes(this.selectedCourse) && mod.year === this.selectedYear
      }).sort((modA, modB) => {
        const semesterCompare = modA.semester.localeCompare(modB.semester)
        if (semesterCompare === 0) {
          return modA.name.localeCompare(modB.name)
        }
        return semesterCompare
      })
    },
    grandTotal: function() {
      let grandTotal = 0;
      let totalCats = 0;
      Object.keys(this.totals).forEach((moduleId) => {
        let module = this.availableModules.find(module => module.id === moduleId);
        if (!module) return;
        let cats = module.cats
        totalCats += +cats;
        console.log(cats)
        grandTotal += this.totals[moduleId] * cats;
      })
      console.log(grandTotal, totalCats)
      return round(grandTotal / (totalCats || 120), 2);
    }
  },
  watch: {
    selectedInstitution(val) {
      localStorage.setItem("selectedInstitution", val)
    },
    selectedCourse(val) {
      localStorage.setItem("selectedCourse", val)
    },
    selectedYear(val) {
      localStorage.setItem("selectedYear", val)
    },
  },
  methods: {
    getAssignmentsForModule(module) {
      return this.assignments.filter(assignment => assignment.module_id === module.id)
    },
    updateModuleTotal(moduleId, total) {
      this.totals = { ...this.totals, [moduleId]: total }
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
      this.modules.forEach((module) => {
        this.totals[module.id] = 0;
      })
    })
    this.selectedInstitution = localStorage.getItem("selectedInstitution")
    this.selectedCourse = localStorage.getItem("selectedCourse")
    this.selectedYear = localStorage.getItem("selectedYear")
  }
}
</script>

<style>
</style>
