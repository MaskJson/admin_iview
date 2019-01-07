<template>
  <Spin fix v-if="show">
    <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
</template>

<script>
  export default {
    name: "SpinUtil",
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .spin-icon-load{
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
