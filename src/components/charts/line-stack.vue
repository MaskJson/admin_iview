<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: "stack-line",
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      },
      text: String,
      subtext: String
    },
    mounted () {
      this.$nextTick(() => {
        let xAxisData = this.value.xAxisData
        // let seriesData = Object.values(this.value.data)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'left'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.value.legend || []
          },
          grid: {
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: this.value.series || []
        }
        let dom = echarts.init(this.$refs.dom, 'tdTheme')
        dom.setOption(option)
      })
    }
  }
</script>

<style scoped>

</style>
