<template>
  <div class="advertisement-manage">
    <div class="title"><span class="extend-text">扩展</span><span class="ad-space">广告位管理</span></div>
    <div class="search-box">
      <Input v-model="id" placeholder="id" class="i-input"/>
      <Input v-model="title" placeholder="标题" class="i-input ml-10"/>
      <Input v-model="index" placeholder="排序序号" class="i-input ml-10"/>
      <span class="ml-10">状态</span>
      <Select v-model="status" class="i-select ml-5">
        <Option v-for="item in statusList" :key="item.id" :value="item.label">{{item.text}}</Option>
      </Select>
      <span class="ml-10">类型</span>
      <Select v-model="code" class="i-select ml-5">
        <Option v-for="item in codeList" :key="item.id" :value="item.code">{{item.text}}</Option>
      </Select>
      <span class="ml-10">显示类型</span>
      <Select v-model="visibleType" class="i-select ml-5">
        <Option v-for="item in visibleTypeList" :key="item.id" :value="item.label">{{item.text}}</Option>
      </Select>
      <div>
        <span class="mb-10">创建时间从</span>
        <Date-picker format="yyyy-MM-dd" type="date" placeholder="start" class="date-picker"
                     @on-change="changeCreateStart"></Date-picker>
        <span class="ml-5 mb-10">到</span>
        <Date-picker format="yyyy-MM-dd" type="date" placeholder="end" class="date-picker"
                     @on-change="changeCreateEnd"></Date-picker>
        <span class="ml-15 mb-10">上次更新时间从</span>
        <Date-picker format="yyyy-MM-dd" type="date" placeholder="start" class="date-picker"
                     @on-change="changeUpdateStart"></Date-picker>
        <span class="ml-5 mb-10">到</span>
        <Date-picker format="yyyy-MM-dd" type="date" placeholder="start" class="date-picker"
                     @on-change="changeUpdateEnd"></Date-picker>
        <span class="ml-15 mb-10">截止时间从</span>
        <Date-picker format="yyyy-MM-dd" type="date" placeholder="start" class="date-picker"
                     @on-change="changeEndStart"></Date-picker>
        <span class="ml-5 mb-10">到</span>
        <Date-picker format="yyyy-MM-dd" type="date" placeholder="start" class="date-picker"
                     @on-change="changeEndEnd"></Date-picker>
        <Button class="ml-10" @click="search">搜索</Button>
        <Button class="ml-10" @click="reset">重置</Button>
      </div>
    </div>
    <div class="form-box">
      <div class="operate-box">
        <Button @click="showAddModal = true">新增一行</Button>
        <Button @click="refresh">刷新</Button>
      </div>
      <Table border stripe :columns="columns" :data="formData"></Table>
    </div>
    <div class="page-box mt-10">
      <page :total="totalElement" @on-change="changePage"></page>
    </div>
    <!--弹窗-->
    <modal v-model="showAddModal" width="800" @on-visible-change="change">
      <div>
        <div class="modal-item">
          <span class="modal-label">广告位标题名称</span>
          <Input v-model="addTitle" class="modal-input"/>
        </div>
        <div class="modal-item">
          <span class="modal-label">广告位图片</span>
          <upload
            :default-file-list="defaultImageList"
            :on-remove="removeMainImage"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="1024"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div class="camera">
              <icon type="ios-camera" size="20"/>
            </div>
          </upload>
        </div>
        <div class="modal-item">
          <span class="modal-label">广告位跳转URL</span>
          <Input v-model="addUrl" class="modal-input"/>
        </div>
        <div class="modal-item">
          <span class="modal-label">广告位类型code</span>
          <Input v-model="addCode" class="modal-input"/>
        </div>
        <div class="modal-item">
          <span class="modal-label">状态</span>
          <Select v-model="addStatus" style="width: 200px">
            <Option v-for="(item, index) in statusList" :key="index" :value="item.label">{{item.text}}</Option>
          </Select>
        </div>
        <div class="modal-item">
          <span class="modal-label">显示类型</span>
          <Select v-model="addVisibleType" style="width: 200px">
            <Option v-for="(item, index) in visibleTypeList" :key="index" :value="item.label">{{item.text}}</Option>
          </Select>
        </div>
        <div class="modal-item">
          <span class="modal-label">排序序号</span>
          <Input v-model="addIndex" class="modal-input" placeholder="请输入整数"/>
        </div>
        <div class="modal-item">
          <span class="modal-label">创建时间</span>
          <Input v-model="addCreateTime" class="modal-input" disabled/>
        </div>
        <div class="modal-item">
          <span class="modal-label">上次修改时间</span>
          <Input v-model="addUpdateTime" class="modal-input" disabled/>
        </div>
        <div class="modal-item">
          <span class="modal-label">截止时间</span>
          <Date-picker :value="addDeadTime" format="yyyy-MM-dd" type="date" class="date-picker"
                       @on-change="changeAddEndTime"></Date-picker>
        </div>
      </div>
      <div slot="footer">
        <Button @click="showAddModal = false">取消</Button>
        <Button @click="saveAdvertise" type="primary">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import upload from '@/view/components/upload/upload'
  import {getAdvertiseInfo, getAdvertiseDetail, addAdvertise} from '@/api'
  import util from '@/libs/util'
  import {aliCallbackImgUrl} from '@/libs/aliUploadConfig'

  export default {
    name: "advertisement-manage",
    components: {
      upload
    },
    data() {
      return {
        id: null,
        title: null,
        index: null,
        status: null,
        statusList: [
          {id: 0, label: "null", text: '全部'},
          {id: 1, label: 0, text: '未启用'},
          {id: 2, label: 1, text: '已启用'},
        ],
        code: null,
        codeList: [
          {id: 0, code: 'others',text: '其他'},
          {id: 1, code: 'h5_home_page',text: 'H5首页'},
          {id: 2, code: 'pc_seller_banner',text: 'PC商家后台头部'},
          {id: 3, code: 'shower_pc_home_page_slide_show',text: '拿手手机端首页轮播图'},
          {id: 4, code: 'seller_pc_home_page_slide_show',text: '商家PC端首页轮播图'},
        ],
        visibleType: null,
        visibleTypeList: [
          {id: 0, label: 'login', text: '登录状态下显示'},
          {id: 1, label: 'all', text: '都显示'},
        ],
        createStart: null,
        createEnd: null,
        updateStart: null,
        updateEnd: null,
        endStart: null,
        endEnd: null,
        showAddModal: false,
        columns: [
          {
            title: 'id',
            key: 'id',
            width: 100
          },
          {
            title: '广告位标题名称',
            key: 'title'
          },
          {
            title: '跳转URL',
            key: 'url'
          },
          {
            title: '广告code',
            key: 'code'
          },
          {
            title: '显示类型',
            key: 'visibleType',
            width: 100
          },
          {
            title: '状态',
            key: 'status',
            width: 100
          },
          {
            title: '排序序号',
            key: 'index',
            width: 100
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '上次更新时间',
            key: 'updateTime'
          },
          {
            title: '截止时间',
            key: 'endTime'
          },
          {
            title: '操作',
            key: 'operate',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.getAdvertiseDetailFunc(params.row.id)
                      }
                    }
                  },
                  '详情/修改'),
              ])
            }
          }
        ],
        formData: [],
        addId: null,
        addTitle: null,
        addVisibleType: null,
        addStatus: null,
        addUrl: null,
        addIndex: null,
        addCode: null,
        addImgUrl: null,
        addCreateTime: null,
        addUpdateTime: null,
        addEndTime: null,
        addDeadTime: null,
        defaultImageList: [],
        showModeMap: {all: '都显示', login: '登录状态下显示'},
        statusMap: {0: '未启用', 1: '已启用'},
        pageIndex: 0,
        pageSize: 10,
        totalElement: 0
      }
    },
    created() {
      this.getAdvertiseInfoFunc();
    },
    methods: {
      change(value) {
        if (!value) {
          this.addId = null;
          this.addTitle = null;
          this.addVisibleType = null;
          this.addStatus = null;
          this.addUrl = null;
          this.addIndex = null;
          this.addCode = null;
          this.addCreateTime = null;
          this.addUpdateTime = null;
          this.addEndTime = null;
          this.addDeadTime = null;
          this.addImgUrl = null;
          this.defaultImageList = [];
        }
      },
      changeCreateStart(date) {
        this.createStart = date + ' 00:00:00';
      },
      changeCreateEnd(date) {
        this.createEnd = date + ' 00:00:00';
      },
      changeUpdateStart(date) {
        this.updateStart = date + ' 00:00:00';
      },
      changeUpdateEnd(date) {
        this.updateEnd = date + ' 00:00:00';
      },
      changeEndStart(date) {
        this.endStart = date + ' 00:00:00';
      },
      changeEndEnd(date) {
        this.endEnd = date + ' 00:00:00';
      },
      changeAddEndTime(date) {
        this.addEndTime = date + ' 00:00:00';
      },
      removeMainImage(file) {
        this.addImgUrl = null;
      },
      handleSuccess(res) {
        this.addImgUrl = aliCallbackImgUrl + res.name;
      },
      handleFormatError(file) {
        this.$Modal.warning({
          title: '文件格式不正确',
          content: '图片 ' + file.name + ' 格式不正确，请上传 jpg 或 jpeg 或 gif 或 bmp 格式的图片。'
        });
      },
      handleMaxSize(file) {
        this.$Modal.warning({
          title: '超出文件大小限制',
          content: '图片 ' + file.name + ' 太大，不能超过 1M'
        });
      },
      search() {
        this.getAdvertiseInfoFunc();
      },
      reset() {
        this.id = null;
        this.title = null;
        this.index = null;
        this.status = null;
        this.code = null;
        this.visibleType = null;
        this.createStart = null;
        this.createEnd = null;
        this.updateStart = null;
        this.updateEnd = null;
        this.endStart = null;
        this.endEnd = null;
      },
      refresh() {
        this.reset();
        this.getAdvertiseInfoFunc();
      },
      // 获取广告位列表信息
      getAdvertiseInfoFunc() {
        const _this = this;
        _this.formData = [];
        getAdvertiseInfo({
          id: _this.id,
          adTitle: _this.title,
          status: _this.status === "null" ? null : _this.status,
          adType: _this.code,
          sortNumber: _this.index,
          createTimeStart: _this.createStart,
          createTimeEnd: _this.createEnd,
          updateTimeStart: _this.updateStart,
          updateTimeEnd: _this.updateEnd,
          deadTimeStart: _this.endStart,
          deadTimeEnd: _this.endEnd,
          page: _this.pageIndex,
          size: _this.pageSize
        }).then(res => {
          if (res.success) {
            let tempData = res.result.content;
            tempData.forEach(item => {
              let temp = {};
              temp.id = item.id;
              temp.title = item.adTitle;
              temp.url = item.adUrl;
              temp.code = item.adType;
              temp.visibleType = _this.showModeMap[item.showMode];
              temp.status = _this.statusMap[item.status];
              temp.index = item.sortNumber;
              temp.createTime = util.formatTime(item.createTime, 'YYYY-MM-DD hh:mm:ss');
              temp.updateTime = util.formatTime(item.updateTime, 'YYYY-MM-DD hh:mm:ss');
              temp.endTime = util.formatTime(item.deadTime, 'YYYY-MM-DD hh:mm:ss');
              _this.formData.push(temp);
            });
            _this.totalElement = res.result.totalElements;
          } else {
            _this.$Message.error(res.msg);
          }
        })
      },
      // 获取广告位详情
      getAdvertiseDetailFunc(id) {
        const _this = this;
        getAdvertiseDetail({id: id}).then(res => {
          if (res.success) {
            let tempdata = res.result;
            _this.addId = tempdata.id;
            _this.addTitle = tempdata.adTitle;
            _this.addVisibleType = tempdata.showMode;
            _this.addStatus = tempdata.status;
            _this.addUrl = tempdata.adUrl;
            _this.addIndex = tempdata.sortNumber;
            _this.addCode = tempdata.adType;
            _this.addCreateTime = util.formatTime(tempdata.createTime, 'YYYY-MM-DD hh:mm:ss');
            _this.addUpdateTime = util.formatTime(tempdata.updateTime, 'YYYY-MM-DD hh:mm:ss');
            _this.addEndTime = util.formatTime(tempdata.deadTime, 'YYYY-MM-DD hh:mm:ss');
            _this.addDeadTime = util.formatTime(tempdata.deadTime, 'YYYY-MM-DD hh:mm:ss');
            _this.defaultImageList = [{src: tempdata.adImg}];
            _this.addImgUrl = tempdata.adImg;
          } else {
            _this.$Message.error(res.message);
          }
          _this.showAddModal = true;
        })
      },
      saveAdvertise() {
        const _this = this;
        if (!_this.addTitle) {
          _this.$Message.info('请填写标题！');
          return
        }
        if (!_this.addImgUrl) {
          _this.$Message.info('请上传图片！');
          return
        }
        if (!_this.addUrl) {
          _this.$Message.info('请填写广告跳转URL！');
          return
        }
        if (!_this.addCode) {
          _this.$Message.info('请填写广告类型！');
          return
        }
        if (_this.addStatus === "null") {
          _this.addStatus = null;
        }
        if (!_this.addVisibleType) {
          _this.$Message.info('请填写显示状态！');
          return
        }
        if (!_this.addIndex) {
          _this.$Message.info('请填写排序序号！');
          return
        }
        if (!_this.addEndTime) {
          _this.$Message.info('请填写截止时间！');
          return
        }
        addAdvertise({
          id: _this.addId,
          adTitle: _this.addTitle,
          showMode: _this.addVisibleType,
          status: _this.addStatus,
          adUrl: _this.addUrl,
          sortNumber: _this.addIndex,
          adType: _this.addCode,
          adImg: _this.addImgUrl,
          createTime: _this.addCreateTime,
          updateTime: _this.addUpdateTime,
          deadTime: _this.addEndTime,
        }).then(res => {
          if (res.success) {
            this.$Message.success('保存成功！');
            this.getAdvertiseInfoFunc();
            this.showAddModal = false;
          } else {
            this.$Message.error(res.message);
          }
        })
      },
      changePage(page) {
        this.pageIndex = page - 1;
        this.getAdvertiseInfoFunc();
      },

    }
  }
</script>

<style scoped lang="less">

  .title {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .extend-text {
      font-size: 24px;
      font-weight: bold;
    }
    .ad-space {
      margin-left: 10px;
    }
  }

  .search-box {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .i-input {
      width: 200px;
      margin-bottom: 10px;
    }
    .i-select {
      width: 200px;
      margin-bottom: 10px;
    }
    .date-picker {
      width: 200px;
      margin-left: 5px;
      margin-bottom: 10px;
    }
  }

  .operate-box {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 0 10px;
  }

  .page-box {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: start;
  }

  .modal-item {
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
  }

  .modal-label {
    width: 200px;
    display: inline-block;
  }

  .modal-input {
    width: 50%;
  }

  .camera {
    width: 58px;
    height: 58px;
    line-height: 58px;
  }
</style>
