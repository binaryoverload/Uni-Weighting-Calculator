<template>
    <div class="border px-4 py-8 my-2">
        <h1 class="text-lg">{{ mod.name }} - Semester {{ mod.semester }} - {{ mod.cats}} CATS </h1>
        <Assignment 
            :key="assignment.number"
            :assignment="assignment"
            :value="assignmentValues[assignment.number]"
            v-on:change="setAssignment(assignment.number, $event)"
            v-for="assignment in assignments" />
        <span>Total: {{ total }}</span>
    </div>
</template>

<script>
import Assignment from "./Assignment.vue"

export default {
    components: {
        Assignment
    },
    props: {
        mod: Object,
        assignments: Array
    },
    data() {
        return {
            assignmentValues: {}
        }
    },
    computed: {
        total() {
            let result = 0
            Object.keys(this.assignmentValues).forEach(key => {
                const weight = this.assignments.find(a => a.number === key).weighting
                result += (this.assignmentValues[key] * weight)
            })
            return result;
        }
    },
    methods: {
        setAssignment(number, value) {
            this.assignmentValues = { ...this.assignmentValues, [number]: value }
        }
    },
    created() {
        this.assignments.forEach(assignment => {
            this.assignmentValues = { ...this.assignmentValues, [assignment.number]: 0 }
        })
    }
}
</script>