<template>
  <div>
    <div class="demo-upload-list" v-for="(item, index) in showList">
      <template>
        <img :src="item.src">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.src)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
        </div>
      </template>
    </div>
    <Upload
      v-show="multiple || uploadList.length==0"
      ref="upload"
      :show-upload-list="false"
      :default-file-list="showList"
      :on-success="handleSuccess"
      :format="format"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      type="drag"
      action="/api/uploadimg"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>

  import {imgBaseUrl} from "../../../config";

  export default {
    name: "MyUpload",
    data () {
      return {
        imgName: '',
        visible: false
      }
    },
    props: {
      uploadList: {
        type: Array,
        default() {
          return [];
        }
      },
      format: {
        type: Array,
        default() {
          return [];
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      maxSize: {
        type: Number,
        default: 1024
      },
      onRemove: {
        type: Function,
        default() {
          return () => {

          }
        }
      },
      onSuccess: {
        type: Function,
        default() {
          return () => {

          }
        }
      },
      onFormatError: {
        type: Function,
        default() {
          return () => {

          }
        }
      },
      onExceededSize: {
        type: Function,
        default() {
          return () => {

          }
        }
      }
    },
    computed: {
      showList() {
        return this.uploadList.map(item => {
          return {
            src: imgBaseUrl + item,
            status: true
          }
        })
      }
    },
    methods: {
      handleView (item) {
        this.imgName = item.src;
        this.visible = true;
      },
      handleRemove (index) {
        this.onRemove(index);
        this.$emit('on-remove')
      },
      handleSuccess (res, file) {
        // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        this.onSuccess(res, file);
        this.$emit('on-success', res, file);
      },
      handleFormatError (file) {
        const _this = this;
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select in '+this.format.toString()
        });
        // this.onFormatError();
      },
      handleMaxSize (file) {
        const _this = this;
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than '+ _this.maxSize +'KB.'
        });
        // this.onExceededSize();
      },
      handleBeforeUpload() {
        return true;
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
