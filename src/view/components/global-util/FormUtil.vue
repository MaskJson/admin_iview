<!--
    model: {
      username: '',
      type: '',
    },
    rules: {
      username: [
        { required: true, type: 'string', message: '用户名不能为空', trigger: 'blur' }
      ],
      type: [
        { required: true, type: 'string or Array', message: '请选择', trigger: 'change' }
      ]
    },
    comp: [
      {compName: 'Input', placeholder: '请输入用户名', label: '用户名', prop: true, value: 'username',disabled: Boolean, unable: Boolean},
      {compName: 'Select', placeholder: '请选择', label: '列表传参', prop: true, value: 'username', list:[{label: '', value: ''}]}
    ]
    comp 为表单数据，当disabled为true且，表单数据存在id，则为修改操作，此组件不允许操作
    当unable为true时，此组件不允许操作
    当存在上传时，需要将model里对应的key给data管理，以便数据清空，清空表单时，调用upload组件的handleRemove重置upload组件
-->
<script>
  import MyUpload from '@/view/components/upload/MyUpload';
  import {aliCallbackImgUrl} from "../../../libs/aliUploadConfig";

  export default {
    name: "FormUtil",
    components: {
      MyUpload,
    },
    props: {
      model: {
        type: Object,
        default() {return {};}
      },
      rules: {
        type: Object,
        default() {return {};}
      },
      comp: {
        type: Array,
        default() {return [];}
      },
      labelWidth: {
        type: Number,
        default: 80
      },
      loading: {
        type: Boolean,
        default: false
      },
      unSubmit: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        uploadList: [],
        uploadKey: ''
      }
    },
    render(h) {
      const _this = this;
      return h('Form', {
        'class': {
          'my-form': true
        },
        props: {
          model: _this.model,
          rules: _this.rules,
          'label-width': _this.labelWidth,
          'label-position': 'right'
        },
        ref: 'form'
      },renderHandler.call(this,h))
    },
    methods: {
      submit() {
        const _this = this;
        this.$refs['form'].validate((valid) => {
          if (valid) {
            _this.$emit('on-submit', _this.model);
          } else {
            this.$Message.warning('请填写带*的必选项');
          }
        })
      },
      resetData() {
        this.$refs['form'].resetFields();
        this.uploadList = [];
        if (this.uploadKey && !this.model[this.uploadKey]) {
          this.$refs['upload'].handleRemove();
        }
        this.uploadKey = '';
      }
    }
  }

  // render result
  function renderHandler(h) {
    const _this = this;
    // 提交按钮
    function renderSubmit() {
      const children = [];
      children.push(h('Button', {
        'class': {
          'w120': true
        },
        props: {
          type: 'primary',
          loading: _this.loading
        },
        on: {
          'click': () => {
            _this.submit();
          }
        }
      }, '提交'));
      return h('FormItem', {}, children)
    }

    const [model, rules, comp, result] = [this.model, this.rules, this.comp, []];
    comp.forEach((item, index) => {
      let props = {label: item.label, prop: item.value};
      const formItem = h('FormItem', {
        props: props,
        'class': {
          'my-upload': item.compName == 'upload'
        }
      }, renderDom.call(this, item, h));
      result.push(formItem);
    });
    !this.unSubmit && result.push(renderSubmit());
    return result;
  }

  /**
   * render FormItem
   */
  function renderDom(item, h) {
    if (item.compName == 'upload') {
      this.uploadKey = item.value;
      return renderUpload.call(this, item, h);
    }
    // 获取复选框、单选、下拉框的子元素
    function renderChildren(compName, list) {
      const children = [];
      compName = compName == 'CheckboxGroup' ? 'Checkbox' : compName == 'Select' ? 'Option' : 'Radio';
      list.forEach((item => {
        const child = h(compName, {
          props: {
            label: item.value,
            value: item.value
          },
          scopedSlots: {
            default: () => h('span', item.label)
          },
          slot: 'default'
        }, null);
        children.push(child);
      }));
      return children;
    }
    const [children, _this, compName] = [[], this, item.compName];
    const props = {
      value: _this.model[item.value],
      placeholder: item.placeholder || '',
      disabled: item.disabled && !!_this.model.id || item.unable,
      type: item.type,
      rows: item.rows || 3,
      maxlength: 150
    }
    if (!!item.mutiple) props.mutiple = true;
    if (compName == 'DatePicker') props.type = 'datetime';
    children.push(h(compName, {
      props: props,
      on: renderEvent.call(this, item.value, compName)
    }, ['CheckGroup', 'RadioGroup', 'Select'].indexOf(compName) > -1 ? renderChildren(compName, item.list) : ''));
    return children;
  }

  /**
   * event handler
   */
  function renderEvent(key, compName) {
    return {
      'on-change': (event) => {
        this.model[key] = ['CheckboxGroup', 'RadioGroup', 'Select', 'DatePicker'].indexOf(compName) > -1 ? event : event.target.value;
      }
    }
  }

  /**
   * render Upload
   */
  function renderUpload(item, h) {
    const [children, _this] = [[], this];
    children.push(h(MyUpload, {
      props: {
        'default-file-list': _this.uploadList,
        'uploaded': _this.model[item.value],
        'on-remove': uploadHandler.bind(this, 0, item.value), // 删除上传列表
        'on-success': handleSuccess.bind(_this),
        'format': ['jpg','jpeg','png','gif','bmp'],
        'max-size': 1024,
        'on-format-error': uploadHandler.bind(this, 1, item.value), // 图片格式错误
        'on-exceeded-size': uploadHandler.bind(this, 2, item.value),
        'type': 'drag'
      },
      'class': {
        block: true
      },
      ref: 'upload'
    }, [
      h('div',{
        'class': {'my-camera': true}
      },[
        h('Icon', {
          props: {
            type: 'ios-camera',
            size: 20
          }
        })
      ])
    ]));
    const src = _this.model[item.value];
    if (src) {
      children.push(h('p',{
        'class': {
          hide: !_this.model[item.value],
          pt20: true
        },
        style: {
          // marginLeft: '80px'
        }
      }, '（已上传）'))
    }
    children.push(h('Input', {
      'class': {
        hide: true
      },
      props: {
        value: _this.model[item.value]
      },
      on: renderEvent.call(this, item.value, 'Input')
    }, null));
    return children;
  }

  /**
   * 图片上传handler
   */
  function uploadHandler(flag, value) {
    switch (flag) {
      case 0:this.model[value] = '';break;
      case 1:this.$Message.warning('请上传jpg,jpeg,png,gif,bmp格式的图片');break;
      case 2:this.$Message.warning('图片大小必须小于1M');break;
      default: break;
    }
  }

  /**
   * 图片上传成功
   */
  function handleSuccess(res) {
    this.model[this.uploadKey] = aliCallbackImgUrl + res.name;
  }
</script>

<style scoped>
</style>
