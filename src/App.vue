<template>
  <div id="app" class="md:container md:mx-auto mx-2 relative">
    <div id="header" class="mt-10">
      <h1 class="text-2xl mb-4">University Grade Calculator</h1>
      <div class="space-y-2">
        <p>This calculator was created to be specific to individual courses making it easier to
          calculate your overall percentage.</p>
        <p>If you would like your course added, please email <a class="underline hover:text-blue-800"
                                                                href="mailto:me@williamoldham.co.uk">me@williamoldham.co.uk</a>
        </p>
        <p>All grades entered into this tool are saved into your local browser storage! This means you can come back to it at any point and your previous entries will still exist.</p>
      </div>
      <div class="bg-yellow-100 px-4 py-2 text-yellow-700 rounded flex my-4">
        <FaIcon icon="exclamation-triangle" class="text-yellow-500 mt-1 mr-4"/>
        <div>
          <p class="font-semibold mb-2">Warning!</p>
          <p>This calculator only provides an estimate of your average grade throughout the year and is <span
              class="font-semibold">not</span>
            a indication of your actual grade or whether you will progress to the next academic year.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 flex-col md:flex-row">
      <select name="institution" id="" v-model="selectedInstitution">
        <option value="" disabled>Select a university</option>
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
    </div>
    <hr class="my-2">
    <h1 class="bg-white md:right-1/4 sticky top-0 md:top-auto md:fixed shadow text-lg px-4 py-2 mb-2">Overall average:
      <span class="font-semibold">{{
          grandAverage
        }}%</span></h1>
    <div class="space-y-2 mb-4">
      <Module :key="mod.id" :mod="mod" v-on:averageUpdate="updateModuleAverage(mod.id, $event)" :average="averages[mod.id]"
              :assignments="getAssignmentsForModule(mod)" v-for="mod in availableModules"/>
    </div>
  </div>
</template>

<script>
import {fetchToCsv, round} from "./utils"
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
      averages: {}
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
    grandAverage: function () {
      let grandTotal = 0;
      let totalCats = 0;
      Object.keys(this.averages).forEach((moduleId) => {
        let module = this.availableModules.find(module => module.id === moduleId);
        if (!module) return;
        let cats = module.cats
        totalCats += +cats;
        console.log(cats)
        grandTotal += this.averages[moduleId] * cats;
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
    updateModuleAverage(moduleId, total) {
      this.averages = {...this.averages, [moduleId]: total}
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
        this.averages[module.id] = 0;
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
