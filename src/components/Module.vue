<template>
  <div class="border px-8 py-4">
    <h1 class="text-lg text-blue-700">{{ mod.module_code }} - {{ mod.name }}</h1>
    <h2 class="text-gray-600 mb-2">Semester {{ semester }} &middot; {{ mod.cats }} CATS</h2>
    <div class="flex flex-col justify-center">
      <div class="space-y-1">
        <Assignment
            :key="assignment.number"
            :assignment="assignment"
            :value="assignmentValues[assignment.number]"
            v-on:change="setAssignment(assignment.number, $event)"
            v-for="assignment in assignments.sort()"/>
      </div>

      <p class="mt-2 text-blue-700 rounded-sm h-full">Average: <span class="font-semibold">{{ average }}%</span></p>
    </div>

  </div>
</template>

<script>
import Assignment from "./Assignment.vue"
import {round} from "@/utils";

export default {
  components: {
    Assignment
  },
  props: {
    mod: Object,
    assignments: Array,
    average: Number
  },
  data() {
    return {
      assignmentValues: {}
    }
  },
  computed: {
    internalAverage() {
      let result = 0
      Object.keys(this.assignmentValues).forEach(key => {
        let assignment = this.assignments.find(a => a.number === key)
        if (assignment) {
          result += (this.assignmentValues[key] * assignment.weighting)
        }
      })
      // Rounding to square off float error and limit to 2d.p
      return round(result, 2);
    },
    semester() {
      return this.mod.semester.toUpperCase().split(";").join(" + ")
    }
  },
  methods: {
    setAssignment(number, value) {
      this.assignmentValues = {...this.assignmentValues, [number]: value}
    }
  },
  watch: {
    assignmentValues: function (val) {
      if (!Object.values(val).every(score => score === 0)) {
        localStorage.setItem(`module_${this.mod.id}`, JSON.stringify(val))
      }
      this.$emit("averageUpdate", this.internalAverage)
    }
  },
  created() {
    this.assignments.forEach(assignment => {
      this.assignmentValues = {...this.assignmentValues, [assignment.number]: 0}
    })

    const localStored = localStorage.getItem(`module_${this.mod.id}`)
    if (localStored) {
      const storedToObj = JSON.parse(localStored)
      this.assignmentValues = {...this.assignmentValues, ...storedToObj}
    }
  }
}
</script>