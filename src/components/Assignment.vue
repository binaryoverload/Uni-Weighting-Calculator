<template>
    <div>
        <label>
            <span>Assignment {{ assignment.number }} ({{ assignment.weighting * 100 }}%)</span>
            <input type="number" :value="value" min="0" v-on:input="$emit('change', $event.target.value)">
        </label>
      </div>
</template>

<script>
export default {
    props: {
        assignment: Object,
        value: Number
    }
}
</script>