<template>
    <div ref="dom"></div>
</template>

<script>
  import echarts from 'echarts'
  import {off, on} from '@/libs/tools'

  export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  props: ['model'],
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    const data = this.model;
    const option = {
      title: {
        text: data.title,
        // subtext: '折线图-subTitle',
        x: 'center'
      },
      legend: data.legend,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            // backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: data.data
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize())
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize())
  }
}
</script>
