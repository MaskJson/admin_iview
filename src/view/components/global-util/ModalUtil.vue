<template>
  <div>
    <Modal :footer-hide="footerHide" :draggable="draggable" :title="title" v-model="isShow" :width="width" @on-visible-change="resetData" :mask-closable="mask">
      <slot></slot>
      <div slot="footer">
        <Button class="w120 mr-10" @click="isShow = false">取消</Button>
        <Button type="primary" class="w120" @click="submit" :loading="loading">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import FormUtil from './FormUtil';
  export default {
    name: "ModalUtil",
    components: {
      FormUtil
    },
    data() {
      return {
        isShow: false
      }
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      draggable: {
        type: Boolean,
        default: true
      },
      mask: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: 'Default Title'
      },
      width: {
        type: Number,
        default: 550
      },
      footerHide: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      submit(result) {
        this.$emit('on-ok');
      },
      resetData(val) {
        if (!val) {
          this.$emit('reset');
        }
      },
      toggleShow() {
        this.isShow = !this.isShow;
      }
    }
  }
</script>

<style scoped>

</style>
