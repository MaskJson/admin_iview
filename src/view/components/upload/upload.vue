<template>
  <div class="clear">
    <template v-if="isShowTipCover">
      <div class="demo-upload-list left" v-for="item in fileList">
        <template v-if="item.status === 'finished'">
          <img :src="item.src | imageSrc('!thum54')">
          <div class="demo-upload-list-cover" v-if="!disabled">
            <icon type="ios-eye-outline" @click.native="handleView(item.src)"/>
            <icon type="ios-trash-outline" @click.native="handleRemove(item)"/>
          </div>
        </template>
        <template v-else>
          <i-progress v-if="item.showProgress" :percent="item.percentage" hide-info/>
        </template>
      </div>
    </template>
    <div ref="Upload" class="left" :class="[prefixCls]" v-show="alwaysShow || showUpload">
      <div :class="[classes,{disabled:disabled}]"
           @click="handleClick"
           @drop.prevent="onDrop"
           @dragover.prevent="dragOver = true"
           @dragleave.prevent="dragOver = false">
        <input
          :disabled="disabled"
          ref="input"
          type="file"
          :class="[prefixCls + '-input']"
          @change="handleChange"
          :multiple="multiple"
          :accept="accept">
        <slot/>
      </div>
      <slot name="tip"/>
    </div>
    <modal title="图片查看器" v-model="visible" :z-index="3000">
      <img :src="originalSrc | imageSrc('!orgi75')" v-if="visible" class="width-pct-100">
    </modal>
  </div>
