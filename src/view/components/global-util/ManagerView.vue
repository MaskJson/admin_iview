<template>
  <div>
    <div class="mt10">
      <Button v-if="del" class="mr10" type="error" icon="md-trash" @click="removeSelected">批量删除</Button>
      <Button v-if="save && save.save" type="primary" icon="md-add" class="mr10" @click="saveEmit">添加</Button>
      <slot></slot>
    </div>
    <Table ref="table" class="mt10" border :data="list" :columns="columns"  @on-selection-change="selectChange"></Table>
    <div class="t-right mt20" v-if="!unPage">
      <Page :current="page.current" :total="page.total" :page-size="page.pageSize"
            @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="[10,20,50]"
            size="small" show-total show-elevator show-sizer></Page>
    </div>
    <Spin fix v-if="showSpin">
      <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  export default {
    name: "ManagerView",
    props: {
      // 是否有删除操作
      del: {
        type: Boolean,
        default: true
      },
      // 是否有添加操作
      save: {
        type: Object,
        default() {
          return {
            save: true,
            modal: true
          }
        }
      },
      // 表格列
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      // 不需要分页
      unPage: {
        type: Boolean,
        default: false
      },
      // query params
      searchData: {
        type: Object,
        default() {
          return {}
        }
      },
      // pageSize 默认为10条
      pageSize: {
        type: Number,
        default: 10
      },
      search: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        showSpin: false,
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        list: [{}],
        selected: []
      }
    },
    methods: {
      // 添加按钮操作
      saveEmit() {
        if (this.save.modal) {
          this.$emit('on-save');
        } else {
          this.handlers['save']();
        }
      },
      // 页码改变刷新数据
      pageChange(current) {
        this.page.current = current;
        this.emitManagerHandler(3, {
          unFresh: true
        })
      },
      // 每页显示数改变刷新数据
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.emitManagerHandler(3, {
          unFresh: true
        })
      },
      // table批量选择
      selectChange(val) {
        this.selected = val;
      },
      // 删除
      removeSelected() {
        if (this.selected.length) {
          this.emitManagerHandler(2, {});
        } else {
          this.$Message.warning('请选择删除项');
        }
      },
      // 批量删除ids
      removeChecked() {
        return this.selected.map(item => {
          return item.id;
        })
      },
      // 获取查询条件
      getSearchData() {
        const params = Object.assign({}, this.searchData);
        if (!this.unPage) {
          params.page = this.page.current;
          params.size = this.page.pageSize;
        }
        return params;
      },
      // 导出数据
      exportTable() {
        this.$emit('export', this.$refs['table'], this.list);
      },
      // 最终执行managerHandler事件
      managerHandler(handler, handlerData, type, params, isAsync, unFresh, unMsg) {
        if (handler) {
          if (!isAsync) {
            this.showSpin = true;
            handler(handlerData).then(res => {
              this.showSpin = false;
              if (res.code == 200) {
                if (type == 3) {
                  const data = res.data;
                  if (!this.unPage) {
                    this.list = data.list || [];
                    this.page.total = data.total;
                  } else {
                    this.list = data;
                  }
                }
                this.$emit('on-success', type, res.data || {}); // 响应组件请求成功监听，特殊处理
                if (!unFresh) { // 需要刷新数据
                  this.emitManagerHandler(3, {
                    unFresh: true
                  })
                }
              } else {
                this.$Message.error(res.msg);
                this.$emit('on-error', type);
              }
              this.showSpin = false;
            }).catch(res => {
              this.$Message.error('请求失败');
              this.showSpin = false;
            })
          } else {
            handler(handlerData);
          }
        }
      },
      // emitManagerHandler, 响应事件触发
      emitManagerHandler(type, data) {
        let [handler, handlerData, isAsync, unMsg, unFresh, params, isBatch] = [null, null, data.isAsync, data.unMsg, data.unFresh, data.params || {}, data.isBatch]; // 方法、是否异步、参数、是否为批量操作
        const {save, del, search, getDetail} = this.handlers;
        switch (type) {
          case 3: handler = search;if (this.search) handler = this.handlers[this.search]; handlerData = this.getSearchData();break; // 查
          case 1: handler = del;handlerData = {ids: [params.id].join(',')};break; // 根据id 删
          case 2: // 批量删
            handlerData = {ids: this.removeChecked().join(',')};
            handler = del;
            break;
          default:
            handler = this.handlers[type];
            handlerData = params;
            if (isBatch) params.ids = this.removeChecked().join(',');
            break; // 骚操作，直接传方法名
        }
        this.managerHandler(handler, handlerData, type, data, isAsync, unFresh, unMsg);
      }
    },
    inject: ['handlers'],
    created() {
      this.page.pageSize = this.pageSize;
    },
    mounted() {
      this.emitManagerHandler(3, {
        unFresh: true
      })
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
