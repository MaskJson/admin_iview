<template>
  <div>
    <DatePicker type="datetime" v-model="value" @on-change="changeHandler"></DatePicker>
  </div>
</template>

<script>
  export default {
    name: "DatePicker",
    props: ['value'],
    methods: {
      changeHandler(value) {
        this.$emit('input', value);
        this.$emit('change', value);
      }
    }
  }
</script>

<style scoped>

</style>
