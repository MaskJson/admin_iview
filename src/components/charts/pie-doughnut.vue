<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: "doughnut-pie",
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
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data: this.value.legendData || []
          },
          grid: {
            containLabel: true
          },
          series: [
            {
              name:'成交商品类目占比',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.value.data || []
            }
          ]
        }
        let dom = echarts.init(this.$refs.dom, 'tdTheme')
        dom.setOption(option)
      })
    }
  }
</script>

<style scoped>

</style>
