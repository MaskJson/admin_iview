<template>
  <SearchItem>
    <span>{{title}}</span>
    <DatePicker type="datetime" placeholder="开始时间" v-model="start" @on-change="startTimeChange" :options="startTimeOptions"></DatePicker>
    <span class="mlr5">-</span>
    <DatePicker type="datetime" placeholder="结束时间" v-model="end" @on-change="endTimeChange" :options="endTimeOptions"></DatePicker>
  </SearchItem>
</template>

<script>
  import SearchItem from '@/view/components/global-util/SearchItem';
  export default {
    name: "DateUtil",
    components: {
      SearchItem
    },
    props: ['startTime', 'endTime', 'title'],
    data() {
      return {
        startTimeOptions: {},
        endTimeOptions: {},
        start: this.startTime,
        end: this.endTime
      }
    },
    methods: {
      startTimeChange: function(e) { //设置开始时间
        this.$emit('change', this.start, this.end)
        this.endTimeOptions = {
          disabledDate: date => {
            let startTime = this.start ? new Date(this.start).valueOf() : '';
            return date && (date.valueOf() < startTime);
          }
        }
      },
      endTimeChange: function(e) { //设置结束时间
        this.$emit('change', this.start, this.end)
        let endTime = this.end ? new Date(e).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
        this.startTimeOptions = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        }
      }
    },
    watch: {
      startTime(val) {
        this.start = val;
      },
      endTime(val) {
        this.end = val;
      }
    }
  }
</script>

<style scoped>

</style>
