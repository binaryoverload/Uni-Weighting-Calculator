<template>
  <div>
    <label>
      <span>Assignment {{ assignment.number }} ({{ assignment.weighting * 100 }}%)</span>
      <input class="ml-2 py-0.5 rounded w-16 text-center" type="number" v-model="internalValue" v-on:input="onChange">
    </label>
  </div>
</template>

<script>
export default {
  props: {
    assignment: Object,
    value: Number
  },
  data() {
    return {
      internalValue: this.value
    }
  },
  methods: {
    enforceMinMax() {
      this.internalValue = Math.min(Math.max(this.internalValue, 0), 100)
    },
    onChange() {
      this.enforceMinMax()
      this.$emit('change', this.internalValue)
    }
  }
}
</script>