</template>
<script>
  import {Icon, Modal, Progress} from 'iview'
  import {oneOf} from 'iview/src/utils/assist'
  import Emitter from 'iview/src/mixins/emitter'
  import {bucket, aliCallbackImgUrl, aliUploadConfig, randomString} from '@/libs/aliUploadConfig'
  const prefixCls = 'ivu-upload';

  export default {
    name: 'Upload',
    mixins: [Emitter],
    components: {
      Icon: Icon,
      Modal: Modal,
      iProgress: Progress,
    },
    props: {
      alwaysShow: {
        type: Boolean,
        default: false
      },
      itemIndex: {
        type: Number,
        default: 0
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: 'file'
      },
      isShowTipCover: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        validator(value) {
          return oneOf(value, ['select', 'drag']);
        },
        default: 'select'
      },
      format: {
        type: Array,
        default() {
          return [];
        }
      },
      accept: {
        type: String
      },
      maxSize: {
        type: Number
      },
      uploadLength: {
        type: Number,
        default: 1
      },
      beforeUpload: Function,
      onProgress: {
        type: Function,
        default() {
          return {};
        }
      },
      onSuccess: {
        type: Function,
        default() {
          return {};
        }
      },
      onError: {
        type: Function,
        default() {
          return {};
        }
      },
      onRemove: {
        type: Function,
        default() {
          return {};
        }
      },
      onPreview: {
        type: Function,
        default() {
          return {};
        }
      },
      onExceededSize: {
        type: Function,
        default() {
          return {};
        }
      },
      onFormatError: {
        type: Function,
        default() {
          return {};
        }
      },
      defaultFileList: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        prefixCls: prefixCls,
        dragOver: false,
        fileList: [],
        visible: false,
        originalSrc: null,
        showUpload: true,
        tempIndex: 1
      };
    },
    computed: {
      classes() {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-select`]: this.type === 'select',
            [`${prefixCls}-drag`]: this.type === 'drag',
            [`${prefixCls}-dragOver`]: this.type === 'drag' && this.dragOver
          }
        ];
      }
    },
    created() {
      if (this.defaultFileList.length > 0) {
        let list = this.defaultFileList;
        this.fileList = list.map(item => {
          item.status = 'finished';
          item.percentage = 100;
          return item;
        });
      }
    },
    methods: {
      handleView(name) {
        this.originalSrc = name;
        this.visible = true;
      },
      handleClick() {
        this.$refs.input.click();
      },
      handleChange(e) {
        const files = e.target.files;
        if (!files) {
          return;
        }
        this.uploadFiles(files);
        this.$refs.input.value = null;
      },
      onDrop(e) {
        this.dragOver = false;
        this.uploadFiles(e.dataTransfer.files);
      },
      uploadFiles(files) {
        let postFiles = Array.prototype.slice.call(files);
        if (!this.multiple) postFiles = postFiles.slice(0, 1);

        if (postFiles.length === 0) return;

        postFiles.forEach(file => {
          this.upload(file);
        });
      },
      upload(file) {
        if (!this.beforeUpload) {
          return this.post(file);
        }

        const before = this.beforeUpload(file);
        if (before && before.then) {
          before.then(processedFile => {
            if (Object.prototype.toString.call(processedFile) === '[object File]') {
              this.post(processedFile);
            } else {
              this.post(file);
            }
          }, () => {
          });
        } else if (before !== false) {
          this.post(file);
        } else {
        }
      },
      post(file) {
        const _this = this;
        if (_this.format.length) {
          const _file_format = file.name.split('.').pop().toLocaleLowerCase();
          const checked = _this.format.some(item => item.toLocaleLowerCase() === _file_format);
          if (!checked) {
            _this.onFormatError(file, this.fileList);
            return false;
          }
        }
        if (_this.maxSize) {
          if (file.size > _this.maxSize * 1024) {
            _this.onExceededSize(file, _this.fileList);
            return false;
          }
        }
        _this.handleStart(file);
        _this.handleProgress(file);
        let key = _this.name + '/' + randomString();
        aliUploadConfig.aliUploadImg(key, file).then(res => {
          _this.handleSuccess(res, file);
        }).catch(err => {
          console.error(err);
          _this.handleError(err, file);
          const _file = this.getFile(file);
          _file.showProgress = false;
          alert('图片上传错误，请刷新页面或者稍后重试！');
        })
      },
      handleStart(file) {
        file.uid = Date.now();
        const _file = {
          status: 'uploading',
          name: file.name,
          size: file.size,
          percentage: 0,
          uid: file.uid,
          showProgress: true
        };

        this.fileList.push(_file);
      },
      getFile(file) {
        const fileList = this.fileList;
        let target;
        fileList.every(item => {
          target = file.uid === item.uid ? item : null;
          return !target;
        });
        return target;
      },
      handleProgress(file) {
        const _file = this.getFile(file);
        let interval = setInterval(() => {
          _file.percentage += 20;
          if (_file.percentage === 100) {
            clearInterval(interval)
          }
        }, 30)
      },
      handleSuccess(res, file) {
        const _file = this.getFile(file);
        if (_file) {
          _file.status = 'finished';
          _file.src = aliCallbackImgUrl + res.name;
          this.onSuccess(res, this.itemIndex, _file, this.fileList);
          setTimeout(() => {
            _file.showProgress = false;
          }, 1000);
        }
      },
      handleError(err, response, file) {
        const _file = this.getFile(file);
        const fileList = this.fileList;

        _file.status = 'fail';

        fileList.splice(fileList.indexOf(_file), 1);

        this.onError(err, response, file);
      },
      handleRemove(file) {
        const fileList = this.fileList;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, this.itemIndex, fileList);
      },
      clearFiles() {
        this.fileList = [];
      },
      initFileList(src) { console.log(src)
        this.fileList.push({
          status: 'finished',
          src: src
        })
      }
    },
    watch: {
      fileList: {
        deep: true,
        handler(newValue, oldValue) {
          this.showUpload = newValue.length < this.uploadLength;
        },
      },
      defaultFileList: {
        handler() {
          if (this.defaultFileList.length > 0) {
            let list = this.defaultFileList;
            this.fileList = list.map(item => {
              item.status = 'finished';
              item.percentage = 100;
              return item;
            });
          } else {
            this.fileList = [];
          }
        },
      }
    }
  };
</script>
<style lang="less" scoped>
  .demo-upload-list {
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
    &:hover .demo-upload-list-cover {
      display: block;
    }
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .disabled {
    background-color: #f7f7f7;
    cursor: not-allowed;
    &:hover {
      border-color: #dddee1;
    }
  }
  .width-pct-100 {
    width: 100%;
  }
</style>
